/**
 * Contenido de la sección "Trayectoria": fotografías de trabajo real,
 * instituciones con las que se ha trabajado y certificaciones.
 *
 * Nada de esto se inventa: solo material entregado por la clienta.
 */

/**
 * Fotografías de trabajo real (public/images/real-work/).
 *
 * ratio  proporción del marco. Define el recorte, así que no es decorativo:
 *        dos de estas fotos traen fecha y coordenadas GPS incrustadas abajo a
 *        la derecha, y el marco ancho + focus 'top' las deja fuera de cuadro.
 * focus  object-position ('top' | 'center' | 'bottom').
 * ratioMobile  opcional; recorte distinto en móvil.
 *
 * Cambiar una foto = cambiar `src` y su `alt`. No hay que tocar componentes.
 */
export const workPhotos = [
  {
    id: 'fiscalia',
    src: '/images/real-work/fiscalia-loja-01.jpg',
    alt: 'Operaria de EXPOASEO limpiando la sala de sesiones de la Fiscalía de Loja',
    width: 1280,
    height: 960,
    ratio: '4 / 3',
    focus: 'center',
  },
  {
    id: 'altura',
    src: '/images/real-work/limpieza-altura-01.jpg',
    alt: 'Trabajo de limpieza en altura sobre andamio, con arnés de seguridad',
    width: 1600,
    height: 1200,
    ratio: '16 / 9',
    focus: 'top',
  },
  {
    id: 'mobiliario',
    src: '/images/real-work/limpieza-mobiliario-01.jpg',
    alt: 'Desinfección de mobiliario en una sala de espera institucional',
    width: 1200,
    height: 1600,
    ratio: '3 / 4',
    ratioMobile: '4 / 3',
    focus: 'center',
  },
  {
    id: 'petroecuador',
    src: '/images/real-work/petroecuador-exterior-01.jpg',
    alt: 'Limpieza exterior de la cubierta de una estación de servicio',
    width: 1280,
    height: 720,
    ratio: '21 / 9',
    focus: 'top',
  },
]

/**
 * Instituciones y organizaciones con las que EXPOASEO ha trabajado.
 * Wording obligatorio: "hemos trabajado" — nunca "clientes actuales".
 * No añadir fechas, contratos ni relaciones vigentes.
 *
 * {
 *   id: 'clave-corta',
 *   name: 'Nombre oficial',
 *   logo: '/images/clientes/archivo.png',  // opcional
 * }
 *
 * Cuando haya logos, basta con añadir `logo`: sustituye al nombre sin tocar
 * el componente. PNG o SVG con fondo transparente, alto útil ≈ 120 px.
 */
export const clients = [
  { id: 'sri', name: 'SRI' },
  { id: 'contraloria', name: 'Contraloría General del Estado', short: 'Contraloría' },
  { id: 'fiscalia', name: 'Fiscalía' },
  { id: 'ecu911', name: 'ECU 911' },
  { id: 'registro-civil', name: 'Registro Civil' },
  { id: 'iess-loja', name: 'IESS Loja', short: 'IESS' },
  { id: 'solca-loja', name: 'SOLCA Loja', short: 'SOLCA' },
  { id: 'petroecuador', name: 'Petroecuador' },
  { id: 'celec', name: 'CELEC EP' },
  { id: 'municipio-loja', name: 'Municipio de Loja' },
]

/**
 * Los cinco nombres de la línea de autoridad bajo el CTA del hero.
 * Cambiar el orden aquí cambia la línea; no hay texto suelto en el componente.
 */
export const heroClientIds = ['sri', 'fiscalia', 'iess-loja', 'petroecuador', 'celec']

export const heroClients = heroClientIds
  .map((id) => clients.find((client) => client.id === id))
  .filter(Boolean)

/**
 * Certificaciones reales. Vacío a propósito.
 * { id, name, issuer?, year? }
 */
export const certifications = []
