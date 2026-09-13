import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ServiceRow from '../components/ServiceRow'
import { categoryImages } from '../config/business'
import { pricingDisclaimer, serviceCategories, serviceMetaLine } from '../data/services'
import { quoteUrl } from '../lib/whatsapp'
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

  /* Un role="tablist" debe responder a flechas, Inicio y Fin: si declaramos
     el rol, cumplimos el contrato de teclado que implica. */
  const onTabKeyDown = (event) => {
    const total = serviceCategories.length
    const current = serviceCategories.findIndex((category) => category.id === activeId)
    const moves = {
      ArrowRight: (current + 1) % total,
      ArrowLeft: (current - 1 + total) % total,
      Home: 0,
      End: total - 1,
    }

    const next = moves[event.key]
    if (next === undefined) return

    event.preventDefault()
    const nextId = serviceCategories[next].id
    setActiveId(nextId)
    document.getElementById(`tab-${nextId}`)?.focus()
  }

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
          text={pricingDisclaimer}
        />

        <div
          className="services__nav"
          role="tablist"
          aria-label="Categorías de servicio"
          onKeyDown={onTabKeyDown}
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={category.id === activeId}
              aria-controls={`panel-${category.id}`}
              tabIndex={category.id === activeId ? 0 : -1}
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
          {/* Banda de categoría: mismo tratamiento haya foto o no, de modo que
              cambiar de pestaña se siente distinto sin romper la unidad. */}
          <div className={`services__banner services__banner--${active.id}`}>
            {categoryImages[active.id] && (
              <img
                className="services__banner-img"
                src={categoryImages[active.id]}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="services__banner-text">
              <h3 className="services__banner-title">{active.title}</h3>
              <p className="services__banner-desc">{active.description}</p>
            </div>
          </div>

          {featured && (
            <a
              className="feature"
              href={quoteUrl({ category: active, service: featured })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="feature__main">
                <span className="feature__flag">{featured.badge}</span>
                <h3 className="feature__name">{featured.name}</h3>
                <p className="feature__desc">{featured.description}</p>
                <p className="feature__meta">{serviceMetaLine(featured)}</p>
              </div>

              <div className="feature__side">
                <strong className="feature__price">{featured.price}</strong>
                <span className="feature__note">
                  {['Valor referencial', featured.priceDetail]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <span className="feature__cta">
                  Solicitar este servicio
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

      </div>
    </section>
  )
}
