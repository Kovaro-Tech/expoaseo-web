/**
 * Configuración central del negocio.
 *
 * ► TODO CLIENTE: reemplazar los valores vacíos cuando tengamos la información
 *   definitiva. Ningún componente hardcodea estos datos.
 *
 * whatsapp: número en formato internacional SIN "+" ni espacios.
 *           Ejemplo Ecuador: "593987654321"
 *           Si queda vacío, los botones abren WhatsApp igual y el usuario
 *           elige el contacto (útil para demos), pero NO publicar así.
 */
export const businessConfig = {
  name: 'EXPOASEO',
  legalName: 'EXPOASEO SERVICIOS GENERALES CIA LTDA',
  tagline: 'Servicios profesionales de limpieza',

  whatsapp: '', // ← pendiente
  email: '', // ← pendiente (ej. "contacto@expoaseo.com")
  phoneDisplay: '', // ← pendiente (ej. "+593 98 765 4321")

  instagram: '', // ← pendiente (URL completa)
  facebook: '', // ← pendiente (URL completa)
  tiktok: '', // ← pendiente (URL completa)

  location: 'Ecuador',
  schedule: 'Lunes a sábado, 08:00 – 18:00', // ← confirmar con la clienta

  /** Mensaje usado cuando el usuario no eligió un servicio específico. */
  defaultMessage:
    'Hola EXPOASEO 👋, quisiera recibir información sobre sus servicios de limpieza.',
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
 *   heroImage        4:3 apaisada   (mín. 1200×900)
 *   homeImage        2:1 apaisada   (mín. 1400×700)
 *   businessImage    2:1 apaisada   (mín. 1400×700)
 *   upholsteryImage  2:1 apaisada   (mín. 1400×700)
 */
export const businessMedia = {
  logo: '/images/logo.png',

  heroImage: '', // portada
  homeImage: '', // categoría Hogares
  businessImage: '', // categoría Empresas e instituciones
  upholsteryImage: '', // categoría Muebles y tapicería
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
