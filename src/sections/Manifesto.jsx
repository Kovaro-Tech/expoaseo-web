import { ArrowRight } from 'lucide-react'
import { serviceIndex } from '../data/content'
import './Manifesto.css'

export default function Manifesto() {
  return (
    <section className="section manifesto">
      <div className="container">
        <div className="manifesto__statement">
          <h2 className="manifesto__title">
            Limpiamos espacios. Pero lo que realmente te devolvemos es{' '}
            <span>tiempo.</span>
          </h2>

          <div className="manifesto__aside">
            <p>
              Una casa recién limpia se nota apenas abres la puerta. Una oficina
              también. De eso nos ocupamos.
            </p>
            <p className="manifesto__signature">
              EXPOASEO Servicios Generales Cía. Ltda.
            </p>
          </div>
        </div>

        <ul className="manifesto__index">
          {serviceIndex.map((item) => (
            <li key={item.id}>
              <a href={`#servicios-${item.id}`}>
                <span className="manifesto__number">{item.number}</span>
                <span className="manifesto__slash" aria-hidden="true">
                  /
                </span>
                <span className="manifesto__name">{item.title}</span>
                <span className="manifesto__text">{item.text}</span>
                <ArrowRight className="manifesto__arrow" size={20} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
