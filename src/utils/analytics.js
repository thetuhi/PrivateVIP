// Consent-gated analytics.
//
// The Google Analytics script is not merely blocked until consent, it is
// never requested. Nothing is injected into the page until the visitor presses
// "Allow analytics", and if VITE_GA_MEASUREMENT_ID is unset the whole module
// is inert. That is what the privacy policy claims, so it has to be true.

const STORAGE_KEY = 'pvi-analytics-consent'
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let injected = false

export function getConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY) // 'granted' | 'denied' | null
  } catch {
    // Private browsing modes can throw on localStorage access.
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* Non-fatal: the banner just reappears next visit. */
  }
  if (value === 'granted') loadAnalytics()
}

export function loadAnalytics() {
  if (injected || !MEASUREMENT_ID || typeof document === 'undefined') return
  injected = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false, // Sent manually so SPA route changes are counted.
  })
}

/** Called on every route change once consent exists. No-op otherwise. */
export function trackPageView(path, title) {
  if (!window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  })
}

/** Conversion events: enquiry sent, WhatsApp opened, phone tapped. */
export function trackEvent(name, params = {}) {
  if (!window.gtag) return
  window.gtag('event', name, params)
}

/** Restore a previously granted consent on boot. */
export function initAnalytics() {
  if (getConsent() === 'granted') loadAnalytics()
}
