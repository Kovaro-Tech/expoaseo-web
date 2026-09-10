import { ArrowRight } from 'lucide-react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessMedia } from '../config/business'
import { getCategoryById } from '../data/services'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './Hero.css'

/* El servicio que se muestra en la ficha sale del catálogo real, para que
   nunca quede desincronizado con los precios. */
const home = getCategoryById('hogar')
const featured = home.services.find((service) => service.badge) ?? home.services[0]
const duration = featured.meta?.find((item) => item.label === 'Duración')?.value

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="label">Servicios profesionales de limpieza</p>

          <h1 className="hero__title">
            Tu espacio impecable.
            <br />
            <span>Tu tiempo, para ti.</span>
          </h1>

          <p className="lead hero__lead">
            Limpieza para hogares, oficinas e instituciones. Tú nos dices qué
            necesitas. Nosotros te decimos cuánto, cuándo y cómo.
          </p>

          <div className="hero__actions">
            <a
              className="btn btn--whatsapp"
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={20} />
              Solicitar limpieza
            </a>
            <a className="link-arrow" href="#servicios">
              Ver servicios
              <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="media hero__frame">
            {businessMedia.heroImage && (
              <img
                src={businessMedia.heroImage}
                alt="Equipo de EXPOASEO durante un servicio de limpieza"
              />
            )}
          </div>

          <figure className="hero__ficha">
            <figcaption>Servicio solicitado</figcaption>
            <p className="hero__ficha-name">
              {featured.name} · {home.label}
            </p>
            <p className="hero__ficha-meta">
              {duration && <span>{duration}</span>}
              <strong>{featured.price}</strong>
            </p>
          </figure>
        </div>
      </div>

      <div className="container">
        <ul className="hero__lines">
          <li>Hogares</li>
          <li>Empresas</li>
          <li>Tapicería</li>
        </ul>
      </div>
    </section>
  )
}
