import { useEffect, useRef, useState } from 'react'
import { workVideos } from '../data/workVideos'
import { DESKTOP, REDUCED_MOTION, useMediaQuery } from '../lib/useMediaQuery'
import './WorkInAction.css'

const AUTO_ADVANCE_MS = 5500
const ACTIVE_VISIBILITY = 0.68
const wrapIndex = (index) => (index + workVideos.length) % workVideos.length

export default function WorkInAction() {
  const isDesktop = useMediaQuery(DESKTOP)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const [activeIndex, setActiveIndex] = useState(1)
  const [visibleMobileIndex, setVisibleMobileIndex] = useState(null)
  const videoRef = useRef(null)
  const cardRefs = useRef(new Map())

  const visibleItems = isDesktop
    ? [-1, 0, 1].map((offset) => wrapIndex(activeIndex + offset))
    : workVideos.map((_, index) => index)

  useEffect(() => {
    if (!isDesktop || reducedMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => wrapIndex(current + 1))
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [isDesktop, reducedMotion])

  useEffect(() => {
    if (isDesktop || reducedMotion || !('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(
          (entry) => entry.isIntersecting && entry.intersectionRatio >= ACTIVE_VISIBILITY,
        )

        if (visibleEntry) {
          const index = Number(visibleEntry.target.dataset.videoIndex)
          setActiveIndex(index)
          setVisibleMobileIndex(index)
          return
        }

        setVisibleMobileIndex((current) => {
          const currentCard = cardRefs.current.get(current)
          return entries.some((entry) => entry.target === currentCard) ? null : current
        })
      },
      { threshold: [ACTIVE_VISIBILITY] },
    )

    cardRefs.current.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [isDesktop, reducedMotion])

  const activeVideoIndex = isDesktop ? activeIndex : visibleMobileIndex

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return undefined

    video.play().catch(() => {})
    return () => video.pause()
  }, [activeVideoIndex, reducedMotion])

  return (
    <section className="section action" aria-labelledby="action-title">
      <div className="container">
        <header className="action__header">
          <p className="label">Trabajo en movimiento</p>
          <h2 id="action-title">EXPOASEO en acción</h2>
          <p>Una mirada al trabajo diario de nuestro equipo.</p>
        </header>

        <div className="action__rail" aria-label="Videos de trabajo real">
          {visibleItems.map((index) => {
            const item = workVideos[index]
            const isActive = index === activeVideoIndex
            const shouldRenderVideo = isActive && !reducedMotion

            return (
              <article
                className={`action__card${isActive ? ' is-active' : ''}`}
                data-video-index={index}
                key={item.id}
                ref={(element) => {
                  if (element) cardRefs.current.set(index, element)
                  else cardRefs.current.delete(index)
                }}
                onClick={() => {
                  setActiveIndex(index)
                  if (!isDesktop) setVisibleMobileIndex(index)
                }}
              >
                <div className="action__media">
                  {shouldRenderVideo ? (
                    <video
                      key={item.id}
                      ref={videoRef}
                      src={item.src}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={item.title}
                    />
                  ) : (
                    <img src={item.poster} alt="" loading="lazy" decoding="async" />
                  )}
                </div>
                <div className="action__copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
