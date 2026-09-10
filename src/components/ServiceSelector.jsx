import { useId, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon'
import { serviceCategories } from '../data/services'
import { buildWhatsAppUrl, messageForRequest } from '../lib/whatsapp'
import './ServiceSelector.css'

/**
 * Selector previo a WhatsApp: categoría + detalle libre opcional.
 * El mensaje se arma en el cliente; no requiere backend.
 */
export default function ServiceSelector() {
  const [selectedId, setSelectedId] = useState(serviceCategories[0].id)
  const [details, setDetails] = useState('')
  const detailsId = useId()

  const selected = serviceCategories.find((category) => category.id === selectedId)

  return (
    <div className="selector">
      <div
        className="selector__options"
        role="radiogroup"
        aria-label="Tipo de servicio"
      >
        {serviceCategories.map((category) => {
          const active = category.id === selectedId
          return (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={active}
              className="selector__option"
              onClick={() => setSelectedId(category.id)}
            >
              {category.shortLabel}
            </button>
          )
        })}
      </div>

      <div className="selector__field">
        <label htmlFor={detailsId}>
          Cuéntanos un poco más <span>(opcional)</span>
        </label>
        <textarea
          id={detailsId}
          rows={2}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Ej. Departamento de 90 m², sábado por la mañana"
        />
      </div>

      <a
        className="btn btn--whatsapp btn--lg selector__cta"
        href={buildWhatsAppUrl(messageForRequest(selected, details))}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={20} />
        Continuar por WhatsApp
      </a>
    </div>
  )
}
