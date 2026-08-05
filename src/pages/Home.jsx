import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import { Lock, Award, Receipt, Compass, ArrowRight, Sailboat, CarFront, PenLine } from 'lucide-react'

import SmartImage from '../components/SmartImage'
import ScrollImage from '../components/motion/ScrollImage'
import SectionHeading from '../components/SectionHeading'
import ExperienceCard from '../components/ExperienceCard'
import SplitReveal from '../components/motion/SplitReveal'
import Magnetic from '../components/motion/Magnetic'
import TiltCard from '../components/motion/TiltCard'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { featuredExperiences } from '../data/experiences'
import { useSeo, organisationJsonLd } from '../utils/useSeo'
import { fadeUp } from '../motion/presets'
import { gsap, EASE } from '../motion/gsap'
import { useMotion } from '../motion/motionContext'
import MessageChannels from '../components/MessageChannels'

const PILLARS = [
  { key: 'private', Icon: Lock },
  { key: 'licensed', Icon: Award },
  { key: 'pricing', Icon: Receipt },
  { key: 'flexible', Icon: Compass },
]

const SERVICES = [
  { key: 'yachts', to: '/yachts', Icon: Sailboat, image: '/images/home/yacht-teaser.webp' },
  { key: 'fleet', to: '/transfers', Icon: CarFront, image: '/images/home/fleet-teaser.webp' },
  { key: 'bespoke', to: '/plan', Icon: PenLine, image: '/images/home/bespoke-teaser.webp' },
]

const TESTIMONIALS = ['t1', 't2', 't3']

// ─────────────────────────────────────────────────────────────────────────────
// Hero
//
// Four layers of motion, each doing a different job:
//
// 1. Entrance, a single timeline: rule draws, eyebrow, headline lines rise
//      from their masks, lede, controls. Held until the intro curtain lifts, so
//      on a first visit it plays *to* the visitor rather than behind a veil.
// 2. Scroll parallax, the photograph moves at 22% of scroll speed while the
//      copy moves at 100% and fades. That difference is the depth; it is what
//      makes the frame feel like a window rather than a background-image.
// 3. Pointer drift, the image leans a few pixels against the cursor. Far too
//      small to notice directly, which is the point: it registers as the image
//      being present in the room rather than printed on the glass.
// 4. Scroll cue, a line that travels its own track on a loop and fades out
//      the moment the visitor takes the hint.
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useTranslation()
  const { reduced, fine, introDone } = useMotion()
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const media = root.querySelector('[data-hero-media]')
      const copy = root.querySelector('[data-hero-copy]')
      const cue = root.querySelector('[data-hero-cue]')

      if (reduced) {
        gsap.set('[data-hero-fade]', { opacity: 1, y: 0 })
        gsap.set('[data-hero-rule]', { scaleX: 1 })
        return
      }

      // Wait for the curtain. Until then the hero holds its opening pose.
      if (!introDone) {
        gsap.set('[data-hero-fade]', { opacity: 0, y: 18 })
        gsap.set('[data-hero-rule]', { scaleX: 0 })
        return
      }

      // Absolute positions, not relative offsets, so the sequence is legible
      // as a whole and the controls' arrival time is a deliberate number rather
      // than the sum of everything above it. Budget: primary CTA readable by
      // ~0.9s, entire hero settled by ~1.3s.
      const tl = gsap.timeline({ defaults: { ease: EASE.luxe } })

      tl.to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.55 }, 0)
        .to('[data-hero-rule]', { scaleX: 1, duration: 0.75, ease: EASE.veil }, 0.28)
        .to('[data-hero-lede]', { opacity: 1, y: 0, duration: 0.6 }, 0.42)
        .to('[data-hero-controls]', { opacity: 1, y: 0, duration: 0.6 }, 0.52)
        .to('[data-hero-cue]', { opacity: 1, duration: 0.5 }, 0.8)

      // 2. Scroll parallax. `scrub: true` locks it to scroll position exactly;
      // no smoothing here because the copy must stay welded to the page.
      gsap.to(media, {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.to(copy, {
        yPercent: -12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '60% top', scrub: true },
      })

      // 3. Pointer drift, desktop only.
      let onMove
      if (fine) {
        const xTo = gsap.quickTo(media, 'x', { duration: 1.4, ease: EASE.precise })
        const yTo = gsap.quickTo(media, 'y', { duration: 1.4, ease: EASE.precise })
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          xTo(nx * -26)
          yTo(ny * -18)
        }
        window.addEventListener('mousemove', onMove, { passive: true })
      }

      // 4. Scroll cue.
      const cueLine = cue?.querySelector('[data-hero-cue-line]')
      if (cueLine) {
        gsap.fromTo(
          cueLine,
          { scaleY: 0, transformOrigin: 'top' },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 0.35,
            transformOrigin: 'top',
            // Re-anchoring the origin at the halfway point makes the line
            // retract from the top instead of collapsing back the way it came.
            onRepeat() {
              gsap.set(cueLine, { transformOrigin: 'top' })
            },
          },
        )
      }

      gsap.to(cue, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '18% top', scrub: true },
      })

      return () => {
        if (onMove) window.removeEventListener('mousemove', onMove)
      }
    },
    { scope: rootRef, dependencies: [reduced, fine, introDone] },
  )

  return (
    <section ref={rootRef} className="relative isolate flex min-h-[100dvh] items-end overflow-hidden">
      {/* Over-scaled so the parallax travel can never expose an edge. */}
      <div data-hero-media className="absolute inset-0 scale-[1.28] will-change-transform">
        <SmartImage src="/images/hero/bosphorus-dusk.webp" alt="" fill priority sizes="100vw" />
      </div>

      <div className="absolute inset-0 scrim-full" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div data-hero-copy className="shell relative z-raised w-full pb-24 pt-32 will-change-transform sm:pb-28">
        <p data-hero-eyebrow data-hero-fade className="eyebrow translate-y-[18px] opacity-0">
          {t('home.heroEyebrow')}
        </p>

        {/* The headline is the one place on the site worth splitting to lines.
        It plays on mount rather than on scroll, it is already in view. */}
        <SplitReveal
          as="h1"
          scroll={false}
          delay={0.12}
          stagger={0.075}
          duration={0.85}
          className="mt-5 max-w-[16ch] text-display-xl text-balance text-bone"
        >
          {t('home.heroTitle')}
        </SplitReveal>

        <div data-hero-rule className="mt-8 h-px w-24 origin-left scale-x-0 bg-brass-500" aria-hidden="true" />

        <p data-hero-lede data-hero-fade className="lede mt-8 translate-y-[18px] opacity-0">
          {t('home.heroLede')}
        </p>

        <div
          data-hero-controls
          data-hero-fade
          className="mt-10 flex translate-y-[18px] flex-col gap-3 opacity-0 sm:flex-row sm:items-center"
        >
          <Magnetic as={Link} to="/plan" className="btn-primary group">
            {t('home.heroCta')}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Magnetic>
          <Magnetic as={Link} strength={0.2} to="/experiences" className="btn-secondary">
            {t('home.heroSecondary')}
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue. Decorative, the page scrolls whether or not it is read. */}
      <div
        data-hero-cue
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-0 lg:flex"
        aria-hidden="true"
      >
        <span className="text-[0.5625rem] uppercase tracking-[0.28em] text-bone-muted">{t('home.scrollHint')}</span>
        <span className="relative block h-12 w-px overflow-hidden bg-ink-600">
          <span data-hero-cue-line className="absolute inset-0 block origin-top bg-brass-500" />
        </span>
      </div>
    </section>
  )
}

