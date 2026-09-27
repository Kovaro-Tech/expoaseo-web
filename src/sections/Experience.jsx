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
        Somos una empresa orgullosamente lojana, con más de 15 años de experiencia
        brindando soluciones integrales de limpieza, desinfección y mantenimiento
        institucional a nivel nacional. Garantizamos espacios impecables, seguros
        y eficientes, adaptándonos a las altas exigencias y normativas de cada sector.
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
