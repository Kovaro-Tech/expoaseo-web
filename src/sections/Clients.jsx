import { useEffect, useRef, useState } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  Dumbbell,
  Fuel,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  Plane,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Siren,
  Zap,
} from 'lucide-react'
import { businessConfig } from '../config/business'
import { certifications, clients, clientSectors, clientStats } from '../data/trust'
import './Clients.css'

/**
 * Solo resuelve la clave que viene del dato. Qué icono lleva cada
 * organización se decide en src/data/trust.js, no aquí.
 */
const ICONS = {
  BriefcaseBusiness,
  Building2,
  Dumbbell,
  Fuel,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  Plane,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Siren,
  Zap,
}

/* El set se repite para que la cinta nunca deje hueco: la animación desplaza
   exactamente un set y el reinicio resulta invisible. */
const REPEATS = 4
/** Por debajo de esto una cinta en movimiento se ve pobre: se deja estática. */
const MIN_TO_ANIMATE = 6
/** Y por debajo de esto no da para dos filas. */
const MIN_FOR_TWO_ROWS = 12
const TOUCH_HOLD = 6000

/** Las destacadas primero, manteniendo el orden del dato dentro de cada grupo. */
function featuredFirst(list) {
  return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
}

function buildRows(list, sector) {
  // "Todos": el sector público arriba, el resto abajo, como pidió la clienta.
  if (!sector) {
    return [
      featuredFirst(list.filter((client) => client.sector === 'publico')),
      featuredFirst(list.filter((client) => client.sector !== 'publico')),
    ]
  }

  const ordered = featuredFirst(list)
  if (ordered.length < MIN_FOR_TWO_ROWS) return [ordered]

  const half = Math.ceil(ordered.length / 2)
  return [ordered.slice(0, half), ordered.slice(half)]
}

function Organization({ client }) {
  const Icon = ICONS[client.icon] ?? Building2

  return (
    <li
      className={`org${client.featured ? ' org--featured' : ''}`}
      title={client.name}
    >
      {client.logo ? (
        <img className="org__logo" src={client.logo} alt="" loading="lazy" />
      ) : (
        <Icon className="org__icon" size={18} strokeWidth={1.6} aria-hidden="true" />
      )}
      <span>{client.shortName}</span>
    </li>
  )
}

function Rail({ items, reverse, animated }) {
  const [held, setHeld] = useState(false)
  const timer = useRef(null)

  // En táctil no hay hover: al tocar la cinta se detiene unos segundos.
  const holdBriefly = () => {
    setHeld(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHeld(false), TOUCH_HOLD)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  if (items.length === 0) return null

  if (!animated) {
    return (
      <div className="rail rail--static">
        <ul className="rail__set">
          {items.map((client) => (
            <Organization key={client.id} client={client} />
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div
      className={`rail${reverse ? ' rail--reverse' : ''}${held ? ' is-held' : ''}`}
      onTouchStart={holdBriefly}
    >
      <div className="rail__track">
        {Array.from({ length: REPEATS }, (_, set) => (
          <ul
            className="rail__set"
            key={set}
            /* Solo el primer set se anuncia; el resto son copias visuales. */
            aria-hidden={set > 0 ? 'true' : undefined}
          >
            {items.map((client) => (
              <Organization key={client.id} client={client} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default function Clients() {
  const [sector, setSector] = useState(null)

  const filtered = sector ? clients.filter((client) => client.sector === sector) : clients
  const rows = buildRows(filtered, sector)

  return (
    <section className="section orgs" id="confianza">
      <div className="container orgs__head">
        <h2 className="orgs__title">Experiencia en espacios que exigen confianza</h2>
        <p className="orgs__text">
          Sector público, salud, energía, comercio y organizaciones privadas.
        </p>

        {/* Cifras derivadas del propio dato: no pueden desincronizarse. */}
        <p className="orgs__stats">
          <span>{clientStats.organizations} organizaciones</span>
          <span>{businessConfig.yearsExperience} años</span>
          <span>{clientStats.sectors} sectores</span>
          <span>{businessConfig.serviceArea}</span>
        </p>

        <div className="orgs__filters" role="group" aria-label="Filtrar por sector">
          {clientSectors.map((option) => (
            <button
              key={option.id ?? 'todos'}
              type="button"
              className="orgs__filter"
              aria-pressed={sector === option.id}
              onClick={() => setSector(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="orgs__rails">
        {rows.map((row, index) => (
          <Rail
            /* Al cambiar de filtro se remonta la cinta y la animación
               vuelve a empezar limpia. */
            key={`${sector ?? 'todos'}-${index}`}
            items={row}
            reverse={index === 1}
            animated={row.length >= MIN_TO_ANIMATE}
          />
        ))}
      </div>

      <p className="container orgs__note">
        Organizaciones con las que hemos trabajado.
      </p>

      {/* No se renderiza hasta que haya certificaciones reales en trust.js. */}
      {certifications.length > 0 && (
        <ul className="container orgs__certs">
          {certifications.map((certification) => (
            <li key={certification.id}>
              <strong>{certification.name}</strong>
              <span>
                {[certification.issuer, certification.year].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
