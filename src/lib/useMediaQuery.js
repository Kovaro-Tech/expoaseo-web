import { useMemo, useSyncExternalStore } from 'react'

export const DESKTOP = '(min-width: 768px)'
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const SLOW_CONNECTIONS = new Set(['slow-2g', '2g'])

/**
 * Respeta las preferencias de datos del navegador antes de crear el elemento
 * de vídeo. Así no hay ninguna solicitud de media que cancelar después.
 */
export function usePosterOnlyForConnection() {
  return useSyncExternalStore(
    (onChange) => {
      const connection = navigator.connection

      if (!connection?.addEventListener) return () => {}

      connection.addEventListener('change', onChange)
      return () => connection.removeEventListener('change', onChange)
    },
    () => {
      const connection = navigator.connection
      return Boolean(
        connection?.saveData || SLOW_CONNECTIONS.has(connection?.effectiveType),
      )
    },
    () => true,
  )
}

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
