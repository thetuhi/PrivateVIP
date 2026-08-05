import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'
import { prefetchRoute } from '../../routes'

// ─────────────────────────────────────────────────────────────────────────────
// PageTransition
//
// Four ink panels sweep up to cover the viewport, the route swaps behind them,
// then they sweep off the top. The staggered edge reads as a material with
// weight rather than a fade.
//
// Navigation is intercepted by one delegated listener rather than by a custom
// Link component, so every existing <Link> in the codebase gets the treatment
// without being touched, and if this component is removed, all of them keep
// working as ordinary links.
//
// What is deliberately NOT intercepted, because breaking any of these would be
// worse than any animation is worth:
//
// · modified clicks (⌘/ctrl/shift/alt, middle button), open-in-new-tab
//   · target="_blank", download, rel="external"
//   · anything not same-origin, and mailto:/tel:/wa.me
// · pure hash links, the skip link and in-page anchors
//   · navigation to the page you are already on
// · browser back/forward, those must feel instantaneous, so they get the
//     uncover half only
// · reduced motion, no interception at all
//
// The scroll reset happens while the panels are closed, which is the real payoff:
// the jump to the top of the next page is never seen.
// ─────────────────────────────────────────────────────────────────────────────

const PANELS = 4

export default function PageTransition() {
  const navigate = useNavigate()
  const { reduced, lenis } = useMotion()
  const rootRef = useRef(null)
  const busyRef = useRef(false)


  const uncover = useCallback(() => {
    const panels = rootRef.current?.querySelectorAll('[data-panel]')
    if (!panels?.length) return

    gsap.to(panels, {
      yPercent: -100,
      duration: 0.78,
      ease: EASE.veil,
      stagger: { each: 0.055, from: 'end' },
      onComplete: () => {
        gsap.set(rootRef.current, { pointerEvents: 'none', autoAlpha: 0 })
        busyRef.current = false
        // Heights have changed with the new route; every scroll-linked
        // animation on it computed its start/end against the old document.
        ScrollTrigger.refresh()
      },
    })
  }, [])

  useEffect(() => {
    if (reduced) return undefined

    const onClick = (event) => {
      if (busyRef.current) {
        // Mid-transition: swallow the click rather than queue a second one.
        event.preventDefault()
        return
      }
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      if (anchor.getAttribute('rel')?.includes('external')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return

      let url
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      // Same page, or same page plus a hash, let the browser/router handle it.
      if (url.pathname === window.location.pathname) return

      event.preventDefault()
      busyRef.current = true

      const panels = rootRef.current?.querySelectorAll('[data-panel]')
      if (!panels?.length) {
        navigate(url.pathname + url.search)
        busyRef.current = false
        return
      }

      gsap.set(rootRef.current, { pointerEvents: 'auto', autoAlpha: 1 })
      gsap.set(panels, { yPercent: 100 })

      gsap.to(panels, {
        yPercent: 0,
        duration: 0.62,
        ease: EASE.veil,
        stagger: { each: 0.055, from: 'start' },
        onComplete: () => {
          navigate(url.pathname + url.search)

          // Reset scroll behind the curtain. Lenis must be told directly,
          // window.scrollTo alone leaves its internal position out of sync and
          // the next wheel event snaps back to where you were.
          lenis?.scrollTo(0, { immediate: true, force: true })
          window.scrollTo(0, 0)

          // Two frames: one for React to commit the new route, one for the
          // browser to lay it out. Uncovering earlier shows a half-built page.
          requestAnimationFrame(() => requestAnimationFrame(uncover))
        },
      })
    }

    // Speculatively warm the destination chunk. By the time the 0.62s cover
    // animation finishes, a route this size has long since arrived.
    const onIntent = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      prefetchRoute(new URL(anchor.href, window.location.href).pathname)
    }

    // Capture phase, so this runs before React Router's own handler.
    document.addEventListener('click', onClick, true)
    document.addEventListener('mouseenter', onIntent, true)
    document.addEventListener('focusin', onIntent)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('mouseenter', onIntent, true)
      document.removeEventListener('focusin', onIntent)
    }
    // `lenis` is a dependency rather than a ref: it changes at most once per
    // session (on mount, or if reduced-motion is toggled), so rebinding one
    // delegated listener is cheaper than the indirection.
  }, [navigate, reduced, uncover, lenis])

  if (reduced) return null

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[9998] flex opacity-0"
      aria-hidden="true"
    >
      {Array.from({ length: PANELS }, (_, i) => (
        <div key={i} data-panel className="h-full flex-1 bg-ink-950 will-change-transform" />
      ))}
    </div>
  )
}
