import SectionHeader from '../components/SectionHeader'
import { benefits } from '../data/content'
import { getIcon } from '../lib/icons'
import './WhyUs.css'

export default function WhyUs() {
  return (
    <section className="section why" id="por-que">
      <div className="container why__inner">
        <SectionHeader
          eyebrow="Por qué EXPOASEO"
          title="Una empresa, no un servicio improvisado"
          text="Detrás de cada limpieza hay una compañía constituida, con equipo propio y procesos definidos."
        />

        <ul className="why__grid">
          {benefits.map((benefit) => {
            const Icon = getIcon(benefit.icon)
            return (
              <li className="why__item" key={benefit.id}>
                <span className="why__icon">
                  <Icon size={21} strokeWidth={1.9} />
                </span>
                <h3 className="why__title">{benefit.title}</h3>
                <p className="why__text">{benefit.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
