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
 * Imágenes. Los archivos van en /public/images y se referencian
 * como "/images/archivo.png".
 *
 * heroImage: si se deja vacío, el hero muestra una composición gráfica propia
 * (sin fotos genéricas de stock).
 */
export const businessMedia = {
  logo: '/images/logo.png',
  heroImage: '', // ← foto real del equipo trabajando (opcional)
}
