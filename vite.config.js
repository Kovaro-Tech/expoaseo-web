import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { pages, resolveSiteEnvironment } from './src/config/site.js'
import { replaceSeo, validOgImage } from './scripts/seo.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: 'expoaseo-seo',
    transformIndexHtml(html, context) {
      const path = context.originalUrl?.split('?')[0].replace(/\/$/, '') || '/'
      const page = path === '/index.html' ? '/' : Object.hasOwn(pages, path) ? path : '/404'
      return replaceSeo(html, page, resolveSiteEnvironment({ ...loadEnv(mode, process.cwd(), ''), ...process.env }), validOgImage())
    },
  }],
}))
