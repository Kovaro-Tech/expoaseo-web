import { businessConfig } from '../config/business'

/** true cuando ya cargamos el número real en business.js */
export const isWhatsAppConfigured = Boolean(businessConfig.whatsapp)

/**
 * Construye el enlace de WhatsApp con el mensaje ya escrito.
 * Si aún no hay número configurado, abre WhatsApp con el texto listo
 * para que el usuario elija el contacto (modo demo).
 */
export function buildWhatsAppUrl(message) {
  const phone = String(businessConfig.whatsapp || '').replace(/\D/g, '')
  const text = encodeURIComponent(message || businessConfig.defaultMessage)
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`
}

/** Mensaje para una categoría completa (Hogar / Empresa / Muebles). */
export function messageForCategory(category) {
  if (!category) return businessConfig.defaultMessage
  return `Hola EXPOASEO 👋, quisiera recibir información sobre el servicio de ${category.whatsappTopic}.`
}

/**
 * Mensaje del selector: categoría + el detalle libre que escribió el usuario.
 * El salto de línea se conserva dentro de WhatsApp.
 */
export function messageForRequest(category, details) {
  const base = messageForCategory(category)
  const extra = String(details || '').trim()
  return extra ? `${base}\n\n${extra}` : base
}

/** Mensaje para un servicio puntual del catálogo. */
export function messageForService(category, service) {
  if (!service) return messageForCategory(category)
  return `Hola EXPOASEO 👋, me interesa el servicio "${service.name}" (${category.label}) — ${service.price}. ¿Me pueden dar más información?`
}
