import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { businessConfig } from '../config/business'
import { serviceCategories } from '../data/services'
import './Footer.css'

const socialLinks = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const activeSocial = socialLinks.filter((social) => businessConfig[social.key])

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo variant="light" />
          <p className="footer__tagline">
            Servicios profesionales de limpieza para hogares, oficinas e instituciones.
          </p>
        </div>

        <nav className="footer__col" aria-label="Servicios">
          <h3 className="footer__title">Servicios</h3>
          <ul className="footer__list">
            {serviceCategories.map((category) => (
              <li key={category.id}>
                <a href={`#servicios-${category.id}`}>{category.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Secciones">
          <h3 className="footer__title">La empresa</h3>
          <ul className="footer__list">
            <li>
              <a href="#por-que">Por qué EXPOASEO</a>
            </li>
            <li>
              <a href="#faq">Preguntas frecuentes</a>
            </li>
            <li>
              <a href="#solicitar">Solicitar limpieza</a>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__title">Contacto</h3>
          <ul className="footer__list footer__list--contact">
            {businessConfig.phoneDisplay && (
              <li>
                <Phone size={15} />
                {businessConfig.phoneDisplay}
              </li>
            )}
            {businessConfig.email && (
              <li>
                <Mail size={15} />
                <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
              </li>
            )}
            <li>
              <MapPin size={15} />
              {businessConfig.location}
            </li>
            <li>
              <Clock size={15} />
              {businessConfig.schedule}
            </li>
          </ul>

          {activeSocial.length > 0 && (
            <ul className="footer__social">
              {activeSocial.map((social) => (
                <li key={social.key}>
                  <a
                    href={businessConfig[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                    <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {businessConfig.legalName}. Todos los derechos reservados.
        </p>
        <p className="footer__credit">
          Sitio desarrollado por <span>Kovaro Tech</span>
        </p>
      </div>
    </footer>
  )
}
