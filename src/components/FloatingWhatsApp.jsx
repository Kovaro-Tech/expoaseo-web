import { useEffect, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './FloatingWhatsApp.css'

/** Botón flotante persistente. Aparece después del hero. */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      className={`float-wa${visible ? ' float-wa--visible' : ''}`}
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribirnos por WhatsApp"
      tabIndex={visible ? 0 : -1}
    >
      <WhatsAppIcon size={26} />
      <span className="float-wa__label">Solicitar limpieza</span>
    </a>
  )
}
