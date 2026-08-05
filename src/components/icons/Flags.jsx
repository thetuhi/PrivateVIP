// ─────────────────────────────────────────────────────────────────────────────
// Flags for the language switcher.
//
// Drawn as inline SVG rather than using the emoji flags (🇬🇧 🇷🇺 🇹🇷) for one
// decisive reason: Windows has no colour flag glyphs, so on the platform a
// large share of visitors use, emoji flags render as bare letter pairs, "GB",
// "RU", "TR". These also inherit the design system's sizing and keep a
// consistent 3:2 ratio and hairline, which the OS glyphs do not.
//
// All three are decorative: the switcher always shows the language name and
// code as text next to them, so nothing depends on recognising a flag.
// ─────────────────────────────────────────────────────────────────────────────

const BOX = 'shrink-0 rounded-[1px]'

/** Hairline that stops the white in each flag bleeding into the dark surface. */
function Edge() {
  return <rect x="0.35" y="0.35" width="23.3" height="15.3" rx="1" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.7" />
}

export function FlagEN({ className = 'h-4 w-6' }) {
  return (
    <svg viewBox="0 0 24 16" className={`${BOX} ${className}`} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#012169" />
      {/* Saltire: white first, then the narrower red over it. */}
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFF" strokeWidth="3.2" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.4" />
      {/* Cross of St George, same order. */}
      <path d="M12 0 V16 M0 8 H24" stroke="#FFF" strokeWidth="5.3" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3.2" />
      <Edge />
    </svg>
  )
}

export function FlagRU({ className = 'h-4 w-6' }) {
  return (
    <svg viewBox="0 0 24 16" className={`${BOX} ${className}`} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#FFF" />
      <rect y="5.333" width="24" height="5.334" fill="#0039A6" />
      <rect y="10.667" width="24" height="5.333" fill="#D52B1E" />
      <Edge />
    </svg>
  )
}

export function FlagTR({ className = 'h-4 w-6' }) {
  return (
    // Geometry follows the Turkish Flag Law. With the height taken as G = 16:
    // the crescent's outer circle has diameter G/2 (r = 4) centred at G/2 from
    // the hoist; the inner circle that cuts it has diameter 0.4G (r = 3.2) and
    // sits G/16 further right; the star's circumscribed circle is G/4 (r = 2).
    // The earlier version had a hand-guessed crescent and a malformed star.
    <svg viewBox="0 0 24 16" className={`${BOX} ${className}`} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#E30A17" />
      <circle cx="8" cy="8" r="4" fill="#FFF" />
      <circle cx="9" cy="8" r="3.2" fill="#E30A17" />
      {/* True five-pointed star: outer r = 2, inner r = 2·sin(18°)/sin(126°),
          rotated so one point faces the crescent. */}
      <path
        fill="#FFF"
        d="M12 8 L13.382 8.449 L13.382 9.902 L14.236 8.727 L15.618 9.176 L14.764 8 L15.618 6.824 L14.236 7.273 L13.382 6.098 L13.382 7.551 Z"
      />
      <Edge />
    </svg>
  )
}
