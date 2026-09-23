/**
 * Textos de secciones. Separado de services.js para que se pueda ajustar copy
 * sin tocar precios.
 *
 * ► No usamos cifras que no podamos comprobar (años, número de clientes).
 */

/**
 * Banda de confianza al cierre de Servicios. Cuatro atributos, una línea cada
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
    id: 'seguridad',
    icon: 'ShieldCheck',
    title: 'Seguridad industrial',
    text: 'Cumplimiento de normativa de seguridad industrial.',
  },
  {
    id: 'cobertura',
    icon: 'MapPinned',
    title: 'Cobertura nacional',
    text: 'Despliegue operativo a nivel nacional.',
  },
  {
    id: 'insumos',
    icon: 'Sparkles',
    title: 'Insumos de alta calidad',
    text: 'Productos adecuados para cada entorno.',
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
    id: 'faq-sectores',
    question: '¿A qué tipo de clientes o sectores atienden?',
    answer:
      'Damos servicio tanto al sector público como privado, abarcando instalaciones corporativas, institucionales e industriales a nivel nacional. Adaptamos nuestros protocolos a los requerimientos técnicos, de seguridad ocupacional y de fiscalización específicos de cada contratación.',
  },
  {
    id: 'faq-cobertura',
    question: '¿Cuál es el alcance geográfico de sus servicios?',
    answer:
      'Ofrecemos cobertura y despliegue operativo a nivel nacional. Nuestra estructura logística y de personal nos permite ejecutar proyectos y mantener continuidad de servicio en diversas provincias del Ecuador, cumpliendo estrictamente con los estándares requeridos por cada cliente.',
  },
  {
    id: 'faq-anticipacion',
    question: '¿Con cuánta anticipación debo coordinar?',
    // ► Confirmar con la clienta el tiempo real de respuesta.
    answer:
      'Depende de la agenda de la semana. Escríbenos y te decimos la fecha más cercana disponible.',
  },
]
