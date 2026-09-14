import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { businessConfig, formatBusinessHours } from '../config/business'
import { serviceCategories } from '../data/services'
import './Footer.css'

const socialLinks = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'facebook', label: 'Facebook' },
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
            Limpieza profesional en {businessConfig.serviceArea}.{' '}
            {businessConfig.yearsExperience} años de experiencia.
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
              <a href="#trayectoria">Trayectoria</a>
            </li>
            <li>
              <a href="#confianza">Confianza</a>
            </li>
            <li>
              <a href="#faq">Preguntas frecuentes</a>
            </li>
            <li>
              <a href="#solicitar">Solicitar limpieza</a>
            </li>
          </ul>
        </nav>

        <div className="footer__col footer__col--contact">
          <h3 className="footer__title">Contacto</h3>
          <ul className="footer__list footer__list--contact">
            {businessConfig.phone && (
              <li>
                <Phone size={15} />
                <a href={`tel:+${businessConfig.whatsapp}`}>{businessConfig.phone}</a>
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
              {businessConfig.serviceArea}
            </li>
            <li>
              <Clock size={15} />
              {formatBusinessHours()}
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
          Sitio desarrollado por{' '}
          <a href="https://kovarotech.com" target="_blank" rel="noopener noreferrer">
            Kovaro Tech
          </a>
        </p>
      </div>
    </footer>
  )
}
