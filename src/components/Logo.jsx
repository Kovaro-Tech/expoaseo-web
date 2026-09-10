import { useState } from 'react'
import { businessMedia } from '../config/business'
import './Logo.css'

/**
 * Carga /public/logo.png cuando exista.
 * Mientras tanto muestra un wordmark tipográfico provisional
 * (NO es el logo de la empresa, es solo un placeholder).
 */
export default function Logo({ variant = 'default' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(businessMedia.logo) && !imageFailed

  return (
    <span className={`logo logo--${variant}`}>
      {showImage ? (
        <img
          className="logo__img"
          src={businessMedia.logo}
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
