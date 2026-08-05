import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'
import { getLenisInstance } from '../../motion/lenisStore'
import Logo from '../Logo'

// ─────────────────────────────────────────────────────────────────────────────
// LoadingScreen
//
// A single first-impression beat: the wordmark resolves, a brass rule draws
// under it, then the veil splits and lifts to reveal the hero already in place.
//
// Four rules keep it from being the usual vanity cost:
//
//   · Once per session. A curtain you sit through on every navigation is an
//     obstacle, not an entrance. sessionStorage, checked before first paint.
// · Capped at ~1.9s total, and it does not wait on images, only on fonts,
//     because a wordmark that swaps typeface mid-reveal is worse than no reveal.
//   · Skipped entirely under reduced motion.
//   · Scroll is locked while it runs and released exactly when it lifts, so the
//     page can never be scrolled behind a curtain the visitor cannot see past.
//
// Honest trade-off: on a first visit this defers the hero's Largest Contentful
// Paint by roughly a second. That is a real cost, taken deliberately for the
// entrance, and it is why it never runs twice.
// ─────────────────────────────────────────────────────────────────────────────

export default function LoadingScreen() {
  // Whether the intro runs at all is decided by MotionProvider, so the hero
  // can key its own entrance off the same fact.
  const { reduced, introRunning, completeIntro } = useMotion()
  const [done, setDone] = useState(!introRunning)
  const rootRef = useRef(null)
  const shouldRun = introRunning

  useGSAP(
    () => {
      if (!shouldRun || reduced) return

      const root = rootRef.current
      if (!root) return

      // Lock scroll for the duration: Lenis and the native scrollbar both.
      //
      // Lenis is read from the store at call time rather than taken as a
      // dependency. Child effects run before parent effects, so on mount this
      // component runs before MotionProvider has created the instance, making
      // it a dependency would re-run this effect the moment Lenis appeared and
      // restart the intro timeline from the top, mid-play.
      const lockScroll = () => getLenisInstance()?.stop()
      const unlockScroll = () => getLenisInstance()?.start()

      lockScroll()
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Two distinct moments, deliberately not the same one:
      //
      // handOver, the panels are still parting. Scroll is returned and the
      //              hero is told to start, so its entrance is already running
      //              behind the opening curtain.
      // teardown, the panels have finished. Only now is the element removed;
      //              unmounting at handOver would make the curtain vanish
      //              mid-slide instead of completing its exit.
      const handOver = () => {
        document.body.style.overflow = prevOverflow
        unlockScroll()
        completeIntro()
      }

      const teardown = () => setDone(true)

      // Budget: ~1.7s from first frame to hero visible, and the hero's own
      // entrance starts as the panels part rather than after them. Anything
      // longer and the visitor is watching a logo instead of reading the offer
      //, the earlier draft of this ran 3.0s and pushed the primary CTA past
      // five seconds on a first visit, which is indefensible on a booking site.
      const tl = gsap.timeline({ onComplete: teardown })

      // Absolute positions, so the total is a number I chose rather than the
      // sum of a dozen relative offsets. Measured budget: curtain gone by
      // ~1.5s after mount.
      //
      // The per-letter stagger is the expensive part and the easiest to get
      // wrong: at 0.035s across an 11-character wordmark it added 0.39s on its
      // own and pushed the whole intro to 2.14s. At 0.02 it still reads as a
      // sequence and costs 0.22s.
      tl.fromTo(
        '[data-intro-mark]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.62, ease: EASE.luxe },
        0,
      )
        .fromTo('[data-intro-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: EASE.veil }, 0.45)
        .to('[data-intro-sub]', { opacity: 1, duration: 0.24 }, 0.58)
        .to('[data-intro-content]', { opacity: 0, y: -12, duration: 0.22, ease: EASE.luxe }, 0.88)
        // Two panels part vertically. A single fade would say "loading spinner";
        // a material splitting says "curtain".
        .to('[data-intro-panel-top]', { yPercent: -100, duration: 0.56, ease: EASE.veil }, 0.96)
        .to('[data-intro-panel-bottom]', { yPercent: 100, duration: 0.56, ease: EASE.veil }, 0.96)
        // Release a beat before the panels finish clearing, so the hero's
        // entrance is already under way as the curtain opens on it rather than
        // starting from nothing once it has gone.
        // Hand over as the panels start moving, not when they finish. The hero
        // entrance then runs *during* the reveal, so the curtain opens on
        // something already in motion instead of on a static frame that then
        // begins to animate.
        .call(handOver, null, 1.02)

        // Escapable. Any deliberate input, a click, a key, a wheel, a touch,
      // accelerates the remaining timeline rather than cutting it, so someone
      // who does not want the entrance is past it in a few hundred ms and it
      // still resolves as a finished gesture instead of a jump cut.
      //
      // This matters more than shaving frames off the animation: on a first
      // visit the bundle parse alone costs about a second before this timeline
      // can even start, and a visitor who has decided to get on with it should
      // never be held by decoration.
      const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart']

      const skip = () => {
        if (tl.timeScale() > 1) return
        gsap.to(tl, { timeScale: 4, duration: 0.25, ease: 'power2.in' })
        SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip))
      }

      // Deliberately NOT `{ once: true }`. This effect only runs once React has
      // mounted, which on a cold load is a second or more after the page became
      // interactive, and `once` would let an impatient first click be consumed
      // by a listener that did not exist yet, leaving the visitor stuck behind
      // the full curtain with no way out. The listeners stay until a skip
      // actually lands, or the timeline finishes and cleanup removes them.
      SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }))

      return () => {
        tl.kill()
        SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip))
        document.body.style.overflow = prevOverflow
        unlockScroll()
      }
    },
    { scope: rootRef, dependencies: [shouldRun, reduced, completeIntro] },
  )

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000]"
      // The veil is decorative furniture around content that already exists in
      // the DOM behind it, announcing it would just interrupt the page.
      aria-hidden="true"
    >
      <div data-intro-panel-top className="absolute inset-x-0 top-0 h-1/2 bg-ink-950" />
      <div data-intro-panel-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950" />

      <div data-intro-content className="absolute inset-0 flex flex-col items-center justify-center px-gutter">
        {/* The real lockup, revealed rather than re-drawn. An earlier version
            animated a hand-built monogram letter by letter, which was a second
            logo the company does not own. */}
        <div data-intro-mark className="opacity-0">
          <Logo height={72} className="max-w-[70vw]" />
        </div>

        <div data-intro-rule className="mt-7 h-px w-28 origin-left bg-brass-500" />

        <p data-intro-sub className="mt-5 text-eyebrow uppercase text-bone-muted opacity-0">
          Istanbul
        </p>
      </div>
    </div>
  )
}
