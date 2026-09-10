import { Check } from 'lucide-react'
import ServiceSelector from '../components/ServiceSelector'
import './RequestCta.css'

const helpItems = [
  'El tipo de espacio (casa, oficina, local o muebles).',
  'El tamaño aproximado o el número de piezas.',
  'La fecha y el horario que te quedan mejor.',
]

export default function RequestCta() {
  return (
    <section className="section request" id="solicitar">
      <div className="container">
        <div className="request__panel">
          <div className="request__copy">
            <span className="eyebrow request__eyebrow">Solicita tu limpieza</span>
            <h2 className="request__title">
              Elige el servicio y te escribimos por WhatsApp
            </h2>
            <p className="request__text">
              Preparamos el mensaje por ti. Solo confírmanos estos datos y te damos el
              valor final en minutos.
            </p>

            <ul className="request__list">
              {helpItems.map((item) => (
                <li key={item}>
                  <span className="request__check" aria-hidden="true">
                    <Check size={13} strokeWidth={3.2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="request__form">
            <ServiceSelector />
          </div>
        </div>
      </div>
    </section>
  )
}
