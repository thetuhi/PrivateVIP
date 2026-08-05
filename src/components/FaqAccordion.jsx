import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { localise } from '../utils/localise'

/**
 * Accordion built on buttons with aria-expanded / aria-controls rather than
 * <details>, so the open/close can animate.
 *
 * The height animation is the one place this site animates a layout property.
 * framer-motion animates `height: auto` on a single isolated element with no
 * siblings reflowing beneath the fold, which is cheap; the alternative
 * (max-height guesswork) either clips long answers or eases at the wrong rate.
 */
function FaqItem({ item, lang }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const id = useId()

  return (
    <div className="border-b border-ink-700">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors duration-micro ease-enter hover:text-brass-300"
        >
          <span className="font-display text-xl leading-snug text-bone sm:text-2xl">
            {localise(item.q, lang)}
          </span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-600 text-brass-500 transition-transform duration-base ease-enter ${
              open ? 'rotate-45' : 'rotate-0'
            }`}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="prose-body pb-6 pr-12">{localise(item.a, lang)}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqAccordion({ groups }) {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  return (
    <div className="flex flex-col gap-14">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`faq-${group.id}`}>
          <h2 id={`faq-${group.id}`} className="eyebrow mb-5">
            {localise(group.title, lang)}
          </h2>
          <div className="border-t border-ink-700">
            {group.items.map((item) => (
              <FaqItem key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
