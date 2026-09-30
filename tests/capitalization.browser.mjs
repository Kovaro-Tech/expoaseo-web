import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const before = process.argv.includes('--before')
const deployment = JSON.parse(await readFile('dist/deployment.json', 'utf8'))
const server = spawn(process.execPath, ['scripts/preview.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] })
let browser
try {
  await new Promise((resolve, reject) => {
    server.stdout.once('data', resolve)
    server.once('error', reject)
    server.once('exit', (code) => reject(new Error(`Preview exited: ${code}`)))
  })
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const report = { environment: deployment.environment, before, pages: [], artifacts: [] }
  for (const path of ['/', '/privacidad', '/cookies', '/404']) {
    await page.goto(`http://127.0.0.1:4173${path}`, { waitUntil: 'networkidle' })
    const faqPanels = []
    if (path === '/') {
      for (const button of await page.locator('#faq button[aria-expanded]').all()) {
        await button.click()
        faqPanels.push(await page.locator('#faq').innerText())
      }
    }
    const evidence = await page.evaluate(() => ({
      bodyText: document.body.innerText,
      hero: document.querySelector('.hero__lead')?.innerText,
      footer: document.querySelector('.footer__tagline').innerText,
      trajectory: document.querySelector('#trayectoria')?.innerText,
      faq: document.querySelector('#faq')?.innerText,
      metadata: [document.title, ...Array.from(document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]'), (node) => node.content)],
      alt: Array.from(document.querySelectorAll('img[alt]'), (node) => node.alt),
    }))
    report.pages.push({ path, ...evidence, faqPanels })
    const city = before ? 'loja' : 'Loja'
    assert.equal(evidence.footer, `Limpieza profesional con cobertura nacional desde ${city}. 15 años de experiencia.`)
    if (path === '/') assert.equal(evidence.hero, `Hogares, empresas e instituciones con cobertura nacional desde ${city}.`)
    if (!before) {
      assert.doesNotMatch(evidence.bodyText, /\bloja\b/)
      assert.doesNotMatch(faqPanels.join('\n'), /\bloja\b/)
      assert.doesNotMatch([...evidence.metadata, ...evidence.alt].join('\n'), /\bloja\b/)
    }
    console.log(JSON.stringify({ path, hero: evidence.hero, footer: evidence.footer, bodyLojaLines: evidence.bodyText.split('\n').filter((line) => /loja/i.test(line)) }))
  }
  assert.deepEqual(errors, [])
  for (const file of ['index.html', 'privacidad.html', 'cookies.html', '404.html', ...(await readdir('dist/assets')).filter((file) => file.endsWith('.js')).map((file) => `assets/${file}`)]) {
    const content = await readFile(`dist/${file}`, 'utf8')
    const matches = content.match(/desde loja| loja\./g) || []
    report.artifacts.push({ file, lowercaseMatches: matches.length })
    if (!before) assert.deepEqual(matches, [], file)
  }
  await mkdir('qa-artifacts', { recursive: true })
  await writeFile(`qa-artifacts/capitalization-${deployment.environment}${before ? '-before' : ''}.json`, JSON.stringify(report, null, 2))
  console.log(`DOM y dist ${deployment.environment}: ${before ? 'error reproducido' : 'capitalización correcta'}.`)
} finally {
  await browser?.close()
  server.kill()
}
