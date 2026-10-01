import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { siteConfig, pages } from '../src/config/site.js'
import { validOgImage } from '../scripts/seo.mjs'

const read = (name) => readFile(`dist/${name}`, 'utf8')
const deployment = JSON.parse(await read('deployment.json'))
assert.equal(validOgImage(), true, 'La OG principal debe existir y medir 1200 × 630.')
assert.equal(deployment.ogAvailable, true)
assert.deepEqual(await readFile('dist/og-image.jpg'), await readFile('public/og-image.jpg'))
for (const page of ['index', 'privacidad', 'cookies']) {
  const html = await read(`${page}.html`)
  const metadata = pages[page === 'index' ? '/' : `/${page}`]
  assert.ok(html.includes(`<title>${metadata.title}</title>`))
  for (const [key, value] of Object.entries({
    description: metadata.description,
    'og:title': metadata.title, 'og:description': metadata.description,
    'og:type': 'website', 'og:image': `${deployment.siteUrl}${siteConfig.ogImage}`,
    'og:image:width': '1200', 'og:image:height': '630', 'og:image:type': 'image/jpeg',
    'twitter:card': 'summary_large_image', 'twitter:title': metadata.title,
    'twitter:description': metadata.description, 'twitter:image': `${deployment.siteUrl}${siteConfig.ogImage}`,
  })) {
    const matches = [...html.matchAll(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`, 'g'))]
    assert.equal(matches.length, 1, `${page}: ${key} debe aparecer una sola vez`)
    assert.equal(matches[0][1], value)
  }
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
  assert.match(html, new RegExp(`content="${deployment.indexable ? 'index,follow' : 'noindex,nofollow'}"`))
  if (deployment.indexable) assert.ok(html.includes(`rel="canonical" href="https://expoaseo.com/${page === 'index' ? '' : page}"`))
  else assert.doesNotMatch(html, /rel="canonical"/)
  assert.equal(/(?:og|twitter):image"/.test(html), deployment.ogAvailable)
  assert.ok(html.includes(`property="og:url" content="${deployment.siteUrl}/${page === 'index' ? '' : page}"`))
  if (page === 'index') {
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
    assert.equal(schema.url, `${deployment.siteUrl}/`)
    assert.ok(html.replace(/<!--.*?-->/gs, '').includes('cobertura nacional desde Loja.'))
  }
}
assert.match(await read('404.html'), /noindex,nofollow/)
assert.doesNotMatch(await read('404.html'), /rel="canonical"/)
const sitemap = await read('sitemap.xml')
assert.equal((sitemap.match(/<loc>/g) || []).length, deployment.indexable ? 3 : 0)
assert.equal((await read('robots.txt')).includes('Sitemap: https://expoaseo.com/sitemap.xml'), deployment.indexable)
assert.ok((await read('_headers')).includes('https://challenges.cloudflare.com'))
for (const name of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) assert.ok((await readFile(`dist/${name}`)).length > 0)
console.log(`Artefactos ${deployment.environment}: HTML, metadatos sociales, JPEG OG, canonical, robots, sitemap, 404, headers e iconos correctos.`)
