export const PRODUCTION_URL = 'https://expoaseo.com'
export const siteConfig = {
  title: 'EXPOASEO | Servicios generales con cobertura nacional',
  description: 'Limpieza, desinfección y mantenimiento institucional para hogares, empresas e instituciones en todo el Ecuador.',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'EXPOASEO: servicios generales con cobertura nacional. Personal realizando limpieza de escaleras.',
  themeColor: '#0f75bc',
  backgroundColor: '#f7f9fc',
}

export const pages = {
  '/': { title: siteConfig.title, description: siteConfig.description },
  '/privacidad': {
    title: 'Política de Privacidad | EXPOASEO',
    description: 'Conoce cómo EXPOASEO trata tus datos personales y hoja de vida para procesos de selección, y cómo ejercer tus derechos en Ecuador.',
  },
  '/cookies': {
    title: 'Política de Cookies | EXPOASEO',
    description: 'Información sobre la preferencia de apariencia, el almacenamiento funcional y las tecnologías de seguridad utilizadas en la web de EXPOASEO.',
  },
  '/404': { title: 'Página no encontrada | EXPOASEO', description: 'La página que buscas no está disponible. Vuelve al inicio de EXPOASEO.' },
}

export function resolveSiteEnvironment(env = {}) {
  const environment = env.SITE_ENVIRONMENT || 'staging'
  if (!['staging', 'production'].includes(environment)) throw new Error('SITE_ENVIRONMENT debe ser staging o production.')
  const siteUrl = new URL(env.SITE_URL || 'https://expoaseo.kovarotech.com').origin
  if (environment === 'production' && siteUrl !== PRODUCTION_URL) {
    throw new Error('Producción requiere SITE_URL=https://expoaseo.com.')
  }
  if (!siteUrl.startsWith('https://')) throw new Error('SITE_URL requiere HTTPS.')
  if (environment === 'staging' && siteUrl === PRODUCTION_URL) throw new Error('Staging requiere su propia URL.')
  const indexable = environment === 'production'
  return { environment, siteUrl, indexable }
}
