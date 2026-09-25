// Selección exclusiva de Trayectoria. Los originales se conservan sin cambios.
export const trajectoryPhotos = [
  {
    id: 'fiscalia-loja-02',
    alt: 'Operaria de EXPOASEO limpiando el salón de la Fiscalía de Loja',
    width: 1280, height: 720, objectPosition: '44% center',
  },
  {
    id: 'limpieza-altura-01',
    alt: 'Operario de EXPOASEO limpiando una cubierta desde un andamio',
    width: 1600, height: 1010, objectPosition: 'center 40%',
  },
  {
    id: 'jardineria-02',
    alt: 'Personal de EXPOASEO realizando mantenimiento de áreas verdes con un pulverizador',
    width: 720, height: 1280, objectPosition: 'center 57%',
  },
  {
    id: 'fumigacion-institucional-01',
    alt: 'Personal con equipo de protección realizando fumigación en una oficina institucional',
    width: 1200, height: 1600, objectPosition: 'center 48%',
  },
  {
    id: 'limpieza-institucional-01',
    alt: 'Operaria de EXPOASEO limpiando las sillas de una sala de atención del Registro Civil',
    width: 1600, height: 1204, objectPosition: '42% center',
  },
  {
    id: 'limpieza-pisos-01',
    alt: 'Operario de EXPOASEO lavando superficies interiores con una hidrolavadora',
    width: 1200, height: 1600, objectPosition: 'center 45%',
  },
  {
    id: 'petroecuador-exterior-01',
    alt: 'Operario limpiando la cubierta exterior de una estación de Petroecuador',
    width: 1280, height: 584, objectPosition: '56% center',
  },
  {
    id: 'limpieza-interior-01',
    alt: 'Operaria de EXPOASEO limpiando los marcos superiores de un pasillo de oficinas',
    width: 900, height: 1600, objectPosition: 'center 45%',
  },
  {
    id: 'limpieza-recepcion-01',
    alt: 'Operaria de EXPOASEO limpiando el escritorio de una recepción institucional',
    width: 960, height: 1280, objectPosition: 'center 42%',
  },
].map((photo) => ({ ...photo, src: `/images/real-work/${photo.id}.jpg` }))
