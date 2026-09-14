import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessConfig, formatBusinessHours } from '../config/business'
import { generalUrl } from '../lib/whatsapp'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="section closing">
      <div className="container closing__inner">
        <h2 className="closing__title">¿Qué necesitas limpiar?</h2>
        <p className="closing__text">
          Cuéntanos tu caso y coordinamos contigo por WhatsApp.
        </p>

        <a
          className="btn btn--whatsapp btn--lg"
          href={generalUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={20} />
          Hablar con EXPOASEO
        </a>

        <p className="closing__aside">
          {businessConfig.serviceArea} · {formatBusinessHours()}
        </p>
      </div>
    </section>
  )
}
