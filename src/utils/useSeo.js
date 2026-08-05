import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { brand } from '../config/brand'

// Minimal head management. React 19 can hoist <title> and <meta> from a
// component tree, but it does not remove tags on unmount, which leaves stale
// descriptions behind on navigation. This hook writes and cleans up explicitly.

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://privatevipistanbul.com'

function upsertMeta(attr, key, content) {
  if (!content) return null
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

/**
 * @param {object} opts
 * @param {string} opts.title    Page title, without the brand suffix.
 * @param {string} opts.description
 * @param {string} [opts.image]  Absolute or root-relative share image.
 * @param {object} [opts.jsonLd] Structured data object, injected as a script.
 */
export function useSeo({ title, description, image, jsonLd }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${brand.name}` : brand.name
    document.title = fullTitle

    const canonical = `${SITE_URL}${pathname}`
    const shareImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/brand/og-cover.webp`

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', shareImage)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', shareImage)
    upsertLink('canonical', canonical)
  }, [title, description, image, pathname])

  useEffect(() => {
    if (!jsonLd) return undefined
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [jsonLd])
}

/** Organisation-level structured data, emitted once on the home page. */
export function organisationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: brand.name,
    legalName: brand.legalName,
    url: SITE_URL,
    telephone: brand.contact.phone,
    email: brand.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.office.street,
      addressLocality: brand.office.district,
      addressRegion: brand.office.city,
      postalCode: brand.office.postcode,
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: brand.office.coordinates.lat,
      longitude: brand.office.coordinates.lng,
    },
    areaServed: 'Istanbul, Türkiye',
    availableLanguage: ['English', 'Russian', 'Turkish'],
  }
}

export default useSeo
