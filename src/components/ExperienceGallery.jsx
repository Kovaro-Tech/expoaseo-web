import { useEffect, useRef, useState } from 'react'
import { trajectoryPhotos } from '../data/trajectoryPhotos'
import { DESKTOP, REDUCED_MOTION, useMediaQuery } from '../lib/useMediaQuery'

const CHANGE_INTERVAL = 12000
const SLOT_ORDER = [0, 2, 4, 1, 3]
const initialPhotos = [0, 3, 2, 7, 1].map((index) => trajectoryPhotos[index])

function Photo({ photo, previous = false, incoming = false }) {
  return (
    <img
      className={`exp__image${incoming ? ' exp__image--incoming' : ''}`}
      src={photo.src}
      alt={previous ? '' : photo.alt}
      aria-hidden={previous || undefined}
      width={photo.width}
      height={photo.height}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: photo.objectPosition }}
      onLoad={incoming ? (event) => event.currentTarget.classList.add('is-ready') : undefined}
    />
  )
}

export default function ExperienceGallery({ count, copy }) {
  const desktop = useMediaQuery(DESKTOP)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const archiveRef = useRef(null)
  const turn = useRef(0)
  const photoCursor = useRef(4)
  const [archive, setArchive] = useState({ photos: initialPhotos, previous: null })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    })
    observer.observe(archiveRef.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!desktop || reducedMotion || hovered || focused || !visible || !pageVisible) return
    let cancelled = false
    const timer = window.setTimeout(async () => {
      const slot = SLOT_ORDER[turn.current % SLOT_ORDER.length]
      const portrait = slot === 1 || slot === 2 || slot === 3
      let nextPhoto
      let nextCursor = photoCursor.current
      // Una sola sustitución. Respetar el encuadre y evitar fotos ya visibles.
      for (let i = 0; i < trajectoryPhotos.length; i += 1) {
        const candidate = trajectoryPhotos[nextCursor % trajectoryPhotos.length]
        nextCursor += 1
        if (!archive.photos.includes(candidate) && (candidate.height > candidate.width) === portrait) {
          nextPhoto = candidate
          break
        }
      }
      if (!nextPhoto) return
      try {
        const image = new Image()
        image.src = nextPhoto.src
        await image.decode()
        if (cancelled) return
        const photos = [...archive.photos]
        photos[slot] = nextPhoto
        photoCursor.current = nextCursor
        turn.current += 1
        setArchive({ photos, previous: { slot, photo: archive.photos[slot] } })
      } catch {
        // Si falla la descarga, la fotografía actual sigue visible.
      }
    }, CHANGE_INTERVAL)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [desktop, reducedMotion, hovered, focused, visible, pageVisible, archive])

  return (
    <div
      ref={archiveRef}
      className={`exp__archive ${desktop ? 'exp__mosaic' : 'exp__rail'}`}
      role="region"
      aria-label={desktop ? 'Archivo visual de trabajos de EXPOASEO' : 'Archivo visual de trabajos de EXPOASEO. Desliza para explorar.'}
      tabIndex={0}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      {desktop ? (
        <>
          <div className="exp__milestone">{count}</div>
          <div className="exp__story">{copy}</div>
          {archive.photos.map((photo, slot) => {
            const previous = archive.previous?.slot === slot && !reducedMotion ? archive.previous.photo : null
            return (
              <figure className={`exp__photo exp__photo--${slot + 1}`} key={slot}>
                {previous && <Photo key={`previous-${previous.id}`} photo={previous} previous />}
                <Photo key={photo.id} photo={photo} incoming={Boolean(previous)} />
              </figure>
            )
          })}
        </>
      ) : (
        <>
          <div className="exp__intro-card">
            {count}
            <figure className="exp__photo exp__intro-photo">
              <Photo photo={trajectoryPhotos[2]} />
            </figure>
            {copy}
          </div>
          {trajectoryPhotos.filter((_, index) => index !== 2).map((photo) => (
            <figure className="exp__photo" key={photo.id}>
              <Photo photo={photo} />
            </figure>
          ))}
        </>
      )}
    </div>
  )
}
