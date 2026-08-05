import { useState } from 'react'

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
  const seed = src || alt || 'placeholder'
  const box = fill ? 'absolute inset-0 h-full w-full' : `relative ${aspect}`

  return (
    <div className={`overflow-hidden bg-ink-850 ${box} ${className}`} style={placeholderStyle(seed)}>
      <PlaceholderMotif seed={seed} />

      {src && state !== 'failed' && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
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
