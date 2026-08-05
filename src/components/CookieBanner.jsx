import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence } from 'framer-motion'
import { getConsent, setConsent } from '../utils/analytics'
import { EASE_ENTER, EASE_EXIT } from '../motion/presets'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

/**
 * Analytics consent prompt.
 *
 * Deliberately not a modal: it does not trap focus, does not block the page,
 * and both choices are real buttons of equal visual weight. If no measurement
 * ID is configured, nothing renders at all, there is nothing to consent to.
 */
export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    // Delay so the banner is not competing with the hero for attention on the
    // first paint, and so it never affects LCP.
    const timer = setTimeout(() => {
      if (!getConsent()) setVisible(true)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  function decide(value) {
    setConsent(value)
    setVisible(false)
  }

  if (!GA_ID) return null

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          role="region"
          aria-label={t('cookies.title')}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_ENTER } }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.2, ease: EASE_EXIT } }}
          className="fixed inset-x-0 bottom-0 z-toast px-gutter"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="glass mx-auto flex max-w-3xl flex-col gap-4 rounded-card border border-ink-700 p-5 shadow-2xl shadow-black/60 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-bone">{t('cookies.title')}</p>
              <p className="mt-1 text-sm font-light leading-relaxed text-bone-dim">
                {t('cookies.body')}{' '}
                <Link to="/policy/privacy" className="link-underline text-bone-dim">
                  {t('cookies.policy')}
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 gap-2.5">
              <button type="button" onClick={() => decide('denied')} className="btn-secondary flex-1 text-xs sm:flex-none">
                {t('cookies.decline')}
              </button>
              <button type="button" onClick={() => decide('granted')} className="btn-primary flex-1 text-xs sm:flex-none">
                {t('cookies.accept')}
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
