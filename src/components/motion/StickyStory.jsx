import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'
import SmartImage from '../SmartImage'

// ─────────────────────────────────────────────────────────────────────────────
// StickyStory
//
// A pinned media panel that cross-fades as the reader moves through the steps
// beside it. Used for the itinerary: the picture is always the hour you are
// currently reading about, so scrolling becomes a way of moving through a day
// rather than down a list.
//
// Why this shape:
//
//   · Pinning only the media column, and only at lg and up. On a phone there is
//     no room for two columns, so the pin is dropped entirely and the steps read
//     as a normal stacked list with each image inline. Pinning a full-height
//     panel on a 375px screen is how sites become unscrollable.
//   · Cross-fade rather than slide. Slides imply the images are a sequence in
//     space; a fade says the same window is showing a different hour.
//   · The active step is tracked in React state so the text column can respond
// too, but only the index is state, so a scroll only re-renders when the
//     step actually changes, not on every frame.
//
// `gsap.matchMedia()` owns the breakpoint and the reduced-motion branch. It
// reverts everything automatically when the query stops matching, which is what
// makes rotating a tablet mid-scroll safe.
// ─────────────────────────────────────────────────────────────────────────────

// The pinned frames carry `alt=""` deliberately: they are a decorative echo of
// the step being read, and the caller renders the same photograph inline on
// small screens with real alt text. Announcing both would read every image twice.
export default function StickyStory({ steps, images, renderStep, className = '' }) {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const { reduced } = useMotion()

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          calm: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop } = context.conditions

          if (!desktop) {
            // Calm (and any non-desktop width): no pin, no cross-fade. The
            // frames are stacked absolutely, so showing all of them would pile
            // them on top of each other, only the first is kept.
            const frames = gsap.utils.toArray('[data-story-frame]', root)
            gsap.set(frames, { autoAlpha: 0 })
            if (frames[0]) gsap.set(frames[0], { autoAlpha: 1 })
            return
          }

          const media = root.querySelector('[data-story-media]')
          const frames = gsap.utils.toArray('[data-story-frame]', root)
          const stepEls = gsap.utils.toArray('[data-story-step]', root)
          if (!media || frames.length === 0) return

          gsap.set(frames, { autoAlpha: 0 })
          gsap.set(frames[0], { autoAlpha: 1 })

          // Pin the media column for the height of the step list.
          ScrollTrigger.create({
            trigger: root,
            start: 'top top+=96',
            end: 'bottom bottom',
            pin: media,
            pinSpacing: false,
            // anticipatePin removes the one-frame jitter when a pin engages
            // during fast scrolling.
            anticipatePin: 1,
            invalidateOnRefresh: true,
          })

          // One trigger per step, driving both the image and the active index.
          stepEls.forEach((step, index) => {
            ScrollTrigger.create({
              trigger: step,
              start: 'top 62%',
              end: 'bottom 62%',
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => {
                if (!isActive) return
                setActive(index)

                const frame = frames[index]
                if (!frame) return

                gsap.to(frames, { autoAlpha: 0, duration: 0.55, ease: EASE.luxe, overwrite: 'auto' })
                gsap.to(frame, { autoAlpha: 1, duration: 0.7, ease: EASE.luxe, overwrite: 'auto' })
                // A slow push-in on the incoming frame keeps the panel alive
                // while the reader is stationary on a long step.
                gsap.fromTo(
                  frame.querySelector('img'),
                  { scale: 1.14 },
                  { scale: 1.06, duration: 1.6, ease: EASE.luxe, overwrite: 'auto' },
                )
              },
            })
          })
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [reduced, steps.length] },
  )

  return (
    <div ref={rootRef} className={`grid gap-10 lg:grid-cols-12 lg:gap-14 ${className}`}>
    {/* Media column. Desktop only, below lg the caller renders its own
          inline image per step, so mounting this too would load every frame
          twice and stack them invisibly. */}
      <div className="hidden lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:block">
        <div data-story-media className="h-[70vh]">
          <div className="relative h-full overflow-hidden rounded-card">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                data-story-frame
                className="absolute inset-0 h-full"
                style={{ zIndex: images.length - i }}
              >
                <SmartImage
                  src={src}
                  alt=""
                  fill
                  // Only the first frame is on screen at the start; the rest are
                  // faded in as the reader arrives, so they can load lazily.
                  priority={i === 0}
                  sizes="40vw"
                  imgClassName="will-change-transform"
                />
              </div>
            ))}

            {/* Step counter, pinned to the frame. Tabular so it cannot reflow
                as the number changes. Decorative: the step's own time and
                heading already carry the position in the text column. */}
            {/* z-index must clear the frames: each frame carries its own
                stacking index so they layer predictably, which would otherwise
                bury the counter underneath the top image. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-ink-950/80 to-transparent p-5 pt-16"
              style={{ zIndex: images.length + 1 }}
            >
              <span className="font-display text-4xl tabular-nums text-bone/90">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="text-xs tabular-nums text-bone-muted">
                / {String(images.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step column */}
      <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
        {steps.map((step, index) => (
          <div key={index} data-story-step>
            {renderStep(step, index, index === active)}
          </div>
        ))}
      </div>
    </div>
  )
}
