// Compilar con la clave pública de prueba de Turnstile antes de ejecutar.
import assert from 'node:assert/strict'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } })
  const errors = []
  const sent = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/api/job-application', async (route) => {
    if (route.request().method() === 'POST') sent.push(route.request().postData())
    await route.fulfill({ json: route.request().method() === 'GET' ? { available: true } : { ok: true } })
  })
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.getByRole('button', { name: 'Trabaja con nosotros', exact: true }).filter({ visible: true }).click()
  // Carga real de Turnstile con clave pública oficial de prueba; no se envía correo.
  let realVerification = false
  try {
    await page.getByText('Verificación completada.', { exact: true }).waitFor({ timeout: 25000 })
    realVerification = true
  } catch { console.log('Turnstile real no completó la verificación local; requiere comprobación en hostname autorizado.') }
  console.log(`Turnstile real (clave de prueba): ${realVerification ? 'completado bajo CSP' : 'pendiente'}`)
  await page.getByRole('button', { name: 'Cerrar formulario de postulación' }).click()
  // Simular el proveedor para que el contrato del formulario sea determinista.
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({ contentType: 'application/javascript', body: `window.turnstile = { render: (node, options) => { window.verifyTest = () => options.callback('test-token'); window.verifyTest(); return 1 }, remove: () => {}, reset: () => window.verifyTest() };` }))
  await page.reload()
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.getByRole('button', { name: 'Trabaja con nosotros', exact: true }).filter({ visible: true }).click()
  await page.getByText('Verificación completada.', { exact: true }).waitFor()
  for (const [name, value] of Object.entries({ name: 'Prueba local', email: 'test@example.com', phone: '0990000000', city: 'Loja' })) await page.locator(`input[name="${name}"]`).fill(value)
  await page.locator('input[type="file"]').setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7 test') })
  await page.getByRole('button', { name: 'Enviar postulación', exact: true }).click()
  await page.getByText('Debes autorizar el tratamiento de tus datos para enviar tu postulación.').waitFor()
  assert.equal(sent.length, 0)
  assert.equal(await page.getByRole('checkbox').evaluate((node) => node === document.activeElement), true)
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Enviar postulación', exact: true }).click()
  await page.getByText('¡Postulación enviada!').waitFor()
  assert.equal(sent.length, 1)
  assert.ok(sent[0].includes('name="privacyConsent"'))
  assert.ok(sent[0].includes('accepted'))
  assert.ok(sent[0].includes('2026-09-27'))
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.getByRole('button', { name: 'Trabaja con nosotros', exact: true }).filter({ visible: true }).click()
  assert.equal(await page.getByRole('checkbox').isChecked(), false)
  assert.equal(await page.locator('input[name="name"]').inputValue(), '')
  assert.equal(await page.getByText('test.pdf', { exact: true }).count(), 0)
  assert.deepEqual(errors, [])
  console.log('Formulario: rechazo sin consentimiento, foco accesible, envío simulado con versión y limpieza al reabrir correctos.')
} finally { await browser.close() }
