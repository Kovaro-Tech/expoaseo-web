import { useState } from 'react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessConfig, businessMedia } from '../config/business'
import { DESKTOP, REDUCED_MOTION, useMediaQuery } from '../lib/useMediaQuery'
import { generalUrl } from '../lib/whatsapp'
import './Hero.css'

export default function Hero() {
  const isDesktop = useMediaQuery(DESKTOP)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)

  /* Guardamos QUÉ fuente está reproduciéndose, no un booleano: así, al cruzar
     el breakpoint, el vídeo vuelve a ocultarse solo, sin efecto de por medio. */
  const [playingSource, setPlayingSource] = useState(null)

  /* Solo se monta UNA etiqueta <video> y con UNA sola fuente. El navegador
     nunca ve la otra ruta, así que no puede descargarla. */
  const source = isDesktop
    ? businessMedia.heroVideoDesktop
    : businessMedia.heroVideoMobile
  const showVideo = Boolean(source) && !reducedMotion
  const poster =
    (!isDesktop && businessMedia.heroPosterMobile) || businessMedia.heroPoster
  const isPlaying = playingSource === source

  return (
    <section className="hero" id="inicio">
      <div
        className="hero__media"
        style={{
          '--focus-desktop': businessMedia.heroVideoPositionDesktop,
          '--focus-mobile': businessMedia.heroVideoPositionMobile,
        }}
      >
        {/* Siempre presente y por debajo del vídeo: nunca se ve fondo negro,
            ni mientras carga, ni si el autoplay está bloqueado, ni si falla. */}
        {poster && (
          <img
            className="hero__layer hero__poster"
            src={poster}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        )}

        {showVideo && (
          <video
            key={source}
            className={`hero__layer hero__video${isPlaying ? ' is-playing' : ''}`}
            src={source}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            /* 'playing', no 'canplay': si el navegador bloquea el autoplay
               el vídeo no aparece y se queda el póster. */
            onPlaying={() => setPlayingSource(source)}
            onError={() => setPlayingSource(null)}
          />
        )}

        <div className="hero__scrim" />
      </div>

      <div className="container hero__inner">
        {/* Primer viewport deliberadamente vacío: ni cifras, ni clientes, ni
            argumentos. La autoridad la demuestra la sección siguiente. */}
        <p className="hero__eyebrow">Servicios profesionales de limpieza</p>

        <h1 className="hero__title">
          Cuidamos los espacios donde la limpieza importa.
        </h1>

        <p className="hero__lead">
          Hogares, empresas e instituciones en {businessConfig.serviceArea}.
        </p>

        <a
          className="btn btn--whatsapp btn--lg hero__cta"
          href={generalUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={20} />
          Solicitar cotización
        </a>
      </div>
    </section>
  )
}
