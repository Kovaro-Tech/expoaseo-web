import WhatsAppIcon from './WhatsAppIcon'
import { serviceMetaLine } from '../data/services'
import { quoteUrl } from '../lib/whatsapp'
import './ServiceRow.css'

/**
 * Fila de catálogo: sin caja, separada solo por filete.
 * Abre WhatsApp con este servicio ya precargado en el mensaje.
 */
export default function ServiceRow({ category, service }) {
  const meta = [serviceMetaLine(service), service.priceDetail].filter(Boolean).join(' · ')

  return (
    <li className="row">
      <a
        className="row__link"
        href={quoteUrl({ category, service })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3 className="row__name">{service.name}</h3>
        <p className="row__price">{service.price}</p>
        <p className="row__desc">{service.description}</p>
        {meta && <p className="row__meta">{meta}</p>}
        {/* El icono deja claro que la fila abre WhatsApp, no otra página. */}
        <WhatsAppIcon className="row__arrow" size={19} />
      </a>
    </li>
  )
}