/** Statement. One paragraph, revealed by line, the site's quietest moment. */
function Statement() {
  const { t } = useTranslation()
  return (
    <section className="section">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t('home.introEyebrow')} title={t('home.introTitle')} size="lg" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <SplitReveal
            as="p"
            stagger={0.055}
            className="max-w-prose text-lg font-light leading-relaxed text-bone-dim sm:text-xl"
          >
            {t('home.introBody')}
          </SplitReveal>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { t } = useTranslation()
  return (
    <section className="section section-seam">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t('home.featuredEyebrow')}
            title={t('home.featuredTitle')}
            lede={t('home.featuredLede')}
            className="md:max-w-2xl"
          />
          <Reveal className="shrink-0">
            <Magnetic as={Link} strength={0.2} to="/experiences" className="btn-secondary group">
              {t('home.featuredCta')}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Magnetic>
          </Reveal>
        </div>

        <RevealGroup as="ul" each={0.09} className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featuredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.slug}
              as="li"
              experience={experience}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
            />
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/**
 * Pillars. The heading column sticks while the four claims scroll past it,
 * a sticky storytelling beat that costs one `position: sticky` and no JS. Each
 * pillar carries a counter that ties the set together as a sequence.
 */
function Pillars() {
  const { t } = useTranslation()
  return (
    <section className="section section-seam bg-ink-900">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+4rem)]">
            <SectionHeading eyebrow={t('home.pillarsEyebrow')} title={t('home.pillarsTitle')} />
          </div>
        </div>

        <RevealGroup as="ul" each={0.1} className="flex flex-col lg:col-span-7 lg:col-start-6">
          {PILLARS.map(({ key, Icon }, index) => (
            <RevealItem
              as="li"
              key={key}
              variant={fadeUp}
              className="group flex gap-6 border-b border-ink-700 py-9 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span className="mt-1 shrink-0 font-display text-sm tabular-nums text-brass-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <Icon
                  className="h-6 w-6 text-brass-500 transition-transform duration-slow ease-enter group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-display text-2xl leading-tight text-bone">{t(`pillars.${key}Title`)}</h3>
                <p className="mt-3 max-w-prose text-sm font-light leading-relaxed text-bone-dim">
                  {t(`pillars.${key}Body`)}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function Services() {
  const { t } = useTranslation()
  return (
    <section className="section section-seam">
      <div className="shell">
        <SectionHeading eyebrow={t('home.servicesEyebrow')} title={t('home.servicesTitle')} />

        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {SERVICES.map(({ key, to, Icon, image }) => (
            <TiltCard as="li" key={key} className="group relative flex flex-col" max={3.5} lift={14}>
              {/* Cards are the one place tilt earns its keep: a grid of flat
                  rectangles is what separates a template from a designed page. */}
              <ScrollImage
                src={image}
                alt={t(`services.${key}Title`)}
                aspect="aspect-[3/2]"
                sizes="(min-width: 768px) 33vw, 92vw"
                className="rounded-card"
                parallax={8}
                imgClassName="transition-transform duration-[1100ms] ease-enter group-hover:scale-[1.07] motion-reduce:transform-none"
              >
                <div className="pointer-events-none absolute inset-0 scrim-b" aria-hidden="true" />
              </ScrollImage>

              <div className="flex flex-1 flex-col pt-5" data-depth="0.5">
                <Icon className="h-5 w-5 text-brass-500" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl leading-tight text-bone transition-colors duration-base ease-enter group-hover:text-brass-300">
                  <Link to={to} className="after:absolute after:inset-0 after:content-['']">
                    {t(`services.${key}Title`)}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-sm font-light leading-relaxed text-bone-dim">
                  {t(`services.${key}Body`)}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-400">
                  {t(`services.${key}Cta`)}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </TiltCard>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Testimonials() {
  const { t } = useTranslation()
  return (
    <section className="section section-seam bg-ink-900">
      <div className="shell">
        <SectionHeading eyebrow={t('home.testimonialsEyebrow')} title={t('home.testimonialsTitle')} />

        <RevealGroup as="ul" each={0.12} className="mt-14 grid gap-10 md:grid-cols-3">
          {TESTIMONIALS.map((key) => (
            <RevealItem as="li" key={key} variant={fadeUp}>
              <figure className="flex h-full flex-col border-t border-ink-600 pt-6">
                <blockquote className="flex-1">
                  <SplitReveal
                    as="p"
                    stagger={0.045}
                    duration={0.8}
                    className="font-display text-xl font-light italic leading-snug text-bone"
                  >
                    {`“${t(`testimonials.${key}`)}”`}
                  </SplitReveal>
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-sm font-medium text-bone">{t(`testimonials.${key}Author`)}</span>
                  <span className="mt-0.5 block text-xs text-bone-muted">{t(`testimonials.${key}Meta`)}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/** Closing call. Slow background parallax under a fixed message. */
function FinalCta() {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const { reduced } = useMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.fromTo(
        '[data-cta-media]',
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  return (
    <section ref={rootRef} className="relative isolate overflow-hidden section-seam">
      <div data-cta-media className="absolute inset-0 scale-[1.22] will-change-transform">
        <SmartImage src="/images/home/cta-bosphorus.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-ink-950/80" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="shell relative z-raised flex flex-col items-center py-section text-center">
        <SplitReveal as="h2" stagger={0.07} className="max-w-[18ch] text-display-lg text-balance text-bone">
          {t('home.ctaTitle')}
        </SplitReveal>
        <Reveal className="mt-6">
          <p className="lede mx-auto text-center">{t('home.ctaBody')}</p>
        </Reveal>
        <Reveal className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Magnetic as={Link} to="/plan" className="btn-primary group">
              {t('home.ctaPrimary')}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Magnetic>
            <MessageChannels location="home_cta" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useTranslation()

  useSeo({
    title: null,
    description: t('home.heroLede'),
    image: '/images/hero/bosphorus-dusk.webp',
    jsonLd: organisationJsonLd(),
  })

  return (
    <>
      <Hero />
      <Statement />
      <Featured />
      <Pillars />
      <Services />
      <Testimonials />
      <FinalCta />
    </>
  )
}
