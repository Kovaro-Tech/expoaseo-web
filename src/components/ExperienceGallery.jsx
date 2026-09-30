import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { trajectoryPhotos } from '../data/trajectoryPhotos'
import { REDUCED_MOTION, useMediaQuery } from '../lib/useMediaQuery'

export default function ExperienceGallery({ count, copy }) {
  const railRef = useRef(null)
  const drag = useRef(null)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const [dragging, setDragging] = useState(false)
  const [edges, setEdges] = useState({ start: true, end: false })

  useEffect(() => {
    const rail = railRef.current
    const updateEdges = () => setEdges({
      start: rail.scrollLeft <= 2,
      end: rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2,
    })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(rail)
    rail.addEventListener('scroll', updateEdges, { passive: true })
    updateEdges()
    return () => {
      observer.disconnect()
      rail.removeEventListener('scroll', updateEdges)
    }
  }, [])

  function move(direction) {
    const rail = railRef.current
    const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft
    rail.scrollBy({ left: direction * step, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function finishDrag(event) {
    if (drag.current?.id !== event.pointerId) return
    drag.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className="exp__archive">
      <div className="exp__intro">
        {count}
        {copy}
      </div>
      <p className="sr-only" id="trajectory-instructions">
        Desliza o arrastra para explorar las fotografías. Con el teclado, usa las flechas izquierda y derecha, Inicio o Fin.
      </p>
      <div
        ref={railRef}
        id="trajectory-photos"
        className={`exp__rail${dragging ? ' is-dragging' : ''}`}
        role="region"
        aria-label="Fotografías de trabajos de EXPOASEO"
        aria-describedby="trajectory-instructions"
        tabIndex={0}
        onPointerDown={(event) => {
          // El gesto táctil y el touchpad conservan el scroll nativo.
          if (event.pointerType !== 'mouse' || event.button !== 0) return
          const rail = event.currentTarget
          rail.focus({ preventScroll: true })
          rail.scrollTo({ left: rail.scrollLeft, behavior: 'instant' })
          drag.current = { id: event.pointerId, x: event.clientX, left: rail.scrollLeft }
          rail.setPointerCapture(event.pointerId)
          setDragging(true)
          event.preventDefault()
        }}
        onPointerMove={(event) => {
          if (drag.current?.id !== event.pointerId) return
          event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            event.currentTarget.scrollTo({
              left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
              behavior: reducedMotion ? 'instant' : 'smooth',
            })
          }
        }}
      >
        {trajectoryPhotos.map((photo) => (
          <figure className="exp__photo" key={photo.id}>
            <img
              className="exp__image"
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ objectPosition: photo.objectPosition || 'center' }}
            />
          </figure>
        ))}
      </div>
      <div className="exp__controls" role="group" aria-label="Navegación de fotografías">
        <button type="button" aria-label="Fotografía anterior" aria-controls="trajectory-photos" disabled={edges.start} onClick={() => move(-1)}>
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Fotografía siguiente" aria-controls="trajectory-photos" disabled={edges.end} onClick={() => move(1)}>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
