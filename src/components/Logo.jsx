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
  const compact = businessMedia.logoCompactWidth
  const compactSrc = src?.replace(/\.png$/, `-${compact}.webp`)

  return (
    <span className={`logo logo--${variant}`}>
      {showImage ? (
        <img
          className="logo__img"
          src={compactSrc}
          srcSet={`${compactSrc} ${compact}w, ${src} 2259w`}
          sizes="(min-width: 768px) 145px, 107px"
          alt="EXPOASEO — Servicios Generales Cía. Ltda."
          width="2259"
          height="719"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="logo__wordmark" role="img" aria-label="EXPOASEO">
          <span className="logo__dot" aria-hidden="true" />
          <span aria-hidden="true">
            EXPO<span className="logo__accent">ASEO</span>
          </span>
        </span>
      )}
    </span>
  )
}
