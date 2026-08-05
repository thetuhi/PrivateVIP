import { m, useReducedMotion } from 'framer-motion'
import { fadeUp, stagger, stillVariant, viewportOnce } from '../motion/presets'

/**
 * Scroll-triggered entrance wrapper.
 *
 * Everything that animates on scroll goes through this component, which means
 * `prefers-reduced-motion` is handled in exactly one place: when it is set,
 * the variant is flattened to a short opacity fade with no movement.
 *
 * Uses `whileInView` with `once: true`, content never re-animates on scroll
 * back, which is distracting and makes long pages feel unstable.
 */
export default function Reveal({
  children,
  as = 'div',
  variant = fadeUp,
  delay = 0,
  className,
  ...rest
}) {
  const reduced = useReducedMotion()
  const active = reduced ? stillVariant(variant) : variant
  const MotionTag = m[as] ?? m.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={active}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Staggered container. Children must be <RevealItem> (or any element with
 * `variants` set) for the stagger to reach them.
 */
export function RevealGroup({ children, as = 'div', each = 0.06, delay = 0, className, ...rest }) {
  const reduced = useReducedMotion()
  const MotionTag = m[as] ?? m.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      // Reduced motion still staggers, just faster and without movement, the
      // sequence carries meaning (these things are a list), the travel does not.
      variants={stagger(reduced ? 0.02 : each, delay)}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ children, as = 'div', variant = fadeUp, className, ...rest }) {
  const reduced = useReducedMotion()
  const MotionTag = m[as] ?? m.div

  return (
    <MotionTag className={className} variants={reduced ? stillVariant(variant) : variant} {...rest}>
      {children}
    </MotionTag>
  )
}
