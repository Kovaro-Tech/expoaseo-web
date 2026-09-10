import { useState } from 'react'
import { Info } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ServiceCard from '../components/ServiceCard'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { pricingDisclaimer, serviceCategories } from '../data/services'
import { getIcon } from '../lib/icons'
import { buildWhatsAppUrl, messageForCategory } from '../lib/whatsapp'
import './Services.css'

export default function Services() {
  const [activeId, setActiveId] = useState(serviceCategories[0].id)
  const active = serviceCategories.find((category) => category.id === activeId)

  return (
    <section className="section services" id="servicios">
      <div className="container">
        <SectionHeader
          eyebrow="Servicios"
          title="Elige lo que tu espacio necesita"
          text="Tres líneas de servicio con precios referenciales publicados. Sin llamadas ni formularios: eliges y nos escribes."
        />

        <div className="services__tabs" role="tablist" aria-label="Categorías de servicio">
          {serviceCategories.map((category) => {
            const Icon = getIcon(category.icon)
            const selected = category.id === activeId

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`panel-${category.id}`}
                className={`services__tab${selected ? ' services__tab--active' : ''}`}
                onClick={() => setActiveId(category.id)}
              >
                <Icon size={18} strokeWidth={2} />
                <span className="services__tab-full">{category.label}</span>
                <span className="services__tab-short">{category.shortLabel}</span>
              </button>
            )
          })}
        </div>

        <div
          className="services__panel"
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          key={active.id}
        >
          <div className="services__intro">
            <h3 className="services__intro-title">{active.title}</h3>
            <p className="services__intro-text">{active.description}</p>
          </div>

          <div className="services__grid">
            {active.services.map((service) => (
              <ServiceCard key={service.id} category={active} service={service} />
            ))}
          </div>
        </div>

        <div className="services__footnote">
          <p className="services__disclaimer">
            <Info size={16} />
            {pricingDisclaimer}
          </p>
          <a
            className="btn btn--whatsapp btn--sm"
            href={buildWhatsAppUrl(messageForCategory(active))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={17} />
            Cotizar {active.shortLabel.toLowerCase()}
          </a>
        </div>
      </div>
    </section>
  )
}
