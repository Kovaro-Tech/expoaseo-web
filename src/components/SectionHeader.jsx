import './SectionHeader.css'

export default function SectionHeader({ label, title, text }) {
  return (
    <header className="sec-head">
      {label && <p className="label">{label}</p>}
      <h2 className="sec-head__title">{title}</h2>
      {text && <p className="lead sec-head__text">{text}</p>}
    </header>
  )
}
