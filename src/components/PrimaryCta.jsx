import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// PrimaryCta
//
// One element, two presentations, split at the sm breakpoint.
//
// Desktop is byte-for-byte the button that was already there: `btn-primary`,
// the arrow, the same hover nudge. Nothing about it changes.
//
// Mobile gets its own thing. It takes the full width and 56px of height, the
// arrow is replaced by a thin chevron that leans into a press, and a single
// light sweep crosses the face when it is held. The type size does not change,
// so it gains hierarchy through weight and position rather than by growing.
//
// The two icons are swapped with `sm:` visibility rather than a media-query
// hook, so there is no hydration flash and no JS involved in deciding which
// one a device sees.
// ─────────────────────────────────────────────────────────────────────────────

export default function PrimaryCta({ to, children, className = '', onClick, ...rest }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`btn-primary cta-primary group ${className}`}
      {...rest}
    >
      {/* The sweep. Purely decorative and only ever visible on mobile. */}
      <span className="cta-shine" aria-hidden="true" />

      <span className="relative">{children}</span>

      {/* Mobile: chevron. Desktop: the original arrow, unchanged. */}
      <ChevronRight
        className="cta-chevron relative h-[1.125rem] w-[1.125rem] sm:hidden"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <ArrowRight
        className="relative hidden h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none sm:block"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  )
}
