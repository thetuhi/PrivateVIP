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

      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 86%', once: true },
      })

      tl.fromTo(
        frame,
        { clipPath: closed },
        { clipPath: 'inset(0%)', duration: 1.15, ease: EASE.veil },
      )

      if (img) {
      // Starts wider than the frame and settles, but never below the scale
        // the parallax needs, or the drift would reveal an edge.
        const restScale = 1 + parallax / 100
        tl.fromTo(
          img,
          { scale: restScale + 0.14 },
          { scale: restScale, duration: 1.5, ease: EASE.luxe },
          0,
        )

        if (parallax > 0) {
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
      }
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
