import { useMemo, useSyncExternalStore } from 'react'

export const DESKTOP = '(min-width: 768px)'
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Lee una media query de forma síncrona, así que el primer render ya conoce
 * el resultado: el hero no llega a pedir el vídeo equivocado y el carrusel
 * no arranca una animación que habría que cancelar.
 */
export function useMediaQuery(query) {
  const list = useMemo(() => window.matchMedia(query), [query])

  return useSyncExternalStore(
    (onChange) => {
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => list.matches,
  )
}
