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

/**
 * Shared viewport config: fire once, with a head start.
 *
 * ⚠ `amount` must stay 'some'. Never put a fraction here.
 *
 * A fraction is measured against the *element*, not the viewport, and
 * RevealGroup wraps an entire grid whose height is not a constant: the
 * three-column deck that is ~540px tall on a desktop stacks into ~4500px on a
 * phone. So a fraction does not merely fire late on a phone, past a certain
 * height it can never fire at all. This was `amount: 0.2`, which asked for 20%
 * of the element on screen; on the eight-card /experiences grid that is 900px,
 * inside a ~700px viewport, a condition no amount of scrolling can satisfy.
 * Children inherit `visible` from the stagger parent, so the entire grid stayed
 * at opacity 0 permanently: every photograph on the page simply absent. It
 * looked fine inside a single category only because one or two cards are short
 * enough for 20% to still be reachable, which is what made it read as "the
 * photos need coaxing" rather than as a hard bug.
 *
 * 'some' means "any part of it is intersecting", which is the condition actually
 * wanted here and the only one that means the same thing at every breakpoint and
 * every content length.
 *
 * `margin` is a positive bottom inset, growing the detection box downward, so
 * the entrance begins ~140px before the element enters and has resolved by the
 * time it is looked at. It used to be -80px, which shrank the box and delayed
 * the trigger, stacking a second delay on top of the impossible threshold.
 *
 * A soft 520ms fade-up firing slightly early is invisible. Firing late, or never,
 * is the only failure mode a visitor actually notices.
 */
export const viewportOnce = { once: true, amount: 'some', margin: '0px 0px 140px 0px' }

/**
 * For blocks taller than the viewport: yacht rows, stacked feature panels.
 *
 * Same 'some' rule as above, and for these it is not optional, these blocks are
 * taller than the viewport by definition, so any fraction would be unsatisfiable
 * for exactly the elements this preset exists to serve. The larger 200px margin
 * gives the taller block a correspondingly longer head start.
 */
export const viewportEarly = { once: true, amount: 'some', margin: '0px 0px 200px 0px' }
