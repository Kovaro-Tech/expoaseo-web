import { useState } from 'react'
import { Check } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { serviceCategories } from '../data/services'
import { getIcon } from '../lib/icons'
import { buildWhatsAppUrl, messageForCategory } from '../lib/whatsapp'
import './ServiceSelector.css'

/**
 * Selector previo a WhatsApp: el usuario elige el tipo de servicio y el
 * botón prepara el mensaje. No requiere backend.
 */
export default function ServiceSelector() {
  const [selectedId, setSelectedId] = useState(serviceCategories[0].id)

  const selected = serviceCategories.find((category) => category.id === selectedId)
  const message = messageForCategory(selected)

  return (
    <div className="selector">
      <p className="selector__question" id="selector-pregunta">
        ¿Qué servicio necesitas?
      </p>

      <div
        className="selector__options"
        role="radiogroup"
        aria-labelledby="selector-pregunta"
      >
        {serviceCategories.map((category) => {
          const Icon = getIcon(category.icon)
          const active = category.id === selectedId

          return (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`selector__option${active ? ' selector__option--active' : ''}`}
              onClick={() => setSelectedId(category.id)}
            >
              <span className="selector__option-icon">
                <Icon size={20} strokeWidth={1.9} />
              </span>
              <span className="selector__option-label">{category.label}</span>
              <span className="selector__option-check" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
            </button>
          )
        })}
      </div>

      <div className="selector__preview">
        <span className="selector__preview-label">Mensaje que enviaremos</span>
        <p className="selector__bubble">{message}</p>
      </div>

      <a
        className="btn btn--whatsapp btn--block"
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={20} />
        Continuar en WhatsApp
      </a>

      <p className="selector__note">
        Se abre tu WhatsApp con el mensaje escrito. Tú decides cuándo enviarlo.
      </p>
    </div>
  )
}
