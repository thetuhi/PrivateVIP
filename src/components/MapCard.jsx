import { ArrowUpRight } from 'lucide-react'
import { brand } from '../config/brand'
import { mapsLink } from '../utils/contact'
import { trackEvent } from '../utils/analytics'

// ─────────────────────────────────────────────────────────────────────────────
// MapCard
//
// Replaces a plain "open in maps" button with the thing it was standing in for.
//
// Deliberately NOT an embedded map. A Google Maps iframe would hand every
// visitor's IP to a third party on page load, and the privacy policy states
// that nothing on this site does that. It would also be the single heaviest
// request on the page, for a decoration.
//
// So the map is drawn: the Bosphorus, the Golden Horn and the Marmara as brass
// on ink, with the office marked where Beyoğlu actually sits, west of the
// strait and north of the Horn. It is schematic and says so by being schematic
// rather than pretending to be a survey. Zero requests, a few hundred bytes,
// and it carries the brand rather than Google's.
// ─────────────────────────────────────────────────────────────────────────────

export default function MapCard({ label }) {
  return (
    <a
      href={mapsLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('open_maps', { location: 'contact' })}
      className="group relative mt-7 block overflow-hidden rounded-card border border-brass-500/40 bg-ink-950 transition-colors duration-slow ease-enter hover:border-brass-500/80"
    >
      <div className="relative aspect-[16/9] w-full">
        <svg
          viewBox="0 0 400 225"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Land tone, so the water reads as the negative space it is. */}
          <rect width="400" height="225" fill="#0B0A09" />

          {/* Street hatching. Faint, and only on the European side where the
              office is, so the eye is drawn there rather than spread evenly. */}
          <g stroke="#C0A062" strokeWidth="0.4" opacity="0.13">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`h${i}`} x1="60" y1={30 + i * 12} x2="235" y2={22 + i * 12} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v${i}`} x1={70 + i * 18} y1="26" x2={64 + i * 18} y2="128" />
            ))}
          </g>

          {/* Water. One shape for the strait, one for the Horn, one for the
              Marmara, all the same fill so they read as continuous. */}
          <g fill="#132A38" opacity="0.85">
            <path d="M243 0 C238 38 258 66 244 96 C230 126 240 154 232 190 L288 190 C296 154 286 126 300 96 C314 66 296 38 300 0 Z" />
            <path d="M240 122 C196 126 150 116 92 108 L86 130 C146 140 198 150 244 150 Z" />
            <path d="M0 192 L400 192 L400 225 L0 225 Z" />
          </g>

          {/* Shoreline. A single hairline is what makes it read as a map. */}
          <g stroke="#C0A062" strokeWidth="0.9" fill="none" opacity="0.5">
            <path d="M243 0 C238 38 258 66 244 96 C230 126 240 154 232 190" />
            <path d="M300 0 C296 38 314 66 300 96 C286 126 296 154 288 190" />
            <path d="M240 122 C196 126 150 116 92 108" />
            <path d="M244 150 C198 150 146 140 86 130" />
            <path d="M0 192 L400 192" />
          </g>

          {/* The office. Beyoğlu: west of the strait, north of the Horn. */}
          <g>
            {/* Halo, held back so it reads as emphasis and not as a target. */}
            <circle cx="196" cy="86" r="16" fill="#C0A062" opacity="0.08" />
            <circle
              cx="196"
              cy="86"
              r="9"
              fill="none"
              stroke="#C0A062"
              strokeWidth="0.8"
              opacity="0.45"
              className="origin-center transition-transform duration-slow ease-enter group-hover:scale-125 motion-reduce:transform-none"
              style={{ transformBox: 'fill-box' }}
            />
            <circle cx="196" cy="86" r="3.2" fill="#C0A062" />
          </g>
        </svg>

        {/* Keeps the caption legible over the drawing without hiding it.
            The address is not repeated here: the page sets it above the card at
            display size, and saying it twice in two hundred pixels reads as a
            template rather than a composition. */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent p-5 pt-14">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-brass-400">
            {label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      {/* The district, set as a map label would be. */}
      <span className="pointer-events-none absolute left-5 top-4 text-eyebrow uppercase tracking-[0.22em] text-brass-500/70">
        {brand.office.district} · {brand.office.city}
      </span>
    </a>
  )
}
