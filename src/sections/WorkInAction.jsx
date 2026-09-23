import { useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'
import { workVideos } from '../data/workVideos'
import './WorkInAction.css'

function VideoLightbox({ item, onClose }) {
  const videoRef = useRef(null)
  const closeRef = useRef(null)
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const video = videoRef.current
    window.addEventListener('keydown', onKeyDown)
    return () => {
      if (video) { video.pause(); video.removeAttribute('src'); video.load() }
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])
  return <div className="video-lightbox" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="video-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="video-lightbox-title">
      <button ref={closeRef} className="video-lightbox__close" type="button" onClick={onClose} aria-label="Cerrar video"><X size={22} /></button>
      <video ref={videoRef} className="video-lightbox__video" src={item.src} poster={item.poster} autoPlay muted controls playsInline preload="metadata" aria-label={item.title} />
      <div className="video-lightbox__copy"><h3 id="video-lightbox-title">{item.title}</h3><p>{item.description}</p></div>
    </div>
  </div>
}

export default function WorkInAction() {
  const [selected, setSelected] = useState(null)
  return <section className="section action" aria-labelledby="action-title">
    <div className="container">
      <header className="action__header"><p className="label">Trabajo en movimiento</p><h2 id="action-title">EXPOASEO en acción</h2><p>Una mirada al trabajo diario de nuestro equipo.</p></header>
      <div className="action__grid" aria-label="Videos de trabajo real">
        {workVideos.map((item) => <button className="action__card" type="button" key={item.id} onClick={() => setSelected(item)} aria-label={`Reproducir: ${item.title}`}>
          <img src={item.poster} alt="" loading="lazy" decoding="async" />
          <span className="action__veil" aria-hidden="true" />
          <span className="action__play" aria-hidden="true"><Play size={22} fill="currentColor" /></span>
          <span className="action__copy"><strong>{item.title}</strong><small>{item.description}</small></span>
        </button>)}
      </div>
    </div>
    {selected && <VideoLightbox item={selected} onClose={() => setSelected(null)} />}
  </section>
}
