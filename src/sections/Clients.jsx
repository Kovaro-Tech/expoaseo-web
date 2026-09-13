import { pillars } from '../data/content'
import { certifications, clients } from '../data/trust'
import './Clients.css'

export default function Clients() {
  return (
    <section className="section clients" id="confianza">
      <div className="container">
        {clients.length > 0 && (
          <div className="clients__block">
            <h2 className="clients__title">
              Instituciones y organizaciones con las que hemos trabajado
            </h2>

            <ul className="clients__list">
              {clients.map((client) => (
                <li key={client.id}>
                  {client.logo ? (
                    <img src={client.logo} alt={client.name} loading="lazy" />
                  ) : (
                    <span>{client.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="clients__block">
            <h3 className="clients__subtitle">Certificaciones</h3>
            <ul className="clients__certs">
              {certifications.map((certification) => (
                <li key={certification.id}>
                  <span className="clients__cert-name">{certification.name}</span>
                  <span className="clients__cert-meta">
                    {[certification.issuer, certification.year]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="clients__how" id="por-que">
          <div className="clients__how-intro">
            <p className="label">Cómo trabajamos</p>
            <h3 className="clients__how-title">
              La limpieza también puede sentirse profesional.
            </h3>
          </div>

          <ol className="clients__pillars">
            {pillars.map((pillar, index) => (
              <li key={pillar.id}>
                <span className="clients__pillar-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="clients__pillar-name">{pillar.title}</h4>
                  <p className="clients__pillar-text">{pillar.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
