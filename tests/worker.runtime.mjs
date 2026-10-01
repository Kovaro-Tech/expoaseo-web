import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { Miniflare, convertV4MiniflareOptions } from 'miniflare'
import { privacyConfig } from '../src/config/privacy.js'
import { securityHeaders } from '../scripts/security.mjs'

test('Cloudflare runtime: assets, headers, multipart, providers, distributed limits and idempotency', async () => {
  const deployment = JSON.parse(await readFile('dist/deployment.json', 'utf8'))
  const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'))
  const vars = deployment.indexable ? config.env.production.vars : config.vars
  const calls = []
  let verification = { success: true, action: 'application', hostname: vars.TURNSTILE_HOSTNAME }
  let providerStatus = 200
  let throwVerification = false
  const options = { workers: [{
    name: 'test-worker',
    modules: true, scriptPath: 'qa-artifacts/worker/index.js',
    compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
    bindings: { ...vars, TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 'test-key', MAIL_FROM: 'test@example.com' },
    durableObjects: { ABUSE_GUARD: { className: 'AbuseGuard', useSQLite: true } },
    ratelimits: { APPLICATION_RATE_LIMITER: config.ratelimits[0] },
    assets: { directory: 'dist', binding: 'ASSETS', run_worker_first: true, routerConfig: { has_user_worker: true }, assetConfig: { html_handling: 'drop-trailing-slash', not_found_handling: '404-page' } },
    outboundService: async (request) => {
      const body = await request.text()
      calls.push({ url: request.url, body, headers: Object.fromEntries(request.headers) })
      if (request.url.includes('siteverify')) {
        if (throwVerification) throw new Error('Simulated timeout')
        return Response.json(verification)
      }
      assert.equal(request.url, 'https://api.resend.com/emails')
      return Response.json(providerStatus === 200 ? { id: 'test-email' } : { error: 'private provider response' }, { status: providerStatus })
    },
  }] }
  const mf = new Miniflare(convertV4MiniflareOptions(options))
  let ipCounter = 1
  const send = async (changes = {}, options = {}) => {
    const form = new FormData()
    const fields = { name: 'Candidata local', email: 'test@example.com', phone: '0990000000', city: 'Loja', area: '', website: '', privacyConsent: 'accepted', privacyVersion: privacyConfig.version, turnstileToken: 'test-token', ...changes }
    for (const [key, value] of Object.entries(fields)) if (value !== null) form.set(key, value)
    form.set('cv', options.file || new File(['%PDF-1.7 local'], 'personal.pdf', { type: 'application/pdf' }))
    if (options.duplicate) form.append('name', 'duplicate')
    const request = new Request(vars.SITE_URL + '/api/job-application', { method: 'POST', headers: { 'cf-connecting-ip': options.ip || `192.0.2.${ipCounter++}`, 'x-forwarded-for': 'untrusted' }, body: form })
    return mf.dispatchFetch(request.url, { method: 'POST', headers: Object.fromEntries(request.headers), body: await request.arrayBuffer() })
  }
  const status = async (response, expected) => {
    const r = await response
    assert.equal(r.status, expected, await r.clone().text())
    for (const [key, value] of Object.entries(securityHeaders)) assert.equal(r.headers.get(key), value)
    return r
  }
  try {
    for (const path of ['/', '/privacidad', '/cookies']) {
      const r = await status(mf.dispatchFetch(vars.SITE_URL + path), 200)
      const html = await r.text()
      assert.match(html, /<h1[ >]/)
      assert.ok(html.includes(vars.SITE_URL))
      assert.doesNotMatch(r.headers.get('cache-control') || '', /immutable|max-age=(?:86400|31536000)/)
      if (!deployment.indexable) assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow')
    }
    for (const path of ['/unknown', '/nested/unknown', '/404', '/404.html', '/api/missing']) {
      const missing = await status(mf.dispatchFetch(vars.SITE_URL + path), 404)
      if (!path.startsWith('/api/')) assert.match(await missing.text(), /Página no encontrada/)
    }
    const redirect = await status(mf.dispatchFetch(vars.SITE_URL.replace('https:', 'http:') + '/privacidad?source=test', { redirect: 'manual' }), 308)
    assert.equal(redirect.headers.get('location'), vars.SITE_URL + '/privacidad?source=test')
    const head = await status(mf.dispatchFetch(vars.SITE_URL + '/', { method: 'HEAD' }), 200)
    assert.equal(await head.text(), '')
    const video = await mf.dispatchFetch(vars.SITE_URL + '/videos/hero-mobile-web.mp4', { headers: { Range: 'bytes=0-31' } })
    assert.ok([200, 206].includes(video.status))
    assert.equal(video.headers.get('content-type'), 'video/mp4')
    assert.equal(video.headers.get('cache-control'), 'public, max-age=86400')
    assert.ok((await video.arrayBuffer()).byteLength >= 32)
    for (const file of (await readdir('dist/assets')).filter((name) => /\.(css|js|woff2)$/.test(name))) {
      const asset = await status(mf.dispatchFetch(`${vars.SITE_URL}/assets/${file}`), 200)
      assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable')
    }
    const og = await status(mf.dispatchFetch(`${vars.SITE_URL}/og-image.jpg`), 200)
    assert.equal(og.headers.get('cache-control'), 'public, max-age=3600')
    assert.equal(og.headers.get('content-type'), 'image/jpeg')
    const photo = await status(mf.dispatchFetch(`${vars.SITE_URL}/images/real-work/new/limpieza-escaleras-01.webp`), 200)
    assert.equal(photo.headers.get('cache-control'), 'public, max-age=86400')
    const availability = await status(mf.dispatchFetch(vars.SITE_URL + '/api/job-application'), 200)
    assert.deepEqual(await availability.json(), { available: true })
    assert.equal(availability.headers.get('cache-control'), 'no-store')
    await status(mf.dispatchFetch(vars.SITE_URL + '/api/job-application', { method: 'PUT' }), 405)
    for (const changes of [{ privacyConsent: null }, { privacyConsent: 'false' }, { privacyVersion: 'old' }, { website: 'bot' }, { website: 'x'.repeat(200) }, { email: 'bad' }, { city: null }, { unknown: 'field' }]) await status(send(changes), 400)
    await status(send({}, { duplicate: true }), 400)
    for (const file of [new File([], 'empty.pdf', { type: 'application/pdf' }), new File(['fake'], 'fake.pdf', { type: 'application/pdf' }), new File(['%PDF-'], 'bad.exe', { type: 'application/pdf' }), new File(['%PDF-'], 'bad.pdf', { type: 'text/plain' }), new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' })]) await status(send({}, { file }), 400)
    await status(mf.dispatchFetch(vars.SITE_URL + '/api/job-application', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=x', 'cf-connecting-ip': '192.0.2.90' }, body: new Uint8Array(4 * 1024 * 1024 + 16385) }), 413)
    assert.equal(calls.length, 0)
    for (const patch of [{ hostname: 'other.example' }, { action: 'other' }, { success: false }]) {
      const original = verification
      verification = { ...verification, ...patch }
      await status(send(), 403)
      verification = original
    }
    throwVerification = true
    await status(send(), 500)
    throwVerification = false
    providerStatus = 503
    const failed = await status(send(), 502)
    assert.doesNotMatch(await failed.text(), /private provider|test-key|test-secret/)
    providerStatus = 200
    const before = calls.filter((c) => c.url.includes('resend')).length
    const parallel = await Promise.all(Array.from({ length: 5 }, () => send({}, { ip: '198.51.100.1' })))
    assert.deepEqual(parallel.map((r) => r.status).sort(), [200, 200, 200, 429, 429])
    const emails = calls.filter((c) => c.url.includes('resend')).slice(before)
    assert.equal(emails.length, 3)
    assert.equal(new Set(emails.map((c) => c.headers['idempotency-key'])).size, 1)
    assert.equal(new Set(emails.map((c) => c.body)).size, 1)
    const email = JSON.parse(emails[0].body)
    assert.deepEqual(email.to, ['expoaseoec@gmail.com'])
    assert.equal(email.from, 'test@example.com')
    assert.equal(email.attachments[0].filename, 'CV.pdf')
    assert.ok(email.text.includes(privacyConfig.consentText))
    for (const [extension, type, signature] of [['doc', 'application/msword', [0xd0, 0xcf, 0x11, 0xe0]], ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', [0x50, 0x4b, 0x03, 0x04]]]) await status(send({}, { file: new File([new Uint8Array(signature)], `file.${extension}`, { type }) }), 200)
    const max = new Uint8Array(4 * 1024 * 1024)
    max.set([0x25, 0x50, 0x44, 0x46])
    await status(send({}, { file: new File([max], 'max.pdf', { type: 'application/pdf' }) }), 200)
    // Native binding rejects bursts even when the forms fail validation.
    let last
    for (let i = 0; i < 25; i++) last = await send({ website: 'bot' }, { ip: '198.51.100.2' })
    assert.equal(last.status, 429)
    options.workers[0].bindings.RESEND_API_KEY = ''
    await mf.setOptions(convertV4MiniflareOptions(options))
    const unavailable = await status(mf.dispatchFetch(vars.SITE_URL + '/api/job-application'), 200)
    assert.deepEqual(await unavailable.json(), { available: false })
    options.workers[0].bindings.SITE_ENVIRONMENT = deployment.indexable ? 'staging' : 'production'
    await mf.setOptions(convertV4MiniflareOptions(options))
    const mismatch = await status(mf.dispatchFetch(vars.SITE_URL + '/'), 503)
    assert.equal(mismatch.headers.get('x-robots-tag'), 'noindex, nofollow')
    console.log(`Runtime ${deployment.environment}: rutas, 404, CSP, rangos de video, CV 4 MB, firmas, consentimiento, Turnstile, Resend, concurrencia e idempotencia OK.`)
  } finally { await mf.dispose() }
})
