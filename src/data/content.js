/**
 * Textos de secciones. Separado de services.js para que se pueda ajustar copy
 * sin tocar precios.
 *
 * ► No usamos cifras que no podamos comprobar (años, número de clientes).
 */

/** Índice editorial del bloque manifiesto. Cada fila abre su categoría. */
export const serviceIndex = [
  {
    id: 'hogar',
    number: '01',
    title: 'Tu hogar',
    text: 'Mantenimiento, limpieza profunda y entrega de obra.',
  },
  {
    id: 'institucional',
    number: '02',
    title: 'Tu negocio',
    text: 'Oficinas, agencias y puntos de atención al público.',
  },
  {
    id: 'tapiceria',
    number: '03',
    title: 'Tus muebles',
    text: 'Lavado y sanitización de tapicería a domicilio.',
  },
]

/** Atributos de la sección "Por qué EXPOASEO". Máximo cuatro. */
export const pillars = [
  {
    id: 'equipo',
    title: 'Equipo capacitado',
    text: 'Personal propio, supervisado y con protocolos definidos para cada tipo de espacio.',
  },
  {
    id: 'insumos',
    title: 'Insumos adecuados',
    text: 'Llegamos con productos y equipos elegidos según la superficie y el tipo de tela.',
  },
  {
    id: 'horarios',
    title: 'Horarios coordinados',
    text: 'Jornadas de 4 u 8 horas acordadas contigo antes de que el equipo salga.',
  },
  {
    id: 'alcance',
    title: 'Hogares y empresas',
    text: 'Desde un juego de sala hasta el mantenimiento mensual de varios puntos de atención.',
  },
]

export const faqs = [
  {
    id: 'faq-solicitar',
    question: '¿Cómo solicito una limpieza?',
    answer:
      'Eliges el servicio y nos escribes por WhatsApp. Ahí confirmamos el valor, la fecha y el horario.',
  },
  {
    id: 'faq-precios',
    question: '¿Los precios publicados son fijos?',
    answer:
      'Son rangos referenciales. El valor final depende del tamaño del espacio, su estado y la frecuencia, y te lo confirmamos antes de agendar.',
  },
  {
    id: 'faq-insumos',
    question: '¿Debo proporcionar los productos?',
    answer: 'No. Los insumos y equipos van incluidos en el precio del servicio.',
  },
  {
    id: 'faq-muebles',
    question: '¿La limpieza de muebles es a domicilio?',
    answer:
      'Sí. Lavamos y desinfectamos sillones, salas y sillas de comedor en tu espacio, sin trasladar los muebles.',
  },
  {
    id: 'faq-empresas',
    question: '¿Atienden empresas e instituciones?',
    answer:
      'Sí. Trabajamos limpieza institucional por metraje y mantenimiento mensual de cajeros o fichas SOS.',
  },
  {
    id: 'faq-anticipacion',
    question: '¿Con cuánta anticipación debo coordinar?',
    // ► Confirmar con la clienta el tiempo real de respuesta.
    answer:
      'Mientras antes escribas, más horarios disponibles tendrás. Consúltanos y te indicamos la fecha más cercana.',
  },
]
