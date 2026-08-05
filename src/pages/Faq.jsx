import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

import SectionHeading from '../components/SectionHeading'
import FaqAccordion from '../components/FaqAccordion'
import Reveal from '../components/Reveal'
import { faqGroups } from '../content/faq'
import { faqJsonLd } from '../utils/faqJsonLd'
import { useSeo } from '../utils/useSeo'
import MessageChannels from '../components/MessageChannels'

export default function Faq() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  // Structured data is generated from the same array the accordion renders, so
  // the rich result and the page can never drift apart.
  const jsonLd = useMemo(() => faqJsonLd(faqGroups, lang), [lang])

  useSeo({
    title: t('faq.metaTitle'),
    description: t('faq.lede'),
    jsonLd,
  })

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('faq.eyebrow')}
            title={t('faq.title')}
            lede={t('faq.lede')}
            size="xl"
            className="max-w-3xl"
          />

          <Reveal className="mt-16 max-w-3xl">
            <FaqAccordion groups={faqGroups} />
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-ink-800 bg-ink-900">
        <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="text-display-md text-balance text-bone">{t('faq.stillTitle')}</h2>
            <p className="prose-body mt-4">{t('faq.stillBody')}</p>
          </Reveal>
          <Reveal className="shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <MessageChannels location="faq_cta" variant="primary" />
              <Link to="/plan" className="btn-secondary">
                {t('nav.bespoke')}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
