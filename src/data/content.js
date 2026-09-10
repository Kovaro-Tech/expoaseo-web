/**
 * Textos de secciones (confianza, pasos, beneficios, FAQ).
 * Separado de services.js para que la clienta pueda ajustar copy sin tocar precios.
 *
 * ► Evitamos cifras que no podemos comprobar (años, número de clientes).
 *   Si la clienta confirma datos duros, se agregan aquí.
 */

export const trustHighlights = [
  {
    id: 'personal',
    icon: 'Users',
    title: 'Personal capacitado',
    text: 'Equipo propio, supervisado y con protocolos de trabajo.',
  },
  {
    id: 'insumos',
    icon: 'SprayCan',
    title: 'Insumos incluidos',
    text: 'Productos y equipos profesionales, sin costo adicional.',
  },
  {
    id: 'precios',
    icon: 'Receipt',
    title: 'Precios claros',
    text: 'Rangos publicados y valor confirmado antes de empezar.',
  },
  {
    id: 'respuesta',
    icon: 'MessageCircle',
    title: 'Respuesta rápida',
    text: 'Cotizamos por WhatsApp, sin formularios eternos.',
  },
]

/** Chips cortos que acompañan al hero. */
export const heroBadges = [
  'Hogares y departamentos',
  'Oficinas e instituciones',
  'Muebles y tapicería',
]

export const steps = [
  {
    id: 'paso-1',
    number: '01',
    icon: 'ClipboardList',
    title: 'Elige el servicio',
    text: 'Revisa las opciones para hogar, empresa o tapicería y su precio referencial.',
  },
  {
    id: 'paso-2',
    number: '02',
    icon: 'MessageCircle',
    title: 'Cuéntanos qué necesitas',
    text: 'Escríbenos por WhatsApp con el tamaño del espacio y la fecha que tienes en mente.',
  },
  {
    id: 'paso-3',
    number: '03',
    icon: 'CalendarCheck',
    title: 'Coordinamos tu limpieza',
    text: 'Confirmamos valor final, horario y enviamos al equipo con todo lo necesario.',
  },
]

export const benefits = [
  {
    id: 'empresa-formal',
    icon: 'BadgeCheck',
    title: 'Empresa legalmente constituida',
    text: 'EXPOASEO SERVICIOS GENERALES CIA LTDA: contrato, respaldo y facturación para hogares y empresas.',
  },
  {
    id: 'protocolos',
    icon: 'ShieldCheck',
    title: 'Protocolos de higiene reales',
    text: 'Limpieza y desinfección con productos adecuados para cada superficie y tipo de tela.',
  },
  {
    id: 'tiempo',
    icon: 'Timer',
    title: 'Cumplimos el horario acordado',
    text: 'Jornadas definidas de 4 u 8 horas: sabes exactamente cuánto dura el servicio.',
  },
  {
    id: 'escala',
    icon: 'Building2',
    title: 'Del departamento a la red de agencias',
    text: 'Mismo estándar para una sala de estar o para el mantenimiento mensual de varios puntos.',
  },
]

/**
 * FAQ. Las respuestas marcadas con ► deben validarse con la clienta.
 */
export const faqs = [
  {
    id: 'faq-solicitar',
    question: '¿Cómo solicito una limpieza?',
    answer:
      'Elige el servicio que necesitas, toca el botón de WhatsApp y llega un mensaje ya escrito a nuestro chat. Ahí confirmamos detalles, valor y fecha.',
  },
  {
    id: 'faq-precios',
    question: '¿Los precios publicados son fijos?',
    answer:
      'Son rangos referenciales. El valor final depende del tamaño del espacio, su estado y la frecuencia del servicio; siempre te lo confirmamos antes de agendar.',
  },
  {
    id: 'faq-insumos',
    question: '¿Debo poner yo los productos de limpieza?',
    answer:
      'No. Nuestro equipo llega con insumos y equipos profesionales incluidos en el precio.',
  },
  {
    id: 'faq-muebles',
    question: '¿La limpieza de muebles es a domicilio?',
    answer:
      'Sí. Lavamos y desinfectamos sillones, salas y sillas de comedor en tu propio espacio, sin necesidad de trasladar los muebles.',
  },
  {
    id: 'faq-empresas',
    question: '¿Atienden empresas e instituciones?',
    answer:
      'Sí. Trabajamos limpieza institucional por metraje y mantenimiento mensual de cajeros o fichas SOS, con planes continuos.',
  },
  {
    id: 'faq-anticipacion',
    question: '¿Con cuánta anticipación debo agendar?',
    // ► Confirmar con la clienta el tiempo real de respuesta.
    answer:
      'Mientras antes nos escribas, más opciones de horario tendrás. Escríbenos por WhatsApp y te indicamos la disponibilidad más cercana.',
  },
]
