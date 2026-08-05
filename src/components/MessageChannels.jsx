import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Copy } from 'lucide-react'
import WhatsAppGlyph from './icons/WhatsAppGlyph'
import TelegramGlyph from './icons/TelegramGlyph'
import { whatsappLink, telegramLink, telegramCarriesText, openTelegram } from '../utils/contact'
import { trackEvent } from '../utils/analytics'

// ─────────────────────────────────────────────────────────────────────────────
// MessageChannels
//
// WhatsApp and Telegram, always as a pair. Defined once so the two never drift
// apart: every place the site offers a chat, it offers both, with the same
// labels, the same order and the same tracking.
//
// Both now leave with the enquiry attached. WhatsApp puts it in the URL. What
// Telegram does depends on the handle configured in brand.js: a @username link
// takes `?text=` and behaves identically to WhatsApp, while the phone-number
// link we currently have accepts no parameters at all, so the message is put on
// the clipboard instead and the visitor is told to paste it.
//
// That fallback is a workaround, not the destination. Registering a @username
// on the business Telegram account and putting it in brand.js turns this into
// the same one-tap flow as WhatsApp, with no code change here.
//
// Labels are the bare brand names rather than a translated sentence: they are
// proper nouns, they stay short enough to sit side by side in a narrow drawer,
// and the glyphs make them unmistakable in any language.
// ─────────────────────────────────────────────────────────────────────────────

export default function MessageChannels({
  /** Prefills both conversations. */
  message,
  /** Analytics label for where the pair was pressed. */
  location,
  /** Visual weight of the WhatsApp button; Telegram is always secondary. */
  variant = 'secondary',
  /** Stretch both to fill the container, for sidebars and the mobile drawer. */
  block = false,
  className = '',
}) {
  const { t } = useTranslation()
  // null until a Telegram press needed the clipboard route, then 'copied' or
  // 'manual'. Never set when the link carried the message itself: there is
  // nothing to explain in that case.
  const [outcome, setOutcome] = useState(null)

  const telegram = telegramLink(message)
  const primaryClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  const widthClass = block ? 'flex-1' : ''

  async function onTelegramClick(e) {
    trackEvent('contact_telegram', { location })
    if (telegramCarriesText()) return // Let the anchor do its job.

    // The href alone would open an empty chat, so the click is taken over and
    // the enquiry routed through the clipboard first.
    e.preventDefault()
    setOutcome(await openTelegram(message))
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
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
            onClick={onTelegramClick}
            className={`btn-secondary ${widthClass}`}
          >
            <TelegramGlyph className="h-4 w-4" />
            Telegram
          </a>
        )}
      </div>

      {/* Announced politely: the chat has already opened in another tab, so
          pulling focus here would fight the visitor for it. */}
      <div aria-live="polite">
        {outcome && (
          <p
            className={`mt-3 flex items-start gap-2 rounded-card border p-3 text-sm font-light leading-relaxed ${
              outcome === 'copied'
                ? 'border-brass-700/60 bg-brass-500/5 text-brass-300'
                : 'border-danger/40 bg-danger/5 text-danger'
            }`}
          >
            {outcome === 'copied' ? (
              <Copy className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            )}
            {outcome === 'copied' ? t('common.telegramCopied') : t('common.telegramCopyFailed')}
          </p>
        )}
      </div>
    </div>
  )
}
