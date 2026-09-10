import { trustHighlights } from '../data/content'
import { getIcon } from '../lib/icons'
import './TrustBar.css'

export default function TrustBar() {
  return (
    <section className="trustbar" aria-label="Por qué confiar en EXPOASEO">
      <div className="container">
        <ul className="trustbar__grid">
          {trustHighlights.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <li className="trustbar__item" key={item.id}>
                <span className="trustbar__icon">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
