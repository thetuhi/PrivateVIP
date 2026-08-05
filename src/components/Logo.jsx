import { brand } from '../config/brand'

// Intrinsic size of public/images/brand/logo.webp, produced by
// `npm run logo -- <source>`. Declared here so width and height can be set on
// the element: the box is correct before the file arrives, and the header never
// reflows around a logo that pops into place.
const RATIO = 560 / 219

/**
 * The company lockup: plane, wordmark and strapline as one horizontal unit.
 *
 * Sized by height, because that is the constraint everywhere it appears, the
 * header bar, a drawer row, a footer column. At 2.56:1 a 36px height renders
 * 92px wide.
 *
 * ⚠ Supplied brand asset. Do not recolour it, do not stretch it, and do not
 * rebuild it in type. To change it, replace the source and re-run the script.
 */
export default function Logo({ className = '', compact = false, height }) {
  const h = height ?? (compact ? 30 : 36)

  return (
    <img
      src="/images/brand/logo.webp"
      alt={brand.name}
      width={Math.round(h * RATIO)}
      height={h}
      style={{ height: h }}
      // Present in the header on every page, above the fold, so never lazy.
      loading="eager"
      decoding="async"
      className={`block w-auto max-w-full select-none ${className}`}
    />
  )
}
