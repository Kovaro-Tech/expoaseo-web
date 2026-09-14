import { useEffect, useState } from 'react'
import { Clock, SprayCan, Users } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import WhatsAppIcon from '../components/WhatsAppIcon'
import ServiceRow from '../components/ServiceRow'
import { categoryImages } from '../config/business'
import { pillars } from '../data/content'
import { pricingDisclaimer, serviceCategories } from '../data/services'
import { quoteUrl } from '../lib/whatsapp'
import './Services.css'

const PILLAR_ICONS = { Users, SprayCan, Clock }

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
          {/* Con fotografía la cabecera es una pieza visual; sin ella, dos
              líneas de texto. Una banda de color vacía solo alejaría los
              precios, que es a lo que viene el usuario. */}
          {categoryImages[active.id] ? (
            <div className={`services__banner services__banner--${active.id}`}>
              <img
                className="services__banner-img"
                src={categoryImages[active.id]}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="services__banner-text">
                <h3 className="services__banner-title">{active.title}</h3>
                <p className="services__banner-desc">{active.description}</p>
              </div>
            </div>
          ) : (
            <div className="services__intro">
              <h3 className="services__intro-title">{active.title}</h3>
              <p className="services__intro-text">{active.description}</p>
            </div>
          )}

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
                {/* Solo unidad y duración: el resto de metadatos alarga la
                    ficha sin ayudar a decidir. */}
                <p className="feature__meta">
                  {[featured.unit, featured.duration].filter(Boolean).join(' · ')}
                </p>
              </div>

              <div className="feature__side">
                <strong className="feature__price">{featured.price}</strong>
                <span className="feature__note">
                  {['Valor referencial', featured.priceDetail]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <span className="feature__cta">
                  <WhatsAppIcon size={17} />
                  Solicitar este servicio
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

        {/* Cierra el catálogo; no es una sección aparte. */}
        <ul className="trustband">
          {pillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.icon] ?? Users
            return (
              <li className="trustband__item" key={pillar.id}>
                <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                <div>
                  <strong>{pillar.title}</strong>
                  <span>{pillar.text}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
