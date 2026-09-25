import { businessConfig } from '../config/business'
import ExperienceGallery from '../components/ExperienceGallery'
import './Experience.css'

export default function Experience() {
  const count = (
    <p className="exp__count">
      <span className="exp__number">{businessConfig.yearsExperience}</span>
      <span className="exp__unit">años de experiencia</span>
    </p>
  )
  const copy = (
    <div className="exp__copy">
      <h2 className="exp__title">Una trayectoria construida trabajando.</h2>
      <p className="exp__text">
        Experiencia real en hogares, instituciones, salud, comercio y
        servicios con {businessConfig.serviceArea.toLowerCase()}.
      </p>
    </div>
  )

  return (
    <section className="section exp" id="trayectoria">
      <div className="container">
        <ExperienceGallery count={count} copy={copy} />
      </div>
    </section>
  )
}
