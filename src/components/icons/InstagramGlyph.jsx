/**
 * Instagram glyph.
 *
 * lucide-react v1 removed brand icons, so this one is local. It is drawn to the
 * same spec as the rest of the set, 24×24 box, currentColor stroke, round caps
 * and joins, caller-controlled `strokeWidth`, so it sits at the same visual
 * weight as its neighbours in the footer.
 *
 * ⚠ This is Instagram's registered mark. Use it only to link to a profile, keep
 * it monochrome, and do not alter its proportions.
 */
export default function InstagramGlyph({ className = '', strokeWidth = 1.5, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
