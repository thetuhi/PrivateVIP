// Country dialling codes for the enquiry form's phone field.
//
// Names are stored in English only. The picker localises them at runtime with
// `Intl.DisplayNames`, which every browser we support has shipped for years and
// which already knows all three of our languages; hand-translating 150 country
// names into en/ru/tr would be a large, permanently stale table for no gain.
// The English name is kept as the fallback and is always searchable, so a
// Russian visitor typing "Germany" still finds Германия.

/**
 * `alias` holds the names people actually type that are neither the official
 * English name nor the localised one. Only added where the mismatch is common
 * enough to matter, not as a general-purpose synonym list.
 */
export const COUNTRIES = [
  { iso: 'AF', dial: '93', name: 'Afghanistan' },
  { iso: 'AL', dial: '355', name: 'Albania' },
  { iso: 'DZ', dial: '213', name: 'Algeria' },
  { iso: 'AD', dial: '376', name: 'Andorra' },
  { iso: 'AR', dial: '54', name: 'Argentina' },
  { iso: 'AM', dial: '374', name: 'Armenia' },
  { iso: 'AU', dial: '61', name: 'Australia' },
  { iso: 'AT', dial: '43', name: 'Austria' },
  { iso: 'AZ', dial: '994', name: 'Azerbaijan' },
  { iso: 'BH', dial: '973', name: 'Bahrain' },
  { iso: 'BD', dial: '880', name: 'Bangladesh' },
  { iso: 'BY', dial: '375', name: 'Belarus' },
  { iso: 'BE', dial: '32', name: 'Belgium' },
  { iso: 'BZ', dial: '501', name: 'Belize' },
  { iso: 'BT', dial: '975', name: 'Bhutan' },
  { iso: 'BO', dial: '591', name: 'Bolivia' },
  { iso: 'BA', dial: '387', name: 'Bosnia and Herzegovina' },
  { iso: 'BW', dial: '267', name: 'Botswana' },
  { iso: 'BR', dial: '55', name: 'Brazil' },
  { iso: 'BN', dial: '673', name: 'Brunei' },
  { iso: 'BG', dial: '359', name: 'Bulgaria' },
  { iso: 'KH', dial: '855', name: 'Cambodia' },
  { iso: 'CA', dial: '1', name: 'Canada' },
  { iso: 'CL', dial: '56', name: 'Chile' },
  { iso: 'CN', dial: '86', name: 'China' },
  { iso: 'CO', dial: '57', name: 'Colombia' },
  { iso: 'CR', dial: '506', name: 'Costa Rica' },
  { iso: 'HR', dial: '385', name: 'Croatia' },
  { iso: 'CU', dial: '53', name: 'Cuba' },
  { iso: 'CY', dial: '357', name: 'Cyprus' },
  { iso: 'CZ', dial: '420', name: 'Czechia', alias: 'czech republic' },
  { iso: 'DK', dial: '45', name: 'Denmark' },
  { iso: 'EC', dial: '593', name: 'Ecuador' },
  { iso: 'EG', dial: '20', name: 'Egypt' },
  { iso: 'SV', dial: '503', name: 'El Salvador' },
  { iso: 'EE', dial: '372', name: 'Estonia' },
  { iso: 'ET', dial: '251', name: 'Ethiopia' },
  { iso: 'FO', dial: '298', name: 'Faroe Islands' },
  { iso: 'FJ', dial: '679', name: 'Fiji' },
  { iso: 'FI', dial: '358', name: 'Finland' },
  { iso: 'FR', dial: '33', name: 'France' },
  { iso: 'GM', dial: '220', name: 'Gambia' },
  { iso: 'GE', dial: '995', name: 'Georgia' },
  { iso: 'DE', dial: '49', name: 'Germany', alias: 'deutschland' },
  { iso: 'GH', dial: '233', name: 'Ghana' },
  { iso: 'GI', dial: '350', name: 'Gibraltar' },
  { iso: 'GR', dial: '30', name: 'Greece' },
  { iso: 'GL', dial: '299', name: 'Greenland' },
  { iso: 'GT', dial: '502', name: 'Guatemala' },
  { iso: 'HT', dial: '509', name: 'Haiti' },
  { iso: 'HN', dial: '504', name: 'Honduras' },
  { iso: 'HK', dial: '852', name: 'Hong Kong' },
  { iso: 'HU', dial: '36', name: 'Hungary' },
  { iso: 'IS', dial: '354', name: 'Iceland' },
  { iso: 'IN', dial: '91', name: 'India' },
  { iso: 'ID', dial: '62', name: 'Indonesia' },
  { iso: 'IR', dial: '98', name: 'Iran' },
  { iso: 'IQ', dial: '964', name: 'Iraq' },
  { iso: 'IE', dial: '353', name: 'Ireland' },
  { iso: 'IL', dial: '972', name: 'Israel' },
  { iso: 'IT', dial: '39', name: 'Italy' },
  { iso: 'JM', dial: '1876', name: 'Jamaica' },
  { iso: 'JP', dial: '81', name: 'Japan' },
  { iso: 'JO', dial: '962', name: 'Jordan' },
  { iso: 'KZ', dial: '7', name: 'Kazakhstan' },
  { iso: 'KE', dial: '254', name: 'Kenya' },
  { iso: 'XK', dial: '383', name: 'Kosovo' },
  { iso: 'KW', dial: '965', name: 'Kuwait' },
  { iso: 'KG', dial: '996', name: 'Kyrgyzstan' },
  { iso: 'LA', dial: '856', name: 'Laos' },
  { iso: 'LV', dial: '371', name: 'Latvia' },
  { iso: 'LB', dial: '961', name: 'Lebanon' },
  { iso: 'LY', dial: '218', name: 'Libya' },
  { iso: 'LI', dial: '423', name: 'Liechtenstein' },
  { iso: 'LT', dial: '370', name: 'Lithuania' },
  { iso: 'LU', dial: '352', name: 'Luxembourg' },
  { iso: 'MO', dial: '853', name: 'Macao' },
  { iso: 'MY', dial: '60', name: 'Malaysia' },
  { iso: 'MV', dial: '960', name: 'Maldives' },
  { iso: 'MT', dial: '356', name: 'Malta' },
  { iso: 'MX', dial: '52', name: 'Mexico' },
  { iso: 'MD', dial: '373', name: 'Moldova' },
  { iso: 'MC', dial: '377', name: 'Monaco' },
  { iso: 'MN', dial: '976', name: 'Mongolia' },
  { iso: 'ME', dial: '382', name: 'Montenegro' },
  { iso: 'MA', dial: '212', name: 'Morocco' },
  { iso: 'MM', dial: '95', name: 'Myanmar' },
  { iso: 'NA', dial: '264', name: 'Namibia' },
  { iso: 'NP', dial: '977', name: 'Nepal' },
  { iso: 'NL', dial: '31', name: 'Netherlands', alias: 'holland' },
  { iso: 'NZ', dial: '64', name: 'New Zealand' },
  { iso: 'NI', dial: '505', name: 'Nicaragua' },
  { iso: 'NG', dial: '234', name: 'Nigeria' },
  { iso: 'MK', dial: '389', name: 'North Macedonia', alias: 'macedonia' },
  { iso: 'NO', dial: '47', name: 'Norway' },
  { iso: 'OM', dial: '968', name: 'Oman' },
  { iso: 'PK', dial: '92', name: 'Pakistan' },
  { iso: 'PS', dial: '970', name: 'Palestine' },
  { iso: 'PA', dial: '507', name: 'Panama' },
  { iso: 'PY', dial: '595', name: 'Paraguay' },
  { iso: 'PE', dial: '51', name: 'Peru' },
  { iso: 'PH', dial: '63', name: 'Philippines' },
  { iso: 'PL', dial: '48', name: 'Poland' },
  { iso: 'PT', dial: '351', name: 'Portugal' },
  { iso: 'QA', dial: '974', name: 'Qatar' },
  { iso: 'RO', dial: '40', name: 'Romania' },
  { iso: 'RU', dial: '7', name: 'Russia' },
  { iso: 'SM', dial: '378', name: 'San Marino' },
  { iso: 'SA', dial: '966', name: 'Saudi Arabia', alias: 'ksa' },
  { iso: 'SN', dial: '221', name: 'Senegal' },
  { iso: 'RS', dial: '381', name: 'Serbia' },
  { iso: 'SG', dial: '65', name: 'Singapore' },
  { iso: 'SK', dial: '421', name: 'Slovakia' },
  { iso: 'SI', dial: '386', name: 'Slovenia' },
  { iso: 'ZA', dial: '27', name: 'South Africa' },
  { iso: 'KR', dial: '82', name: 'South Korea', alias: 'korea' },
  { iso: 'ES', dial: '34', name: 'Spain' },
  { iso: 'LK', dial: '94', name: 'Sri Lanka' },
  { iso: 'SE', dial: '46', name: 'Sweden' },
  { iso: 'CH', dial: '41', name: 'Switzerland' },
  { iso: 'SY', dial: '963', name: 'Syria' },
  { iso: 'TW', dial: '886', name: 'Taiwan' },
  { iso: 'TJ', dial: '992', name: 'Tajikistan' },
  { iso: 'TZ', dial: '255', name: 'Tanzania' },
  { iso: 'TH', dial: '66', name: 'Thailand' },
  { iso: 'TN', dial: '216', name: 'Tunisia' },
  { iso: 'TR', dial: '90', name: 'Türkiye', alias: 'turkey turkiye' },
  { iso: 'TM', dial: '993', name: 'Turkmenistan' },
  { iso: 'UG', dial: '256', name: 'Uganda' },
  { iso: 'UA', dial: '380', name: 'Ukraine' },
  { iso: 'AE', dial: '971', name: 'United Arab Emirates', alias: 'uae emirates dubai abu dhabi' },
  { iso: 'GB', dial: '44', name: 'United Kingdom', alias: 'uk britain england scotland wales' },
  { iso: 'US', dial: '1', name: 'United States', alias: 'usa us america' },
  { iso: 'UY', dial: '598', name: 'Uruguay' },
  { iso: 'UZ', dial: '998', name: 'Uzbekistan' },
  { iso: 'VE', dial: '58', name: 'Venezuela' },
  { iso: 'VN', dial: '84', name: 'Vietnam' },
  { iso: 'YE', dial: '967', name: 'Yemen' },
  { iso: 'ZM', dial: '260', name: 'Zambia' },
  { iso: 'ZW', dial: '263', name: 'Zimbabwe' },
]

