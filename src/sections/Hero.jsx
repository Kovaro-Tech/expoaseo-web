import { ArrowDown, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessMedia } from '../config/business'
import { heroBadges } from '../data/content'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__glow" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <Sparkles size={15} strokeWidth={2.4} />
            Servicios profesionales de limpieza
          </span>

          <h1 className="hero__title">
            Tu espacio impecable.
            <br />
            <span className="hero__title-accent">Tu tiempo, para ti.</span>
          </h1>

          <p className="lead hero__text">
            Limpieza profesional para hogares, oficinas e instituciones. Elige el
            servicio, escríbenos por WhatsApp y nosotros nos encargamos del resto.
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
            <a className="btn btn--ghost" href="#servicios">
              Ver servicios
              <ArrowDown size={18} />
            </a>
          </div>

          <ul className="hero__badges">
            {heroBadges.map((badge) => (
              <li key={badge} className="hero__badge">
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/* Composición visual. Si se carga businessMedia.heroImage, se usa la foto real. */}
        <div className="hero__visual" aria-hidden="true">
          {businessMedia.heroImage ? (
            <img className="hero__photo" src={businessMedia.heroImage} alt="" />
          ) : (
            <div className="hero__mock">
              <div className="hero__mock-card">
                <span className="hero__mock-label">Servicio solicitado</span>
                <strong className="hero__mock-title">Jornada Completa para Hogares</strong>
                <div className="hero__mock-row">
                  <span>
                    <Timer size={15} /> 8 horas
                  </span>
                  <span className="hero__mock-price">$45 – $60</span>
                </div>
                <div className="hero__mock-bar">
                  <span />
                </div>
                <div className="hero__mock-status">
                  <WhatsAppIcon size={16} />
                  Coordinado por WhatsApp
                </div>
              </div>

              <div className="hero__chip hero__chip--one">
                <ShieldCheck size={17} />
                Insumos incluidos
              </div>

              <div className="hero__chip hero__chip--two">
                <Sparkles size={17} />
                Equipo capacitado
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
