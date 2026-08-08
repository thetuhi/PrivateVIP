import { useEffect } from 'react'
import { useMotion } from '../../motion/motionContext'
import { getLenisInstance } from '../../motion/lenisStore'

// ─────────────────────────────────────────────────────────────────────────────
// LoadingScreen
//
// Controller only. It renders nothing.
//
// The curtain itself — markup, styling and entrance — lives in index.html, so it
// paints with the first frame instead of waiting for this bundle. See the long
// note beside it there for why. This component owns the three things the
// document cannot do for itself: when the curtain leaves, releasing scroll, and
// telling the hero to start.
//
// The rules that keep an entrance from becoming a toll gate:
//
//   · Once per session. Enforced in two places, the inline script in index.html
//     (so nothing is painted) and MotionProvider (so the hero knows). Both read
//     the same sessionStorage key.
//   · It leaves on a wall clock measured from navigation start, not from React
//     mount. This is the important one, see REVEAL_AT_MS.
//   · Skipped entirely under reduced motion, by CSS in the document.
//   · Any deliberate input starts the exit immediately.
//   · Scroll is locked while it is up and released the instant it starts to
//     part, so the page can never be scrolled behind a curtain.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * When the curtain starts to leave, in ms since navigation start.
 *
 * Measured from navigation start rather than from mount, which is what makes
 * the intro cost a fixed amount of the visitor's time instead of an amount that
 * grows with how slow their connection is. Under the old arrangement the two
 * costs stacked: bundle time, and then a full timeline on top of it, so the
 * worse the connection the longer the entrance. Now they overlap. A cold load
 * that reaches this code at 1.3s has already shown the visitor 1.3s of curtain,
 * so there is nothing left to hold for and it leaves at once.
 *
 * 900ms is set by the CSS entrance, which settles at ~820ms (the eyebrow starts
 * at 580 and runs 240). Below that the curtain would be cut off mid-gesture;
 * far above it and the visitor is watching a logo instead of reading the offer.
 */
const REVEAL_AT_MS = 900

/** Panel travel, matching the transition on #intro-top/#intro-bottom (560 + 80 delay). */
const EXIT_MS = 640

export default function LoadingScreen() {
  const { introRunning, completeIntro } = useMotion()

  useEffect(() => {
    const intro = document.getElementById('intro')

    // Nothing to drive. Either this is a second page load in the session, or
    // reduced motion is on, or a previous run already removed the node. In the
    // reduced-motion case the document has hidden it but not removed it, so
    // take it out to be sure nothing is left in front of the page.
    if (!intro) return undefined
    if (!introRunning) {
      intro.remove()
      return undefined
    }

    let exitTimer
    let removeTimer

    // Lock scroll for the duration: Lenis and the native scrollbar both.
    //
    // Lenis is read from the store at call time rather than taken as a
    // dependency. Child effects run before parent effects, so on mount this
    // component runs before MotionProvider has created the instance; making it
    // a dependency would re-run this effect the moment Lenis appeared, and
    // restart the intro mid-play.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getLenisInstance()?.stop()

    const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart']

    const leave = () => {
      // The visual start happens once. StrictMode runs this effect twice in
      // development, and several skip listeners can fire in the same gesture;
      // re-adding the class would restart the CSS transition mid-flight.
      if (!intro.classList.contains('is-leaving')) {
        intro.classList.add('is-leaving')

        // Handed over as the panels begin moving, not after they finish, so the
        // hero's own entrance is already under way when the curtain opens on it
        // rather than starting from a static frame once it has gone.
        document.body.style.overflow = prevOverflow
        getLenisInstance()?.start()
        completeIntro()
      }

      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, leave))

      // Removal is (re)scheduled unconditionally, outside the guard above. A
      // StrictMode remount cancels the previous timer in cleanup, and if this
      // were inside the guard the second pass would take the early exit and
      // nobody would ever be left to take the node out of the document.
      window.clearTimeout(removeTimer)
      removeTimer = window.setTimeout(() => intro.remove(), EXIT_MS)
    }

    // Escapable. Any deliberate input leaves at once rather than accelerating a
    // timeline, because by the time this code runs the visitor has already been
    // looking at the curtain for as long as the bundle took, and someone who
    // has decided to get on with it should never be held by decoration.
    //
    // Deliberately NOT `{ once: true }`: an impatient first tap can land before
    // React has mounted, i.e. before these listeners exist, and `once` would let
    // that tap be consumed by a listener that was not there yet.
    SKIP_EVENTS.forEach((type) => window.addEventListener(type, leave, { passive: true }))

    // performance.now() is ms since navigation start, which is the clock the
    // budget above is written against.
    exitTimer = window.setTimeout(leave, Math.max(0, REVEAL_AT_MS - performance.now()))

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, leave))
      // Scroll is never left locked by an unmount, whatever stage this was at.
      document.body.style.overflow = prevOverflow
      getLenisInstance()?.start()
    }
  }, [introRunning, completeIntro])

  return null
}