/**
 * Pinned to the top of an unfiltered list. These are where our enquiries
 * actually come from, and scrolling past 140 countries to reach Türkiye or
 * Russia is the single worst thing a picker like this can do.
 *
 * Ordered by where the guests come from, not alphabetically: Türkiye, then the
 * Russian-speaking and Turkic markets, then Europe and the Gulf. The order is
 * the recommendation, so it is worth keeping deliberate.
 */
export const SUGGESTED_ISO = ['TR', 'RU', 'UA', 'KZ', 'UZ', 'GB', 'DE', 'AZ', 'FR', 'NL', 'US', 'AE', 'SA']

/**
 * How many digits a national number has, once the country code and any trunk
 * zero are off. A single number means exactly that many; a pair is an
 * inclusive range.
 *
 * Kept as a separate table rather than a field on every country because it is
 * the part most likely to need correcting later, and because anything missing
 * here falls back to DEFAULT_LENGTH rather than breaking.
 *
 * Deliberately generous. This exists to catch a typo, a missing digit or a
 * doubled country code, not to adjudicate whether a number is issued: a range
 * that is one digit too wide costs nothing, while one that is a digit too
 * narrow rejects a real guest's real phone number, which is unforgivable in a
 * form whose whole job is to let them reach us. Where a country's landlines
 * and mobiles disagree, the range covers both.
 */
