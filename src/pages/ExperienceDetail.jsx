import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import { Clock, Users, Check, Minus, Info, ArrowLeft, ArrowRight, Expand } from 'lucide-react'

import SmartImage from '../components/SmartImage'
import ScrollImage from '../components/motion/ScrollImage'
import StickyStory from '../components/motion/StickyStory'
import SplitReveal from '../components/motion/SplitReveal'
import Magnetic from '../components/motion/Magnetic'
import Lightbox from '../components/Lightbox'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import ExperienceCard from '../components/ExperienceCard'
import { getExperience, experiences } from '../data/experiences'
import { localise, formatPrice } from '../utils/localise'
import { enquiryMessage } from '../utils/contact'
import { trackEvent } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import { fadeUp } from '../motion/presets'
import { gsap } from '../motion/gsap'
import { useMotion } from '../motion/motionContext'
import MessageChannels from '../components/MessageChannels'

export default function ExperienceDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const heroRef = useRef(null)
  const { reduced } = useMotion()

  const experience = getExperience(slug)

  const title = experience ? localise(experience.title, lang) : ''
  const summary = experience ? localise(experience.summary, lang) : ''

  const gallery = useMemo(
    () => (experience ? experience.images.map((file) => `/images/experiences/${experience.slug}/${file}`) : []),
    [experience],
  )

  const related = useMemo(() => {
    if (!experience) return []
    const sameCategory = experiences.filter((e) => e.slug !== experience.slug && e.category === experience.category)
    const others = experiences.filter((e) => e.slug !== experience.slug && e.category !== experience.category)
    return [...sameCategory, ...others].slice(0, 3)
  }, [experience])

  const jsonLd = useMemo(() => {
    if (!experience) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: title,
      description: summary,
      touristType: 'Private travel',
      itinerary: {
        '@type': 'ItemList',
        itemListElement: experience.itinerary.map((step, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: localise(step.title, lang),
        })),
      },
      offers: {
        '@type': 'Offer',
        price: experience.priceFrom,
        priceCurrency: experience.currency,
        availability: 'https://schema.org/InStock',
      },
    }
  }, [experience, title, summary, lang])

  useSeo({
    title,
    description: summary,
    image: experience ? `/images/experiences/${experience.slug}/${experience.coverImage}` : undefined,
    jsonLd,
  })

  // Hero parallax. The photograph rises at a fraction of scroll speed while the
  // title travels with the page and fades, the same depth relationship as the
  // home hero, so the two pages feel like one system.
  useGSAP(
    () => {
      if (reduced || !heroRef.current) return

      gsap.to('[data-detail-media]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.to('[data-detail-copy]', {
        yPercent: -14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '70% top', scrub: true },
      })
    },
    { scope: heroRef, dependencies: [reduced, slug] },
  )

  // A stale or mistyped slug should land on the catalog, not on a broken page.
  if (!experience) return <Navigate to="/experiences" replace />

  return (
    <>
      {/* ---- Hero ------------------------------------------------------- */}
      <section ref={heroRef} className="relative isolate flex min-h-[72dvh] items-end overflow-hidden">
        {/* Over-scaled so the scroll parallax cannot expose an edge. */}
        <div data-detail-media className="absolute inset-0 scale-[1.24] will-change-transform">
          <SmartImage src={gallery[0]} alt={title} fill priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 scrim-b" aria-hidden="true" />
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div data-detail-copy className="shell relative z-raised w-full pb-14 pt-32 will-change-transform">
          <Link
            to="/experiences"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-bone-dim transition-colors duration-micro ease-enter hover:text-brass-400"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-base ease-enter group-hover:-translate-x-1 motion-reduce:transform-none"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {t('common.backToAll')}
          </Link>

          <SplitReveal
            as="h1"
            scroll={false}
            stagger={0.085}
            duration={1.05}
            className="mt-4 max-w-[18ch] text-display-lg text-balance text-bone"
          >
            {title}
          </SplitReveal>
          <Reveal className="mt-5">
            <p className="lede">{summary}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- Meta bar --------------------------------------------------- */}
      <section className="border-y border-ink-700 bg-ink-900">
        <div className="shell">
          <dl className="grid grid-cols-2 divide-ink-700 md:grid-cols-3 md:divide-x">
            <div className="py-6 md:pr-8">
              <dt className="eyebrow flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {t('experiences.duration')}
              </dt>
              <dd className="mt-2 font-display text-2xl text-bone">
                {t('common.hours', { count: experience.durationHours })}
              </dd>
            </div>

            <div className="py-6 md:px-8">
              <dt className="eyebrow flex items-center gap-2">
                <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {t('experiences.groupSize')}
              </dt>
              <dd className="mt-2 font-display text-2xl text-bone">
                {t('common.upToGuests', { count: experience.maxGuests })}
              </dd>
            </div>

            <div className="col-span-2 border-t border-ink-700 py-6 md:col-span-1 md:border-t-0 md:pl-8">
              <dt className="eyebrow">{t('experiences.priceLabel')}</dt>
              <dd className="mt-2 font-display text-2xl tabular-nums text-brass-400">
                {t('common.from')} {formatPrice(experience.priceFrom, experience.currency, lang)}
              </dd>
              <dd className="mt-1 text-xs text-bone-muted">{t('experiences.priceNote')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---- Body + sticky booking rail --------------------------------- */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <Reveal>
              <h2 className="eyebrow">{t('experiences.overview')}</h2>
              <p className="prose-body mt-5 text-lg">{localise(experience.description, lang)}</p>
            </Reveal>

            {/* Highlights */}
            <div className="mt-16">
              <Reveal>
                <h2 className="eyebrow">{t('experiences.highlights')}</h2>
              </Reveal>
              <RevealGroup as="ul" className="mt-6 grid gap-4 sm:grid-cols-2">
                {experience.highlights.map((item, index) => (
                  <RevealItem as="li" key={index} variant={fadeUp} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brass-500" strokeWidth={2} aria-hidden="true" />
                    <span className="text-sm font-light leading-relaxed text-bone-dim">{localise(item, lang)}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            {/* Itinerary, see the sticky storytelling section below. */}

            {/* Includes / excludes */}
            <div className="mt-16 grid gap-10 sm:grid-cols-2">
              <Reveal>
                <h2 className="eyebrow">{t('experiences.includes')}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {experience.includes.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm font-light leading-relaxed text-bone-dim">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                      {localise(item, lang)}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <h2 className="eyebrow">{t('experiences.excludes')}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {experience.excludes.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm font-light leading-relaxed text-bone-muted">
                      <Minus className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                      {localise(item, lang)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Good to know */}
            <Reveal className="mt-16">
              <div className="card flex gap-4 p-6">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brass-500" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-medium text-bone">{t('experiences.goodToKnow')}</h2>
                  <p className="mt-2 max-w-prose text-sm font-light leading-relaxed text-bone-dim">
                    {localise(experience.good_to_know, lang)}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Booking rail. Sticky on desktop only, on mobile the bottom bar
              below does the same job without stealing vertical space. */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <Reveal>
                <div className="card p-6">
                  <p className="eyebrow">{t('experiences.priceLabel')}</p>
                  <p className="mt-3 font-display text-4xl tabular-nums text-bone">
                    {formatPrice(experience.priceFrom, experience.currency, lang)}
                  </p>
                  <p className="mt-1 text-sm text-bone-muted">{t('common.perParty')}</p>

                  <hr className="my-6 border-ink-700" />

                  <Magnetic
                    as={Link}
                    strength={0.18}
                    to={`/plan?experience=${experience.slug}`}
                    className="btn-primary w-full"
                    onClick={() => trackEvent('enquiry_start', { experience: experience.slug })}
                  >
                    {t('experiences.detailCta')}
                  </Magnetic>

                  <MessageChannels
                    className="mt-2.5"
                    message={enquiryMessage(title, lang)}
                    location={`experience:${experience.slug}`}
                    block
                  />
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      {/* ---- Itinerary, told as a pinned sequence ------------------------ */}
      {/*
        The strongest narrative moment on the site. The photograph stays fixed
        while the hours scroll past it and cross-fade underneath, so reading
        the itinerary feels like moving through a day rather than down a list.

        Below lg the pin is dropped entirely and this degrades to the ordinary
        stacked timeline: there is no room for two columns on a phone, and
        pinning a full-height panel on a small screen is how sites become
        unscrollable.
      */}
      <section className="section section-seam">
        <div className="shell">
          <Reveal>
            <h2 className="eyebrow">{t('experiences.itinerary')}</h2>
          </Reveal>

          <StickyStory
            className="mt-10"
            steps={experience.itinerary}
            images={experience.itinerary.map((_, i) => gallery[i % gallery.length])}
            renderStep={(step, index, isActive) => (
              <div
                className={`relative border-l border-ink-700 py-8 pl-8 transition-opacity duration-slow ease-enter lg:py-14 ${
                  // Inactive steps recede, but 0.65 is the floor: bone-dim body
                  // text blended at that opacity measures 5.18:1 on ink-950,
                  // still comfortably AA. At the 0.45 this started out as, it
                  // was 3.03:1, the focus effect would have been bought by
                  // making the surrounding content genuinely hard to read.
                  isActive ? 'opacity-100' : 'lg:opacity-[0.65]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[4.5px] top-9 h-2 w-2 rounded-full transition-colors duration-slow ease-enter lg:top-[3.9rem] ${
                    isActive ? 'bg-brass-500' : 'bg-ink-600'
                  }`}
                />

                <span className="font-sans text-sm font-medium tabular-nums tracking-wide text-brass-400">
                  {step.time}
                </span>
                <h3 className="mt-2 font-display text-2xl leading-tight text-bone lg:text-3xl">
                  {localise(step.title, lang)}
                </h3>
                <p className="mt-3 max-w-prose text-sm font-light leading-relaxed text-bone-dim lg:text-base">
                  {localise(step.body, lang)}
                </p>

                {/* Inline image on small screens, where the pinned panel is off. */}
                <div className="mt-5 lg:hidden">
                  <SmartImage
                    src={gallery[index % gallery.length]}
                    alt={`${title}, ${localise(step.title, lang)}`}
                    aspect="aspect-[3/2]"
                    sizes="92vw"
                    className="rounded-card"
                  />
                </div>
              </div>
            )}
          />

          <p className="mt-6 max-w-prose text-xs text-bone-muted">{t('experiences.itineraryNote')}</p>
        </div>
      </section>

      {/* ---- Gallery ---------------------------------------------------- */}
      {gallery.length > 1 && (
        <section className="section border-t border-ink-800 pt-0">
          <div className="shell pt-16">
            <Reveal>
              <h2 className="eyebrow">{t('experiences.gallery')}</h2>
            </Reveal>

            <RevealGroup as="ul" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, index) => (
                <RevealItem as="li" key={src} variant={fadeUp}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`${t('a11y.openGallery')}, ${index + 1} / ${gallery.length}`}
                    className="group relative block w-full cursor-pointer overflow-hidden rounded-card"
                  >
                  {/* Each tile wipes open on entry and drifts as it passes,
                        staggered by the RevealGroup, so the grid fills in as a
                        sequence rather than appearing all at once. */}
                    <ScrollImage
                      src={src}
                      alt={`${title}, ${index + 1}`}
                      aspect="aspect-[4/3]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                      parallax={9}
                      reveal={index % 2 === 0 ? 'up' : 'down'}
                      imgClassName="transition-transform duration-[900ms] ease-enter group-hover:scale-[1.07] motion-reduce:transform-none"
                    />
                    {/* The magnifier is the affordance, on every input. It was
                        hidden on desktop hover while the custom cursor said
                        "gallery" by itself; that cursor is gone, so hiding it
                        would leave a mouse user with no signal at all. */}
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all duration-base ease-enter group-hover:bg-ink-950/40 group-hover:opacity-100 group-focus-visible:bg-ink-950/40 group-focus-visible:opacity-100">
                      <Expand className="h-6 w-6 text-bone" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </button>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---- Related ---------------------------------------------------- */}
      {related.length > 0 && (
        <section className="section border-t border-ink-800 bg-ink-900">
          <div className="shell">
            <Reveal>
              <h2 className="text-display-sm text-bone">{t('experiences.relatedTitle')}</h2>
            </Reveal>
            <RevealGroup as="ul" className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ExperienceCard
                  key={item.slug}
                  as="li"
                  experience={item}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                />
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---- Mobile booking bar ----------------------------------------- */}
      <div
        className="glass fixed inset-x-0 bottom-0 z-sticky border-t border-ink-700 px-gutter pt-3 lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-bone-muted">{t('common.from')}</p>
            <p className="font-display text-xl tabular-nums leading-tight text-bone">
              {formatPrice(experience.priceFrom, experience.currency, lang)}
            </p>
          </div>
          <Link
            to={`/plan?experience=${experience.slug}`}
            className="btn-primary shrink-0"
            onClick={() => trackEvent('enquiry_start', { experience: experience.slug, location: 'mobile_bar' })}
          >
            {t('common.enquire')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {/* Spacer so the sticky bar never covers the last of the page content. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />

      <Lightbox
        images={gallery}
        index={lightboxIndex}
        alt={title}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length)}
        onNext={() => setLightboxIndex((i) => (i + 1) % gallery.length)}
      />
    </>
  )
}
