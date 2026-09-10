import './FaqItem.css'

export default function FaqItem({ faq, open, onToggle }) {
  const panelId = `${faq.id}-panel`

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <h3 className="faq-item__heading">
        <button
          type="button"
          className="faq-item__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{faq.question}</span>
          <span className="faq-item__sign" aria-hidden="true" />
        </button>
      </h3>

      <div className="faq-item__panel" id={panelId} hidden={!open}>
        <p>{faq.answer}</p>
      </div>
    </div>
  )
}