const LENGTHS = {
  AD: 6, AE: 9, AF: 9, AL: 9, AM: 8, AR: [10, 11], AT: [7, 13], AU: 9, AZ: 9,
  BA: 8, BD: [9, 10], BE: [8, 9], BG: 9, BH: 8, BN: 7, BO: 8, BR: [10, 11],
  BT: 8, BW: [7, 8], BY: 9, BZ: 7, CA: 10, CH: 9, CL: 9, CN: [10, 11], CO: 10,
  CR: 8, CU: 8, CY: 8, CZ: 9, DE: [6, 11], DK: 8, DZ: 9, EC: 9, EE: [7, 8],
  EG: 10, ES: 9, ET: 9, FI: [7, 11], FJ: 7, FO: 6, FR: 9, GB: [9, 10], GE: 9,
  GH: 9, GI: 8, GL: 6, GM: 7, GR: 10, GT: 8, HK: 8, HN: 8, HR: 9, HT: 8,
  HU: 9, ID: [9, 12], IE: [7, 9], IL: [8, 9], IN: 10, IQ: 10, IR: 10,
  IS: 7, IT: [6, 11], JM: 7, JO: 9, JP: [9, 10], KE: 9, KG: 9, KH: [8, 9],
  KR: [9, 10], KW: 8, KZ: 10, LA: [8, 9], LB: [7, 8], LI: 7, LK: 9, LT: 8,
  LU: 9, LV: 8, LY: 9, MA: 9, MC: 8, MD: 8, ME: 8, MK: 8, MM: [8, 10], MN: 8,
  MO: 8, MT: 8, MV: 7, MX: 10, MY: [9, 10], NA: 9, NG: 10, NI: 8, NL: 9,
  NO: 8, NP: 10, NZ: [8, 10], OM: 8, PA: 8, PE: 9, PH: 10, PK: 10, PL: 9,
  PS: 9, PT: 9, PY: 9, QA: 8, RO: 9, RS: [8, 9], RU: 10, SA: 9, SE: [7, 9],
  SG: 8, SI: 8, SK: 9, SM: 10, SN: 9, SV: 8, SY: 9, TH: 9, TJ: 9, TM: 8,
  TN: 8, TR: 10, TW: 9, TZ: 9, UA: 9, UG: 9, US: 10, UY: 8, UZ: 9, VE: 10,
  VN: 9, XK: 8, YE: 9, ZA: 9, ZM: 9, ZW: 9,
}

