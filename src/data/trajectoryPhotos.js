// Selección exclusiva de Trayectoria. WebP originales, sin reprocesar; las
// variantes reducidas (scripts/create-responsive-images.mjs) solo se ofrecen
// en srcset y el original sigue siendo el candidato de mayor resolución.
export const trajectoryWidths = [640, 960]
export const trajectoryVariant = (id, width) => `/images/real-work/new/${id}-${width}.webp`
// Ancho mostrado según Experience.css: rail móvil, tablet y tres columnas en el contenedor de 1160px.
export const trajectorySizes = '(min-width: 1024px) calc((min(100vw, 1160px) - 104px) / 3), (min-width: 768px) min(45vw, 480px), min(86vw, 440px)'

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
].map((photo) => ({
  ...photo,
  src: `/images/real-work/new/${photo.id}.webp`,
  srcSet: [...trajectoryWidths.map((width) => `${trajectoryVariant(photo.id, width)} ${width}w`), `/images/real-work/new/${photo.id}.webp ${photo.width}w`].join(', '),
}))
