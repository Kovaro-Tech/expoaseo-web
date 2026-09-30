import { handler } from './job-application.js'
import { securityHeaders } from '../scripts/security.mjs'
import deployment from '../dist/deployment.json'
export { AbuseGuard } from './abuse-guard.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    let response
    if (url.protocol === 'http:' && ['expoaseo.com', 'expoaseo.kovarotech.com'].includes(url.hostname)) {
      url.protocol = 'https:'
      response = Response.redirect(url.href, 308)
    } else if (deployment.environment !== env.SITE_ENVIRONMENT || deployment.siteUrl !== env.SITE_URL) {
      response = new Response('Sitio temporalmente no disponible.', { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
    } else if (url.pathname === '/api/job-application') {
      response = await handler(request, env)
    } else if (url.pathname.startsWith('/api/')) {
      response = Response.json({ error: 'Ruta no encontrada.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
    } else if (['/404', '/404.html'].includes(url.pathname)) {
      response = new Response((await env.ASSETS.fetch(new Request(new URL('/404', url), request))).body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    } else {
      response = await env.ASSETS.fetch(request)
    }
    const secured = new Response(response.body, response)
    for (const [key, value] of Object.entries(securityHeaders)) secured.headers.set(key, value)
    if (env.SITE_ENVIRONMENT !== 'production' || url.hostname !== 'expoaseo.com' || response.status === 404 || url.pathname.startsWith('/api/')) {
      secured.headers.set('X-Robots-Tag', 'noindex, nofollow')
    }
    return secured
  },
}