/** Anything not in LENGTHS. Wide enough to accept every real number. */
const DEFAULT_LENGTH = [4, 15]

const BY_ISO = new Map(COUNTRIES.map((c) => [c.iso, c]))

/** Longest dial code first, so `+1876` wins over `+1` when parsing a paste. */
const BY_DIAL_LENGTH = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length)

export const DEFAULT_ISO = 'TR'

/** Language-to-region fallback, used when the browser reports no region. */
const LANG_REGION = { tr: 'TR', ru: 'RU', en: 'GB' }

export function getCountry(iso) {
  return BY_ISO.get(iso) ?? BY_ISO.get(DEFAULT_ISO)
}

/**
 * The flag as regional-indicator pairs. Windows has no flag glyphs and falls
 * back to rendering the two letters, which is the ISO code, so the picker still
 * says something true rather than showing tofu. Nothing depends on reading it:
 * the country name and the dial code sit right beside it.
 */
export function flagOf(iso) {
  return String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

/**
 * Best guess at the visitor's country: the region the browser reports, then the
 * interface language, then Türkiye. Only ever a starting value, the picker is
 * one tap away and the guess is visible rather than hidden in a submit handler.
 */
export function guessCountry(lang = 'en') {
  const tags = typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language])
  for (const tag of tags) {
    if (!tag) continue
    let region
    try {
      region = new Intl.Locale(tag).maximize().region
    } catch {
      region = tag.split('-')[1]?.toUpperCase()
    }
    if (region && BY_ISO.has(region)) return region
  }
  return LANG_REGION[lang] ?? DEFAULT_ISO
}

/**
 * Localised country names, memoised per language. `Intl.DisplayNames` returns
 * the ISO code unchanged for a region it does not know, so the English name is
 * used whenever that happens.
 */
const nameCache = new Map()

export function countryName(iso, lang = 'en') {
  const key = `${lang}:${iso}`
  const cached = nameCache.get(key)
  if (cached) return cached

  const fallback = getCountry(iso).name
  let name = fallback
  try {
    const localised = new Intl.DisplayNames([lang], { type: 'region' }).of(iso)
    if (localised && localised !== iso) name = localised
  } catch {
    /* No Intl.DisplayNames, or an unsupported locale: keep the English name. */
  }

  nameCache.set(key, name)
  return name
}

