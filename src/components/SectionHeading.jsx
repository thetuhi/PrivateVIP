import Reveal from './Reveal'
import SplitReveal from './motion/SplitReveal'
import { fadeUp, wipeRight } from '../motion/presets'

/**
 * The page's one heading pattern: eyebrow, rule, title, optional lede.
 * Used everywhere so vertical rhythm and type hierarchy never drift.
 *
 * The title is line-split and masked; the eyebrow and lede use the simpler
 * whole-element reveal. Splitting everything would flatten the hierarchy,
 * when every element performs, nothing is emphasised. The title is the thing
 * that should feel uncovered; its supporting text should simply arrive.
 *
 * `as` controls the heading level so pages keep a legal h1 → h2 → h3 order
 * without the visual size being tied to the semantics.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = 'h2',
  align = 'left',
  size = 'lg',
  className = '',
  children,
}) {
  const sizeClass = {
    xl: 'text-display-lg',
    lg: 'text-display-md',
    md: 'text-display-sm',
  }[size]

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <Reveal as="div" variant={fadeUp} className="flex items-center gap-3">
          <span className="eyebrow">{eyebrow}</span>
          {/* Hairline that draws itself in. Pure scaleX, no layout cost. */}
          <Reveal
            as="span"
            variant={wipeRight}
            aria-hidden="true"
            className="block h-px w-10 origin-left bg-brass-600"
          />
        </Reveal>
      )}

      <SplitReveal as={Tag} stagger={0.075} className={`mt-4 ${sizeClass} text-balance text-bone`}>
        {title}
      </SplitReveal>

      {lede && (
        <Reveal as="div" className="mt-5">
          <p className={`lede ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>
        </Reveal>
      )}

      {children}
    </div>
  )
}
