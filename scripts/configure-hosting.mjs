import { writeFile } from 'node:fs/promises'
import { securityHeaders } from './security.mjs'

// Ejecutar al cambiar headers; Vercel lee su configuración ANTES del build.
export const vercelConfig = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  cleanUrls: true,
  headers: [
    { source: '/(.*)', headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })) },
    {
      source: '/(.*)',
      missing: [{ type: 'host', value: 'expoaseo.com' }],
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    { source: '/404', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/api/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ],
}

if (process.argv.includes('--write')) await writeFile('vercel.json', `${JSON.stringify(vercelConfig, null, 2)}\n`)
