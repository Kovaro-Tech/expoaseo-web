// npm run preview en otra terminal; PLAYWRIGHT_MODULE opcional para una instalación externa.
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined })
const root = 'http://127.0.0.1:4173'
const failures = []
await mkdir('qa-artifacts', { recursive: true })
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme })
      const page = await context.newPage()
      page.on('pageerror', (error) => failures.push(error.message))
      await page.addInitScript(() => {
        window.cspViolations = []
        document.addEventListener('securitypolicyviolation', (event) => window.cspViolations.push(`${event.effectiveDirective}: ${event.blockedURI}`))
      })
      for (const path of ['/', '/privacidad', '/cookies', '/ruta-inexistente']) {
        const response = await page.goto(root + path, { waitUntil: 'networkidle' })
        assert.equal(response.status(), path.includes('inexistente') ? 404 : 200)
        assert.equal(await page.locator('h1').count(), 1)
        assert.equal(await page.locator('main').count(), 1)
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow')
        assert.equal(await page.locator('link[rel="canonical"]').count(), 0)
        assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), theme)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}, ${width}, ${theme}: overflow`)
        assert.deepEqual(await page.evaluate(() => window.cspViolations), [], `${path}: CSP`)
        assert.equal(await page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])').count(), 0)
        assert.equal(await page.locator('img:not([alt])').count(), 0)
        if (path === '/' && width === 1440 && theme === 'light') {
          await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2)
          for (const image of await page.locator('main img:visible').all()) {
            await image.scrollIntoViewIfNeeded()
            await image.evaluate((node) => node.decode())
            assert.ok(await image.evaluate((node) => node.naturalWidth > 0))
          }
          const navigation = await page.locator('a[href^="/#"]').evaluateAll((nodes) => nodes.map((node) => ({ href: node.getAttribute('href'), text: node.textContent })))
          for (const { href } of navigation) {
            const id = href.slice(2)
            if (!id.startsWith('servicios-')) assert.equal(await page.locator(`[id="${id}"]`).count(), 1)
          }
          assert.deepEqual(await page.evaluate(() => window.cspViolations), [])
        }
      }
      await page.goto(root + '/privacidad')
      if (width < 1200) await page.getByRole('button', { name: 'Abrir menú' }).click()
      await page.getByRole('button', { name: 'Trabaja con nosotros', exact: true }).filter({ visible: true }).click()
      const checkbox = page.getByRole('checkbox')
      assert.equal(await checkbox.isChecked(), false)
      assert.equal(await checkbox.getAttribute('required'), '')
      await checkbox.check()
      await page.locator('input[name="name"]').fill('Prueba local')
      const [privacyTab] = await Promise.all([context.waitForEvent('page'), page.locator('.application-form__consent a').click()])
      await privacyTab.waitForLoadState()
      assert.ok(privacyTab.url().endsWith('/privacidad'))
      await privacyTab.close()
      assert.equal(await page.locator('input[name="name"]').inputValue(), 'Prueba local')
      if (width === 390) await page.screenshot({ path: `qa-artifacts/modal-${theme}.png` })
      await page.keyboard.press('Escape')
      assert.equal(await page.locator('[role="dialog"]').count(), 0)
      assert.equal(await page.locator('#root').getAttribute('inert'), null)
      if (width === 390 || width === 1440) await page.screenshot({ path: `qa-artifacts/privacy-${width}-${theme}.png`, fullPage: true })
      assert.deepEqual(await page.evaluate(() => window.cspViolations), [])
      await context.close()
    }
  }
  assert.deepEqual(failures, [])
  console.log('32 recorridos: rutas, 404, móvil/escritorio, temas, CSP, semántica, enlaces y modal correctos.')
} finally { await browser.close() }
