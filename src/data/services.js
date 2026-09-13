/**
 * Catálogo de servicios — ÚNICA fuente de verdad.
 * Datos proporcionados directamente por la clienta.
 *
 * Campos de cada servicio:
 *   id           clave única (no cambiar una vez publicada)
 *   name         nombre visible
 *   description  descripción corta, tal como la entregó la clienta
 *   price        valor REFERENCIAL, siempre como rango o "Desde …"
 *   unit         unidad de cobro ("por jornada", "por m²", "por silla"…)
 *   duration     opcional; si no existe, no aparece ni en la web ni en WhatsApp
 *   detail       opcional; matiz corto ("1 puesto", "Modular"…)
 *   priceDetail  opcional; aclaración del precio
 *   bestFor      opcional; para quién es
 *   badge        opcional; marca el servicio destacado de la categoría
 *
 * `whatsappTopic` (nivel categoría) es opcional: si existe, sustituye a `label`
 * en la línea "Tipo de servicio" del mensaje de WhatsApp.
 */

export const serviceCategories = [
  {
    id: 'hogar',
    label: 'Hogares',
    shortLabel: 'Hogar',
    title: 'Limpieza para hogares',
    description:
      'Casas y departamentos: mantenimiento periódico, limpiezas profundas y entrega de obra.',
    whatsappTopic: 'Limpieza para hogares',
    services: [
      {
        id: 'jornada-basica-hogar',
        name: 'Jornada Básica',
        description: 'Mantenimiento general de espacios interiores.',
        price: '$25 – $35',
        unit: 'por jornada',
        duration: '4 horas',
        bestFor: 'Mantenimiento semanal',
      },
      {
        id: 'jornada-completa-hogar',
        name: 'Jornada Completa',
        description: 'Limpieza exhaustiva y ordenamiento general.',
        price: '$45 – $60',
        unit: 'por jornada',
        duration: '8 horas',
        bestFor: 'Casa completa',
        badge: 'Más solicitado',
      },
      {
        id: 'limpieza-profunda-fin-obra',
        name: 'Limpieza Profunda / Fin de Obra',
        description:
          'Remoción de residuos de construcción, polvo residual y acondicionamiento integral.',
        price: 'Desde $0.90 / m²',
        unit: 'por m² o tarifa plana',
        priceDetail: 'hasta $1.50 / m² · referencia $80 – $150 por inmueble estándar',
        bestFor: 'Entrega de obra o mudanza',
      },
    ],
  },

  {
    id: 'institucional',
    label: 'Empresas e instituciones',
    shortLabel: 'Empresas',
    title: 'Limpieza institucional',
    description:
      'Oficinas, agencias y áreas de atención al público, con limpieza continua.',
    whatsappTopic: 'Limpieza institucional',
    services: [
      {
        id: 'institucional-metraje',
        name: 'Limpieza Institucional por Metraje',
        description:
          'Limpieza y desinfección continua de áreas operativas y de atención.',
        price: 'Desde $0.80 / m²',
        unit: 'por m²',
        priceDetail: 'hasta $1.25 / m²',
        bestFor: 'Oficinas y agencias',
        badge: 'Plan continuo',
      },
      {
        id: 'cajeros-fichas-sos',
        name: 'Mantenimiento de Cajeros / Fichas SOS',
        description:
          'Atención periódica, desinfección profunda y mantenimiento de higiene por unidad.',
        price: '$45 – $75 / mes',
        unit: 'mensual por unidad',
        bestFor: 'Redes de puntos de atención',
      },
    ],
  },

  {
    id: 'tapiceria',
    label: 'Muebles y tapicería',
    shortLabel: 'Muebles',
    title: 'Limpieza y sanitización de tapicería',
    description:
      'Lavado y desinfección de tapicería en tu propio espacio, sin trasladar los muebles.',
    whatsappTopic: 'Limpieza de muebles y tapicería',
    services: [
      {
        id: 'sillon-individual',
        name: 'Sillón / Mueble Individual',
        description: 'Lavado y desinfección de tapicería.',
        price: '$12 – $15',
        unit: 'por mueble',
        detail: '1 puesto',
      },
      {
        id: 'juego-sala',
        name: 'Juego de Sala Estándar',
        description:
          'Limpieza profunda de muebles, configuración aproximada 3-2-1 puestos.',
        price: '$40 – $60',
        unit: 'juego completo',
        badge: 'Más solicitado',
      },
      {
        id: 'sala-seccional',
        name: 'Sala Seccional / en "L"',
        description: 'Higienización integral de sofá modular.',
        price: '$50 – $70',
        unit: 'por sala',
        detail: 'Modular',
      },
      {
        id: 'sillas-sencillas',
        name: 'Sillas de Comedor — Sencillas',
        description: 'Limpieza de tapiz únicamente en el área del asiento.',
        price: '$2.50 – $3.50',
        unit: 'por silla',
      },
      {
        id: 'sillas-completas',
        name: 'Sillas de Comedor — Completas',
        description: 'Limpieza de tapiz de asiento y respaldo.',
        price: '$4 – $6',
        unit: 'por silla',
      },
    ],
  },
]

/**
 * Nota que acompaña a los precios. Aparece bajo el título de la sección,
 * antes de cualquier cifra: todos los valores publicados son referenciales.
 */
export const pricingDisclaimer =
  'Todos los valores son referenciales. El precio final lo confirmamos por WhatsApp según el espacio, las condiciones y la frecuencia del servicio.'

/** Línea de detalle de un servicio: "por jornada · 8 horas · Casa completa" */
export function serviceMetaLine(service) {
  return [service.unit, service.duration, service.detail, service.bestFor]
    .filter(Boolean)
    .join(' · ')
}

export function getCategoryById(id) {
  return serviceCategories.find((category) => category.id === id)
}
