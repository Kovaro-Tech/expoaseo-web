// Servidor local para revisar los artefactos reales, CSP y estados HTTP.
// No reemplaza a Vercel ni ejecuta la API: sin secretos devuelve indisponibilidad.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { securityHeaders } from './security.mjs'

const root = resolve('dist')
const deployment = JSON.parse(await readFile(resolve(root, 'deployment.json'), 'utf8'))
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }
createServer(async (req, res) => {
  for (const [key, value] of Object.entries(securityHeaders)) res.setHeader(key, value)
  if (!deployment.indexable || req.headers.host?.split(':')[0] !== 'expoaseo.com') res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  let path
  try { path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { res.writeHead(400).end(); return }
  if (path === '/api/job-application') {
    res.writeHead(req.method === 'GET' ? 200 : 503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify(req.method === 'GET' ? { available: false } : { error: 'El envío no está disponible temporalmente.' }))
    return
  }
  const route = path === '/' ? '/index.html' : !extname(path) ? `${path.replace(/\/$/, '')}.html` : path
  const filename = resolve(root, `.${route}`)
  if (!filename.startsWith(root + sep)) { res.writeHead(403).end(); return }
  try {
    const data = await readFile(filename)
    res.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream' }).end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'], 'X-Robots-Tag': 'noindex, nofollow' }).end(await readFile(resolve(root, '404.html')))
  }
}).listen(4173, '127.0.0.1', () => console.log('Preview con headers: http://127.0.0.1:4173'))
