import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ServiceRow from '../components/ServiceRow'
import { categoryImages } from '../config/business'
import { pricingDisclaimer, serviceCategories } from '../data/services'
import { buildWhatsAppUrl, messageForService } from '../lib/whatsapp'
import './Services.css'

/** Permite enlazar una categoría concreta: #servicios-hogar, #servicios-tapiceria… */
function categoryFromHash() {
  const match = /^#servicios-(.+)$/.exec(window.location.hash)
  return serviceCategories.some((category) => category.id === match?.[1]) ? match[1] : null
}

export default function Services() {
  const [activeId, setActiveId] = useState(
    () => categoryFromHash() ?? serviceCategories[0].id,
  )

  useEffect(() => {
    const sync = () => {
      const fromHash = categoryFromHash()
      if (fromHash) setActiveId(fromHash)
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const active = serviceCategories.find((category) => category.id === activeId)
  const featured = active.services.find((service) => service.badge)
  const rest = active.services.filter((service) => service !== featured)

  return (
    <section className="section section--rule services" id="servicios">
      <div className="container">
        {/* Anclas para enlazar directamente a una categoría desde otras secciones. */}
        <div className="services__anchors" aria-hidden="true">
          {serviceCategories.map((category) => (
            <span key={category.id} id={`servicios-${category.id}`} />
          ))}
        </div>

        <SectionHeader
          label="Servicios y precios"
          title="Qué hacemos y cuánto cuesta"
        />

        <div className="services__nav" role="tablist" aria-label="Categorías">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={category.id === activeId}
              aria-controls={`panel-${category.id}`}
              className="services__nav-item"
              onClick={() => setActiveId(category.id)}
            >
              <span className="services__nav-full">{category.label}</span>
              <span className="services__nav-short">{category.shortLabel}</span>
            </button>
          ))}
        </div>

        <div
          className="services__panel"
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          key={active.id}
        >
          {/* Cada categoría trae su propia imagen y su propio tono: es lo que
              hace que cambiar de pestaña se sienta distinto. */}
          <div className="services__lead">
            <div className={`media services__banner services__banner--${active.id}`}>
              {categoryImages[active.id] && (
                <img src={categoryImages[active.id]} alt={active.title} />
              )}
            </div>

            <div className="services__lead-text">
              <h3 className="services__lead-title">{active.title}</h3>
              <p className="services__lead-desc">{active.description}</p>
            </div>
          </div>

          {featured && (
            <a
              className="feature"
              href={buildWhatsAppUrl(messageForService(active, featured))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="feature__main">
                <span className="feature__flag">{featured.badge}</span>
                <h3 className="feature__name">{featured.name}</h3>
                <p className="feature__desc">{featured.description}</p>
                {featured.meta?.length > 0 && (
                  <p className="feature__meta">
                    {featured.meta.map((item) => item.value).join(' · ')}
                  </p>
                )}
              </div>

              <div className="feature__side">
                <strong className="feature__price">{featured.price}</strong>
                {featured.priceNote && (
                  <span className="feature__note">{featured.priceNote}</span>
                )}
                <span className="feature__cta">
                  Solicitar
                  <ArrowRight size={17} />
                </span>
              </div>
            </a>
          )}

          <ul className="services__rows">
            {rest.map((service) => (
              <ServiceRow key={service.id} category={active} service={service} />
            ))}
          </ul>
        </div>

        <p className="services__note">{pricingDisclaimer}</p>
      </div>
    </section>
  )
}
