import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { getPolicy } from '../content/policies'
import { localise, formatDate } from '../utils/localise'
import { useSeo } from '../utils/useSeo'
import { fadeUp } from '../motion/presets'

export default function PolicyPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const policy = getPolicy(slug)
  const title = policy ? localise(policy.title, lang) : ''
  const intro = policy ? localise(policy.intro, lang) : ''

  useSeo({ title, description: intro })

  if (!policy) return <Navigate to="/" replace />

  return (
    <section className="section pt-36 lg:pt-44">
      {/* Narrower than the site shell: legal prose wants a 68ch measure, and
          the standard 86rem container would run it to 140 characters a line. */}
      <div className="mx-auto w-full max-w-3xl px-gutter">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-bone-dim transition-colors duration-micro ease-enter hover:text-brass-400"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t('policy.backHome')}
        </Link>

        <Reveal className="mt-6">
          <h1 className="text-display-lg text-balance text-bone">{title}</h1>
          <p className="mt-3 text-sm text-bone-muted">
            {t('policy.updated', { date: formatDate(policy.updated, lang) })}
          </p>
          <p className="lede mt-7">{intro}</p>
        </Reveal>

        <RevealGroup as="div" className="mt-14 flex flex-col gap-11">
          {policy.sections.map((section, index) => (
            <RevealItem as="section" key={index} variant={fadeUp}>
              <h2 className="font-display text-2xl leading-snug text-bone">{localise(section.h, lang)}</h2>
              <p className="mt-4 text-base font-light leading-relaxed text-bone-dim">{localise(section.p, lang)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
