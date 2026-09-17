/**
 * Configuración central del negocio.
 * Datos confirmados por la clienta. Ningún componente los hardcodea.
 *
 * whatsapp: formato internacional SIN "+" ni espacios (Ecuador = 593 + número
 *           sin el 0 inicial). 0989869808 → 593989869808
 */
export const businessConfig = {
  name: 'EXPOASEO',
  legalName: 'EXPOASEO SERVICIOS GENERALES CIA LTDA',
  tagline: 'Servicios profesionales de limpieza',

  whatsapp: '593989869808',
  phone: '098 986 9808',
  email: 'expoaseoec@gmail.com',

  /** Años en el mercado. Se muestra como cifra grande en "Trayectoria". */
  yearsExperience: 15,

  instagram: 'https://instagram.com/expoaseo',
  tiktok: 'https://www.tiktok.com/@expoaseo',
  facebook: '', // ← sin cuenta confirmada; si se crea, pegar la URL aquí

  serviceArea: 'Loja y provincia',

  /**
   * Franjas de atención. Se muestran separadas por "·".
   * ► Pendiente: la clienta no confirmó qué días aplican. Cuando lo haga,
   *   escribirlo en businessDays (ej. 'Lunes a viernes') y aparecerá solo.
   */
  businessHours: ['08:30 – 12:30', '15:00 – 18:00'],
  businessDays: '',
}

/** Horario en una línea: "Lunes a viernes · 08:30 – 12:30 · 15:00 – 18:00" */
export function formatBusinessHours() {
  return [businessConfig.businessDays, ...businessConfig.businessHours]
    .filter(Boolean)
    .join(' · ')
}

/**
 * Imágenes del sitio — punto único de cambio.
 *
 * Los archivos van en /public/images y se referencian como
 * "/images/archivo.jpg". Cualquier valor vacío se sustituye automáticamente
 * por un campo de color de marca: nunca se rompe el diseño.
 *
 * Añadir una foto = escribir una ruta aquí. No hay que tocar ningún componente.
 *
 * Proporciones recomendadas:
 *   heroVideoDesktop 16:9 apaisado  (1920×1080, MP4 H.264, sin audio, < 4 MB)
 *   heroVideoMobile  9:16 vertical  (720×1280,  MP4 H.264, sin audio, < 3 MB)
 *   homeImage        21:9 apaisada  (mín. 1600×686)
 *   businessImage    21:9 apaisada  (mín. 1600×686)
 *   upholsteryImage  21:9 apaisada  (mín. 1600×686)
 *   closingImage     16:9 apaisada  (mín. 1600×900)
 *
 * Las fotos de trabajo real de la sección "Trayectoria" viven en
 * src/data/trust.js, junto al resto del contenido de esa sección.
 */
export const businessMedia = {
  /**
   * Dos versiones del mismo logo, ambas con transparencia:
   *   onLight  original a color, para fondos claros
   *   onDark   wordmark y bajada en blanco, escoba en verde de marca,
   *            para el hero y el footer
   * Generada con ffmpeg a partir del original; el comando está en el README.
   */
  logo: {
    onLight: '/images/logo.png',
    onDark: '/images/logo-light.png',
  },

  /**
   * Portada en vídeo. Se sirve UN solo archivo según el viewport: el hero
   * decide cuál antes de pintar y nunca descarga los dos.
   *
   * Se reproduce en bucle, silenciado y con preload="metadata". Si el usuario
   * pide movimiento reducido, el vídeo no llega a pedirse y se queda el póster.
   *
   * Dejar cualquiera de las dos rutas vacía desactiva el vídeo en ese viewport.
   */
  heroVideoDesktop: '/videos/hero-desktop-web.mp4', // 1920×1080 · 8 s · 1,1 MB
  heroVideoMobile: '/videos/hero-mobile-web.mp4', // 720×1280 · 7 s · 0,6 MB

  /** Encuadre del vídeo (object-position). */
  heroVideoPositionDesktop: 'center 40%',
  heroVideoPositionMobile: 'center center',

  /** Cabecera de cada categoría de servicio. Vacío = campo de color de marca. */
  homeImage: '',
  businessImage: '',
  upholsteryImage: '',

  /** Fondo del cierre. Se muestra bajo un velo azul profundo. */
  closingImage: '/images/real-work/limpieza-interior-01.jpg',
}

/**
 * Imagen que acompaña a cada categoría de servicio.
 * La clave es el `id` de la categoría en src/data/services.js.
 */
export const categoryImages = {
  hogar: businessMedia.homeImage,
  institucional: businessMedia.businessImage,
  tapiceria: businessMedia.upholsteryImage,
}
