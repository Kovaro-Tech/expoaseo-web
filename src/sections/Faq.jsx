import { useState } from 'react'
import FaqItem from '../components/FaqItem'
import SectionHeader from '../components/SectionHeader'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { faqs } from '../data/content'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import './Faq.css'

export default function Faq() {
  const [openId, setOpenId] = useState(faqs[0].id)

  return (
    <section className="section section--alt faq" id="faq">
      <div className="container">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Lo que más nos preguntan"
          align="center"
        />

        <div className="faq__list">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              open={openId === faq.id}
              onToggle={() => setOpenId((current) => (current === faq.id ? null : faq.id))}
            />
          ))}
        </div>

        <div className="faq__help">
          <p>¿Tu caso no aparece aquí?</p>
          <a
            className="btn btn--ghost btn--sm"
            href={buildWhatsAppUrl(
              'Hola EXPOASEO 👋, tengo una consulta sobre sus servicios de limpieza.',
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={17} />
            Pregúntanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
