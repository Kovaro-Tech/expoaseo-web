import { businessConfig } from '../config/business'
import { workPhotos } from '../data/trust'
import './Experience.css'

const photo = (id) => workPhotos.find((item) => item.id === id)

/* Una principal grande, dos de apoyo y una cuarta solo en desktop:
   en móvil un mosaico de cuatro se vuelve ilegible. */
const layout = [
  { slot: 'a', item: photo('fiscalia') },
  { slot: 'b', item: photo('mobiliario') },
  { slot: 'c', item: photo('altura') },
  { slot: 'd', item: photo('petroecuador') },
]

function Photo({ item, className = '' }) {
  if (!item) return null

  return (
    <figure
      className={`exp__photo ${className}`}
      style={{
        '--ratio': item.ratio,
        '--ratio-mobile': item.ratioMobile ?? item.ratio,
        '--focus': item.focus ?? 'center',
      }}
    >
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}

export default function Experience() {
  const years = businessConfig.yearsExperience

  return (
    <section className="section exp" id="trayectoria">
      <div className="container">
        <div className="exp__top">
          <p className="exp__count">
            <span className="exp__number">{years}</span>
            <span className="exp__unit">años</span>
          </p>

          <div className="exp__copy">
            <h2 className="exp__title">
              {years} años trabajando donde la limpieza no puede fallar.
            </h2>
            <p className="exp__text">
              Experiencia en instituciones públicas, salud, educación, energía,
              comercio y servicios.
            </p>
          </div>
        </div>

        <div className="exp__gallery">
          {layout.map(({ slot, item }) => (
            <Photo key={slot} item={item} className={`exp__photo--${slot}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
