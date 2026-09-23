import { useRef, useState } from 'react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { businessConfig, businessMedia } from '../config/business'
import {
  DESKTOP,
  REDUCED_MOTION,
  useMediaQuery,
  usePosterOnlyForConnection,
} from '../lib/useMediaQuery'
import { generalUrl } from '../lib/whatsapp'
import './Hero.css'

export default function Hero() {
  const videoRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const posterOnlyForConnection = usePosterOnlyForConnection()

  /* Guardamos QUÉ fuente está reproduciéndose, no un booleano: así, al cruzar
     el breakpoint, el vídeo vuelve a ocultarse solo, sin efecto de por medio. */
  const [playingSource, setPlayingSource] = useState(null)
  const [failedSource, setFailedSource] = useState(null)

  /* Solo se monta UNA etiqueta <video> y con UNA sola fuente. El navegador
     nunca ve la otra ruta, así que no puede descargarla. */
  const source = isDesktop
    ? businessMedia.heroVideoDesktop
    : businessMedia.heroVideoMobile
  /* La sesión también cambia si se activa una preferencia de ahorro de datos:
     una futura carga nunca hereda el estado visible de un vídeo anterior. */
  const videoSession = `${source}:${isDesktop}:${reducedMotion}:${posterOnlyForConnection}`
  const showVideo =
    Boolean(source) &&
    !reducedMotion &&
    !posterOnlyForConnection &&
    failedSource !== videoSession
  const isPlaying = playingSource === videoSession

  return (
    <section className="hero" id="inicio">
      <div
        className="hero__media"
        style={{
          '--focus-desktop': businessMedia.heroVideoPositionDesktop,
          '--focus-mobile': businessMedia.heroVideoPositionMobile,
        }}
      >
        {showVideo && (
          <video
            ref={videoRef}
            key={videoSession}
            className={`hero__layer hero__video${isPlaying ? ' is-playing' : ''}`}
            src={source}
            autoPlay={!paused}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            /* 'playing', no 'canplay': si el navegador bloquea el autoplay,
               se conserva el fondo de marca sin revelar un fotograma. */
            onPlaying={() => setPlayingSource(videoSession)}
            onError={() => {
              setPlayingSource(null)
              setFailedSource(videoSession)
            }}
          />
        )}

        <div className="hero__scrim" />
      </div>

      <div className="container hero__inner">
        {/* Primer viewport deliberadamente vacío: ni cifras, ni clientes, ni
            argumentos. La autoridad la demuestra la sección siguiente. */}
        <p className="hero__eyebrow">Servicios generales profesionales</p>

        <h1 className="hero__title">
          Cuidamos los espacios donde la limpieza importa.
        </h1>

        <p className="hero__lead">
          Hogares, empresas e instituciones con {businessConfig.serviceArea.toLowerCase()}.
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
        {showVideo && (
          <button type="button" className="hero__motion" aria-pressed={paused} onClick={() => {
            const video = videoRef.current
            if (paused) {
              video?.play().then(() => setPaused(false)).catch(() => {})
            } else {
              video?.pause()
              setPaused(true)
            }
          }}>
            {paused ? 'Reanudar video de portada' : 'Pausar video de portada'}
          </button>
        )}
      </div>
    </section>
  )
}
