// Selección exclusiva de Trayectoria. WebP originales, sin reprocesar.
export const trajectoryPhotos = [
  {
    id: 'equipo-institucional-01',
    alt: 'Equipo operativo de EXPOASEO junto a personal institucional y banderas',
    width: 1599, height: 1066,
  },
  {
    id: 'limpieza-sanitaria-02',
    alt: 'Personal de EXPOASEO limpiando el espejo de un área sanitaria',
    width: 1600, height: 1066,
  },
  {
    id: 'mantenimiento-areas-verdes-01',
    alt: 'Operaria de EXPOASEO cuidando plantas de interior con un pulverizador',
    width: 1599, height: 1066,
  },
  {
    id: 'equipo-operativo-01',
    alt: 'Dos integrantes de EXPOASEO con uniformes y utensilios de limpieza',
    width: 1600, height: 1066,
  },
  {
    id: 'limpieza-escaleras-01',
    alt: 'Operaria de EXPOASEO limpiando el pasamanos de una escalera, vista de espaldas',
    width: 1600, height: 1066,
  },
  {
    id: 'limpieza-ventanas-01',
    alt: 'Detalle de una mano con guante limpiando un ventanal con una herramienta de microfibra',
    width: 1600, height: 1066,
  },
  {
    id: 'equipo-institucional-02',
    alt: 'Equipo de EXPOASEO posando junto a personal institucional',
    width: 1599, height: 1066,
  },
  {
    id: 'limpieza-escaleras-02',
    alt: 'Operaria de EXPOASEO limpiando una baranda de acero con un paño',
    width: 1600, height: 1066,
  },
  {
    id: 'mantenimiento-areas-verdes-03',
    alt: 'Personal de EXPOASEO aspirando la alfombra de una sala institucional',
    width: 1600, height: 1066, objectPosition: '60% center',
  },
  {
    id: 'limpieza-ventanas-02',
    alt: 'Operaria de EXPOASEO limpiando un ventanal junto a una cortina azul',
    width: 1600, height: 1225, objectPosition: 'center 40%',
  },
].map((photo) => ({ ...photo, src: `/images/real-work/new/${photo.id}.webp` }))
