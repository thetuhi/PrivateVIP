import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Users, ArrowUpRight } from 'lucide-react'
import SmartImage from './SmartImage'
import TiltCard from './motion/TiltCard'
import { RevealItem } from './Reveal'
import { localise } from '../utils/localise'
import { cardIn } from '../motion/presets'

/**
 * Catalog card.
 *
 * The whole card is one link wrapping the whole card. One tab stop, the title
 * as the accessible name, and a click anywhere — picture included — navigates.
 *
 * It used to be a stretched pseudo-element (`after:absolute after:inset-0`) on
 * a link around the title only. That is the usual pattern and it was wrong
 * here: an absolutely positioned box resolves `inset-0` against the nearest
 * *transformed* ancestor, not the nearest positioned one, and TiltCard writes
 * a transform onto the [data-depth] layer this card's text sits in. The moment
 * the pointer armed the tilt, the overlay collapsed from the full 297x541 card
 * onto the 160x29 title. The picture — two thirds of the card — went dead and
 * showed an arrow while the title showed a hand, so a single card handed out
 * two different cursors. A real element cannot be shrunk that way.
 *
 * Hover choreography, all transform/opacity, all on the same 900ms curve so the
 * parts read as one gesture rather than four:
 *
 *   · image scales up behind a fixed frame
 *   · the scrim deepens, holding the picture down as it brightens
 *   · a brass rule wipes across beneath the title
 *   · the corner disc fills and the arrow steps out
 *   · the card itself tilts a degree or two toward the pointer
 */
export default function ExperienceCard({ experience, priority = false, sizes, as = 'article' }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const title = localise(experience.title, lang)
  const src = `/images/experiences/${experience.slug}/${experience.coverImage}`

  return (
  // `as="li"` inside a <ul> grid keeps list semantics intact, wrapping the
    // card in an extra li with `display: contents` strips them in Safari.
    <RevealItem as={as} variant={cardIn} className="group relative flex flex-col">
      <TiltCard max={3} lift={12} className="flex h-full flex-col">
        {/* aria-label rather than letting the name be computed: the link now
            contains the summary and the meta row, and without this a screen
            reader reads the entire card as the link's name. The label is the
            visible title, so the name still contains the visible label. */}
        <Link
          to={`/experiences/${experience.slug}`}
          aria-label={title}
          className="flex h-full flex-col"
        >
          <div className="overflow-hidden rounded-card">
            <SmartImage
              src={src}
              alt=""
              aspect="aspect-[4/5]"
              priority={priority}
              sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 92vw'}
              imgClassName="transition-transform duration-[900ms] ease-enter group-hover:scale-[1.08] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div
                className="pointer-events-none absolute inset-0 scrim-b opacity-90 transition-opacity duration-[900ms] ease-enter group-hover:opacity-100"
                aria-hidden="true"
              />

              {/* Affordance. Bottom-aligned, out of the title's way. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end p-5">
                <span
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-brass-500/40 text-brass-400 transition-colors duration-base ease-enter group-hover:border-brass-500 group-hover:text-ink-950"
                  aria-hidden="true"
                >
                  {/* Fill grows from the centre rather than the background colour
                  swapping, the disc reads as filling, not as switching. */}
                  <span className="absolute h-9 w-9 scale-0 rounded-full bg-brass-500 transition-transform duration-base ease-enter group-hover:scale-100" />
                  <ArrowUpRight
                    className="relative h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </SmartImage>
          </div>

          <div className="flex flex-1 flex-col pt-5" data-depth="0.4">
            <h3 className="font-display text-2xl leading-tight text-bone transition-colors duration-base ease-enter group-hover:text-brass-300">
              {title}
            </h3>

            {/* Underline wipes in from the left on hover. scaleX only. */}
            <span
              aria-hidden="true"
              className="mt-2.5 block h-px w-full origin-left scale-x-0 bg-brass-600/70 transition-transform duration-[700ms] ease-enter group-hover:scale-x-100 motion-reduce:transition-none"
            />

            <p className="mt-2.5 line-clamp-3 text-sm font-light leading-relaxed text-bone-dim">
              {localise(experience.summary, lang)}
            </p>

            {/* Meta row. Icons are decorative; the text carries the meaning. */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-bone-muted">
              <li className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {t('common.hours', { count: experience.durationHours })}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {t('common.upToGuests', { count: experience.maxGuests })}
              </li>
            </ul>
          </div>
        </Link>
      </TiltCard>
    </RevealItem>
  )
}
