// Requires a served production build and AXE_PATH (axe-core from the Lighthouse CLI cache).
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4173'
const phase = process.env.AUDIT_PHASE || 'before'
const axe = await readFile(process.env.AXE_PATH, 'utf8')
const output = `qa-artifacts/production-audit/${phase}`
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const report = { base, cases: [] }
try {
  for (const width of [360, 390, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme })
      const page = await context.newPage()
      const events = { console: [], errors: [], failed: [], issues: [], responses: [] }
      page.on('console', (msg) => { if (['error', 'warning'].includes(msg.type())) events.console.push({ type: msg.type(), text: msg.text() }) })
      page.on('pageerror', (error) => events.errors.push(error.message))
      page.on('requestfailed', (request) => events.failed.push({ url: request.url(), failure: request.failure() }))
      page.on('response', (response) => events.responses.push({ url: response.url(), status: response.status(), headers: response.headers() }))
      const cdp = await context.newCDPSession(page)
      await cdp.send('Audits.enable')
      cdp.on('Audits.issueAdded', ({ issue }) => events.issues.push(issue))
      // Never submit a real application during an audit.
      await page.route('**/api/job-application', async (route) => {
        if (route.request().method() === 'POST') await route.abort()
        else await route.continue()
      })
      for (const path of ['/', '/privacidad', '/cookies', '/ruta-inexistente']) {
        const response = await page.goto(base + path, { waitUntil: 'networkidle' })
        assert.equal(response.status(), path.includes('inexistente') ? 404 : 200)
        assert.equal(await page.locator('h1').count(), 1)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        await page.evaluate(axe)
        const violations = await page.evaluate(async () => (await window.axe.run(document, { preload: false, runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })))
        const network = await page.evaluate(() => performance.getEntriesByType('resource').map(({ name, initiatorType, transferSize, encodedBodySize, duration }) => ({ name, initiatorType, transferSize, encodedBodySize, duration })))
        report.cases.push({ width, theme, path, violations, network })
        if (path === '/' && [390, 1440].includes(width)) await page.screenshot({ path: `${output}/home-${width}-${theme}.png` })
      }
      if (width < 1200) await page.getByRole('button', { name: 'Abrir menú' }).click()
      await page.getByRole('button', { name: 'Trabaja con nosotros', exact: true }).filter({ visible: true }).click()
      await page.locator('[role="dialog"]').waitFor()
      await page.waitForTimeout(1500)
      await page.evaluate(axe)
      const violations = await page.evaluate(async () => (await window.axe.run(document, { preload: false, runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })))
      await page.locator('.application-modal__close').focus()
      await page.keyboard.press('Shift+Tab')
      assert.ok(await page.locator('[role="dialog"]').evaluate((node) => node.contains(document.activeElement)))
      await page.keyboard.press('Tab')
      assert.ok(await page.locator('.application-modal__close').evaluate((node) => node === document.activeElement))
      await page.keyboard.press('Escape')
      assert.equal(await page.locator('[role="dialog"]').count(), 0)
      assert.ok(await page.evaluate(() => document.activeElement.matches('button')))
      report.cases.push({ width, theme, path: 'modal', violations, events })
      await context.close()
    }
  }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report.cases.filter((c) => c.violations.length).map(({ width, theme, path, violations }) => ({ width, theme, path, violations })), null, 2))
} finally { await browser.close() }
