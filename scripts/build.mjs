import { readFile, writeFile } from 'node:fs/promises'
import { build, createServer, loadEnv } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { resolveSiteEnvironment, pages } from '../src/config/site.js'
import { replaceSeo, validOgImage } from './seo.mjs'
import { securityHeaders } from './security.mjs'

const target = process.argv.includes('--production') ? 'production' : process.argv.includes('--staging') ? 'staging' : null
const mode = target || 'production'
const forced = target ? { SITE_ENVIRONMENT: target, SITE_URL: target === 'production' ? 'https://expoaseo.com' : 'https://expoaseo.kovarotech.com' } : {}
const environment = resolveSiteEnvironment({ ...loadEnv(mode, process.cwd(), ''), ...process.env, ...forced })
const ogAvailable = validOgImage()
await build({ mode })
const template = await readFile('dist/index.html', 'utf8')
const server = await createServer({ mode, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  for (const path of Object.keys(pages)) {
    const content = renderToString(createElement(App, { path }))
    const html = replaceSeo(template, path, environment, ogAvailable).replace('<div id="root"></div>', () => `<div id="root">${content}</div>`)
    await writeFile(`dist/${path === '/' ? 'index' : path.slice(1)}.html`, html)
  }
} finally { await server.close() }

const headers = Object.entries(securityHeaders).map(([key, value]) => `  ${key}: ${value}`).join('\n')
await writeFile('dist/_headers', `/*\n${headers}\n${environment.indexable ? '' : '  X-Robots-Tag: noindex, nofollow\n'}
/404
  X-Robots-Tag: noindex, nofollow
/404.html
  X-Robots-Tag: noindex, nofollow

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=86400

/videos/*
  Cache-Control: public, max-age=86400

/og-image.jpg
  Cache-Control: public, max-age=3600
`)
if (!environment.indexable) {
  // Permitir rastreo para que los buscadores lean noindex en HTML y headers.
  await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\n')
  await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n')
}
await writeFile('dist/deployment.json', JSON.stringify({ ...environment, ogAvailable }, null, 2))
console.log(`Entorno: ${environment.environment}; SITE_URL: ${environment.siteUrl}; OG: ${ogAvailable ? 'disponible' : 'pendiente'}.`)
