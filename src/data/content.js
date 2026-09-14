/**
 * Textos de secciones. Separado de services.js para que se pueda ajustar copy
 * sin tocar precios.
 *
 * ► No usamos cifras que no podamos comprobar (años, número de clientes).
 */

/**
 * Banda de confianza al cierre de Servicios. Tres atributos, una línea cada
 * uno: es un apoyo al catálogo, no una sección.
 * `icon` es una clave; el mapa vive en src/sections/Services.jsx.
 */
export const pillars = [
  {
    id: 'equipo',
    icon: 'Users',
    title: 'Personal capacitado',
    text: 'Equipo propio y supervisado.',
  },
  {
    id: 'insumos',
    icon: 'SprayCan',
    title: 'Insumos adecuados',
    text: 'Productos según cada superficie.',
  },
  {
    id: 'horarios',
    icon: 'Clock',
    title: 'Horarios coordinados',
    text: 'Jornadas acordadas antes de empezar.',
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
    id: 'faq-zona',
    question: '¿A qué zonas llegan?',
    answer:
      'Trabajamos en Loja y la provincia. Si tu dirección queda fuera, escríbenos igual y te decimos si podemos llegar.',
  },
  {
    id: 'faq-anticipacion',
    question: '¿Con cuánta anticipación debo coordinar?',
    // ► Confirmar con la clienta el tiempo real de respuesta.
    answer:
      'Depende de la agenda de la semana. Escríbenos y te decimos la fecha más cercana disponible.',
  },
]
