import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin } from 'lucide-react'
import Logo from './Logo'
import InstagramGlyph from './icons/InstagramGlyph'
import { brand, fullAddress } from '../config/brand'
import { whatsappLink, telegramLink, phoneLink, mailtoLink, mapsLink } from '../utils/contact'
import { trackEvent } from '../utils/analytics'
import { localise } from '../utils/localise'
import WhatsAppGlyph from './icons/WhatsAppGlyph'
import TelegramGlyph from './icons/TelegramGlyph'

const EXPLORE = [
  { to: '/experiences', key: 'nav.experiences' },
  { to: '/yachts', key: 'nav.yachts' },
  { to: '/transfers', key: 'nav.fleet' },
  { to: '/plan', key: 'nav.bespoke' },
]

const COMPANY = [
  { to: '/about', key: 'nav.about' },
  { to: '/faq', key: 'nav.faq' },
  { to: '/contact', key: 'nav.contact' },
]

const LEGAL = [
  { to: '/policy/terms', key: 'legalTerms' },
  { to: '/policy/privacy', key: 'legalPrivacy' },
]

export default function Footer() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const legalLabels = {
    legalTerms: { en: 'Booking terms', ru: 'Условия бронирования', tr: 'Rezervasyon koşulları' },
    legalPrivacy: { en: 'Privacy', ru: 'Конфиденциальность', tr: 'Gizlilik' },
  }

  const contactLinkClass = 'footer-row text-bone-dim hover:text-brass-400'

  return (
    <footer className="relative border-t border-ink-700 bg-ink-950">
      <div className="shell py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Identity */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="prose-body mt-4 max-w-xs text-sm">{t('footer.tagline')}</p>

            {brand.social.instagram && (
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-card border border-ink-700 text-bone-dim transition-colors duration-micro ease-enter hover:border-brass-600 hover:text-brass-400"
              >
                <InstagramGlyph className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Link columns */}
          <nav aria-label={t('footer.explore')} className="lg:col-span-2">
            <h2 className="eyebrow mb-3">{t('footer.explore')}</h2>
            <ul className="flex flex-col">
              {EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="footer-row text-bone-dim hover:text-brass-400"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.company')} className="lg:col-span-2">
            <h2 className="eyebrow mb-3">{t('footer.company')}</h2>
            <ul className="flex flex-col">
              {COMPANY.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="footer-row text-bone-dim hover:text-brass-400"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="footer-row text-bone-muted hover:text-brass-400"
                  >
                    {legalLabels[item.key][lang] ?? legalLabels[item.key].en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="eyebrow mb-3">{t('footer.contactHeading')}</h2>
            <ul className="flex flex-col">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('contact_whatsapp', { location: 'footer' })}
                  className={contactLinkClass}
                >
                  <WhatsAppGlyph className="h-4 w-4 shrink-0" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={telegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('contact_telegram', { location: 'footer' })}
                  className={contactLinkClass}
                >
                  <TelegramGlyph className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={phoneLink()}
                  onClick={() => trackEvent('contact_phone', { location: 'footer' })}
                  className={contactLinkClass}
                >
                  <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {/* Each channel is labelled by its name; the number lives on
                      the one row where it is the thing you act on. */}
                  {brand.contact.phone}
                </a>
              </li>
              <li>
                <a href={mailtoLink()} className={contactLinkClass}>
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${contactLinkClass} items-start`}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="not-italic">{fullAddress}</span>
                </a>
              </li>
            </ul>

            {/* Hours live in brand.js, not the locale files, they are company
                data, not interface copy, and change without a code release. */}
            <p className="mt-3 text-sm text-bone-muted">{localise(brand.hours, lang)}</p>
          </div>
        </div>

        <hr className="rule my-8" />

        <div className="flex flex-col gap-3 text-sm text-bone-muted md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights', { year: new Date().getFullYear(), name: brand.legalName })}</p>
          <p>{t('footer.licence', { number: brand.tursabNumber })}</p>
        </div>

        <p className="mt-2 max-w-prose text-xs text-bone-muted/80">{t('footer.builtNote')}</p>
      </div>
    </footer>
  )
}
