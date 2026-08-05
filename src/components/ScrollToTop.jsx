import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useMotion } from '../motion/motionContext'

/**
 * Restores the scroll behaviour a single-page app breaks.
 *
 *  - Forward navigation starts at the top of the new page.
 *  - Browser back/forward (POP) is left alone, so the browser's own scroll
 *    restoration returns you to where you were in the list you came from.
 *  - Hash links are left alone so `scroll-margin-top` can clear the header.
 *
 * With the transition curtain active, this runs while the panels are closed,
 * so the reset is invisible. Lenis has to be reset explicitly alongside the
 * window: it keeps its own scroll position, and leaving that stale makes the
 * next wheel event jump back to the previous page's offset.
 *
 * It also moves focus to <main>, which is what tells a screen reader the page
 * changed, without it, focus stays on the link you just left.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const { lenis } = useMotion()

  useEffect(() => {
    if (hash) return
    if (navigationType === 'POP') return

    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash, navigationType, lenis])

  return null
}
