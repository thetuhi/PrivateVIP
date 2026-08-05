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

      const rotX = gsap.quickTo(plane, 'rotationX', { duration: 0.6, ease: EASE.precise })
      const rotY = gsap.quickTo(plane, 'rotationY', { duration: 0.6, ease: EASE.precise })

      const onMove = (e) => {
        const rect = host.getBoundingClientRect()
        // Normalised to −0.5…0.5 from the centre.
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5

        rotY(px * max * 2)
        rotX(-py * max * 2)

        depthLayers.forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth) || 0
          gsap.to(layer, {
            x: px * depth * 26,
            y: py * depth * 26,
            duration: 0.7,
            ease: EASE.precise,
            overwrite: 'auto',
          })
        })
      }

      const onEnter = () => gsap.to(plane, { z: lift, duration: 0.5, ease: EASE.luxe, overwrite: 'auto' })

      const onLeave = () => {
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
