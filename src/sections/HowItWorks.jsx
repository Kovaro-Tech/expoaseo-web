import SectionHeader from '../components/SectionHeader'
import { steps } from '../data/content'
import { getIcon } from '../lib/icons'
import './HowItWorks.css'

export default function HowItWorks() {
  return (
    <section className="section section--alt how" id="como-funciona">
      <div className="container">
        <SectionHeader
          eyebrow="Cómo funciona"
          title="Tres pasos y listo"
          text="Sin registros, sin apps y sin esperar cotizaciones por correo."
          align="center"
        />

        <ol className="how__list">
          {steps.map((step) => {
            const Icon = getIcon(step.icon)
            return (
              <li className="how__step" key={step.id}>
                <span className="how__number">{step.number}</span>
                <span className="how__icon">
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <h3 className="how__title">{step.title}</h3>
                <p className="how__text">{step.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
