// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for company identity.
//
// Nothing below is written by hand anywhere else in the codebase. Change a
// value here and it updates the header, footer, contact page, WhatsApp links,
// structured data and share tags at once.
//
// ⚠ REPLACE BEFORE LAUNCH, every value marked TODO is a placeholder.
// ─────────────────────────────────────────────────────────────────────────────

export const brand = {
  name: 'Private VIP Istanbul',
  shortName: 'Private VIP',
  tagline: {
    en: 'Istanbul, on your own terms',
    ru: 'Стамбул на ваших условиях',
    tr: 'İstanbul, sizin şartlarınızda',
  },

  // TODO: confirm the licensed agency name and TÜRSAB certificate number.
  // Turkish law requires the licence number to appear on the site.
  legalName: 'Private VIP Turizm Seyahat Acentesi',
  tursabNumber: '0000', // TODO
  taxOffice: '', // TODO, optional, some clients want it in the footer

  founded: 2014, // TODO

  contact: {
    // E.164, digits only. Used to build the wa.me and t.me links.
    whatsapp: '905433542335',
    phone: '+90 543 354 23 35',
    phoneHref: '+905433542335',
    email: 'reservations@privatevipistanbul.com', // TODO
    // Telegram is reachable by phone number when no @username is set. Swap this
    // for a username (without the @) if one is registered later.
    telegram: '+905433542335',
  },

  office: {
    street: 'Asmalı Mescit Mah.', // TODO
    district: 'Beyoğlu',
    city: 'Istanbul',
    postcode: '34430', // TODO
    country: 'Türkiye',
    // Used by the map embed and the "open in maps" link.
    coordinates: { lat: 41.0296, lng: 28.9752 }, // TODO
  },

  hours: {
    en: 'Reservations answered 09:00 – 22:00 (GMT+3), seven days',
    ru: 'Бронирование: 09:00 – 22:00 (GMT+3), без выходных',
    tr: 'Rezervasyon: 09:00 – 22:00 (GMT+3), her gün',
  },

  social: {
    instagram: 'https://www.instagram.com/privatevipturizm',
    tripadvisor: '', // TODO, leave empty to hide the link
    youtube: '',
  },

  // Trust signals shown in the footer and on About. Keep to things you can
  // actually evidence; unverifiable claims read as noise on a luxury site.
  credentials: [
    { key: 'licensed', value: 'TÜRSAB' },
    { key: 'insured', value: null },
    { key: 'englishGuides', value: null },
    { key: 'noSharedGroups', value: null },
  ],
}

export const fullAddress = [
  brand.office.street,
  `${brand.office.postcode} ${brand.office.district}`,
  `${brand.office.city}, ${brand.office.country}`,
].join(', ')

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', dir: 'ltr' },
  { code: 'ru', label: 'Русский', short: 'RU', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', short: 'TR', dir: 'ltr' },
]

export default brand
