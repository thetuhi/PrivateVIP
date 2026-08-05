import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react'

import SectionHeading from '../components/SectionHeading'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import MapCard from '../components/MapCard'
import { brand, fullAddress } from '../config/brand'
import { whatsappLink, telegramLink, phoneLink, mailtoLink } from '../utils/contact'
import { localise } from '../utils/localise'
import { trackEvent } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import { cardIn } from '../motion/presets'
import WhatsAppGlyph from '../components/icons/WhatsAppGlyph'
import TelegramGlyph from '../components/icons/TelegramGlyph'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  useSeo({
    title: t('contact.metaTitle'),
    description: t('contact.lede'),
  })

  const channels = [
    {
      id: 'whatsapp',
      Icon: WhatsAppGlyph,
      title: t('contact.whatsappTitle'),
      body: t('contact.whatsappBody'),
      value: brand.contact.phone,
      href: whatsappLink(),
      external: true,
    },
    {
      id: 'telegram',
      Icon: TelegramGlyph,
      title: 'Telegram',
      body: t('contact.telegramBody'),
      value: brand.contact.phone,
      href: telegramLink(),
      external: true,
    },
    {
      id: 'phone',
      Icon: Phone,
      title: t('contact.phoneTitle'),
      body: t('contact.phoneBody'),
      value: brand.contact.phone,
      href: phoneLink(),
      external: false,
    },
    {
      id: 'email',
      Icon: Mail,
      title: t('contact.emailTitle'),
      body: t('contact.emailBody'),
      value: brand.contact.email,
      href: mailtoLink(),
      external: false,
    },
  ]

  return (
    <>
      <section className="section pt-36 lg:pt-44">
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={t('contact.eyebrow')}
            title={t('contact.title')}
            lede={t('contact.lede')}
            size="xl"
            className="max-w-3xl"
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ id, Icon, title, body, value, href, external }) => (
              <RevealItem as="li" key={id} variant={cardIn}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => trackEvent(`contact_${id}`, { location: 'contact_page' })}
                  className="card group flex h-full flex-col p-6 hover:border-brass-700 hover:bg-ink-700"
                >
                  <Icon className="h-6 w-6 text-brass-500" strokeWidth={1.25} aria-hidden="true" />
                  <h2 className="mt-5 font-display text-2xl leading-tight text-bone">{title}</h2>
                  <p className="mt-2.5 flex-1 text-sm font-light leading-relaxed text-bone-dim">{body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-400">
                    {value}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-base ease-enter group-hover:translate-x-1 motion-reduce:transform-none"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Office & hours */}
      <section className="section border-t border-ink-800 bg-ink-900">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="eyebrow flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {t('contact.officeTitle')}
            </h2>
            {/* Kept at display size. It is the only physical address on the
                site, and it balances the hours column opposite, which sets its
                one line at the same weight. */}
            <address className="mt-5 font-display text-3xl not-italic leading-tight text-bone">{fullAddress}</address>
            <p className="prose-body mt-4">{t('contact.officeBody')}</p>

            {/* Was a lone secondary button under a line of text, which is the
                weakest thing this section could have offered: the one place on
                the site with a physical address, answered with a link. MapCard
                carries the address, the district and a drawn map, and is itself
                the link, so the whole block is the invitation. */}
            <MapCard label={t('contact.openInMaps')} />
          </Reveal>

          <Reveal>
            <h2 className="eyebrow flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {t('contact.hoursTitle')}
            </h2>
            <p className="mt-5 font-display text-3xl leading-tight text-bone">{localise(brand.hours, lang)}</p>

            <hr className="rule my-8" />

            <h2 className="text-display-sm text-bone">{t('contact.formTitle')}</h2>
            <p className="prose-body mt-3">{t('contact.formBody')}</p>
            <Link to="/plan" className="btn-primary mt-7">
              {t('nav.bespoke')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
