import ServiceSelector from '../components/ServiceSelector'
import './RequestCta.css'

export default function RequestCta() {
  return (
    <section className="request" id="solicitar">
      <div className="container request__inner">
        <div className="request__copy">
          <p className="label request__label">Te orientamos</p>
          <h2 className="request__title">¿No sabes qué servicio necesitas?</h2>
          <p className="request__text">
            Cuéntanos qué necesitas limpiar y te orientamos por WhatsApp.
          </p>
        </div>

        <ServiceSelector />
      </div>
    </section>
  )
}
