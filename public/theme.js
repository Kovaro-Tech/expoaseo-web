;(() => {
  let savedTheme
  try { savedTheme = localStorage.getItem('expoaseo-theme') } catch { /* Storage opcional. */ }
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0b1725' : '#0f75bc'
  // Defensa adicional si un artefacto de producción se sirve en otro host.
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hostname !== 'expoaseo.com') {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow')
      document.querySelector('link[rel="canonical"]')?.remove()
    }
  })
})()
