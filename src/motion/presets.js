// Shared motion vocabulary.
//
// Two rules govern everything here:
// 1. Transform and opacity only. Never width, height, top or left, those
//      trigger layout and drop frames on a mid-range phone.
//   2. Distances stay small (12–24px). Long travel reads as a slideshow and
//      makes reduced-motion users queasy; short travel reads as intent.
//
// Durations and easings mirror the CSS custom properties in index.css so a
// framer-motion transition and a Tailwind `transition-*` class feel identical.

export const EASE_ENTER = [0.16, 1, 0.3, 1] // expo.out
export const EASE_EXIT = [0.7, 0, 0.84, 0] // expo.in

export const DUR = {
  micro: 0.18,
  base: 0.28,
  slow: 0.52,
}

/** Standard section entrance: rise and fade. */
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_ENTER },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_ENTER } },
}

/** Horizontal reveal used for pull-quotes and the hero rule. */
export const wipeRight = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_ENTER },
  },
}

/**
 * Parent for staggered lists. 60ms between children is the sweet spot: fast
 * enough that a six-card grid finishes in under half a second, slow enough to
 * read as a sequence rather than a flicker.
 */
export const stagger = (each = 0.06, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: each, delayChildren: delay },
  },
})

/** Card entrance. Scale is deliberately subtle, 0.97, not 0.9. */
export const cardIn = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.slow, ease: EASE_ENTER },
  },
}

/**
 * Route transitions. The exit is ~60% of the enter duration so navigation
 * feels responsive rather than gated behind an animation.
 */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_ENTER } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: EASE_EXIT } },
}

/** Overlay scrim for the mobile menu and the lightbox. */
export const scrim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DUR.base, ease: EASE_ENTER } },
  exit: { opacity: 0, transition: { duration: DUR.micro, ease: EASE_EXIT } },
}

/** Mobile drawer: slides from the edge it is anchored to. */
export const drawer = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.36, ease: EASE_ENTER } },
  exit: { x: '100%', transition: { duration: 0.24, ease: EASE_EXIT } },
}

/** Modal/lightbox: grows very slightly from its trigger's plane. */
export const modalIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE_ENTER } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: DUR.micro, ease: EASE_EXIT } },
}

/**
 * Flattens any variant set to opacity-only. Applied by <Reveal> when the OS
 * asks for reduced motion, content still arrives with a soft fade, which
 * preserves the sense of sequence without any spatial movement.
 */
export function stillVariant(variant) {
  return {
    hidden: { opacity: variant.hidden?.opacity ?? 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'linear' } },
  }
}

/** Shared viewport config: fire once, slightly before the element is centred. */
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -80px 0px' }

/**
 * For blocks taller than a comfortable fraction of the viewport: yacht rows,
 * stacked feature panels.
 *
 * `amount: 0.2` asks for a fifth of the element to be on screen, which on a
 * 650px row is 130px of scrolling after it first appears, and the positive
 * bottom margin below turns that into a head start instead. The element begins
 * revealing 200px before it enters, so by the time it is actually looked at the
 * animation has already resolved rather than starting under the reader.
 */
export const viewportEarly = { once: true, amount: 0.01, margin: '0px 0px 200px 0px' }
