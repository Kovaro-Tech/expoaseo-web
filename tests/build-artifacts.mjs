import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (name) => readFile(`dist/${name}`, 'utf8')
const deployment = JSON.parse(await read('deployment.json'))
for (const page of ['index', 'privacidad', 'cookies']) {
  const html = await read(`${page}.html`)
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
  assert.match(html, new RegExp(`content="${deployment.indexable ? 'index,follow' : 'noindex,nofollow'}"`))
  if (deployment.indexable) assert.ok(html.includes(`rel="canonical" href="https://expoaseo.com/${page === 'index' ? '' : page}"`))
  else assert.doesNotMatch(html, /rel="canonical"/)
  assert.equal(/(?:og|twitter):image"/.test(html), deployment.ogAvailable)
  assert.ok(html.includes(`property="og:url" content="${deployment.siteUrl}/${page === 'index' ? '' : page}"`))
  if (page === 'index') {
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
    assert.equal(schema.url, `${deployment.siteUrl}/`)
    assert.ok(html.includes('Cobertura nacional desde Loja.'))
  }
}
assert.match(await read('404.html'), /noindex,nofollow/)
assert.doesNotMatch(await read('404.html'), /rel="canonical"/)
const sitemap = await read('sitemap.xml')
assert.equal((sitemap.match(/<loc>/g) || []).length, deployment.indexable ? 3 : 0)
assert.equal((await read('robots.txt')).includes('Sitemap: https://expoaseo.com/sitemap.xml'), deployment.indexable)
assert.ok((await read('_headers')).includes('https://challenges.cloudflare.com'))
for (const name of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) assert.ok((await readFile(`dist/${name}`)).length > 0)
console.log(`Artefactos ${deployment.environment}: HTML, canonical, robots, sitemap, 404, headers e iconos correctos.`)
