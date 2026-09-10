import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessConfig } from '../config/business'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="section closing">
      <div className="container closing__inner">
        <h2 className="closing__title">
          Menos tiempo limpiando.
          <br />
          <span>Más tiempo para ti.</span>
        </h2>

        <a
          className="btn btn--whatsapp btn--lg"
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={20} />
          Solicitar limpieza
        </a>

        <p className="closing__aside">{businessConfig.schedule}</p>
      </div>
    </section>
  )
}
