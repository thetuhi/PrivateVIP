import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { scrim, modalIn } from '../motion/presets'

/**
 * Full-screen gallery.
 *
 * Rendered through a portal so it escapes any `overflow: hidden` ancestor, and
 * built as a proper modal dialog: Escape closes, Tab is trapped, arrows page,
 * the background is scroll-locked, and focus returns to the thumbnail that
 * opened it.
 */
export default function Lightbox({ images, index, alt, onClose, onPrev, onNext }) {
  const { t } = useTranslation()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const open = index != null
  const multiple = images.length > 1

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (multiple && e.key === 'ArrowLeft') {
        onPrev()
        return
      }
      if (multiple && e.key === 'ArrowRight') {
        onNext()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll('button:not([disabled])')
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
    },
    [multiple, onClose, onPrev, onNext],
  )

  useEffect(() => {
    if (!open) return undefined

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          variants={scrim}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-modal flex items-center justify-center bg-ink-950/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div ref={panelRef} className="relative flex h-full w-full flex-col">
            <div className="flex items-center justify-between px-gutter py-4">
              <span className="text-sm tabular-nums text-bone-muted">
                {index + 1} / {images.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('a11y.closeDialog')}
                className="btn-ghost -mr-2"
              >
                <X className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-gutter pb-gutter">
              {/* Crossfade between frames: same container, so it reads as a
                  replacement rather than as separate objects arriving. */}
              <AnimatePresence mode="wait">
                <m.img
                  key={images[index]}
                  src={images[index]}
                  alt={alt}
                  variants={modalIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-h-full max-w-full object-contain"
                />
              </AnimatePresence>
            </div>

            {multiple && (
              <>
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label={t('a11y.previousImage')}
                  className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ink-700 bg-ink-900/80 text-bone transition-colors duration-micro ease-enter hover:border-brass-600 hover:text-brass-400 sm:left-4"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label={t('a11y.nextImage')}
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ink-700 bg-ink-900/80 text-bone transition-colors duration-micro ease-enter hover:border-brass-600 hover:text-brass-400 sm:right-4"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
