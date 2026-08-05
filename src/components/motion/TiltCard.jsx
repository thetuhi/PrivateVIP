import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'

// ─────────────────────────────────────────────────────────────────────────────
// TiltCard
//
// Floating depth. The card rotates a couple of degrees toward the pointer and
// lifts slightly, and any child marked `data-depth` shifts further than the card
// itself, so the contents sit at different distances and the whole thing reads
// as a physical object rather than a rectangle being skewed.
//
// Deliberately restrained: 4.5° maximum. Past about 8° the perspective distorts
// type and the card starts to look like a toy. Aman, not arcade.
//
// Rotation is applied to a child transform layer, never to the element that
// owns the shadow or the border, so nothing has to re-rasterise mid-tilt.
// ─────────────────────────────────────────────────────────────────────────────

export default function TiltCard({
  children,
  as: Tag = 'div',
  /** Maximum rotation in degrees on each axis. */
  max = 4.5,
  /** Pixels the card lifts toward the viewer on hover. */
  lift = 10,
  className = '',
  ...rest
}) {
  const hostRef = useRef(null)
  const { fine, reduced } = useMotion()

  useGSAP(
    () => {
      const host = hostRef.current
      if (!host || !fine || reduced) return

      const plane = host.querySelector('[data-tilt-plane]')
      if (!plane) return
      const depthLayers = plane.querySelectorAll('[data-depth]')

      // Built on entry, dropped on exit. The release tweens below use
      // `overwrite: 'auto'`, which kills every other tween touching the same
      // properties, quickTo's included; calling one afterwards makes GSAP warn
      // "rotationX not eligible for reset" because there is no PropTween left
      // to retarget. Rebuilding per hover keeps a dead tween from ever being
      // called, and the motion is identical.
      //
      // The depth layers get quickTo as well. They were allocating two fresh
      // tweens per layer per mousemove, which at 120Hz across a grid of cards
      // is thousands of objects a second for an effect that reuses two.
      let setters = null

      const buildSetters = () => {
        setters = {
          rotX: gsap.quickTo(plane, 'rotationX', { duration: 0.6, ease: EASE.precise }),
          rotY: gsap.quickTo(plane, 'rotationY', { duration: 0.6, ease: EASE.precise }),
          layers: [...depthLayers].map((layer) => ({
            depth: parseFloat(layer.dataset.depth) || 0,
            x: gsap.quickTo(layer, 'x', { duration: 0.7, ease: EASE.precise }),
            y: gsap.quickTo(layer, 'y', { duration: 0.7, ease: EASE.precise }),
          })),
        }
      }

      const onMove = (e) => {
        if (!setters) buildSetters()
        const rect = host.getBoundingClientRect()
        // Normalised to −0.5…0.5 from the centre.
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5

        setters.rotY(px * max * 2)
        setters.rotX(-py * max * 2)
        setters.layers.forEach((l) => {
          l.x(px * l.depth * 26)
          l.y(py * l.depth * 26)
        })
      }

      const onEnter = () => {
        buildSetters()
        gsap.to(plane, { z: lift, duration: 0.5, ease: EASE.luxe, overwrite: 'auto' })
      }

      const onLeave = () => {
        setters = null
        gsap.to(plane, { rotationX: 0, rotationY: 0, z: 0, duration: 0.85, ease: EASE.luxe, overwrite: 'auto' })
        depthLayers.forEach((layer) =>
          gsap.to(layer, { x: 0, y: 0, duration: 0.85, ease: EASE.luxe, overwrite: 'auto' }),
        )
      }

      host.addEventListener('mousemove', onMove)
      host.addEventListener('mouseenter', onEnter)
      host.addEventListener('mouseleave', onLeave)

      return () => {
        host.removeEventListener('mousemove', onMove)
        host.removeEventListener('mouseenter', onEnter)
        host.removeEventListener('mouseleave', onLeave)
        gsap.set(plane, { clearProps: 'transform' })
      }
    },
    { scope: hostRef, dependencies: [fine, reduced, max, lift] },
  )

  return (
    <Tag ref={hostRef} className={className} style={{ perspective: 1100 }} {...rest}>
      <div data-tilt-plane className="h-full [transform-style:preserve-3d]">
        {children}
      </div>
    </Tag>
  )
}
