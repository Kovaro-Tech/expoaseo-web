import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveSiteEnvironment } from '../src/config/site.js'
import { privacyConfig } from '../src/config/privacy.js'
import { renderSeo, organization } from '../scripts/seo.mjs'
import { handler } from '../worker/job-application.js'

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
  assert.throws(() => resolveSiteEnvironment({ SITE_ENVIRONMENT: 'staging', SITE_URL: 'https://expoaseo.com' }))
  assert.match(renderSeo('/', staging), /property="og:url" content="https:\/\/expoaseo.kovarotech.com\//)
  assert.equal(organization['@type'], 'Organization')
  assert.equal(organization.taxID, '1191739848001')
  assert.deepEqual(organization.address, {
    '@type': 'PostalAddress',
    streetAddress: privacyConfig.address,
    addressCountry: privacyConfig.country,
  })
  for (const key of ['geo', 'aggregateRating', 'openingHours', 'foundingDate']) assert.equal(organization[key], undefined)
})

test('API fails closed without secrets/bindings and never trusts forwarded-for', async () => {
  const missing = await handler(new Request('https://expoaseo.com/api/job-application'), {})
  assert.deepEqual(await missing.json(), { available: false })
  assert.equal((await handler(new Request('https://expoaseo.com/api/job-application', { method: 'POST' }), {})).status, 503)
  const env = {
    SITE_ENVIRONMENT: 'production', SITE_URL: 'https://expoaseo.com', TURNSTILE_HOSTNAME: 'expoaseo.com',
    TURNSTILE_SECRET_KEY: 'test', RESEND_API_KEY: 'test', MAIL_FROM: 'test@example.com',
    ABUSE_GUARD: {}, APPLICATION_RATE_LIMITER: {},
  }
  const form = new FormData()
  form.set('name', 'Local')
  const response = await handler(new Request('https://expoaseo.com/api/job-application', {
    method: 'POST', headers: { 'x-forwarded-for': '192.0.2.1' }, body: form,
  }), env)
  assert.equal(response.status, 503)
  env.TURNSTILE_HOSTNAME = 'www.expoaseo.com'
  assert.deepEqual(await (await handler(new Request('https://expoaseo.com/api/job-application'), env)).json(), { available: false })
})

test('API exige consentimiento vigente antes de contactar proveedores y registra evidencia', async () => {
  const originalFetch = globalThis.fetch
  let attempts = 0
  const env = {
    SITE_ENVIRONMENT: 'production', SITE_URL: 'https://expoaseo.com',
    TURNSTILE_SECRET_KEY: 'test-only', TURNSTILE_HOSTNAME: 'expoaseo.com', RESEND_API_KEY: 'test-only', MAIL_FROM: 'test@example.com',
    APPLICATION_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ABUSE_GUARD: { idFromName: (name) => name, get: () => ({ fetch: async (url) => url.endsWith('/attempt') ? new Response(null, { status: ++attempts > 3 ? 429 : 200 }) : Response.json({ receivedAt: 1790726400000 }) }) },
  }
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
    return new Request('https://expoaseo.com/api/job-application', { method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.1' }, body: form })
  }
  try {
    const oversized = new Request('https://expoaseo.com/api/job-application', {
      method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=test', 'cf-connecting-ip': '192.0.2.1' },
      body: new Uint8Array(4 * 1024 * 1024 + 16385),
    })
    assert.equal((await handler(oversized, env)).status, 413)
    assert.equal(calls.length, 0)
    for (const req of [request(undefined), request('false'), request('accepted', 'old'), request('accepted', privacyConfig.version, true)]) {
      const response = await handler(req, env)
      assert.equal(response.status, 400)
      assert.equal(response.headers.get('cache-control'), 'no-store')
      assert.equal(calls.length, 0)
    }
    const response = await handler(request('accepted'), env)
    assert.equal(response.status, 200)
    assert.equal(calls.length, 2)
    const email = JSON.parse(calls[1].options.body)
    assert.ok(email.text.includes(privacyConfig.consentText))
    assert.ok(email.text.includes(privacyConfig.version))
    assert.match(email.text, /Recibido \(UTC\): \d{4}-\d{2}-\d{2}T/)
    assert.equal(email.attachments[0].filename, 'CV.pdf')
    assert.equal((await handler(request('accepted'), env)).status, 200)
    assert.equal(calls[1].options.body, calls[3].options.body)
    assert.equal(calls[1].options.headers['Idempotency-Key'], calls[3].options.headers['Idempotency-Key'])
    assert.equal((await handler(request('accepted'), env)).status, 200)
    assert.equal((await handler(request('accepted'), env)).status, 429)
    assert.equal(calls.filter(({ url }) => url.includes('resend')).length, 3)
  } finally {
    globalThis.fetch = originalFetch
  }
})
