import { useEffect, useRef, useState } from 'react'

// Must match WIDTHS in scripts/responsive-images.mjs.
const VARIANT_WIDTHS = [640, 1024, 1600]

// ─────────────────────────────────────────────────────────────────────────────
// SmartImage
//
// Three jobs:
//
//  1. Reserve space. The wrapper always carries an aspect-ratio, so the layout
//     is final before the image byte arrives. Zero CLS by construction.
//
//  2. Fade in rather than pop in. The image starts at opacity 0 over a
//     deterministic placeholder and transitions on load, so a slow connection
//     degrades to something composed instead of something broken.
//
// 3. Survive a missing file. Photography is not in place yet, until it is,
//     every slot renders an on-brand placeholder derived from the filename,
//     not a browser's broken-image glyph. Drop the real WebP in and it takes
//     over with no code change.
//
// See README "Photography" for the drop-in workflow.
// ─────────────────────────────────────────────────────────────────────────────

/** Stable 31-hash so the same filename always yields the same placeholder. */
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Placeholder styling stays inside the Nocturne palette: warm near-blacks in
 * the 18–48° hue band, so a grid of them reads as a deliberate treatment
 * rather than as a set of failures.
 */
function placeholderStyle(seed) {
  const h = hashString(seed)
  const hue = 18 + (h % 30)
  const sat = 10 + (h % 8)
  const angle = 120 + (h % 110)
  return {
    backgroundImage: `linear-gradient(${angle}deg, hsl(${hue} ${sat}% 9%) 0%, hsl(${hue + 8} ${sat + 4}% 13%) 52%, hsl(${hue} ${sat}% 7%) 100%)`,
  }
}

/** Ottoman arch motif, tiled faintly over the gradient. Inline, so no request. */
function PlaceholderMotif({ seed }) {
  const rotate = hashString(seed) % 2 === 0 ? 0 : 180
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      style={{ transform: `rotate(${rotate}deg)` }}
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`arch-${hashString(seed)}`} width="40" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M20 46 V22 a10 10 0 0 1 20 0 V46"
            fill="none"
            stroke="#C0A062"
            strokeWidth="1"
            transform="translate(-10,0)"
          />
          <circle cx="20" cy="8" r="1.6" fill="#C0A062" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill={`url(#arch-${hashString(seed)})`} />
    </svg>
  )
}

export default function SmartImage({
  src,
  alt,
  /** Tailwind aspect class, e.g. "aspect-[4/5]". Ignored when `fill` is set. */
  aspect = 'aspect-[4/3]',
  /**
   * Stretch to a positioned ancestor instead of holding an aspect ratio. For
   * hero backgrounds, where the section, not the image, defines the height.
   */
  fill = false,
  className = '',
  imgClassName = '',
  /** true for the LCP image only, sets eager loading and high fetch priority. */
  priority = false,
  sizes = '100vw',
  children,
}) {
  const [state, setState] = useState('loading') // loading | loaded | failed
  // Priority images are wanted immediately, and so is anything running without
  // IntersectionObserver, where the alternative is never loading at all. That
  // decision belongs in the initial state rather than in the effect: setting it
  // synchronously from an effect body costs an extra render pass on every
  // image on the page.
  const [shouldLoad, setShouldLoad] = useState(
    () => priority || typeof IntersectionObserver === 'undefined',
  )
  const frameRef = useRef(null)
  const seed = src || alt || 'placeholder'
  const box = fill ? 'absolute inset-0 h-full w-full' : `relative ${aspect}`

  // Responsive variants written by `npm run images:responsive`, named
  // <file>-<width>w.webp beside the original.
  //
  // Without these the browser had one file to choose from and downloaded the
  // full-size frame for a 330px card, which is why photographs were still
  // arriving after they had scrolled into view. `sizes` was already correct at
  // every call site; it simply had nothing to select between.
  //
  // The original stays as `src`, so anything that cannot parse a srcset still
  // gets a working image, and a missing variant degrades to it rather than to
  // a broken picture.
  const srcSet = src && src.endsWith('.webp')
    ? VARIANT_WIDTHS.map((w) => `${src.replace(/\.webp$/, `-${w}w.webp`)} ${w}w`).join(', ')
    : undefined

  // Loading is started 1200px before the frame reaches the viewport, rather
  // than left to `loading="lazy"`.
  //
  // Native lazy loading picks its own distance and the browsers disagree about
  // it: Chrome varies the threshold with connection speed, Safari is stingier
  // still. That is why photographs were arriving after they had already
  // scrolled into view. An explicit rootMargin behaves the same everywhere and
  // is roughly a viewport and a half of warning at this page's scroll speed.
  useEffect(() => {
    if (shouldLoad) return undefined
    const el = frameRef.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '1200px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={frameRef} className={`overflow-hidden bg-ink-850 ${box} ${className}`} style={placeholderStyle(seed)}>
      <PlaceholderMotif seed={seed} />

      {src && shouldLoad && state !== 'failed' && (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          sizes={sizes}
          // The observer above already decided the timing, so the browser is
          // told to get on with it rather than applying its own heuristic.
          loading="eager"
          // fetchPriority is React 19's camelCase form of the fetchpriority attr.
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-slow ease-enter ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

      {children}
    </div>
  )
}
