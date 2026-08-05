import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Search } from 'lucide-react'

import {
  COUNTRIES,
  SUGGESTED_ISO,
  countryName,
  flagOf,
  getCountry,
  maxNationalLength,
  normalise,
  parseInternational,
  stripTrunkZero,
} from '../data/dialCodes'
import { modalIn } from '../motion/presets'

/**
 * Phone number with an explicit country code.
 *
 * Asking for "+90 532…" in a single free-text box is how enquiries arrive
 * unreachable: people write their number the way they dial it at home, without
 * the country code, and nobody notices until the callback fails. So the code is
 * a separate, always-visible control with a real default rather than a hint
 * asking politely.
 *
 * Built as a combobox over a listbox instead of a <select>, because a bare
 * select cannot carry a search box and 150 countries without search is not a
 * control, it is a punishment. Every keyboard behaviour a select would have is
 * kept: arrows move, Home/End jump, Enter picks, Escape closes and returns
 * focus to the trigger.
 */
export default function PhoneField({
  id,
  country,
  number,
  onCountryChange,
  onNumberChange,
  onBlur,
  error,
  describedBy,
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'

  const uid = useId()
  const listId = `${uid}-listbox`

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const searchRef = useRef(null)
  const numberRef = useRef(null)

  const selected = getCountry(country)

  // Localised, sorted and search-keyed once per language rather than per
  // keystroke: Intl.Collator over 150 rows is cheap, but not 150 times a second.
  const catalogue = useMemo(() => {
    const collator = new Intl.Collator(lang)
    const decorated = COUNTRIES.map((c) => {
      const label = countryName(c.iso, lang)
      return { ...c, label, key: normalise(`${label} ${c.name} ${c.alias ?? ''} ${c.iso}`) }
    })
    const byIso = new Map(decorated.map((c) => [c.iso, c]))
    return {
      all: [...decorated].sort((a, b) => collator.compare(a.label, b.label)),
      suggested: SUGGESTED_ISO.map((iso) => byIso.get(iso)).filter(Boolean),
    }
  }, [lang])

  const results = useMemo(() => {
    const q = normalise(query)
    if (!q) return null

    const digits = q.replace(/\D/g, '')
    const matched = catalogue.all.filter((c) => c.key.includes(q) || (digits && c.dial.startsWith(digits)))

    // A prefix match is what the visitor meant; a match buried mid-string is a
    // coincidence. Ranking beats filtering harder, nothing is ever hidden.
    const rank = (c) => (c.label.toLowerCase().startsWith(q) || c.dial === digits ? 0 : 1)
    return matched.sort((a, b) => rank(a) - rank(b))
  }, [query, catalogue])

  // One flat list underneath the visual grouping, so arrow keys walk straight
  // through the headers instead of tripping over them.
  const { groups, flat } = useMemo(() => {
    const raw = results
      ? [{ id: 'results', label: null, items: results }]
      : [
          { id: 'suggested', label: t('bespoke.fields.phoneSuggested'), items: catalogue.suggested },
          { id: 'all', label: t('bespoke.fields.phoneAll'), items: catalogue.all },
        ]

    let offset = 0
    const withOffset = raw.map((group) => {
      const positioned = { ...group, offset }
      offset += group.items.length
      return positioned
    })

    return { groups: withOffset, flat: raw.flatMap((group) => group.items) }
  }, [results, catalogue, t])

  // Close on outside pointer and on Escape, mirroring LanguageSwitcher so the
  // two menus on this site behave identically.
  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    function onKeyDown(e) {
      if (e.key !== 'Escape') return
      // Stopped here so Escape closes this menu without also reaching any
      // dialog or drawer that happens to be open behind the form.
      e.stopPropagation()
      setOpen(false)
      setQuery('')
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  // Keep the highlighted row on screen while arrowing. `nearest` scrolls the
  // minimum needed, so the list does not lurch on every keypress.
  useEffect(() => {
    if (!open) return
    document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, uid])

  function openPanel() {
    // Open on the current country, not on the top of the list: the most common
    // reason to open this menu is to check what is already selected.
    const index = catalogue.suggested.findIndex((c) => c.iso === selected.iso)
    const fallback = catalogue.suggested.length + catalogue.all.findIndex((c) => c.iso === selected.iso)
    setActive(index >= 0 ? index : Math.max(fallback, 0))
    setQuery('')
    setOpen(true)
  }

  function close(focus) {
    setOpen(false)
    setQuery('')
    if (focus === 'trigger') triggerRef.current?.focus()
    if (focus === 'number') numberRef.current?.focus()
  }

  function choose(iso) {
    onCountryChange(iso)
    // Focus lands on the number, not back on the trigger. Picking a code is
    // never the last thing anyone wants to do here.
    close(number ? 'trigger' : 'number')
  }

  function onTriggerKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openPanel()
    }
  }

  function onSearchKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault()
        if (!flat.length) return
        const next = active + (e.key === 'ArrowDown' ? 1 : -1)
        setActive((next + flat.length) % flat.length)
        break
      }
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(Math.max(flat.length - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (flat[active]) choose(flat[active].iso)
        break
      case 'Tab':
        close()
        break
      default:
        break
    }
  }

  /**
   * Refuse digits past the country's maximum. Stopping the keystroke is kinder
   * than accepting it and complaining afterwards: an eleventh digit in a
   * ten-digit country is always a slip, and the field simply declines it the
   * way a card number field declines a seventeenth digit. Separators are kept,
   * so grouping the visitor typed survives.
   */
  function capToLength(value, iso) {
    const max = maxNationalLength(iso)
    let digits = 0
    let out = ''
    for (const ch of value) {
      if (/\d/.test(ch)) {
        if (digits >= max) break
        digits += 1
      }
      out += ch
    }
    return out
  }

  function onNumberInput(e) {
    const raw = e.target.value

    // Someone pasting "+90 532 …" or "0090 532 …" has already told us their
    // country. Splitting it into the picker is strictly better than silently
    // ending up with the code twice.
    if (/^\s*(\+|00)/.test(raw)) {
      const parsed = parseInternational(raw)
      if (parsed) {
        onCountryChange(parsed.iso)
        // Capped against the country that just arrived, not the one it replaced.
        onNumberChange(capToLength(parsed.number, parsed.iso))
        return
      }
      // Mid-code: leave the prefix alone so typing can continue.
      onNumberChange(raw.replace(/[^\d\s+]/g, ''))
      return
    }

    // Spaces, brackets and dashes survive, people group digits the way they
    // read them and rewriting that under the cursor feels like a fight.
    onNumberChange(capToLength(raw.replace(/[^\d\s()-]/g, ''), selected.iso))
  }

  function onNumberBlur() {
    const tidied = stripTrunkZero(number.trim().replace(/\s{2,}/g, ' '), selected.iso)
    if (tidied !== number) onNumberChange(tidied)
    onBlur?.()
  }

  const selectedLabel = countryName(selected.iso, lang)

  return (
    <div ref={containerRef} className="relative">
      {/* `data-open` keeps the field lit while the menu is up. Focus is inside
          the panel by then, which is outside this element, so :focus-within
          alone would drop the highlight at the exact moment it matters most. */}
      <div className="phone-field" data-open={open ? 'true' : undefined} data-invalid={error ? 'true' : undefined}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close('trigger') : openPanel())}
          onKeyDown={onTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${t('a11y.chooseCountry')}. ${selectedLabel}, +${selected.dial}`}
          className="phone-trigger"
        >
          <span className="phone-flag" aria-hidden="true">
            {flagOf(selected.iso)}
          </span>
          <span className="tabular-nums">+{selected.dial}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-bone-muted transition-transform duration-base ease-enter ${
              open ? '-rotate-180' : ''
            }`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        <span className="phone-divider" aria-hidden="true" />

        <input
          ref={numberRef}
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          // `tel-national`, not `tel`: the country code is its own control, so a
          // browser autofilling the full international number here would double it.
          autoComplete="tel-national"
          value={number}
          onChange={onNumberInput}
          onBlur={onNumberBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="phone-number"
        />
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            variants={modalIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: 'top left' }}
            className="absolute left-0 top-full z-overlay mt-2 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-card border border-ink-700 bg-ink-850 shadow-2xl shadow-black/60"
          >
            <div className="border-b border-ink-700 p-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-muted"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={flat[active] ? `${uid}-opt-${active}` : undefined}
                  aria-label={t('bespoke.fields.phoneSearch')}
                  placeholder={t('bespoke.fields.phoneSearch')}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  onKeyDown={onSearchKeyDown}
                  className="min-h-11 w-full rounded-[0.625rem] border border-ink-700 bg-ink-900 py-2.5 pl-9 pr-3 text-sm font-light text-bone placeholder:text-bone-muted/80 focus:border-brass-600 focus:outline-none"
                />
              </div>
            </div>

            <div
              role="listbox"
              id={listId}
              aria-label={t('a11y.chooseCountry')}
              // Lenis drives the page scroll, so a scrollable panel has to opt
              // out or a wheel over the list scrolls the page behind it instead.
              data-lenis-prevent
              className="max-h-64 overflow-y-auto overscroll-contain p-1"
            >
              {groups.map((group) => (
                <div key={group.id} role="group" aria-label={group.label ?? undefined}>
                  {group.label && (
                    // Announced through the group's own label, so the visible
                    // heading is hidden from assistive tech to avoid saying it twice.
                    <p
                      aria-hidden="true"
                      className="px-3 pb-1 pt-3 text-[0.6875rem] uppercase tracking-[0.16em] text-bone-muted"
                    >
                      {group.label}
                    </p>
                  )}

                  {group.items.map((c, i) => {
                    const index = group.offset + i
                    const isSelected = c.iso === selected.iso
                    return (
                      <div
                        key={c.iso}
                        id={`${uid}-opt-${index}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => choose(c.iso)}
                        onPointerMove={() => setActive(index)}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[0.625rem] px-3 text-sm transition-colors duration-micro ease-enter ${
                          index === active ? 'bg-ink-800 text-bone' : 'text-bone-dim'
                        }`}
                      >
                        <span className="phone-flag" aria-hidden="true">
                          {flagOf(c.iso)}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-light">{c.label}</span>
                        <span className={`shrink-0 tabular-nums ${isSelected ? 'text-brass-400' : 'text-bone-muted'}`}>
                          +{c.dial}
                        </span>
                        {/* Icon, not colour alone, marks the current selection. */}
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-brass-400" strokeWidth={1.5} aria-hidden="true" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              {flat.length === 0 && (
                <p role="status" className="px-3 py-6 text-center text-sm font-light text-bone-muted">
                  {t('bespoke.fields.phoneNoResults')}
                </p>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
