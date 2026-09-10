import { Sparkles } from 'lucide-react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="section section--tight final">
      <div className="container">
        <div className="final__panel">
          <span className="final__eyebrow">
            <Sparkles size={15} strokeWidth={2.4} />
            Empieza hoy
          </span>

          <h2 className="final__title">
            Dinos qué necesitas limpiar y nosotros nos encargamos
          </h2>

          <p className="final__text">
            Respondemos por WhatsApp con el valor final y la disponibilidad más cercana.
          </p>

          <div className="final__actions">
            <a
              className="btn btn--whatsapp"
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={20} />
              Solicitar limpieza
            </a>
            <a className="btn btn--ghost" href="#servicios">
              Ver servicios y precios
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
