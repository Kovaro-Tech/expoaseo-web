import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './Navbar.css'

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#por-que', label: 'Por qué EXPOASEO' },
  { href: '#faq', label: 'Preguntas' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a className="navbar__brand" href="#inicio" onClick={() => setMenuOpen(false)}>
          <Logo />
        </a>

        <nav className="navbar__links" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a key={link.href} className="navbar__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a
            className="btn btn--whatsapp btn--sm navbar__cta"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={18} />
            Solicitar limpieza
          </a>

          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        hidden={!menuOpen}
      >
        <nav className="navbar__mobile-links" aria-label="Navegación móvil">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="navbar__mobile-link"
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="btn btn--whatsapp btn--block"
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          <WhatsAppIcon size={20} />
          Solicitar limpieza
        </a>
      </div>
    </header>
  )
}
