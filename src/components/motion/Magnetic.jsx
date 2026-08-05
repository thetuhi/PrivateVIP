import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic
//
// The control leans toward the pointer while the pointer is over it, and springs
// back when it leaves. Applied to primary CTAs only, a page where everything is
// magnetic feels unstable, and the effect stops meaning "this is the thing to
// press".
//
// Renders the element itself via `as` rather than cloning a child, so there is
// no wrapper in the DOM to disturb flex and grid layout, and no ambiguity about
// whether the child forwards a ref:
//
//   <Magnetic as={Link} to="/plan" className="btn-primary">Plan your journey</Magnetic>
//
// The listener is bound to the element, not to window. A global mousemove
// handler multiplied across every button on a page is exactly the kind of quiet
// cost that turns a 60fps site into a 45fps one.
// ─────────────────────────────────────────────────────────────────────────────

export default function Magnetic({
  as: Tag = 'button',
  children,
  /** Fraction of the pointer offset the element travels. Past ~0.4 it detaches. */
  strength = 0.28,
  ...rest
}) {
  const ref = useRef(null)
  const { fine, reduced } = useMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !fine || reduced) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: EASE.precise })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: EASE.precise })

      const onMove = (e) => {
        const rect = el.getBoundingClientRect()
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
      }

      // Slower return than approach, with a little elasticity: the element is
      // being released, not pushed back.
      const onLeave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })

      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)

      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
        gsap.set(el, { x: 0, y: 0 })
      }
    },
    { dependencies: [fine, reduced, strength] },
  )

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
