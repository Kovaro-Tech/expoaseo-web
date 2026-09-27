import { useEffect, useRef, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import JobApplicationModal from './JobApplicationModal'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { generalUrl } from '../lib/whatsapp'
import { lockScroll } from '../lib/scrollLock'
import './Navbar.css'

/* El orden sigue al de la página. */
const navLinks = [
  { href: '#trayectoria', label: 'Trayectoria' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#confianza', label: 'Confianza' },
  { href: '#faq', label: 'Preguntas' },
]

export default function Navbar({ home = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [applicationOpen, setApplicationOpen] = useState(false)
  const workButtonRef = useRef(null)
  const menuButtonRef = useRef(null)
  const headerRef = useRef(null)
  const [theme, setTheme] = useState(() => typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme || 'light')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    if (!menuOpen) return undefined
    const unlock = lockScroll()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const onResize = () => { if (window.innerWidth >= 1200) setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    window.addEventListener('resize', onResize)
    return () => {
      unlock()
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      nextTheme === 'dark' ? '#0b1725' : '#0f75bc',
    )
    setTheme(nextTheme)
    try {
      localStorage.setItem('expoaseo-theme', nextTheme)
    } catch {
      // La preferencia visual sigue funcionando aunque el storage no esté disponible.
    }
  }

  const themeControl = (mobile = false) => (
    <button
      type="button"
      className={`theme-toggle${mobile ? ' theme-toggle--mobile' : ''}`}
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      <Sun className="theme-toggle__sun" size={15} aria-hidden="true" />
      <span className="theme-toggle__thumb" aria-hidden="true" />
      <Moon className="theme-toggle__moon" size={14} aria-hidden="true" />
    </button>
  )

  /* Arriba del todo el navbar flota sobre el vídeo del hero: fondo
     transparente y logo sobre placa blanca, porque el azul del logo no
     contrasta con el velo oscuro. Al desplazarse vuelve a la versión clara. */
  const overHero = home && !scrolled && !menuOpen
  const openApplication = (event) => {
    workButtonRef.current = menuOpen ? menuButtonRef.current : event.currentTarget
    setMenuOpen(false)
    setApplicationOpen(true)
  }

  return (
    <header
      ref={headerRef}
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}${
        overHero ? ' navbar--over-hero' : ''
      }`}
    >
      <div className="container navbar__inner">
        <a className="navbar__brand" href="/#inicio" onClick={() => setMenuOpen(false)}>
          <Logo variant={overHero || theme === 'dark' ? 'light' : 'default'} />
        </a>

        <nav className="navbar__links" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a key={link.href} className="navbar__link" href={`/${link.href}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          {themeControl()}
          <button
            type="button"
            className="btn btn--secondary btn--sm navbar__work"
            onClick={openApplication}
          >
            Trabaja con nosotros
          </button>
          <a
            className="btn btn--primary btn--sm navbar__cta"
            href={generalUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={18} />
            Escríbenos
          </a>

          {/* CTA persistente en móvil: sustituye al antiguo botón flotante. */}
          <a
            className="navbar__cta-mini"
            href={generalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribirnos por WhatsApp"
          >
            <WhatsAppIcon size={20} />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="navbar__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div id="menu-movil" className="navbar__mobile" hidden={!menuOpen}>
        <nav className="navbar__mobile-links" aria-label="Navegación móvil">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="navbar__mobile-link"
              href={`/${link.href}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="btn btn--secondary navbar__mobile-work"
            onClick={openApplication}
          >
            Trabaja con nosotros
          </button>
          <div className="navbar__mobile-theme">{themeControl(true)}</div>
        </nav>
      </div>
      {applicationOpen && <JobApplicationModal
        onClose={() => setApplicationOpen(false)}
        returnFocusRef={workButtonRef}
      />}
    </header>
  )
}
