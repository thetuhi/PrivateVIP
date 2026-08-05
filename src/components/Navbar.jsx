import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useMotion } from '../motion/motionContext'
import Magnetic from './motion/Magnetic'
import { drawer, scrim } from '../motion/presets'
import MessageChannels from './MessageChannels'

const LINKS = [
  { to: '/experiences', key: 'nav.experiences' },
  { to: '/yachts', key: 'nav.yachts' },
  { to: '/transfers', key: 'nav.fleet' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const { lenis } = useMotion()
  const headerRef = useRef(null)
  const panelRef = useRef(null)
  const burgerRef = useRef(null)

  // Dynamic header.
  //
  //   · Transparent over the hero, frosted once you leave it.
  // · Retracts on downward scroll, returns immediately on upward scroll,
  //     reading gets the full viewport, and the way back is always one small
  //     gesture away. This is the one behaviour that most makes a long page
  //     feel like an app rather than a document.
  //
  // Driven off Lenis's own scroll event when it is running, so the header moves
  // on the same frame as the content instead of one behind it. Falls back to a
  // passive window listener under reduced motion, where Lenis is not created.
  //
  // A 6px threshold ignores trackpad jitter; below that the bar flickers.
  useEffect(() => {
    let lastY = window.scrollY

    const update = (y) => {
      setScrolled(y > 24)

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      // Quantised to 200 steps. The bar is ~1400px wide at most, so finer
      // resolution than this is invisible and just costs renders.
      setProgress(scrollable > 0 ? Math.round((y / scrollable) * 200) / 200 : 0)

      const delta = y - lastY
      if (Math.abs(delta) < 6) return

      // Never hide while the drawer is open, and never hide at the very top,
      // retracting during an overscroll bounce looks like a glitch.
      setHidden(delta > 0 && y > 220)
      lastY = y
    }

    if (lenis) {
      const onLenisScroll = ({ scroll }) => update(scroll)
      lenis.on('scroll', onLenisScroll)
      update(window.scrollY)
      return () => lenis.off('scroll', onLenisScroll)
    }

    const onScroll = () => update(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lenis])

  // Publish the measured header height so anchor targets and sticky offsets
  // elsewhere stay correct when the logo wraps or the font loads late.
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--header-h', `${entry.contentRect.height}px`)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Close the drawer on navigation, otherwise it stays open over the new page.
  // Adjusted during render rather than in an effect: React re-runs this pass
  // immediately without committing the stale open state, so there is no frame
  // where the new page is visible behind an open drawer.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  // While the drawer is open: lock the background, trap Tab inside it, and
  // send Escape back to the button that opened it.
  useEffect(() => {
    if (!open) return undefined

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // Focus the panel itself rather than the first link, so a screen reader
    // announces the dialog before reading its contents.
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const navLinkClass = ({ isActive }) =>
    `relative inline-flex min-h-11 items-center px-1 text-sm font-normal tracking-wide transition-colors duration-micro ease-enter ${
      isActive ? 'text-brass-400' : 'text-bone-dim hover:text-bone'
    }`

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-header transition-[background-color,border-color,transform] duration-slow ease-enter ${
          scrolled || open ? 'glass border-b border-ink-700/70' : 'border-b border-transparent bg-transparent'
        } ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}
      >
      {/* Scroll progress. A 1px brass rule along the header's lower edge,
            the only always-visible indicator of position in a long page, and
            cheap: one scaleX driven by Lenis, no layout, no repaint. */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-brass-500/70 transition-opacity duration-base ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: `scaleX(${progress})` }}
        />

        <div
          className={`shell flex items-center justify-between gap-4 transition-[padding] duration-slow ease-enter ${
            scrolled ? 'py-2.5' : 'py-3.5'
          }`}
        >
          <Link
            to="/"
            aria-label={t('a11y.homeLink')}
            className="-ml-1 inline-flex min-h-11 items-center rounded-card px-1 transition-opacity duration-micro ease-enter hover:opacity-80"
          >
            <Logo />
          </Link>

          {/* Desktop navigation. Hidden below lg, where the drawer takes over. */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {t(link.key)}
                    {/* Active marker is a rule, not just a colour change. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brass-500 transition-transform duration-base ease-enter ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />

            {/* The one magnetic control in the header. Making every nav item
                magnetic would make the bar feel unstable and would stop this
                reading as the primary action. */}
            <Magnetic as={Link} strength={0.22} to="/plan" className="btn-primary hidden text-xs sm:inline-flex lg:text-sm">
              {t('nav.bespoke')}
            </Magnetic>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t('a11y.openMenu')}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="btn-ghost -mr-2 lg:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              variants={scrim}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-overlay bg-ink-950/70 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            <m.div
              id="mobile-nav"
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.experiences')}
              variants={drawer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 right-0 z-modal flex w-[min(22rem,88vw)] flex-col border-l border-ink-700 bg-ink-900 shadow-2xl shadow-black/60 focus:outline-none lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink-700 px-6 py-3.5">
                <Logo compact />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('a11y.closeMenu')}
                  className="btn-ghost -mr-2"
                >
                  <X className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-6">
                <ul className="flex flex-col gap-1">
                  {LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `flex min-h-12 items-center border-b border-ink-800 font-display text-2xl transition-colors duration-micro ease-enter ${
                            isActive ? 'text-brass-400' : 'text-bone hover:text-brass-300'
                          }`
                        }
                      >
                        {t(link.key)}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to="/faq"
                      className={({ isActive }) =>
                        `flex min-h-12 items-center border-b border-ink-800 font-display text-2xl transition-colors duration-micro ease-enter ${
                          isActive ? 'text-brass-400' : 'text-bone hover:text-brass-300'
                        }`
                      }
                    >
                      {t('nav.faq')}
                    </NavLink>
                  </li>
                </ul>
              </nav>

              {/* Safe-area padding keeps the CTA clear of the iOS home bar. */}
              <div
                className="flex flex-col gap-2.5 border-t border-ink-700 px-6 pt-5"
                style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
              >
                <Link to="/plan" className="btn-primary w-full">
                  {t('nav.bespoke')}
                </Link>
                <MessageChannels location="mobile_nav" block />
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
