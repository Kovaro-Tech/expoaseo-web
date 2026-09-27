import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveSiteEnvironment } from '../src/config/site.js'
import { privacyConfig } from '../src/config/privacy.js'
import { renderSeo, organization } from '../scripts/seo.mjs'
import { handler } from '../api/job-application.js'

test('producción explícita, staging seguro y preview noindex', () => {
  const staging = resolveSiteEnvironment()
  assert.equal(staging.indexable, false)
  assert.match(renderSeo('/', staging), /noindex,nofollow/)
  assert.doesNotMatch(renderSeo('/', staging), /rel="canonical"/)
  assert.throws(() => resolveSiteEnvironment({ SITE_ENVIRONMENT: 'production' }))
  const production = resolveSiteEnvironment({ SITE_ENVIRONMENT: 'production', SITE_URL: 'https://expoaseo.com' })
  assert.match(renderSeo('/', production), /href="https:\/\/expoaseo.com\/"/)
  assert.match(renderSeo('/privacidad', production), /href="https:\/\/expoaseo.com\/privacidad"/)
  assert.match(renderSeo('/404', production), /noindex,nofollow/)
  assert.doesNotMatch(renderSeo('/404', production), /rel="canonical"/)
  assert.doesNotMatch(renderSeo('/', production), /(?:og|twitter):image/)
  assert.equal(resolveSiteEnvironment({ SITE_ENVIRONMENT: 'production', SITE_URL: 'https://expoaseo.com', VERCEL_ENV: 'preview' }).indexable, false)
  assert.equal(organization['@type'], 'Organization')
  for (const key of ['address', 'geo', 'aggregateRating', 'openingHours', 'foundingDate']) assert.equal(organization[key], undefined)
})

test('API exige consentimiento vigente antes de contactar proveedores y registra evidencia', async () => {
  const previousEnv = { ...process.env }
  const originalFetch = globalThis.fetch
  Object.assign(process.env, { TURNSTILE_SECRET_KEY: 'test-only', TURNSTILE_HOSTNAME: 'expoaseo.com', RESEND_API_KEY: 'test-only', MAIL_FROM: 'test@example.com' })
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return Response.json(url.includes('siteverify') ? { success: true, action: 'application', hostname: 'expoaseo.com' } : { id: 'test' })
  }
  const request = (consent, version = privacyConfig.version, duplicate = false) => {
    const form = new FormData()
    for (const [key, value] of Object.entries({ name: 'Candidata de prueba', email: 'test@example.com', phone: '0990000000', city: 'Loja', turnstileToken: 'test', privacyVersion: version })) form.set(key, value)
    if (consent !== undefined) form.set('privacyConsent', consent)
    if (duplicate) form.append('privacyConsent', 'accepted')
    form.set('cv', new File(['%PDF-1.7 test'], 'private-name.pdf', { type: 'application/pdf' }))
    return new Request('https://expoaseo.com/api/job-application', { method: 'POST', headers: { 'x-forwarded-for': '192.0.2.1' }, body: form })
  }
  try {
    const oversized = new Request('https://expoaseo.com/api/job-application', {
      method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=test' },
      body: new Uint8Array(4 * 1024 * 1024 + 16385),
    })
    assert.equal((await handler(oversized)).status, 413)
    assert.equal(calls.length, 0)
    for (const req of [request(undefined), request('false'), request('accepted', 'old'), request('accepted', privacyConfig.version, true)]) {
      const response = await handler(req)
      assert.equal(response.status, 400)
      assert.equal(response.headers.get('cache-control'), 'no-store')
      assert.equal(calls.length, 0)
    }
    const response = await handler(request('accepted'))
    assert.equal(response.status, 200)
    assert.equal(calls.length, 2)
    const email = JSON.parse(calls[1].options.body)
    assert.ok(email.text.includes(privacyConfig.consentText))
    assert.ok(email.text.includes(privacyConfig.version))
    assert.match(email.text, /Recibido \(UTC\): \d{4}-\d{2}-\d{2}T/)
    assert.equal(email.attachments[0].filename, 'CV.pdf')
    assert.equal((await handler(request('accepted'))).status, 429)
    assert.equal(calls.length, 2)
  } finally {
    globalThis.fetch = originalFetch
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key]
    Object.assign(process.env, previousEnv)
  }
})
