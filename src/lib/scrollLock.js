let locks = 0
let restore

// Shared by menu and portal: transferring between them never unlocks the body.
export function lockScroll() {
  if (locks++ === 0) {
    const body = document.body
    const previous = body.style.cssText
    const x = window.scrollX
    const y = window.scrollY
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = `-${x}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (gap) body.style.paddingRight = `${gap}px`
    restore = () => {
      body.style.cssText = previous
      const html = document.documentElement
      const behavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo(x, y)
      html.style.scrollBehavior = behavior
    }
  }
  return () => {
    if (--locks === 0) restore()
  }
}
