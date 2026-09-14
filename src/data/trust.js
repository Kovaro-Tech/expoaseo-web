/**
 * Contenido de las secciones "Trayectoria" y "Experiencia que nos respalda":
 * fotografías de trabajo real y organizaciones con las que se ha trabajado.
 *
 * Nada de esto se inventa: solo material entregado por la clienta.
 */

/**
 * Fotografías de trabajo real (public/images/real-work/).
 *
 *   src             ruta dentro de /public
 *   alt             descripción para lectores de pantalla
 *   label           contexto del trabajo, nunca dirección, coordenadas ni fecha
 *   objectPosition  encuadre dentro del marco
 *   width/height    dimensiones reales, para reservar el espacio
 *
 * ► Los archivos de andamio y estación de servicio están recortados para
 *   eliminar la fecha y las coordenadas GPS que traían incrustadas. Los
 *   originales quedan en assets-source/images/.
 */
export const workPhotos = [
  {
    id: 'sala-sesiones',
    src: '/images/real-work/fiscalia-loja-01.jpg',
    alt: 'Operaria de EXPOASEO limpiando una sala de sesiones institucional',
    label: 'Sala de sesiones',
    objectPosition: 'center center',
    width: 1280,
    height: 960,
  },
  {
    id: 'fiscalia',
    src: '/images/real-work/fiscalia-loja-02.jpg',
    alt: 'Operaria trapeando el salón principal de la Fiscalía de Loja',
    label: 'Fiscalía de Loja',
    objectPosition: 'center center',
    width: 1280,
    height: 720,
  },
  {
    id: 'altura',
    src: '/images/real-work/limpieza-altura-01.jpg',
    alt: 'Operario limpiando en altura sobre un andamio, con arnés de seguridad',
    label: 'Trabajo en altura',
    objectPosition: 'center 40%',
    width: 1600,
    height: 1010,
  },
  {
    id: 'mobiliario',
    src: '/images/real-work/limpieza-mobiliario-01.jpg',
    alt: 'Desinfección de mobiliario en una sala de espera institucional',
    label: 'Mobiliario institucional',
    objectPosition: 'center 55%',
    width: 1200,
    height: 1600,
  },
  {
    id: 'oficinas',
    src: '/images/real-work/limpieza-interior-01.jpg',
    alt: 'Operaria limpiando los marcos superiores de un pasillo de oficinas',
    label: 'Oficinas',
    objectPosition: 'center 45%',
    width: 900,
    height: 1600,
  },
  {
    id: 'estacion',
    src: '/images/real-work/petroecuador-exterior-01.jpg',
    alt: 'Operario limpiando la cubierta exterior de una estación de servicio',
    label: 'Estación de servicio',
    objectPosition: 'center center',
    width: 1280,
    height: 585,
  },
]

/**
 * Organizaciones con las que EXPOASEO ha trabajado.
 *
 * Wording obligatorio: "hemos trabajado" / "experiencia con".
 * NUNCA "clientes actuales", "aliados" ni "partners", y sin fechas ni
 * contratos: no afirmamos relaciones vigentes.
 *
 * Campos:
 *   id         clave estable (no cambiar una vez publicada)
 *   name       nombre oficial completo; se muestra como `title` al pasar el ratón
 *   shortName  el que se ve en pantalla, corto y reconocible
 *   sector     grupo grueso: publico · salud · energia · privado.
 *              Decide en qué fila y bajo qué filtro aparece
 *   category   matiz fino; documenta por qué lleva ese icono
 *   icon       clave de icono Lucide. El componente solo resuelve la clave:
 *              qué icono lleva cada organización se decide AQUÍ
 *   logo       ruta al logo oficial; si existe, sustituye al icono
 *   featured   un punto más de peso visual y aparición prioritaria en su fila
 *
 * Añadir una organización = un objeto más. Entra sola en su fila y su filtro.
 */
