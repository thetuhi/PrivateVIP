import { brand } from '../config/brand'
import { trackEvent } from '../utils/analytics'
import InstagramGlyph from './icons/InstagramGlyph'
import TikTokGlyph from './icons/TikTokGlyph'

/**
 * Social accounts, in the order they are shown.
 *
 * Each entry renders only if `brand.social[key]` holds a URL, so an account that
 * does not exist yet leaves no empty square behind and no dead link. Names are
 * brand names and are never translated.
 *
 * brand.social also carries `tripadvisor` and `youtube`. They are absent here on
 * purpose: there is no glyph drawn for either, and the header is not the place to
 * introduce a mismatched one. Add the glyph first, then the entry.
 */
const ACCOUNTS = [
  { key: 'instagram', label: 'Instagram', Glyph: InstagramGlyph },
  { key: 'tiktok', label: 'TikTok', Glyph: TikTokGlyph },
]

const configured = () => ACCOUNTS.filter((account) => brand.social[account.key])

/**
 * The social row, living in the header at every width.
 *
 * Styled with btn-ghost rather than the bordered .social-link it used to wear in
 * the footer. Two bordered squares beside the language button and the burger read
 * as three competing controls; borderless, they sit at the same weight as the
 * rest of the bar and the brass hover is what answers the pointer.
 *
 * btn-ghost also brings min-h-11 with it, so each icon keeps a 44px touch target
 * even though the glyph inside is 18px.
 */
export default function SocialLinks({ location, className = '' }) {
  const accounts = configured()
  if (!accounts.length) return null

  return (
    <ul aria-label="Social" className={`flex items-center ${className}`}>
      {accounts.map(({ key, label, Glyph }) => (
        <li key={key}>
          <a
            href={brand.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onClick={() => trackEvent('social_click', { network: key, location })}
            className="btn-ghost group px-1.5 sm:px-2"
          >
            {/* The lift is on the glyph, not the box, so hovering one icon
                cannot nudge its neighbour along the bar. */}
            <Glyph className="h-[1.125rem] w-[1.125rem] transition-transform duration-base ease-enter group-hover:-translate-y-px group-hover:scale-110 motion-reduce:transform-none" />
          </a>
        </li>
      ))}
    </ul>
  )
}