/**
 * Case- and accent-insensitive search key. Stripping diacritics is what lets
 * "Turkiye" find "Türkiye" and "Osterreich" find "Österreich", which is how
 * people type when they are on a keyboard that is not their own.
 */
export function normalise(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/** Only these keep their national trunk "0" inside the international number. */
const TRUNK_ZERO_KEPT = new Set(['IT'])

/**
 * Strip the national trunk prefix. Someone in Istanbul writes their mobile as
 * 0532…, but +90 0532… is not a number anyone can dial, so the leading zero has
 * to come off before the enquiry is sent. Italy is the well-known exception:
 * its landlines genuinely keep the zero.
 */
export function stripTrunkZero(number, iso) {
  if (TRUNK_ZERO_KEPT.has(iso)) return number
  return number.replace(/^0+\s*(?=\d)/, '')
}

/** Digits only, which is what length checks and the final link both want. */
export function digitsOf(number) {
  return (number ?? '').replace(/\D/g, '')
}

/**
 * The number as it will be sent, and as it is read back to the visitor above
 * the send buttons.
 *
 * The grouping the visitor typed is kept rather than flattened to one run of
 * digits: this string exists to be checked by eye, and "+44 7700 900123" is
 * checkable where "+447700900123" is not. Brackets and dashes collapse to
 * spaces so the shape survives without the punctuation. Empty when nothing was
 * typed, so callers can use it as the "is there a phone number" test too.
 */
export function internationalPhone(iso, number) {
  const national = stripTrunkZero(
    (number ?? '')
      .replace(/[^\d\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    iso,
  )
  if (!digitsOf(national)) return ''
  return `+${getCountry(iso).dial} ${national}`
}

/** Inclusive [min, max] digit count for a country's national number. */
export function nationalLength(iso) {
  const len = LENGTHS[getCountry(iso).iso] ?? DEFAULT_LENGTH
  return typeof len === 'number' ? [len, len] : len
}

/** The most digits worth accepting. Used to stop typing rather than to scold. */
export function maxNationalLength(iso) {
  return nationalLength(iso)[1]
}

/**
 * How to say the expected length to a human: "10" for a fixed length, "9-11"
 * for a range. Returned as a string because it is only ever interpolated into
 * a sentence, and null where the country has no meaningful expectation, so the
 * hint can stay quiet rather than claim "4-15 digits", which helps nobody.
 */
export function expectedDigits(iso) {
  const [min, max] = nationalLength(iso)
  if (min === DEFAULT_LENGTH[0] && max === DEFAULT_LENGTH[1]) return null
  return min === max ? String(min) : `${min}-${max}`
}

/**
 * Length verdict for a typed number: null when it is fine or empty, otherwise
 * 'short' or 'long'. Only length is judged. Deciding whether a given prefix is
 * an issued mobile range is what libphonenumber is for, and getting that
 * half-right would reject real numbers, which is worse than accepting a fake.
 */
export function phoneLengthProblem(iso, number) {
  const count = digitsOf(stripTrunkZero((number ?? '').trim(), iso)).length
  if (!count) return null
  const [min, max] = nationalLength(iso)
  if (count < min) return 'short'
  if (count > max) return 'long'
  return null
}

/**
 * Split a pasted international number into a country and the rest. Returns null
 * when the string is not international, so the caller can leave the field alone.
 *
 * Both "+90 532…" and the "00 90 532…" form dialled out of Europe are accepted.
 * Where two countries share a code the more populous one wins (+1 → US, +7 →
 * RU); the visitor can still correct it in one tap, and guessing beats refusing.
 */
export function parseInternational(raw) {
  const trimmed = raw.trim()
  if (!/^(\+|00)\d/.test(trimmed)) return null

  const digits = digitsOf(trimmed).replace(/^00/, '')
  const match = BY_DIAL_LENGTH.find((c) => digits.startsWith(c.dial))
  if (!match) return null

  const shared = { 1: 'US', 7: 'RU' }
  const iso = shared[match.dial] ?? match.iso
  return { iso, number: digits.slice(match.dial.length) }
}
