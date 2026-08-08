// Catalog data stores visitor-facing strings as { en, ru, tr } objects rather
// than as translation keys, because the content is the product and it belongs
// next to the itinerary and the photo list, not in a JSON file three folders
// away.
//
// localise() resolves one of those objects for the active language, falling
// back to English so a half-translated entry degrades to readable rather than
// blank.

const FALLBACK = 'en'

export function localise(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value[FALLBACK] ?? ''
}

/** Curried form for use inside a component that already knows its language. */
export function makeLocaliser(lang) {
  return (value) => localise(value, lang)
}

export function formatDate(isoDate, lang) {
  const locale = { en: 'en-GB', ru: 'ru-RU', tr: 'tr-TR' }[lang] ?? 'en-GB'
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate))
}
