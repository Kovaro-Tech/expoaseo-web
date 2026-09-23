import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { workVideos } from '../data/workVideos'
import { REDUCED_MOTION, useMediaQuery } from '../lib/useMediaQuery'
import './WorkInAction.css'

const HOVER_POINTER = '(hover: hover) and (pointer: fine)'
const INTENT_DELAY = 180

export default function WorkInAction() {
  const hoverPointer = useMediaQuery(HOVER_POINTER)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const automaticIntent = hoverPointer && !reducedMotion
  const [activeVideoId, setActiveVideoId] = useState(null)
  const [playingId, setPlayingId] = useState(null)
  const [failedId, setFailedId] = useState(null)
  const videos = useRef(new Map())
  // Synchronous ownership prevents stale canplay/play callbacks from starting
  // a previous selection before React has committed the next render.
  const activeRef = useRef(null)
  const intent = useRef(null)
  const generation = useRef(0)

  const cancelIntent = useCallback(() => {
    window.clearTimeout(intent.current)
    intent.current = null
  }, [])

  const stop = useCallback(() => {
    cancelIntent()
    generation.current += 1
    activeRef.current = null
    videos.current.forEach((video) => {
      video.pause()
      if (video.readyState > 0) video.currentTime = 0
    })
    setActiveVideoId(null)
    setPlayingId(null)
  }, [cancelIntent])

  const playReady = useCallback((id, video) => {
    if (activeRef.current !== id || video.readyState < 3) return
    const attempt = generation.current
    video.play().catch(() => {
      // Switching cards may reject an older pending play(); ignore it.
      if (activeRef.current === id && attempt === generation.current) {
        stop()
        setFailedId(id)
      }
    })
  }, [stop])

  const activate = useCallback((item) => {
    if (activeRef.current === item.id) return
    stop()
    const video = videos.current.get(item.id)
    if (!video) return
    activeRef.current = item.id
    setActiveVideoId(item.id)
    setFailedId(null)
    if (!video.getAttribute('src') || video.error) {
      video.src = item.src
      video.load()
    }
    playReady(item.id, video)
  }, [playReady, stop])

  useEffect(() => {
    // Scrolling never starts playback. Stop only when the active card leaves
    // view, so focus scrolling and tiny wheel movements cannot cancel intent.
    const onScroll = () => {
      const video = videos.current.get(activeRef.current)
      if (!video) return
      const rect = video.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) stop()
    }
    const onVisibility = () => { if (document.hidden) stop() }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [automaticIntent, stop])

  const leave = (id) => {
    cancelIntent()
    if (activeRef.current === id) stop()
  }

  return (
    <section className="section action" aria-labelledby="action-title">
      <div className="container">
        <header className="action__header">
          <p className="label">Trabajo en movimiento</p>
          <h2 id="action-title">EXPOASEO en acción</h2>
          <p>Una mirada al trabajo diario de nuestro equipo.</p>
        </header>
        <div className="action__rail" aria-label="Videos de trabajo real" onScroll={() => {
          // A mobile rail gesture pauses playback; desktop focus scrolling
          // must not cancel a pending hover or keyboard activation.
          if (!automaticIntent) stop()
        }}>
          {workVideos.map((item) => (
            <article className="action__card" key={item.id}>
              <button
                className={`action__media${playingId === item.id ? ' is-playing' : ''}`}
                type="button"
                aria-label={`${activeVideoId === item.id ? 'Pausar' : 'Reproducir'}: ${item.title}`}
                aria-pressed={activeVideoId === item.id}
                onPointerEnter={(event) => {
                  if (!automaticIntent || event.pointerType !== 'mouse') return
                  cancelIntent()
                  intent.current = window.setTimeout(() => activate(item), INTENT_DELAY)
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') leave(item.id)
                }}
                onFocus={(event) => {
                  if (automaticIntent && event.currentTarget.matches(':focus-visible')) activate(item)
                }}
                onBlur={() => leave(item.id)}
                onClick={(event) => {
                  // Clicking after hover confirms playback instead of stopping
                  // the video the user just asked to watch.
                  if (automaticIntent && event.nativeEvent.pointerType !== 'touch') {
                    activate(item)
                    return
                  }
                  if (activeRef.current === item.id) stop()
                  else activate(item)
                }}
              >
                <video
                  ref={(node) => {
                    if (node) videos.current.set(item.id, node)
                    else videos.current.delete(item.id)
                  }}
                  preload="none"
                  muted
                  playsInline
                  loop
                  tabIndex={-1}
                  aria-hidden="true"
                  onCanPlay={(event) => playReady(item.id, event.currentTarget)}
                  onPlaying={(event) => {
                    if (activeRef.current === item.id) setPlayingId(item.id)
                    else {
                      event.currentTarget.pause()
                      event.currentTarget.currentTime = 0
                    }
                  }}
                  onError={() => {
                    if (activeRef.current === item.id) {
                      stop()
                      setFailedId(item.id)
                    }
                  }}
                />
                <img className="action__poster" src={item.poster} alt="" loading="lazy" decoding="async" />
                <span className="action__play" aria-hidden="true">
                  <Play size={25} fill="currentColor" />
                </span>
              </button>
              <div className="action__copy">
                <h3>{item.title}</h3>
                <p title={item.description}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="action__status" role="status">
          {failedId ? 'No se pudo reproducir el video. Pulsa la tarjeta para intentarlo de nuevo.' : ''}
        </p>
      </div>
    </section>
  )
}
