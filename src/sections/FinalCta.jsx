import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessConfig, businessMedia, formatBusinessHours } from '../config/business'
import { generalUrl } from '../lib/whatsapp'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="section closing">
      {businessMedia.closingImage && (
        <img
          className="closing__bg"
          src={businessMedia.closingImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="closing__scrim" />

      <div className="container closing__inner">
        <h2 className="closing__title">Tu espacio merece un estándar profesional.</h2>

        <a
          className="btn btn--whatsapp btn--lg"
          href={generalUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={20} />
          Pedir cotización
        </a>

        <p className="closing__aside">
          {businessConfig.serviceArea} · {formatBusinessHours()}
        </p>
      </div>
    </section>
  )
}
