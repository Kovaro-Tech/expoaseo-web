import { pillars } from '../data/content'
import './WhyUs.css'

export default function WhyUs() {
  return (
    <section className="section section--alt why" id="por-que">
      <div className="container why__inner">
        <div className="why__intro">
          <p className="label">Por qué EXPOASEO</p>
          <h2 className="why__title">
            La limpieza también puede sentirse profesional.
          </h2>
          <p className="lead why__lead">
            Equipo, procesos y atención pensados para que sepas quién entra a tu
            espacio y qué puedes esperar del servicio.
          </p>
        </div>

        <ol className="why__list">
          {pillars.map((pillar, index) => (
            <li className="why__item" key={pillar.id}>
              <span className="why__num">{String(index + 1).padStart(2, '0')}</span>
              <div className="why__body">
                <h3 className="why__name">{pillar.title}</h3>
                <p className="why__text">{pillar.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
