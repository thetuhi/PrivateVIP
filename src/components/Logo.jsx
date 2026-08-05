import { brand } from '../config/brand'

/**
 * Wordmark. Drawn in type rather than shipped as an image so it stays crisp at
 * every size, recolours with the theme and costs nothing to load.
 *
 * ⚠ If the client has a real logo, replace the inner markup with an inline
 * SVG of the official asset, do not recolour or re-proportion a supplied one.
 */
export default function Logo({ className = '', compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
    {/* Monogram mark, a hexagonal cartouche around a 'P'. */}
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0 text-brass-500 transition-colors duration-base ease-enter"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20 3 L34 11.5 V28.5 L20 37 L6 28.5 V11.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 12.5 h6.6 a4.9 4.9 0 0 1 0 9.8 H19 v5.2 h-3.5 Z M19 15.6 v3.6 h3.1 a1.8 1.8 0 0 0 0-3.6 Z"
          fill="currentColor"
        />
      </svg>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.16em] text-bone">
            {brand.shortName.toUpperCase()}
          </span>
          <span className="mt-0.5 font-sans text-[0.5625rem] font-medium tracking-[0.34em] text-brass-500">
            ISTANBUL
          </span>
        </span>
      )}
    </span>
  )
}
