import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'
import SmartImage from '../SmartImage'

// ─────────────────────────────────────────────────────────────────────────────
// ScrollImage
//
// Two effects on one element, both scroll-driven:
//
// 1. Reveal, a clip-path wipes the frame open once, as it enters. The image
//      inside starts slightly over-scaled and settles to 1, so the picture
//      appears to relax into its frame rather than to slide in.
//
// 2. Parallax, the image drifts against the page for the whole time it is on
//      screen, giving the section depth.
//
// The parallax is applied to the <img>, never to the frame, and the frame keeps
// `overflow: hidden`. That is what makes it look like a window onto something
// behind the page instead of a picture sliding around.
//
// The over-scale is what buys the parallax its travel: an image at scale 1 that
// drifts 12% would expose its own edge. Scale and drift are tied together below
// so that can never happen.
//
// The two effects are driven by different mechanisms, deliberately:
//
//   the wipe   → IntersectionObserver
//   the drift  → ScrollTrigger
//
// because they fail differently. The wipe starts with the frame clipped shut,
// so if whatever opens it never runs, the photograph is simply gone. The drift
// failing means an image that does not drift, which nobody notices.
//
// ScrollTrigger resolves "top 98%" against positions it cached at refresh time,
// and this site suppresses its resize handling (ignoreMobileResize, set in
// motion/gsap.js, so a phone hiding its URL bar does not re-pin mid-scroll).
// On a long page that reflows after those positions were taken, a trigger can
// end up waiting for a scroll offset that no longer corresponds to the element,
// and never fire. That is survivable for a drift and not survivable for the
// only picture of the boat, which is exactly what went wrong on phones, where
// the rows stack and the page is three times taller.
//
// IntersectionObserver has no cached geometry to go stale: the browser answers
// from current layout, and it reports the initial state on observe, so a frame
// that is already on screen opens on the next frame rather than waiting for a
// scroll that may never come.
// ─────────────────────────────────────────────────────────────────────────────

export default function ScrollImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  fill = false,
  priority = false,
  sizes,
  className = '',
  imgClassName = '',
  /** Parallax travel as a percentage of image height. 0 disables it. */
  parallax = 12,
  /** Direction of the opening wipe. */
  reveal = 'up',
  children,
  ...rest
}) {
  const frameRef = useRef(null)
  const { reduced } = useMotion()

  useGSAP(
    () => {
      const frame = frameRef.current
      if (!frame) return
      const img = frame.querySelector('img')

      // Reduced motion keeps the composition and drops the movement: the frame
      // is simply open, the image simply present.
      if (reduced) {
        gsap.set(frame, { clipPath: 'inset(0%)' })
        if (img) gsap.set(img, { scale: 1, yPercent: 0 })
        return
      }

      const closed = {
        up: 'inset(100% 0% 0% 0%)',
        down: 'inset(0% 0% 100% 0%)',
        left: 'inset(0% 100% 0% 0%)',
        right: 'inset(0% 0% 0% 100%)',
      }[reveal]

      // Starts wider than the frame and settles, but never below the scale the
      // parallax needs, or the drift would reveal an edge.
      const restScale = 1 + parallax / 100

      const tl = gsap.timeline({ paused: true })
      tl.fromTo(frame, { clipPath: closed }, { clipPath: 'inset(0%)', duration: 1.15, ease: EASE.veil })
      if (img) {
        tl.fromTo(img, { scale: restScale + 0.14 }, { scale: restScale, duration: 1.5, ease: EASE.luxe }, 0)
      }

      let observer

      // No IntersectionObserver: show the picture. An entrance is a courtesy,
      // never a precondition for the content existing.
      if (typeof IntersectionObserver === 'undefined') {
        tl.progress(1)
      } else {
        // A positive bottom margin, so the wipe begins ~220px before the frame
        // enters and is finished by the time it is looked at.
        //
        // This was -2%, i.e. 2% *later* than the frame touching the bottom
        // edge, on the reasoning that a 1.15s wipe would still complete in
        // time. That holds at desktop scroll speeds and does not hold on a
        // phone: a fling covers a viewport faster than the wipe runs, so the
        // frame was arriving mid-clip and reading as an empty box. A clipped
        // frame is indistinguishable from a missing photograph, which is the
        // one thing this component must never look like.
        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[entries.length - 1]

            // Two ways to deserve opening, not one.
            //
            // The obvious one is intersecting. The other is having been passed:
            // a fling scroll on a phone, or a tab that was backgrounded and
            // throttled, can carry a frame from below the fold to above it
            // between two observer callbacks. Reacting only to `isIntersecting`
            // means that frame is never once reported visible, so it keeps the
            // clip it was born with and the boat is never seen at all. A
            // negative `top` says it is behind us; there is nothing left to
            // animate, so it is simply opened.
            if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return

            // Snap rather than wipe for anything already scrolled past, so
            // scrolling back up does not meet an animation replaying at content
            // that was on screen a moment ago.
            if (entry.isIntersecting) tl.play()
            else tl.progress(1)

            // Only ever disconnected once the frame is open, so any later
            // callback still gets the chance to rescue it.
            observer.disconnect()
          },
          { rootMargin: '0px 0px 220px 0px' },
        )
        observer.observe(frame)
      }

      if (img && parallax > 0) {
        gsap.fromTo(
          img,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              // scrub ties the tween to scroll position; 0.6 adds a short
              // catch-up so it glides instead of snapping frame to frame.
              scrub: 0.6,
            },
          },
        )
      }

      // useGSAP reverts the tweens and triggers it owns; the observer is ours.
      return () => observer?.disconnect()
    },
    { scope: frameRef, dependencies: [reduced, parallax, reveal] },
  )

  return (
    <div ref={frameRef} className={fill ? 'absolute inset-0' : className} style={{ clipPath: 'inset(0%)' }}>
      <SmartImage
        src={src}
        alt={alt}
        aspect={aspect}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={fill ? '' : className}
        imgClassName={`will-change-transform ${imgClassName}`}
        {...rest}
      >
        {children}
      </SmartImage>
    </div>
  )
}
