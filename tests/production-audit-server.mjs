// Production-like transport for before/after audits; keeps local noindex protection.
// node tests/production-audit-server.mjs [dist-directory] [port]
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { securityHeaders } from '../scripts/security.mjs'

const root = resolve(process.argv[2] || 'dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }
const headerRules = (await readFile(resolve(root, '_headers'), 'utf8')).split(/\r?\n/)
createServer(async (req, res) => {
  for (const [name, value] of Object.entries(securityHeaders)) res.setHeader(name, value)
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  let pathname
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { res.writeHead(400).end(); return }
  if (pathname.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store')
    res.writeHead(req.method === 'GET' ? 200 : 503, { 'Content-Type': 'application/json' }).end(JSON.stringify({ available: false }))
    return
  }
  const route = pathname === '/' ? '/index.html' : extname(pathname) ? pathname : `${pathname}.html`
  const filename = resolve(root, `.${route}`)
  if (!filename.startsWith(root + sep)) { res.writeHead(403).end(); return }
  try {
    let data = await readFile(filename)
    let matches = false
    for (const line of headerRules) {
      if (line.startsWith('/')) matches = line.endsWith('*') ? pathname.startsWith(line.slice(0, -1)) : pathname === line
      else if (matches && /^\s+Cache-Control:/.test(line)) res.setHeader('Cache-Control', line.trim().slice('Cache-Control:'.length).trim())
    }
    res.setHeader('Content-Type', types[extname(filename)] || 'application/octet-stream')
    if (extname(filename) === '.mp4') {
      res.setHeader('Accept-Ranges', 'bytes')
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '')
      if (range) {
        const start = Number(range[1])
        const end = Math.min(range[2] ? Number(range[2]) : data.length - 1, data.length - 1)
        if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${data.length}` }).end(); return }
        res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Content-Length': end - start + 1 }).end(data.subarray(start, end + 1))
        return
      }
    }
    if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && ['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml'].includes(extname(filename))) {
      data = gzipSync(data)
      res.setHeader('Content-Encoding', 'gzip')
      res.setHeader('Vary', 'Accept-Encoding')
    }
    res.writeHead(200, { 'Content-Length': data.length }).end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] }).end(await readFile(resolve(root, '404.html')))
  }
}).listen(Number(process.argv[3] || 4175), '127.0.0.1', () => console.log(`Audit transport: ${root}`))
