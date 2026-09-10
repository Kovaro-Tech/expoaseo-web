import { ArrowRight } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWhatsAppUrl, messageForService } from '../lib/whatsapp'
import './ServiceCard.css'

export default function ServiceCard({ category, service }) {
  return (
    <article className={`service-card${service.badge ? ' service-card--featured' : ''}`}>
      {service.badge && <span className="service-card__badge">{service.badge}</span>}

      <div className="service-card__body">
        <h3 className="service-card__name">{service.name}</h3>
        <p className="service-card__desc">{service.description}</p>

        {service.meta?.length > 0 && (
          <dl className="service-card__meta">
            {service.meta.map((item) => (
              <div className="service-card__meta-row" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="service-card__footer">
        <div className="service-card__price">
          <strong>{service.price}</strong>
          {service.priceNote && <span>{service.priceNote}</span>}
        </div>

        <a
          className="service-card__cta"
          href={buildWhatsAppUrl(messageForService(category, service))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={17} />
          <span>Solicitar</span>
          <ArrowRight size={16} className="service-card__arrow" />
        </a>
      </div>
    </article>
  )
}
