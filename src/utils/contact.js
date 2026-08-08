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

/** A configured handle that is digits rather than a @username. */
function telegramIsPhone(handle) {
  return /^\+?\d[\d\s()-]+$/.test(handle)
}

/**
 * True when the configured Telegram handle can carry a prefilled message.
 *
 * Only username links can. `t.me/+905551234567` is a contact-import link and
 * Telegram accepts no parameters on it at all, so a `?text=` there is dropped
 * and the visitor lands in an empty chat with the enquiry they just typed gone.
 * Registering a @username on the business account is the single change that
 * would make Telegram behave exactly like WhatsApp here; see brand.js.
 */
export function telegramCarriesText() {
  const handle = brand.contact.telegram.trim()
  return Boolean(handle) && !telegramIsPhone(handle)
}

/**
 * Telegram accepts either a @username or a phone number in E.164 form. A number
 * has to keep its leading "+", so it is normalised here rather than at the call
 * site, and a username is passed through untouched.
 *
 * `text` is honoured only where Telegram honours it; see telegramCarriesText.
 */
export function telegramLink(text) {
  const handle = brand.contact.telegram.trim()
  if (!handle) return null

  if (telegramIsPhone(handle)) return `https://t.me/+${handle.replace(/\D/g, '')}`

  const username = handle.replace(/^@/, '')
  return text ? `https://t.me/${username}?text=${encodeURIComponent(text)}` : `https://t.me/${username}`
}

/**
 * Open Telegram with the enquiry attached, by whatever means the configured
 * handle allows. Resolves to what actually happened:
 *
 *   'sent'   the message rode in the URL, exactly like WhatsApp
 *   'copied' the link could not carry it, so it is on the clipboard to paste
 *   'manual' neither worked; the chat is open but empty
 *
 * Callers are expected to tell the visitor which of the three it was. Claiming
 * the enquiry was copied when the clipboard was refused leaves someone staring
 * at an empty chat with nothing to paste, which is worse than saying nothing.
 *
 * The clipboard write is deliberately awaited *before* the window is opened:
 * writing to the clipboard from a document that has just been backgrounded is
 * refused by every browser that implements the permission properly.
 */
export async function openTelegram(message) {
  const href = telegramLink(message)
  if (!href) return 'manual'

  const open = () => window.open(href, '_blank', 'noopener,noreferrer')

  if (!message || telegramCarriesText()) {
    open()
    return 'sent'
  }

  let copied = false
  try {
    await navigator.clipboard.writeText(message)
    copied = true
  } catch {
    /* No clipboard API, or permission refused. The chat still opens. */
  }
  open()
  return copied ? 'copied' : 'manual'
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
 *
 * `phone` arrives already in international form rather than being composed
 * here: this module is imported by the header and the footer, so it is in the
 * bundle on every page, and the 150-country dialling table it would need is
 * only ever wanted on the enquiry form.
 */
export function bespokeMessage(form, t, phone = '') {
  const lines = [
    t('bespoke.title'),
    '',
    `${t('bespoke.fields.arrival')}: ${form.arrival || '-'}${form.flexible ? ` (${t('bespoke.fields.flexible')})` : ''}`,
    `${t('bespoke.fields.nights')}: ${form.nights || '-'}`,
    `${t('bespoke.fields.adults')}: ${form.adults || '-'}`,
  ]

  // Only mentioned when there are any. A line reading "Infants: 0" is noise on
  // an enquiry that is read on a phone.
  if (Number(form.children) > 0) lines.push(`${t('bespoke.fields.children')}: ${form.children}`)
  if (Number(form.infants) > 0) lines.push(`${t('bespoke.fields.infants')}: ${form.infants}`)
  // Only when asked for, and phrased as a statement rather than repeating the
  // question with a "yes" after it. A "child seat: no" line would tell the
  // office nothing it could not infer from the head counts anyway.
  if (form.childSeat) lines.push(t('bespoke.fields.childSeatRequested'))

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

  // Always in full international form. A number that arrives without its
  // country code is a number nobody can call back.
  if (phone) lines.push(`${t('bespoke.fields.phone')}: ${phone}`)

  return lines.join('\n')
}
