import { brand } from '../config/brand'

// Every outbound contact link in the site is built here, so the phone number
// exists in exactly one place (src/config/brand.js) and the message templates
// stay consistent across the header, the cards and the enquiry form.

const WA_BASE = 'https://wa.me'

/**
 * Build a WhatsApp deep link. `text` is optional, without it the user lands
 * in an empty thread, which is what a generic "message us" button should do.
 */
export function whatsappLink(text) {
  const number = brand.contact.whatsapp.replace(/\D/g, '')
  return text ? `${WA_BASE}/${number}?text=${encodeURIComponent(text)}` : `${WA_BASE}/${number}`
}

/**
 * Telegram accepts either a @username or a phone number in E.164 form. A number
 * has to keep its leading "+", so it is normalised here rather than at the call
 * site, and a username is passed through untouched.
 */
export function telegramLink() {
  const handle = brand.contact.telegram.trim()
  if (!handle) return null
  const isPhone = /^\+?\d[\d\s()-]+$/.test(handle)
  return isPhone ? `https://t.me/+${handle.replace(/\D/g, '')}` : `https://t.me/${handle.replace(/^@/, '')}`
}

export function phoneLink() {
  return `tel:${brand.contact.phoneHref}`
}

export function mailtoLink(subject, body) {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const qs = params.toString()
  return `mailto:${brand.contact.email}${qs ? `?${qs}` : ''}`
}

export function mapsLink() {
  const { lat, lng } = brand.office.coordinates
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

// ---- Message templates -----------------------------------------------------

const GREETING = {
 en: 'Hello. I found you through your website.',
  ru: 'Здравствуйте! Я нашёл(-ла) вас через ваш сайт.',
    tr: 'Merhaba, sizi web sitenizden buldum.',
}

const ABOUT = {
  en: 'I would like to ask about',
  ru: 'Хотел(-а) бы узнать про',
  tr: 'Şunun hakkında bilgi almak istiyorum:',
}

/** Pre-filled enquiry for a specific experience, yacht or vehicle. */
export function enquiryMessage(itemName, lang = 'en') {
  const greeting = GREETING[lang] ?? GREETING.en
  const about = ABOUT[lang] ?? ABOUT.en
  return `${greeting} ${about} "${itemName}".`
}

/**
 * Turn a completed bespoke form into a readable WhatsApp message. Written as
 * labelled lines rather than JSON so the recipient can act on it directly.
 */
export function bespokeMessage(form, t) {
  const lines = [
    t('bespoke.title'),
    '',
      `${t('bespoke.fields.arrival')}: ${form.arrival || '-'}${form.flexible ? ` (${t('bespoke.fields.flexible')})` : ''}`,
        `${t('bespoke.fields.nights')}: ${form.nights || '-'}`,
          `${t('bespoke.fields.adults')}: ${form.adults || '-'}`,
  ]

  if (Number(form.children) > 0) {
    lines.push(`${t('bespoke.fields.children')}: ${form.children}`)
    if (form.childrenAges) lines.push(`${t('bespoke.fields.childrenAges')}: ${form.childrenAges}`)
  }

  if (form.services.length) {
    lines.push(`${t('bespoke.fields.services')}: ${form.services.map((s) => t(`bespoke.services.${s}`)).join(', ')}`)
  }
  if (form.interests.length) {
    lines.push(`${t('bespoke.fields.interests')}: ${form.interests.map((i) => t(`bespoke.interests.${i}`)).join(', ')}`)
  }
  if (form.pace) lines.push(`${t('bespoke.fields.pace')}: ${t(`bespoke.pace.${form.pace}`)}`)
  if (form.notes) lines.push('', `${t('bespoke.fields.notes')}: ${form.notes}`)

  lines.push('', `${t('bespoke.fields.name')}: ${form.name || '-'}`)
  if (form.email) lines.push(`${t('bespoke.fields.email')}: ${form.email}`)
  if (form.phone) lines.push(`${t('bespoke.fields.phone')}: ${form.phone}`)

  return lines.join('\n')
}