export const clients = [
  // ── Sector público · justicia · seguridad ────────────────────────────────
  {
    id: 'sri',
    name: 'Servicio de Rentas Internas',
    shortName: 'SRI',
    sector: 'publico',
    category: 'gobierno',
    icon: 'Landmark',
    logo: '',
    featured: true,
  },
  {
    id: 'contraloria',
    name: 'Contraloría General del Estado',
    shortName: 'Contraloría',
    sector: 'publico',
    category: 'control',
    icon: 'Scale',
    logo: '',
  },
  {
    id: 'fiscalia',
    name: 'Fiscalía Provincial de Loja',
    shortName: 'Fiscalía de Loja',
    sector: 'publico',
    category: 'justicia',
    icon: 'Scale',
    logo: '',
    featured: true,
  },
  {
    id: 'judicatura',
    name: 'Consejo de la Judicatura Provincial de Loja',
    shortName: 'Consejo de la Judicatura',
    sector: 'publico',
    category: 'justicia',
    icon: 'Scale',
    logo: '',
  },
  {
    id: 'ecu911',
    name: 'ECU 911 Zona 7',
    shortName: 'ECU 911 Zona 7',
    sector: 'publico',
    category: 'seguridad',
    icon: 'Siren',
    logo: '',
    featured: true,
  },
  {
    id: 'registro-civil',
    name: 'Registro Civil de Loja',
    shortName: 'Registro Civil',
    sector: 'publico',
    category: 'gobierno',
    icon: 'Landmark',
    logo: '',
  },
  {
    id: 'cuerpo-militar',
    name: 'Cuerpo Militar',
    shortName: 'Cuerpo Militar',
    sector: 'publico',
    category: 'seguridad',
    icon: 'ShieldCheck',
    logo: '',
  },
  {
    id: 'ministerio-educacion',
    name: 'Ministerio de Educación',
    shortName: 'Ministerio de Educación',
    sector: 'publico',
    category: 'educacion',
    icon: 'GraduationCap',
    logo: '',
  },
  {
    id: 'mies',
    name: 'Ministerio de Inclusión Económica y Social',
    shortName: 'MIES',
    sector: 'publico',
    category: 'social',
    icon: 'HeartHandshake',
    logo: '',
  },
  {
    id: 'ministerio-trabajo',
    name: 'Ministerio del Trabajo',
    shortName: 'Ministerio del Trabajo',
    sector: 'publico',
    category: 'trabajo',
    icon: 'BriefcaseBusiness',
    logo: '',
  },
  {
    id: 'dac-catamayo',
    name: 'Dirección General de Aviación Civil — Aeropuerto de Catamayo',
    shortName: 'Aeropuerto de Catamayo',
    sector: 'publico',
    category: 'aviacion',
    icon: 'Plane',
    logo: '',
  },
  {
    id: 'municipio-loja',
    name: 'Municipio de Loja',
    shortName: 'Municipio de Loja',
    sector: 'publico',
    category: 'gobierno',
    icon: 'Landmark',
    logo: '',
    featured: true,
  },
  {
    id: 'centro-movilizacion',
    name: 'Centro de Movilización de Loja',
    shortName: 'Centro de Movilización',
    sector: 'publico',
    category: 'seguridad',
    icon: 'ShieldCheck',
    logo: '',
  },

  // ── Salud ────────────────────────────────────────────────────────────────
  {
    id: 'isidro-ayora',
    name: 'Hospital Isidro Ayora',
    shortName: 'Hospital Isidro Ayora',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'iess-loja',
    name: 'Hospital del Día IESS Loja',
    shortName: 'IESS Loja',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
    featured: true,
  },
  {
    id: 'solca-loja',
    name: 'SOLCA Núcleo de Loja',
    shortName: 'SOLCA Loja',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
    featured: true,
  },
  {
    id: 'clinica-santa-maria',
    name: 'Clínica Santa María',
    shortName: 'Clínica Santa María',
    sector: 'salud',
    category: 'clinica',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'clinica-moderna',
    name: 'Clínica Moderna',
    shortName: 'Clínica Moderna',
    sector: 'salud',
    category: 'clinica',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'hospital-catacocha',
    name: 'Hospital Básico de Catacocha',
    shortName: 'Hospital de Catacocha',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'hospital-saraguro',
    name: 'Hospital Básico de Saraguro',
    shortName: 'Hospital de Saraguro',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'hospital-macara',
    name: 'Hospital Básico de Macará',
    shortName: 'Hospital de Macará',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'hospital-yantzaza',
    name: 'Hospital Básico de Yantzaza',
    shortName: 'Hospital de Yantzaza',
    sector: 'salud',
    category: 'hospital',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'sozoranga',
    name: 'Centro de Salud Tipo B Sozoranga',
    shortName: 'Centro de Salud Sozoranga',
    sector: 'salud',
    category: 'centro-salud',
    icon: 'Hospital',
    logo: '',
  },
  {
    id: 'red-catamayo',
    name: 'Red de Salud Catamayo · Chaguarpamba · Olmedo',
    shortName: 'Red de Salud Catamayo',
    sector: 'salud',
    category: 'centro-salud',
    icon: 'Hospital',
    logo: '',
  },

  // ── Energía e infraestructura ────────────────────────────────────────────
  {
    id: 'petroecuador',
    name: 'EP Petroecuador',
    shortName: 'Petroecuador',
    sector: 'energia',
    category: 'combustible',
    icon: 'Fuel',
    logo: '',
    featured: true,
  },
  {
    id: 'celec',
    name: 'CELEC EP',
    shortName: 'CELEC EP',
    sector: 'energia',
    category: 'electrico',
    icon: 'Zap',
    logo: '',
    featured: true,
  },

  // ── Privado · financiero · comercial ─────────────────────────────────────
  {
    id: 'cacpe-loja',
    name: 'Cooperativa CACPE Loja',
    shortName: 'CACPE Loja',
    sector: 'privado',
    category: 'financiero',
    icon: 'Landmark',
    logo: '',
  },
  {
    id: 'plaza-del-valle',
    name: 'Plaza del Valle Shopping',
    shortName: 'Plaza del Valle',
    sector: 'privado',
    category: 'comercio',
    icon: 'ShoppingBag',
    logo: '',
  },
  {
    id: 'equilibrium',
    name: 'Equilibrium Club',
    shortName: 'Equilibrium Club',
    sector: 'privado',
    category: 'deporte',
    icon: 'Dumbbell',
    logo: '',
  },
]

/**
 * Sectores del filtro, en orden de aparición.
 * `id: null` es "Todos". Añadir un sector aquí lo hace filtrable.
 */
export const clientSectors = [
  { id: null, label: 'Todos' },
  { id: 'publico', label: 'Sector público' },
  { id: 'salud', label: 'Salud' },
  { id: 'energia', label: 'Energía' },
  { id: 'privado', label: 'Privado' },
]

/** Métricas de la banda: se calculan del dato, nunca se desincronizan. */
export const clientStats = {
  organizations: clients.length,
  sectors: clientSectors.filter((sector) => sector.id).length,
}

/**
 * Certificaciones reales. Vacío a propósito.
 * { id, name, issuer?, year? }
 */
export const certifications = []
