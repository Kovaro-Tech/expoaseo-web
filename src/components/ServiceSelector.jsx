import { useId, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon'
import { serviceCategories } from '../data/services'
import { quoteUrl } from '../lib/whatsapp'
import './ServiceSelector.css'

const ANY_SERVICE = ''

/**
 * Solicitud de cotización: categoría → servicio (opcional) → detalle (opcional).
 * Todo el texto del mensaje sale de src/config/whatsapp.js.
 */
export default function ServiceSelector() {
  const [categoryId, setCategoryId] = useState(serviceCategories[0].id)
  const [serviceId, setServiceId] = useState(ANY_SERVICE)
  const [details, setDetails] = useState('')

  const serviceFieldId = useId()
  const detailsFieldId = useId()

  const category = serviceCategories.find((item) => item.id === categoryId)
  const service = category.services.find((item) => item.id === serviceId)

  const selectCategory = (id) => {
    setCategoryId(id)
    setServiceId(ANY_SERVICE) // el servicio anterior ya no pertenece a esta categoría
  }

  return (
    <div className="selector">
      {/* Botones de alternancia con aria-pressed: son navegables con Tab.
          No usamos role="radio" para no prometer navegación con flechas. */}
      <div className="selector__options" role="group" aria-label="Tipo de servicio">
        {serviceCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === categoryId}
            className="selector__option"
            onClick={() => selectCategory(item.id)}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>

      <div className="selector__field">
        <label htmlFor={serviceFieldId}>
          ¿Qué servicio? <span>(opcional)</span>
        </label>
        <div className="selector__select">
          <select
            id={serviceFieldId}
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
          >
            <option value={ANY_SERVICE}>Todavía no lo sé</option>
            {category.services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.price}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selector__field">
        <label htmlFor={detailsFieldId}>
          Cuéntanos un poco más <span>(opcional)</span>
        </label>
        <textarea
          id={detailsFieldId}
          rows={2}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Ej. Departamento de 90 m², sábado por la mañana"
        />
      </div>

      <a
        className="btn btn--whatsapp btn--lg selector__cta"
        href={quoteUrl({ category, service, details })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={20} />
        Enviar solicitud
      </a>
    </div>
  )
}
