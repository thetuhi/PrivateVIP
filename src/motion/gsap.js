import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

// ─────────────────────────────────────────────────────────────────────────────
// GSAP registration and the house easing vocabulary.
//
// Registered once, at module scope, so no component has to think about it.
// Everything on this site pulls its easing from EASE below, a single curve
// vocabulary is most of what separates "animated" from "designed".
// ─────────────────────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger, CustomEase)

// Signature curves.
//
// luxe, the house curve. Long, decisive tail; nothing bounces. This is
//             the Aman register: it arrives, it settles, it does not perform.
// precise. Porsche register. Fast off the mark, mechanical, no overshoot.
//             Used for anything that answers a pointer directly.
// veil, for masks and curtains. Slow start so a wipe reads as a
//             material moving, not an opacity fade pretending to be one.
CustomEase.create('luxe', '0.16, 1, 0.3, 1')
CustomEase.create('precise', '0.33, 1, 0.45, 1')
CustomEase.create('veil', '0.76, 0, 0.24, 1')

export const EASE = {
  luxe: 'luxe',
  precise: 'precise',
  veil: 'veil',
  out: 'power3.out',
  inOut: 'power2.inOut',
}

// Durations, in seconds. Mirrors the CSS custom properties in index.css so a
// GSAP tween and a Tailwind transition on the same element agree.
export const DUR = {
  micro: 0.18,
  base: 0.28,
  slow: 0.52,
  reveal: 0.9,
  curtain: 1.1,
}

// Default tween settings applied globally. Anything that does not opt out
// inherits the house curve.
gsap.defaults({ ease: EASE.luxe, duration: DUR.slow })

// lagSmoothing(0) keeps GSAP's clock locked to the Lenis RAF loop. Without it,
// a long task makes GSAP "catch up" in one jump and the scroll position and the
// animation position disagree for a frame, visible as a tear on pinned
// sections.
gsap.ticker.lagSmoothing(0)

// ScrollTrigger recalculates on resize by default, but mobile browsers fire
// resize when the URL bar hides, which re-pins mid-scroll and looks broken.
// Ignoring resize on touch unless the width actually changed fixes it.
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * True when the visitor has asked for reduced motion. Read at call time rather
 * than cached, so a change in OS settings takes effect on the next navigation.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True for mouse/trackpad pointers. Gates the cursor, magnetics and tilt. */
export function hasFinePointer() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: fine)').matches
}

export { gsap, ScrollTrigger }
