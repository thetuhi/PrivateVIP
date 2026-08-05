import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BadgeCheck, ShieldCheck, Languages, UserRoundX, ArrowRight } from 'lucide-react'

import SmartImage from '../components/SmartImage'
import SectionHeading from '../components/SectionHeading'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { brand } from '../config/brand'
import { useSeo } from '../utils/useSeo'
import { fadeUp } from '../motion/presets'
import MessageChannels from '../components/MessageChannels'

const CREDENTIAL_ICONS = {
  licensed: BadgeCheck,
  insured: ShieldCheck,
  englishGuides: Languages,
  noSharedGroups: UserRoundX,
}

export default function About() {
  const { t } = useTranslation()

  useSeo({
    title: t('about.metaTitle'),
    description: t('about.lede'),
    image: '/images/about/office.webp',
  })

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('about.eyebrow')}
            title={t('about.title')}
            lede={t('about.lede')}
            size="xl"
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* Story + portrait */}
      <section className="pb-section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SmartImage
              src="/images/about/office.webp"
              alt={t('about.title')}
              aspect="aspect-[4/5]"
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="rounded-card"
            />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2 className="text-display-sm text-bone">{t('about.storyTitle')}</h2>
            </Reveal>
            <RevealGroup as="div" className="mt-6 flex flex-col gap-5">
              {['storyBody1', 'storyBody2', 'storyBody3'].map((key) => (
                <RevealItem as="p" key={key} variant={fadeUp} className="prose-body">
                  {t(`about.${key}`)}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section border-t border-ink-800 bg-ink-900">
        <div className="shell">
          <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.credentialsTitle')} />

          <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {brand.credentials.map(({ key }) => {
              const Icon = CREDENTIAL_ICONS[key]
              return (
                <RevealItem as="li" key={key} variant={fadeUp} className="flex gap-5">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-brass-500" strokeWidth={1.25} aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-bone">{t(`about.${key}`)}</h3>
                    <p className="mt-2.5 max-w-prose text-sm font-light leading-relaxed text-bone-dim">
                      {t(`about.${key}Body`, { number: brand.tursabNumber })}
                    </p>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="section border-t border-ink-800">
        <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="text-display-md text-balance text-bone">{t('about.ctaTitle')}</h2>
            <p className="prose-body mt-4">{t('about.ctaBody')}</p>
          </Reveal>
          <Reveal className="shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary">
                {t('nav.contact')}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
              <MessageChannels location="about_cta" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
