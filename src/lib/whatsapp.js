import { businessConfig } from '../config/business'
import { whatsappMessage } from '../config/whatsapp'

/**
 * Enlace de WhatsApp con el mensaje ya escrito.
 * Si businessConfig.whatsapp quedara vacío, abre WhatsApp con el texto listo
 * para que el usuario elija el contacto, en lugar de romper el enlace.
 */
export function buildWhatsAppUrl(message) {
  const phone = String(businessConfig.whatsapp || '').replace(/\D/g, '')
  const text = encodeURIComponent(message || buildGeneralMessage())
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`
}

/** Une los bloques que existan, separados por línea en blanco. */
function joinBlocks(blocks) {
  return blocks.filter(Boolean).join('\n\n')
}

export function buildGeneralMessage() {
  const { greeting, intro, closing } = whatsappMessage.general
  return joinBlocks([greeting, intro, closing])
}

/**
 * Mensaje de cotización. Solo se escriben las líneas con valor:
 * un servicio sin duración o sin precio no deja huecos.
 */
export function buildQuoteMessage({ category, service, details } = {}) {
  const { greeting, intro, fields, labels, closing } = whatsappMessage.quote

  const values = {
    category: category ? (category.whatsappTopic ?? category.label) : '',
    service: service?.name ?? '',
    price: service?.price ?? '',
    duration: service?.duration ?? '',
    details: String(details || '').trim(),
  }

  const lines = fields
    .filter((field) => values[field])
    .map((field) => `${labels[field]}: ${values[field]}`)

  return joinBlocks([greeting, intro, lines.join('\n'), closing])
}

/** Enlace listo para los CTA de cotización. */
export function quoteUrl(selection) {
  return buildWhatsAppUrl(buildQuoteMessage(selection))
}

/** Enlace listo para los CTA de contacto general. */
export function generalUrl() {
  return buildWhatsAppUrl(buildGeneralMessage())
}
