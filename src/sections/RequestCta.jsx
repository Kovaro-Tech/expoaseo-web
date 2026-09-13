import ServiceSelector from '../components/ServiceSelector'
import './RequestCta.css'

export default function RequestCta() {
  return (
    <section className="request" id="solicitar">
      <div className="container request__inner">
        <div className="request__copy">
          <p className="label request__label">Cotización</p>
          <h2 className="request__title">Cuéntanos qué necesitas limpiar.</h2>
          <p className="request__text">
            Selecciona el servicio y te llevamos directo a WhatsApp.
          </p>
        </div>

        <ServiceSelector />
      </div>
    </section>
  )
}
