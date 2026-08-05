import { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LazyMotion, domAnimation } from 'framer-motion'

import MotionProvider from './motion/MotionProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CookieBanner from './components/CookieBanner'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import Cursor from './components/motion/Cursor'
import LoadingScreen from './components/motion/LoadingScreen'
import PageTransition from './components/motion/PageTransition'
import { trackPageView } from './utils/analytics'

// Home ships in the initial bundle, it is where nearly all traffic lands, and
// gating the hero behind a chunk request would undo the entrance.
import Home from './pages/Home'
import {
  Experiences,
  ExperienceDetail,
  Yachts,
  Fleet,
  Bespoke,
  About,
  Contact,
  Faq,
  PolicyPage,
  NotFound,
} from './routes'

/**
 * Route fallback. Reserves a viewport-height block so swapping a chunk in does
 * not collapse the page and bounce the footer up.
 *
 * In practice this is rarely seen: links prefetch their chunk on hover, and the
 * transition curtain covers the swap. It exists for cold deep links and for
 * anyone navigating by keyboard faster than the network.
 */
function RouteFallback() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">{t('a11y.loading')}</span>
      <span
        className="h-8 w-8 animate-spin rounded-full border border-ink-600 border-t-brass-500 motion-reduce:animate-none"
        aria-hidden="true"
      />
    </div>
  )
}

function Shell() {
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location.pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-toast focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-card focus:bg-brass-500 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        {t('a11y.skipToContent')}
      </a>

      <LoadingScreen />
      <PageTransition />
      <Cursor />

      <ScrollToTop />
      <Navbar />

      {/* tabIndex -1 lets ScrollToTop move focus here after navigation without
          adding a tab stop for mouse users.

          No opacity animation on this element any more, the transition curtain
          owns the change between routes, and fading the container as well would
          double the effect and delay first paint on a cold load. */}
      <main id="main" tabIndex={-1} className="min-h-dvh focus:outline-none">
        <RouteErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experiences/:slug" element={<ExperienceDetail />} />
              <Route path="/yachts" element={<Yachts />} />
              <Route path="/transfers" element={<Fleet />} />
              <Route path="/plan" element={<Bespoke />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/policy/:slug" element={<PolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>

      <Footer />
      <CookieBanner />
    </>
  )
}

export default function App() {
  return (
    // MotionProvider owns Lenis and the GSAP ticker; it must sit above anything
    // that animates. LazyMotion + domAnimation keeps framer-motion to the
    // feature set actually used, which is roughly 25 KB smaller than the full
    // `motion` import.
    <MotionProvider>
      <LazyMotion features={domAnimation} strict>
        <Shell />
      </LazyMotion>
    </MotionProvider>
  )
}
