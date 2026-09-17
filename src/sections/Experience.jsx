import { businessConfig } from '../config/business'
import { workPhotos } from '../data/trust'
import './Experience.css'

const trajectoryIds = ['sala-sesiones', 'altura', 'estacion']
const trajectoryPhotos = trajectoryIds.map((id) =>
  workPhotos.find((item) => item.id === id),
)

export default function Experience() {
  return (
    <section className="section exp" id="trayectoria">
      <div className="container exp__inner">
        <div className="exp__gallery" aria-label="Fotografías de trabajo real">
          {trajectoryPhotos.map((item, index) =>
            item ? (
              <figure
                className={`exp__photo exp__photo--${['primary', 'secondary', 'tertiary'][index]}`}
                key={item.id}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: item.objectPosition }}
                />
              </figure>
            ) : null,
          )}
        </div>

        <div className="exp__top">
          <p className="exp__count">
            <span className="exp__number">{businessConfig.yearsExperience}</span>
            <span className="exp__unit">años de experiencia</span>
          </p>

          <div className="exp__copy">
            <h2 className="exp__title">Una trayectoria construida trabajando.</h2>
            <p className="exp__text">
              Experiencia real en hogares, instituciones, salud, comercio y
              servicios en {businessConfig.serviceArea}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
