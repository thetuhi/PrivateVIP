import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Ruler, Users, BedDouble, Anchor, Check, ArrowRight, Expand } from 'lucide-react'

import ScrollImage from '../components/motion/ScrollImage'
import SplitReveal from '../components/motion/SplitReveal'
import Magnetic from '../components/motion/Magnetic'
import PrimaryCta from '../components/PrimaryCta'
import SectionHeading from '../components/SectionHeading'
import Lightbox from '../components/Lightbox'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { yachts, charterOccasions } from '../data/yachts'
import { localise, formatPrice } from '../utils/localise'
import { enquiryMessage } from '../utils/contact'
import { useSeo } from '../utils/useSeo'
import { fadeUp, viewportEarly } from '../motion/presets'
import MessageChannels from '../components/MessageChannels'

/**
 * Yacht rows alternate image side on desktop. Each is a full spec block rather
 * than a card grid, four boats is few enough that the visitor should be able
 * to compare them without clicking through.
 */
function YachtRow({ yacht, index, onOpenGallery }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const name = localise(yacht.name, lang)
  const cover = `/images/yachts/${yacht.slug}/${yacht.coverImage}`
  const reversed = index % 2 === 1

  const specs = [
    { Icon: Ruler, label: t('yachts.specLength'), value: t('common.metres', { count: yacht.lengthM }) },
    { Icon: Users, label: t('yachts.specGuests'), value: yacht.guests },
    ...(yacht.cabins > 0 ? [{ Icon: BedDouble, label: t('yachts.specCabins'), value: yacht.cabins }] : []),
    { Icon: Anchor, label: t('yachts.specCrew'), value: yacht.crew },
  ]

  return (
    // Each row carries its own trigger rather than inheriting one from a
    // stagger group. A stagger only makes sense for items that share a screen;
    // these are taller than the viewport, and gating them on the parent list
    // meant the first yacht sat visible but unrevealed for 780px of scrolling.
    <Reveal
      as="li"
      variant={fadeUp}
      viewport={viewportEarly}
      className="grid items-center gap-8 border-t border-ink-800 pt-14 lg:grid-cols-12 lg:gap-14"
    >
      <div className={`lg:col-span-7 ${reversed ? 'lg:order-2' : ''}`}>
        <button
          type="button"
          onClick={() => onOpenGallery(yacht)}
          aria-label={`${t('a11y.openGallery')}, ${name}`}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-card"
        >
          {/* Alternating wipe direction follows the alternating layout, so the
              image opens from the side the column sits on. Small detail; it is
              what stops a list of four rows reading as four copies. */}
          <ScrollImage
            src={cover}
            alt={name}
            aspect="aspect-[16/10]"
            sizes="(min-width: 1024px) 58vw, 92vw"
            parallax={14}
            reveal={reversed ? 'right' : 'left'}
            imgClassName="transition-transform duration-[1100ms] ease-enter group-hover:scale-[1.05] motion-reduce:transform-none"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-base ease-enter group-hover:bg-ink-950/35 group-hover:opacity-100 group-focus-visible:bg-ink-950/35 group-focus-visible:opacity-100 lg:group-hover:opacity-0">
            <Expand className="h-6 w-6 text-bone" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className={`lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
        <SplitReveal as="h3" stagger={0.07} className="font-display text-display-sm text-bone">
          {name}
        </SplitReveal>
        <p className="mt-3 max-w-prose text-base font-light leading-relaxed text-bone-dim">
          {localise(yacht.tagline, lang)}
        </p>

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {specs.map(({ Icon, label, value }) => (
            <div key={label}>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-bone-muted">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 font-display text-2xl tabular-nums text-bone">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7">
          <p className="text-xs uppercase tracking-[0.16em] text-bone-muted">{t('yachts.bestFor')}</p>
          <p className="mt-1.5 text-sm font-light text-bone-dim">{localise(yacht.bestFor, lang)}</p>
        </div>

        <ul className="mt-6 flex flex-col gap-2.5">
          {yacht.features.map((feature, i) => (
            <li key={i} className="flex gap-2.5 text-sm font-light text-bone-dim">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" strokeWidth={2} aria-hidden="true" />
              {localise(feature, lang)}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-ink-700 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-bone-muted">{t('yachts.rateFrom')}</p>
            <p className="mt-1 font-display text-3xl tabular-nums text-brass-400">
              {formatPrice(yacht.rateFrom, yacht.currency, lang)}
            </p>
            <p className="mt-1 text-xs text-bone-muted">
              {t('common.minimumHours', { count: yacht.minHours })} · {t('yachts.rateNote')}
            </p>
          </div>

          <MessageChannels message={enquiryMessage(name, lang)} location={`yacht:${yacht.slug}`} />
        </div>
      </div>
    </Reveal>
  )
}

export default function Yachts() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'
  const [gallery, setGallery] = useState({ images: [], index: null, alt: '' })

  useSeo({
    title: t('yachts.metaTitle'),
    description: t('yachts.lede'),
  })

  function openGallery(yacht) {
    setGallery({
      images: yacht.images.map((file) => `/images/yachts/${yacht.slug}/${file}`),
      index: 0,
      alt: localise(yacht.name, lang),
    })
  }

  const closeGallery = () => setGallery((g) => ({ ...g, index: null }))

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('yachts.eyebrow')}
            title={t('yachts.title')}
            lede={t('yachts.lede')}
            size="xl"
            className="max-w-3xl"
          />
        </div>
      </section>

      <section aria-labelledby="fleet-heading" className="pb-section">
        <div className="shell">
          <h2 id="fleet-heading" className="sr-only">
            {t('yachts.fleetTitle')}
          </h2>
          <ul className="flex flex-col gap-16 lg:gap-24">
            {yachts.map((yacht, index) => (
              <YachtRow key={yacht.slug} yacht={yacht} index={index} onOpenGallery={openGallery} />
            ))}
          </ul>
        </div>
      </section>

      {/* Occasions */}
      <section className="section border-t border-ink-800 bg-ink-900">
        <div className="shell">
          <SectionHeading eyebrow={t('yachts.occasionsEyebrow')} title={t('yachts.occasionsTitle')} />

          <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {charterOccasions.map((occasion) => (
              <RevealItem as="li" key={occasion.id} variant={fadeUp} className="border-t border-ink-600 pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-brass-500">{localise(occasion.duration, lang)}</p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-bone">{localise(occasion.title, lang)}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-bone-dim">{localise(occasion.body, lang)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="section border-t border-ink-800">
        <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="text-display-md text-balance text-bone">{t('yachts.ctaTitle')}</h2>
            <p className="prose-body mt-4">{t('yachts.ctaBody')}</p>
          </Reveal>
          <Reveal className="shrink-0">
            <PrimaryCta to="/plan">{t('nav.bespoke')}</PrimaryCta>
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
