import WhatsAppGlyph from './icons/WhatsAppGlyph'
import TelegramGlyph from './icons/TelegramGlyph'
import { whatsappLink, telegramLink } from '../utils/contact'
import { trackEvent } from '../utils/analytics'

// ─────────────────────────────────────────────────────────────────────────────
// MessageChannels
//
// WhatsApp and Telegram, always as a pair. Defined once so the two never drift
// apart: every place the site offers a chat, it offers both, with the same
// labels, the same order and the same tracking.
//
// One asymmetry worth knowing about: WhatsApp deep links accept a prefilled
// message, Telegram's phone-number links do not. So `message` reaches WhatsApp
// with the enquiry already written out, while Telegram opens an empty chat.
// That is a Telegram limitation, not an oversight, and it is the reason
// WhatsApp stays first in the order.
//
// Labels are the bare brand names rather than a translated sentence: they are
// proper nouns, they stay short enough to sit side by side in a narrow drawer,
// and the glyphs make them unmistakable in any language.
// ─────────────────────────────────────────────────────────────────────────────

export default function MessageChannels({
  /** Prefills the WhatsApp conversation. Telegram cannot accept it. */
  message,
  /** Analytics label for where the pair was pressed. */
  location,
  /** Visual weight of the WhatsApp button; Telegram is always secondary. */
  variant = 'secondary',
  /** Stretch both to fill the container, for sidebars and the mobile drawer. */
  block = false,
  className = '',
}) {
  const telegram = telegramLink()
  const primaryClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  const widthClass = block ? 'flex-1' : ''

  return (
    <div className={`flex flex-col gap-2.5 sm:flex-row ${className}`}>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('contact_whatsapp', { location })}
        className={`${primaryClass} ${widthClass}`}
      >
        <WhatsAppGlyph className="h-4 w-4" />
        WhatsApp
      </a>

      {/* Rendered only when a handle is configured, so clearing it in brand.js
          removes the button rather than leaving a dead link. */}
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('contact_telegram', { location })}
          className={`btn-secondary ${widthClass}`}
        >
          <TelegramGlyph className="h-4 w-4" />
          Telegram
        </a>
      )}
    </div>
  )
}
