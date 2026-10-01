// Manual asset generation: node scripts/create-og-image.mjs
// Uses the original photograph and logo without modifying either source.
// The committed JPEG is served directly; production builds do not need a browser.
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const photo = await readFile('public/images/real-work/new/limpieza-escaleras-01.webp')
const logo = await readFile('public/images/logo-light.png')
const browser = await chromium.launch(process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : { channel: 'chrome' })
try {
  const page = await browser.newPage()
  const jpeg = await page.evaluate(async ({ photo, logo }) => {
    const load = async (src) => {
      const image = new Image()
      image.src = src
      await image.decode()
      return image
    }
    const [background, brand] = await Promise.all([load(photo), load(logo)])
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.fillStyle = '#091928'
    ctx.fillRect(0, 0, 1200, 630)
    const photoWidth = background.width * 630 / background.height
    ctx.drawImage(background, 400, 0, photoWidth, 630)
    const shade = ctx.createLinearGradient(0, 0, 1200, 0)
    shade.addColorStop(0, 'rgba(9,25,40,1)')
    shade.addColorStop(0.33, 'rgba(9,25,40,1)')
    shade.addColorStop(0.52, 'rgba(9,25,40,0.88)')
    shade.addColorStop(0.77, 'rgba(9,25,40,0.32)')
    shade.addColorStop(1, 'rgba(9,25,40,0.28)')
    ctx.fillStyle = shade
    ctx.fillRect(0, 0, 1200, 630)
    ctx.drawImage(brand, 64, 54, 300, 300 * brand.height / brand.width)
    ctx.fillStyle = '#8cc63f'
    ctx.fillRect(64, 198, 48, 4)
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 58px Arial, sans-serif'
    ctx.fillText('Servicios generales', 64, 235)
    ctx.fillText('con cobertura', 64, 301)
    ctx.fillText('nacional', 64, 367)
    ctx.fillStyle = '#d5e7f3'
    ctx.font = '400 27px Arial, sans-serif'
    ctx.fillText('Limpieza, desinfección y', 66, 458)
    ctx.fillText('mantenimiento institucional', 66, 494)
    ctx.fillStyle = '#b9dcf5'
    ctx.font = '400 20px Arial, sans-serif'
    ctx.fillText('expoaseo.com', 66, 565)
    return canvas.toDataURL('image/jpeg', 0.9).split(',')[1]
  }, {
    photo: `data:image/webp;base64,${photo.toString('base64')}`,
    logo: `data:image/png;base64,${logo.toString('base64')}`,
  })
  await writeFile('public/og-image.jpg', Buffer.from(jpeg, 'base64'))
  console.log('public/og-image.jpg: JPEG 1200 × 630 generado con los originales.')
} finally {
  await browser.close()
}
