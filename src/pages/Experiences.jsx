import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

import SectionHeading from '../components/SectionHeading'
import ExperienceCard from '../components/ExperienceCard'
import Reveal, { RevealGroup } from '../components/Reveal'
import { CATEGORIES, experiencesByCategory } from '../data/experiences'
import { localise } from '../utils/localise'
import { useSeo } from '../utils/useSeo'

export default function Experiences() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  // The filter lives in the URL, not in component state, so a filtered view is
  // shareable, survives a refresh, and the browser back button steps through
  // filter changes the way a visitor expects.
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('type') ?? 'all'
  const results = experiencesByCategory(active)

  useSeo({
    title: t('experiences.metaTitle'),
    description: t('experiences.lede'),
  })

  function selectCategory(id) {
    if (id === 'all') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ type: id }, { replace: true })
    }
  }

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('experiences.eyebrow')}
            title={t('experiences.title')}
            lede={t('experiences.lede')}
            size="xl"
            className="max-w-3xl"
          />

          {/* Filter. Real buttons in a group, not a select, three to six
              options are faster to scan than they are to open. */}
          <Reveal className="mt-12">
            <div role="group" aria-label={t('experiences.filterLabel')} className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const selected = category.id === active
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-11 cursor-pointer items-center rounded-card border px-5 text-sm transition-colors duration-micro ease-enter ${
                      selected
                        ? 'border-brass-500 bg-brass-500 font-medium text-ink-950'
                        : 'border-ink-600 text-bone-dim hover:border-brass-700 hover:text-bone'
                    }`}
                  >
                    {localise(category.label, lang)}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* Announced politely so screen reader users hear the result count
              change without the focus being yanked away from the filter. */}
          <p aria-live="polite" className="mt-6 text-sm text-bone-muted">
            {t('experiences.resultsCount', { count: results.length })}
          </p>

          {results.length > 0 ? (
            <RevealGroup
              as="ul"
              // Re-keying on the filter replays the stagger, so a filter change
              // reads as new content arriving rather than as a silent swap.
              key={active}
              className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((experience, index) => (
                <ExperienceCard
                  key={experience.slug}
                  as="li"
                  experience={experience}
                  priority={index < 3}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                />
              ))}
            </RevealGroup>
          ) : (
            <Reveal className="mt-16 border-t border-ink-700 pt-16">
              <h2 className="font-display text-3xl text-bone">{t('experiences.emptyTitle')}</h2>
              <p className="prose-body mt-4">{t('experiences.emptyBody')}</p>
              <Link to="/plan" className="btn-primary mt-8">
                {t('experiences.emptyCta')}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
