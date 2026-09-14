import { useState } from 'react'
import { businessMedia } from '../config/business'
import './Logo.css'

/**
 * `variant="light"` usa la versión blanca del logo, para el hero y el footer.
 * Ambas van sobre transparencia: nunca se monta sobre una placa de color.
 */
export default function Logo({ variant = 'default' }) {
  const [imageFailed, setImageFailed] = useState(false)

  const src = variant === 'light' ? businessMedia.logo.onDark : businessMedia.logo.onLight
  const showImage = Boolean(src) && !imageFailed

  return (
    <span className={`logo logo--${variant}`}>
      {showImage ? (
        <img
          className="logo__img"
          src={src}
          alt="EXPOASEO — Servicios Generales Cía. Ltda."
          width="2259"
          height="719"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="logo__wordmark" aria-label="EXPOASEO">
          <span className="logo__dot" aria-hidden="true" />
          <span aria-hidden="true">
            EXPO<span className="logo__accent">ASEO</span>
          </span>
        </span>
      )}
    </span>
  )
}
