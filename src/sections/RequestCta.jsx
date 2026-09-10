import ServiceSelector from '../components/ServiceSelector'
import './RequestCta.css'

export default function RequestCta() {
  return (
    <section className="request" id="solicitar">
      <div className="container request__inner">
        <h2 className="request__title">¿Qué necesitas limpiar?</h2>
        <ServiceSelector />
      </div>
    </section>
  )
}
