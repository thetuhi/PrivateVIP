import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '../config/brand'
import { FlagEN, FlagRU, FlagTR } from './icons/Flags'
import { modalIn } from '../motion/presets'

// Built here rather than exported from Flags.jsx: a module that exports both
// components and a plain object breaks Vite's fast refresh for that file.
const FLAGS = { en: FlagEN, ru: FlagRU, tr: FlagTR }

/**
 * Language menu. Implemented as a real listbox rather than a <select> so it can
 * carry the Nocturne styling, but it keeps every keyboard behaviour a native
 * control would have: Escape closes, arrows move, focus returns to the trigger.
 */
export default function LanguageSwitcher({ className = '', align = 'right' }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? SUPPORTED_LANGUAGES[0]
  const CurrentFlag = FLAGS[current.code]

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Move focus into the menu when it opens, onto the current language.
  useEffect(() => {
    if (!open) return
    const index = SUPPORTED_LANGUAGES.findIndex((l) => l.code === current.code)
    optionRefs.current[Math.max(index, 0)]?.focus()
  }, [open, current.code])

  function onOptionKeyDown(e, index) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? index + 1 : index - 1
    const wrapped = (next + SUPPORTED_LANGUAGES.length) % SUPPORTED_LANGUAGES.length
    optionRefs.current[wrapped]?.focus()
  }

  function choose(code) {
    i18n.changeLanguage(code)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('a11y.chooseLanguage')}
        className="btn-ghost min-w-11 gap-2 px-3 text-sm"
      >
        <CurrentFlag className="h-3.5 w-[1.3125rem] ring-1 ring-inset ring-white/10" />
        <span className="font-medium tracking-wide">{current.short}</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="listbox"
            aria-label={t('a11y.chooseLanguage')}
            variants={modalIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: align === 'right' ? 'top right' : 'top left' }}
            className={`absolute top-full z-overlay mt-2 min-w-[11rem] overflow-hidden rounded-card border border-ink-700 bg-ink-850 py-1 shadow-2xl shadow-black/60 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {SUPPORTED_LANGUAGES.map((lang, index) => {
              const selected = lang.code === current.code
              const Flag = FLAGS[lang.code]
              return (
                <li key={lang.code} role="none">
                  <button
                    ref={(el) => {
                      optionRefs.current[index] = el
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    lang={lang.code}
                    onClick={() => choose(lang.code)}
                    onKeyDown={(e) => onOptionKeyDown(e, index)}
                    className={`flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm transition-colors duration-micro ease-enter hover:bg-ink-800 ${
                      selected ? 'text-brass-400' : 'text-bone-dim hover:text-bone'
                    }`}
                  >
                    {/* Decorative: the language name beside it carries the meaning,
                        so nothing depends on recognising a flag. */}
                    <Flag className="h-4 w-6 ring-1 ring-inset ring-white/10" />
                    <span className="flex-1">{lang.label}</span>
                    {/* Icon, not colour alone, marks the current selection. */}
                    {selected && <Check className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
