/**
 * Plantilla del mensaje de WhatsApp — punto único de cambio.
 *
 * Ningún componente escribe texto de WhatsApp: todo sale de aquí.
 * El constructor (src/lib/whatsapp.js) omite automáticamente las líneas cuyo
 * valor no exista, así que un servicio sin duración o sin precio nunca genera
 * una línea vacía.
 */

export const whatsappMessage = {
  /** Solicitud de cotización (selector, filas del catálogo). */
  quote: {
    greeting: 'Hola EXPOASEO 👋',
    intro: 'Quisiera solicitar una cotización.',

    /**
     * Líneas que se incluyen y en qué orden.
     * Quitar una clave de este array la elimina del mensaje.
     * Claves disponibles: category · service · price · duration · details
     */
    fields: ['category', 'service', 'price', 'duration', 'details'],

    labels: {
      category: 'Tipo de servicio',
      service: 'Servicio',
      price: 'Valor referencial visto en la web',
      duration: 'Duración',
      details: 'Detalles',
    },

    closing: '¿Me pueden confirmar disponibilidad y precio final?',
  },

  /** Contacto general: navbar, hero y cierre. */
  general: {
    greeting: 'Hola EXPOASEO 👋',
    intro: 'Quisiera información sobre sus servicios de limpieza.',
    closing: '',
  },
}
