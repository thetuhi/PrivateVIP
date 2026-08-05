import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlaneLanding, UserRoundCheck, BadgeEuro, Baby, Users, Briefcase, ArrowRight } from 'lucide-react'

import SmartImage from '../components/SmartImage'
import SectionHeading from '../components/SectionHeading'
import PrimaryCta from '../components/PrimaryCta'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { vehicles, transferRates, transferPromises } from '../data/fleet'
import { localise, formatPrice } from '../utils/localise'
import { useSeo } from '../utils/useSeo'
import { fadeUp, cardIn } from '../motion/presets'
import MessageChannels from '../components/MessageChannels'

const PROMISE_ICONS = {
  'flight-tracked': PlaneLanding,
  'meet-greet': UserRoundCheck,
  'fixed-price': BadgeEuro,
  'child-seats': Baby,
}

/**
 * Rate list, rendered twice from one data source:
 *
 *  - Below md, as stacked blocks. A five-column price table on a 375px screen
 *    either overflows or shrinks the type below readable size; stacking keeps
 *    every figure legible and avoids horizontal scroll entirely.
 *  - At md and above, as a real <table> with scope'd headers, which is what
 *    the data actually is and what a screen reader navigates best.
 */
function RateTable() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const classes = [
    { key: 'saloon', label: t('fleet.tableSaloon') },
    { key: 'van', label: t('fleet.tableVan') },
    { key: 'sprinter', label: t('fleet.tableSprinter') },
  ]

  return (
    <>
      {/* Mobile */}
      <ul className="mt-10 flex flex-col gap-4 md:hidden">
        {transferRates.map((rate) => (
          <li key={rate.id} className="card p-5">
            <p className="font-display text-xl leading-snug text-bone">{localise(rate.from, lang)}</p>
            <p className="mt-0.5 text-sm text-bone-dim">{localise(rate.to, lang)}</p>
            <p className="mt-1 text-xs text-bone-muted">{localise(rate.duration, lang)}</p>

            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-700 pt-4">
              {classes.map(({ key, label }) => (
                <div key={key}>
                  <dt className="text-xs text-bone-muted">{label}</dt>
                  <dd className="mt-0.5 font-display text-xl tabular-nums text-brass-400">
                    {formatPrice(rate[key], 'EUR', lang)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="mt-10 hidden md:block">
        <table className="w-full border-collapse text-left">
          {/* A caption gives screen reader users the gist before they navigate
          the cells. Visually hidden, the section heading already says it. */}
          <caption className="sr-only">{t('fleet.tableSummary')}</caption>
          <thead>
            <tr className="border-b border-ink-600">
              <th scope="col" className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-bone-muted">
                {t('fleet.tableRoute')}
              </th>
              <th scope="col" className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-bone-muted">
                {t('fleet.tableDuration')}
              </th>
              {classes.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="py-4 pr-6 text-right text-xs uppercase tracking-[0.16em] text-bone-muted last:pr-0"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transferRates.map((rate) => (
              <tr key={rate.id} className="border-b border-ink-800 transition-colors duration-micro ease-enter hover:bg-ink-900">
                <th scope="row" className="py-5 pr-6 font-normal">
                  <span className="block font-display text-lg text-bone">{localise(rate.from, lang)}</span>
                  <span className="mt-0.5 block text-sm font-light text-bone-dim">{localise(rate.to, lang)}</span>
                </th>
                <td className="py-5 pr-6 text-sm tabular-nums text-bone-muted">{localise(rate.duration, lang)}</td>
                {classes.map(({ key }) => (
                  <td key={key} className="py-5 pr-6 text-right font-display text-xl tabular-nums text-brass-400 last:pr-0">
                    {formatPrice(rate[key], 'EUR', lang)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-prose text-sm text-bone-muted">{t('fleet.ratesNote')}</p>
    </>
  )
}

export default function Fleet() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  useSeo({
    title: t('fleet.metaTitle'),
    description: t('fleet.lede'),
  })

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('fleet.eyebrow')}
            title={t('fleet.title')}
            lede={t('fleet.lede')}
            size="xl"
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* Promises */}
      <section className="section border-t border-ink-800 bg-ink-900 pt-16">
        <div className="shell">
          <h2 className="eyebrow">{t('fleet.promisesTitle')}</h2>

          <RevealGroup as="ul" className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {transferPromises.map((promise) => {
              const Icon = PROMISE_ICONS[promise.id]
              return (
                <RevealItem as="li" key={promise.id} variant={fadeUp}>
                  <Icon className="h-6 w-6 text-brass-500" strokeWidth={1.25} aria-hidden="true" />
                  <h3 className="mt-5 font-display text-2xl leading-tight text-bone">{localise(promise.title, lang)}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-bone-dim">{localise(promise.body, lang)}</p>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Rates */}
      <section className="section border-t border-ink-800">
        <div className="shell">
          <SectionHeading eyebrow={t('fleet.ratesEyebrow')} title={t('fleet.ratesTitle')} />
          <Reveal>
            <RateTable />
          </Reveal>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section border-t border-ink-800 bg-ink-900">
        <div className="shell">
          <SectionHeading eyebrow={t('fleet.vehiclesEyebrow')} title={t('fleet.vehiclesTitle')} />

          <RevealGroup as="ul" className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => {
              const name = localise(vehicle.name, lang)
              return (
                <RevealItem as="li" key={vehicle.slug} variant={cardIn} className="flex flex-col">
                  <SmartImage
                    src={`/images/fleet/${vehicle.coverImage}`}
                    alt={name}
                    aspect="aspect-[4/3]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                    className="rounded-card"
                  />

                  <p className="eyebrow mt-5">{localise(vehicle.tier, lang)}</p>
                  <h3 className="mt-2 font-display text-xl leading-tight text-bone">{name}</h3>

                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-bone-muted">
                    <li className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      {t('fleet.passengers', { count: vehicle.passengers })}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      {t('fleet.luggage', { count: vehicle.luggage })}
                    </li>
                  </ul>

                  <p className="mt-3 text-sm font-light leading-relaxed text-bone-dim">{localise(vehicle.body, lang)}</p>
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
            <h2 className="text-display-md text-balance text-bone">{t('fleet.ctaTitle')}</h2>
            <p className="prose-body mt-4">{t('fleet.ctaBody')}</p>
          </Reveal>
          <Reveal className="shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCta to="/plan">{t('nav.bespoke')}</PrimaryCta>
              <MessageChannels location="fleet_cta" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
