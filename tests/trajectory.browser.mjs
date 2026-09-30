import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const copy = 'Somos una empresa orgullosamente lojana, con más de 15 años de experiencia brindando soluciones integrales de limpieza, desinfección y mantenimiento institucional a nivel nacional. Garantizamos espacios impecables, seguros y eficientes, adaptándonos a las altas exigencias y normativas de cada sector.'
const server = spawn(process.execPath, ['scripts/preview.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] })
let browser
try {
  await new Promise((resolve, reject) => {
    server.stdout.once('data', resolve)
    server.once('error', reject)
    server.once('exit', (code) => reject(new Error(`Preview exited: ${code}`)))
  })
  browser = await chromium.launch(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: 'chrome' })
  await mkdir('qa-artifacts/trajectory', { recursive: true })
  const report = []
  const errors = []
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  const initialPhotoRequests = await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => entry.name.includes('/real-work/new/')).length)
  assert.equal(await page.locator('.exp__title').innerText(), 'Una trayectoria construida trabajando.')
  assert.equal((await page.locator('.exp__text').innerText()).replace(/\s+/g, ' '), copy)
  assert.equal(await page.locator('.exp__number').innerText(), '15')
  const rail = page.locator('.exp__rail')
  const left = () => rail.evaluate((node) => node.scrollLeft)
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1100 })
      await page.evaluate((theme) => { document.documentElement.dataset.theme = theme }, theme)
      await rail.evaluate((node) => node.scrollTo({ left: 0, behavior: 'instant' }))
      await page.locator('#trayectoria').scrollIntoViewIfNeeded()
      await page.waitForTimeout(350)
      const dimensions = await page.evaluate(() => {
        const rail = document.querySelector('.exp__rail')
        const photos = [...rail.querySelectorAll('img')]
        const boxes = photos.map((img) => img.getBoundingClientRect())
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          heights: boxes.map((box) => box.height),
          widths: boxes.map((box) => box.width),
          snap: getComputedStyle(rail).scrollSnapType,
          count: photos.length,
          visible: boxes.filter((box) => box.left >= rail.getBoundingClientRect().left - 1 && box.right <= rail.getBoundingClientRect().right + 1).length,
          natural: photos.every((img) => getComputedStyle(img).filter === 'none' && getComputedStyle(img).objectFit === 'cover'),
        }
      })
      assert.equal(dimensions.overflow, false, `body overflow ${theme} ${width}`)
      assert.equal(dimensions.count, 10)
      assert.ok(dimensions.natural)
      assert.ok(dimensions.heights.every((height) => Math.abs(height - dimensions.heights[0]) < 1))
      assert.ok(dimensions.widths.every((value, i) => Math.abs(value / dimensions.heights[i] - 4 / 3) < 0.01))
      if (width >= 1024) assert.equal(dimensions.visible, 3)
      if (width < 768) {
        assert.ok(Math.abs(dimensions.widths[0] / width - 0.86) < 0.01)
        assert.equal(dimensions.snap, 'x mandatory')
      }
      if ([390, 768, 1280, 1440].includes(width)) {
        await page.locator('#trayectoria').screenshot({ path: `qa-artifacts/trajectory/${theme}-${width}.png` })
      }
      report.push({ theme, width, ...dimensions })
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 })
  await rail.scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Fotografía siguiente', exact: true }).click()
  await page.waitForTimeout(700)
  assert.ok(await left() > 300, 'arrow advances')
  await rail.focus()
  await page.keyboard.press('End')
  await page.waitForFunction(() => document.querySelector('.exp__controls button:last-child').disabled)
  assert.ok(await page.getByRole('button', { name: 'Fotografía siguiente', exact: true }).isDisabled())
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.querySelector('.exp__rail').scrollLeft < 2)
  assert.ok(await left() < 2)
  const box = await rail.boundingBox()
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, { steps: 15 })
  await page.mouse.up()
  await page.waitForTimeout(400)
  assert.ok(await left() > 300, 'mouse drag advances')
  assert.equal(await rail.evaluate((node) => node.classList.contains('is-dragging')), false)
  const beforeWheel = await left()
  await page.mouse.wheel(500, 0)
  await page.waitForTimeout(600)
  assert.ok(await left() > beforeWheel, 'horizontal wheel advances')
  const beforeHover = await left()
  await page.waitForTimeout(1500)
  assert.equal(await left(), beforeHover, 'no automatic movement')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await rail.focus()
  await page.keyboard.press('Home')
  assert.ok(await left() < 2, 'reduced motion navigation is immediate')
  await page.keyboard.press('ArrowRight')
  assert.ok(await left() > 300)
  // Bring every image into view and verify source dimensions and successful decoding.
  for (const img of await rail.locator('img').all()) {
    await img.scrollIntoViewIfNeeded()
    await img.evaluate((node) => node.decode())
    const valid = await img.evaluate((node) => node.naturalWidth === Number(node.getAttribute('width')) && node.naturalHeight === Number(node.getAttribute('height')) && node.src.includes('/real-work/new/') && node.loading === 'lazy')
    assert.ok(valid)
  }
  await page.locator('#trayectoria').screenshot({ path: 'qa-artifacts/trajectory/dark-final-photos.png' })

  // Deliberately delay the photos to detect changes in the space reserved for them.
  const delayed = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  let releasePhotos
  const photoGate = new Promise((resolve) => { releasePhotos = resolve })
  await delayed.route('**/images/real-work/new/*', async (route) => {
    await photoGate
    await route.continue()
  })
  await delayed.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' })
  await delayed.evaluate(() => document.fonts.ready)
  await delayed.locator('.exp__rail').scrollIntoViewIfNeeded()
  const reserved = await delayed.locator('#trayectoria').boundingBox()
  const reservedPhoto = await delayed.locator('.exp__photo').first().boundingBox()
  releasePhotos()
  await delayed.locator('.exp__image').first().evaluate((img) => img.decode())
  const loaded = await delayed.locator('#trayectoria').boundingBox()
  const loadedPhoto = await delayed.locator('.exp__photo').first().boundingBox()
  assert.equal(loaded.height, reserved.height, 'section keeps its height while photos load')
  assert.equal(loadedPhoto.height, reservedPhoto.height, 'photo keeps its reserved height')
  await delayed.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  mobile.on('pageerror', (error) => errors.push(error.message))
  await mobile.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await mobile.locator('.exp__rail').scrollIntoViewIfNeeded()
  const mobileBox = await mobile.locator('.exp__rail').boundingBox()
  const cdp = await mobile.context().newCDPSession(mobile)
  const y = mobileBox.y + mobileBox.height / 2
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 330, y }] })
  for (const x of [290, 240, 190, 140, 90]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] })
    await mobile.waitForTimeout(30)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await mobile.waitForTimeout(700)
  assert.ok(await mobile.locator('.exp__rail').evaluate((node) => node.scrollLeft) > 100, 'native touch swipe advances')
  assert.deepEqual(errors, [])
  await writeFile('qa-artifacts/trajectory/report.json', JSON.stringify({ layouts: report, initialPhotoRequests, reservedHeight: reserved.height, loadedHeight: loaded.height, interactions: ['arrows', 'keyboard', 'mouse drag', 'horizontal wheel', 'stationary hover', 'reduced motion', 'native touch'], errors }, null, 2))
  console.log('Trayectoria: 18 layouts, 9 screenshots, 10 WebP, reserved image space and desktop/touch interactions passed.')
} finally {
  await browser?.close()
  server.kill()
}
