import { ArrowRight } from 'lucide-react'
import { buildWhatsAppUrl, messageForService } from '../lib/whatsapp'
import './ServiceRow.css'

/** Fila de catálogo: sin caja, separada solo por filete. */
export default function ServiceRow({ category, service }) {
  return (
    <li className="row">
      <a
        className="row__link"
        href={buildWhatsAppUrl(messageForService(category, service))}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3 className="row__name">{service.name}</h3>
        <p className="row__price">{service.price}</p>
        <p className="row__desc">{service.description}</p>
        <p className="row__meta">
          {[service.priceNote, ...(service.meta?.map((item) => item.value) ?? [])]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <ArrowRight className="row__arrow" size={18} />
      </a>
    </li>
  )
}
