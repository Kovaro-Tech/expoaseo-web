import './SectionHeader.css'

export default function SectionHeader({ eyebrow, title, text, align = 'left' }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-header__title">{title}</h2>
      {text && <p className="lead section-header__text">{text}</p>}
    </header>
  )
}
