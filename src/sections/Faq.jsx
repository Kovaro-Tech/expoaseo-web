import { useState } from 'react'
import FaqItem from '../components/FaqItem'
import { faqs } from '../data/content'
import './Faq.css'

export default function Faq() {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="section faq" id="faq">
      <div className="container faq__inner">
        <div className="faq__intro">
          <p className="label">Preguntas</p>
          <h2 className="faq__title">Antes de escribirnos</h2>
        </div>

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
      </div>
    </section>
  )
}
