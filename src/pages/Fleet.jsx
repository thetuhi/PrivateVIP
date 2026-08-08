import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlaneLanding, UserRoundCheck, Baby, Users, Briefcase, Expand } from 'lucide-react'

import SmartImage from '../components/SmartImage'
import SectionHeading from '../components/SectionHeading'
import PrimaryCta from '../components/PrimaryCta'
import Lightbox from '../components/Lightbox'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { vehicles, transferPromises } from '../data/fleet'
import { localise } from '../utils/localise'
import { useSeo } from '../utils/useSeo'
import { fadeUp, cardIn } from '../motion/presets'
import MessageChannels from '../components/MessageChannels'

const PROMISE_ICONS = {
  'flight-tracked': PlaneLanding,
  'meet-greet': UserRoundCheck,
  'child-seats': Baby,
}

export default function Fleet() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'
  const [gallery, setGallery] = useState({ images: [], index: null, alt: '' })

  useSeo({
    title: t('fleet.metaTitle'),
    description: t('fleet.lede'),
  })

  // Same contract as the yacht gallery: `index: null` is closed, so the images
  // stay in state through the exit animation instead of vanishing mid-fade.
  //
  // Fleet photography sits flat in /images/fleet rather than in a per-slug
  // folder the way experiences and yachts do, so the filenames are joined
  // directly. Worth noting before anyone copies this line.
  function openGallery(vehicle) {
    setGallery({
      images: vehicle.images.map((file) => `/images/fleet/${file}`),
      index: 0,
      alt: localise(vehicle.name, lang),
    })
  }

  const closeGallery = () => setGallery((g) => ({ ...g, index: null }))

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

          {/* Three across, not four: the fourth promise was the pricing one.
              At lg:grid-cols-4 three items leave a quarter of the row empty
              and the band reads as a missing card. */}
          <RevealGroup as="ul" className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Vehicles */}
      <section className="section border-t border-ink-800">
        <div className="shell">
          <SectionHeading eyebrow={t('fleet.vehiclesEyebrow')} title={t('fleet.vehiclesTitle')} />

          <RevealGroup as="ul" className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => {
              const name = localise(vehicle.name, lang)
              return (
                <RevealItem as="li" key={vehicle.slug} variant={cardIn} className="flex flex-col">
                  {/* The photograph is the control. Pressing a vehicle used to do
                      nothing at all, which is the worst answer a card can give:
                      it looks like a link, so it gets tapped, and nothing
                      happens. Every vehicle has an interior shot that was sitting
                      in the data and appearing nowhere, so the press now opens
                      it. */}
                  <button
                    type="button"
                    onClick={() => openGallery(vehicle)}
                    aria-label={`${t('a11y.openGallery')}, ${name}`}
                    className="group relative block w-full cursor-pointer overflow-hidden rounded-card"
                  >
                    <SmartImage
                      src={`/images/fleet/${vehicle.coverImage}`}
                      alt={name}
                      aspect="aspect-[4/3]"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                      imgClassName="transition-transform duration-[900ms] ease-enter group-hover:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
                    />

                    {/* Always visible, not hover-only. A hover-revealed
                        affordance tells a phone nothing, and a phone is where
                        this was reported: there is no hover state to discover it
                        with, so the badge has to be there before the tap. It
                        brightens for a pointer rather than appearing. */}
                    <span
                      className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-bone/20 bg-ink-950/60 text-bone backdrop-blur-sm transition-colors duration-base ease-enter group-hover:border-brass-500 group-hover:bg-ink-950/80 group-hover:text-brass-400"
                      aria-hidden="true"
                    >
                      <Expand className="h-4 w-4" strokeWidth={1.5} />
                    </span>

                    {/* Pointer-only depth: the whole frame dims so the badge
                        reads as the target rather than as a sticker. */}
                    <span
                      className="pointer-events-none absolute inset-0 bg-ink-950/0 transition-colors duration-base ease-enter group-hover:bg-ink-950/25 group-focus-visible:bg-ink-950/25"
                      aria-hidden="true"
                    />
                  </button>

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

      {/* CTA. Carries the ink-900 band the removed rates section used to hand
          to Vehicles, so the page still alternates tone rather than running
          three unbroken ink-950 sections to the footer. */}
      <section className="section border-t border-ink-800 bg-ink-900">
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

      <Lightbox
        images={gallery.images}
        index={gallery.index}
        alt={gallery.alt}
        onClose={closeGallery}
        onPrev={() => setGallery((g) => ({ ...g, index: (g.index - 1 + g.images.length) % g.images.length }))}
        onNext={() => setGallery((g) => ({ ...g, index: (g.index + 1) % g.images.length }))}
      />
    </>
  )
}
