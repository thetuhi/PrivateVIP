import { lazy } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Route chunks, declared once.
//
// Each loader is referenced by both `lazy()` and `prefetchRoute()`. Because they
// are the same function object, the module registry dedupes them: hovering a
// link fetches the chunk, and the later navigation resolves from cache with no
// second request.
//
// This is what keeps the transition curtain honest, it covers for the length of
// an animation, not for the length of a download.
// ─────────────────────────────────────────────────────────────────────────────

const loaders = {
  experiences: () => import('./pages/Experiences'),
  experienceDetail: () => import('./pages/ExperienceDetail'),
  yachts: () => import('./pages/Yachts'),
  fleet: () => import('./pages/Fleet'),
  bespoke: () => import('./pages/Bespoke'),
  about: () => import('./pages/About'),
  contact: () => import('./pages/Contact'),
  faq: () => import('./pages/Faq'),
  policy: () => import('./pages/PolicyPage'),
  notFound: () => import('./pages/NotFound'),
}

export const Experiences = lazy(loaders.experiences)
export const ExperienceDetail = lazy(loaders.experienceDetail)
export const Yachts = lazy(loaders.yachts)
export const Fleet = lazy(loaders.fleet)
export const Bespoke = lazy(loaders.bespoke)
export const About = lazy(loaders.about)
export const Contact = lazy(loaders.contact)
export const Faq = lazy(loaders.faq)
export const PolicyPage = lazy(loaders.policy)
export const NotFound = lazy(loaders.notFound)

/** Resolve a pathname to its chunk loader. Home is not lazy, so it has none. */
function loaderFor(pathname) {
  if (pathname === '/' || pathname === '') return null
  if (pathname.startsWith('/experiences/')) return loaders.experienceDetail
  if (pathname === '/experiences') return loaders.experiences
  if (pathname === '/yachts') return loaders.yachts
  if (pathname === '/transfers') return loaders.fleet
  if (pathname === '/plan') return loaders.bespoke
  if (pathname === '/about') return loaders.about
  if (pathname === '/contact') return loaders.contact
  if (pathname === '/faq') return loaders.faq
  if (pathname.startsWith('/policy/')) return loaders.policy
  return loaders.notFound
}

const prefetched = new Set()

/**
 * Warm a route's chunk. Called on link hover and focus. Safe to call repeatedly;
 * each route is only ever requested once.
 */
export function prefetchRoute(pathname) {
  if (prefetched.has(pathname)) return
  prefetched.add(pathname)
  const load = loaderFor(pathname)
  // Failure is not worth surfacing: this is speculative, and the real
  // navigation will retry and report properly through the error boundary.
  if (load) load().catch(() => prefetched.delete(pathname))
}
