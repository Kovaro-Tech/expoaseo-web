import { existsSync, readFileSync } from 'node:fs'
import { businessConfig } from '../src/config/business.js'
import { privacyConfig } from '../src/config/privacy.js'
import { PRODUCTION_URL, pages, siteConfig } from '../src/config/site.js'

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: businessConfig.legalName,
  taxID: privacyConfig.taxId,
  address: {
    '@type': 'PostalAddress',
    streetAddress: privacyConfig.address,
    addressCountry: privacyConfig.country,
  },
  url: `${PRODUCTION_URL}/`,
  email: businessConfig.email,
  telephone: businessConfig.telephone,
  areaServed: { '@type': 'Country', name: privacyConfig.country },
  sameAs: [businessConfig.instagram, businessConfig.tiktok].filter(Boolean),
}

// Detectar dimensiones reales del JPEG; no publicar una ruta ausente o un archivo inválido.
export function validOgImage() {
  const path = `public${siteConfig.ogImage}`
  if (!existsSync(path)) return false
  const data = readFileSync(path)
  if (data.readUInt16BE(0) !== 0xffd8) throw new Error('og-image.jpg debe ser JPEG.')
  let offset = 2
  while (offset + 9 < data.length) {
    if (data[offset] !== 0xff) break
    const marker = data[offset + 1]
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (data.readUInt16BE(offset + 5) !== 630 || data.readUInt16BE(offset + 7) !== 1200) {
        throw new Error('La imagen OG debe medir 1200 × 630.')
      }
      return true
    }
    const length = data.readUInt16BE(offset + 2)
    if (length < 2) break
    offset += 2 + length
  }
  throw new Error('No se pudo validar el JPEG de Open Graph.')
}

export function renderSeo(path, environment, ogAvailable = false) {
  const page = pages[path] || pages['/404']
  const notFound = page === pages['/404']
  const indexable = environment.indexable && !notFound
  const url = `${environment.siteUrl}${path}`
  return [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta name="robots" content="${indexable ? 'index,follow' : 'noindex,nofollow'}" />`,
    indexable ? `<link rel="canonical" href="${url}" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="EXPOASEO" />',
    '<meta property="og:locale" content="es_EC" />',
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    !notFound ? `<meta property="og:url" content="${url}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    ogAvailable ? `<meta property="og:image" content="${environment.siteUrl}${siteConfig.ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(siteConfig.ogImageAlt)}" />
    <meta name="twitter:image" content="${environment.siteUrl}${siteConfig.ogImage}" />
    <meta name="twitter:image:alt" content="${escape(siteConfig.ogImageAlt)}" />` : '',
    path === '/' ? `<script type="application/ld+json">${JSON.stringify({ ...organization, url: `${environment.siteUrl}/` }).replaceAll('<', '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')
}

export function replaceSeo(html, path, environment, ogAvailable) {
  return html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${renderSeo(path, environment, ogAvailable)}\n    <!--seo:end-->`)
}
