/**
 * Catálogo de servicios — ÚNICA fuente de verdad.
 *
 * Datos proporcionados directamente por la clienta.
 * Los precios son referenciales y así se comunican en la web.
 *
 * Estructura pensada para migrar a una API más adelante: todos los campos son
 * serializables.
 *
 * `badge` marca el servicio destacado de cada categoría: es el que se presenta
 * como bloque principal en la sección de servicios.
 */

export const serviceCategories = [
  {
    id: 'hogar',
    label: 'Hogares',
    shortLabel: 'Hogar',
    title: 'Limpieza para hogares',
    description:
      'Casas y departamentos: mantenimiento periódico, limpiezas profundas y entrega de obra.',
    /** Se usa para armar el mensaje de WhatsApp. */
    whatsappTopic: 'limpieza para hogares',
    services: [
      {
        id: 'jornada-basica-hogar',
        name: 'Jornada Básica',
        description: 'Mantenimiento general de espacios interiores.',
        price: '$25 – $35',
        priceNote: 'por jornada',
        meta: [
          { label: 'Duración', value: '4 horas' },
          { label: 'Ideal para', value: 'Mantenimiento semanal' },
        ],
      },
      {
        id: 'jornada-completa-hogar',
        name: 'Jornada Completa',
        description: 'Limpieza exhaustiva y ordenamiento general.',
        price: '$45 – $60',
        priceNote: 'por jornada',
        badge: 'Más solicitado',
        meta: [
          { label: 'Duración', value: '8 horas' },
          { label: 'Ideal para', value: 'Casa completa' },
        ],
      },
      {
        id: 'limpieza-profunda-fin-obra',
        name: 'Limpieza Profunda / Fin de Obra',
        description:
          'Remoción de residuos de construcción, polvo residual y acondicionamiento integral.',
        price: 'Desde $0.90 / m²',
        priceNote: 'hasta $1.50 / m² · referencia $80 – $150 por inmueble estándar',
        meta: [
          { label: 'Modalidad', value: 'Por m² o tarifa plana' },
          { label: 'Ideal para', value: 'Entrega de obra o mudanza' },
        ],
      },
    ],
  },

  {
    id: 'institucional',
    label: 'Empresas e instituciones',
    shortLabel: 'Empresas',
    title: 'Limpieza institucional',
    description:
      'Oficinas, agencias y áreas de atención al público con estándares constantes de higiene.',
    whatsappTopic: 'limpieza institucional para empresas',
    services: [
      {
        id: 'institucional-metraje',
        name: 'Limpieza Institucional por Metraje',
        description:
          'Limpieza y desinfección continua de áreas operativas y de atención.',
        price: 'Desde $0.80 / m²',
        priceNote: 'hasta $1.25 / m²',
        badge: 'Plan continuo',
        meta: [
          { label: 'Unidad', value: 'Por m²' },
          { label: 'Ideal para', value: 'Oficinas y agencias' },
        ],
      },
      {
        id: 'cajeros-fichas-sos',
        name: 'Mantenimiento de Cajeros / Fichas SOS',
        description:
          'Atención periódica, desinfección profunda y mantenimiento de higiene por unidad.',
        price: '$45 – $75 / mes',
        priceNote: 'por unidad',
        meta: [
          { label: 'Modalidad', value: 'Mensual por unidad' },
          { label: 'Ideal para', value: 'Redes de puntos de atención' },
        ],
      },
    ],
  },

  {
    id: 'tapiceria',
    label: 'Muebles y tapicería',
    shortLabel: 'Muebles',
    title: 'Limpieza y sanitización de tapicería',
    description:
      'Lavado y desinfección de muebles a domicilio, con secado y sin dañar la tela.',
    whatsappTopic: 'limpieza y sanitización de muebles y tapicería',
    services: [
      {
        id: 'sillon-individual',
        name: 'Sillón / Mueble Individual',
        description: 'Lavado y desinfección de tapicería.',
        price: '$12 – $15',
        priceNote: 'por mueble',
        meta: [{ label: 'Capacidad', value: '1 puesto' }],
      },
      {
        id: 'juego-sala',
        name: 'Juego de Sala Estándar',
        description:
          'Limpieza profunda de muebles, configuración aproximada 3-2-1 puestos.',
        price: '$40 – $60',
        priceNote: 'juego completo',
        badge: 'Más solicitado',
        meta: [{ label: 'Unidad', value: 'Juego completo' }],
      },
      {
        id: 'sala-seccional',
        name: 'Sala Seccional / en "L"',
        description: 'Higienización integral de sofá modular.',
        price: '$50 – $70',
        priceNote: 'por sala',
        meta: [{ label: 'Tipo', value: 'Modular' }],
      },
      {
        id: 'sillas-sencillas',
        name: 'Sillas de Comedor — Sencillas',
        description: 'Limpieza de tapiz únicamente en el área del asiento.',
        price: '$2.50 – $3.50',
        priceNote: 'por silla',
        meta: [{ label: 'Unidad', value: 'Por silla' }],
      },
      {
        id: 'sillas-completas',
        name: 'Sillas de Comedor — Completas',
        description: 'Limpieza de tapiz de asiento y respaldo.',
        price: '$4 – $6',
        priceNote: 'por silla',
        meta: [{ label: 'Unidad', value: 'Por silla' }],
      },
    ],
  },
]

/** Nota legal/comercial que acompaña a los precios. */
export const pricingDisclaimer =
  'Precios referenciales. El valor final se confirma por WhatsApp según el tamaño, el estado del espacio y la frecuencia del servicio.'

export function getCategoryById(id) {
  return serviceCategories.find((category) => category.id === id)
}
