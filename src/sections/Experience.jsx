import { businessConfig } from '../config/business'
import { workPhotos } from '../data/trust'
import './Experience.css'

/* Tres fotografías fijas: una principal y dos de apoyo. Sin carrusel, sin
   controles y sin avance automático — la prueba no necesita animarse. */
const photo = (id) => workPhotos.find((item) => item.id === id)
const shown = [
  { slot: 'a', item: photo('sala-sesiones') },
  { slot: 'b', item: photo('altura') },
  { slot: 'c', item: photo('estacion') },
]

function Photo({ slot, item }) {
  if (!item) return null

  return (
    <figure className={`exp__photo exp__photo--${slot}`}>
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        style={{ objectPosition: item.objectPosition }}
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
      <div className="container exp__inner">
        <div className="exp__top">
          <p className="exp__count">
            <span className="exp__number">{years}</span>
            <span className="exp__unit">años</span>
          </p>

          <div className="exp__copy">
            <h2 className="exp__title">Una trayectoria construida trabajando.</h2>
            <p className="exp__text">
              Experiencia real en instituciones públicas, salud, educación,
              energía, comercio y hogares de {businessConfig.serviceArea}.
            </p>
          </div>
        </div>

        <div className="exp__gallery">
          {shown.map(({ slot, item }) => (
            <Photo key={slot} slot={slot} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
