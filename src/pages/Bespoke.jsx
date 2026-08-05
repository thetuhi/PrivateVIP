import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react'

import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { getExperience } from '../data/experiences'
import { localise } from '../utils/localise'
import { whatsappLink, telegramLink, mailtoLink, bespokeMessage } from '../utils/contact'
import { trackEvent } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import { EASE_ENTER, EASE_EXIT } from '../motion/presets'
import WhatsAppGlyph from '../components/icons/WhatsAppGlyph'
import TelegramGlyph from '../components/icons/TelegramGlyph'

const DRAFT_KEY = 'pvi-bespoke-draft'
const TOTAL_STEPS = 4

const INTEREST_KEYS = ['history', 'food', 'water', 'shopping', 'art', 'family', 'photography', 'nightlife']
const SERVICE_KEYS = ['tours', 'yacht', 'transfers', 'fullTrip']
const PACE_KEYS = ['gentle', 'balanced', 'full']

const EMPTY_FORM = {
  arrival: '',
  nights: '',
  flexible: false,
  adults: '2',
  children: '0',
  childrenAges: '',
  services: [],
  interests: [],
  pace: '',
  notes: '',
  name: '',
  email: '',
  phone: '',
  language: '',
  consent: false,
}

/** Which fields belong to which step, so validation can run per step. */
const STEP_FIELDS = {
  1: ['arrival'],
  2: ['adults'],
  3: [],
  4: ['name', 'contact', 'consent'],
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Builds the form's initial state: a saved draft if there is one, with any
 * `?experience=` referrer folded in so arriving from a tour page pre-fills the
 * subject rather than making the visitor retype it.
 *
 * Pure and synchronous, so it can run as a useState initialiser.
 */
function restoreDraft({ searchParams, lang, t }) {
  let restored = EMPTY_FORM
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) restored = { ...EMPTY_FORM, ...JSON.parse(raw) }
  } catch {
    /* Corrupt or unreadable draft: fall through to a clean form. */
  }

  const slug = searchParams.get('experience')
  const experience = slug ? getExperience(slug) : null

  if (experience) {
    const name = localise(experience.title, lang)
    // Guard against duplicating the line if the visitor reloads the page.
    if (!restored.notes.includes(name)) {
      const prefix = t('common.enquireAbout', { name })
      restored = {
        ...restored,
        notes: restored.notes ? `${prefix}\n\n${restored.notes}` : prefix,
        services: restored.services.includes('tours') ? restored.services : [...restored.services, 'tours'],
      }
    }
  }

  return restored.language ? restored : { ...restored, language: lang }
}

// ---- Field primitives ------------------------------------------------------

function Field({ id, label, hint, error, required, relaxed = false, children }) {
  const { t } = useTranslation()
  return (
    // `relaxed` recedes the field when it stops being load-bearing. It is
    // never the only signal: the required asterisk disappears, an "optional"
    // tag appears and the hint text changes, so the state is legible without
    // perceiving the colour shift at all.
    <div className={relaxed ? 'field-relaxed' : undefined}>
      <label htmlFor={id} className="field-label flex items-center gap-2">
        <span>{label}</span>
        {required && (
          <span className="text-brass-500" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> ({t('common.required')})</span>}
        {relaxed && (
          <span className="rounded-full border border-ink-600 px-2 py-0.5 text-[0.625rem] font-normal uppercase tracking-[0.14em] text-bone-muted">
            {t('common.optional')}
          </span>
        )}
      </label>
      {children}
      {/* Hint is persistent, not a placeholder, it stays readable while typing. */}
      {hint && !error && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  )
}

/** Multi-select chips. Checkboxes underneath, so keyboard and SR behaviour is native. */
function ChipGroup({ legend, hint, options, values, onToggle, name }) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      {hint && <span className="field-hint mb-3 block">{hint}</span>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = values.includes(option.value)
          return (
            <label
              key={option.value}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-card border px-4 text-sm transition-colors duration-micro ease-enter has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass-400 ${
                checked
                  ? 'border-brass-500 bg-brass-500/10 text-brass-300'
                  : 'border-ink-600 text-bone-dim hover:border-brass-700 hover:text-bone'
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onToggle(option.value)}
                className="sr-only"
              />
              {/* State is carried by an icon as well as colour. */}
              <Check
                className={`h-3.5 w-3.5 transition-opacity duration-micro ${checked ? 'opacity-100' : 'opacity-0'}`}
                strokeWidth={2.5}
                aria-hidden="true"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

// ---- Page ------------------------------------------------------------------

export default function Bespoke() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'en'
  const reduced = useReducedMotion()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(1)
  // Lazy initialiser, not a mount effect: the first paint already shows the
  // restored draft, no flash of an empty form and no second render pass.
  const [form, setForm] = useState(() => restoreDraft({ searchParams, lang, t }))
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  // null until a Telegram send; then true/false depending on whether the
  // clipboard write was permitted, so the confirmation can tell the truth.
  const [telegramCopied, setTelegramCopied] = useState(null)

  const summaryRef = useRef(null)
  const stepHeadingRef = useRef(null)
  const mountedRef = useRef(false)

  useSeo({
    title: t('bespoke.metaTitle'),
    description: t('bespoke.lede'),
  })

  // Persist on every change. A long form that loses everything to an accidental
  // back-swipe is the fastest way to lose an enquiry.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* Storage full or blocked: the form still works, it just will not persist. */
    }
  }, [form])

  // Moving between steps is a navigation, so focus follows to the new heading.
  useEffect(() => {
    if (!mountedRef.current) return
    stepHeadingRef.current?.focus()
  }, [step])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear an error as soon as the visitor addresses it, leaving stale red
    // text under a now-valid field is the most common form-UX failure.
    setErrors((prev) => {
      // Turning on flexible dates makes arrival optional, so an outstanding
      // "arrival required" error has to go with it. Leaving red text under a
      // field the form no longer needs is the thing that makes a toggle feel
      // like it did not take.
      const clearArrival = field === 'flexible' && value === true && prev.arrival
      if (!prev[field] && !clearArrival) return prev
      const next = { ...prev }
      delete next[field]
      if (clearArrival) delete next.arrival
      return next
    })
  }

  function toggleInList(field, value) {
    setForm((prev) => {
      const list = prev[field]
      return { ...prev, [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] }
    })
  }

  function validate(fields, data = form) {
    const found = {}

    if (fields.includes('arrival')) {
      // The flexible toggle has a real consequence, not a cosmetic one: with
      // open dates the enquiry is perfectly actionable without an arrival date,
      // so the field stops being required. Anything less would make the toggle
      // decoration, which is exactly what it looked like before.
      if (!data.arrival) {
        if (!data.flexible) found.arrival = t('bespoke.errors.arrivalRequired')
      } else if (data.arrival < todayIso()) {
        found.arrival = t('bespoke.errors.arrivalPast')
      }
    }

    if (fields.includes('adults')) {
      if (!data.adults || Number(data.adults) < 1) found.adults = t('bespoke.errors.adultsRequired')
    }

    if (fields.includes('name') && !data.name.trim()) {
      found.name = t('bespoke.errors.nameRequired')
    }

    if (fields.includes('contact')) {
      const hasEmail = data.email.trim().length > 0
      const hasPhone = data.phone.trim().length > 0
      if (!hasEmail && !hasPhone) {
        found.email = t('bespoke.errors.contactRequired')
      } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
        found.email = t('bespoke.errors.emailInvalid')
      }
    }

    if (fields.includes('consent') && !data.consent) {
      found.consent = t('bespoke.errors.consentRequired')
    }

    return found
  }

  function focusFirstError(found) {
    const first = Object.keys(found)[0]
    if (!first) return
    // Give the error summary a frame to render before moving focus into it.
    requestAnimationFrame(() => {
      const el = document.getElementById(first)
      if (el) el.focus()
      else summaryRef.current?.focus()
    })
  }

  function goNext() {
    const found = validate(STEP_FIELDS[step])
    setErrors(found)
    if (Object.keys(found).length) {
      focusFirstError(found)
      return
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  const message = useMemo(() => bespokeMessage(form, t), [form, t])

  function send(channel) {
  // Validate every step, not just the visible one, a visitor can reach the
    // last step and then edit an earlier answer into an invalid state.
    const allFields = Object.values(STEP_FIELDS).flat()
    const found = validate(allFields)
    setErrors(found)

    if (Object.keys(found).length) {
      focusFirstError(found)
      return
    }

    trackEvent('enquiry_submit', { channel, services: form.services.join(',') })

    // Telegram is the odd one out. WhatsApp and mailto both carry a prefilled
    // body; Telegram's phone-number links accept no message parameter at all,
    // so opening one would hand the visitor an empty chat and quietly lose
    // every answer they just typed.
    //
    // Copying the enquiry to the clipboard first turns that into a paste
    // instead of a retype, and the confirmation screen says so explicitly.
    // Clipboard access can be refused, so the channel is only reported as
    // copied once the write actually resolves.
    if (channel === 'telegram') {
      const open = (copied) => {
        setTelegramCopied(copied)
        window.open(telegramLink(), '_blank', 'noopener,noreferrer')
        finishSend()
      }
      navigator.clipboard?.writeText(message).then(
        () => open(true),
        () => open(false),
      ) ?? open(false)
      return
    }

    const href =
      channel === 'whatsapp' ? whatsappLink(message) : mailtoLink(`${t('bespoke.title')}, ${form.name}`, message)

    window.open(href, channel === 'whatsapp' ? '_blank' : '_self', 'noopener,noreferrer')
    finishSend()
  }

  function finishSend() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* Nothing to clean up. */
    }
    setSent(true)
  }

  const errorList = Object.entries(errors)
  const stepVariants = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE_ENTER } },
        exit: { opacity: 0, x: -16, transition: { duration: 0.2, ease: EASE_EXIT } },
      }

  // ---- Sent confirmation ---------------------------------------------------

  if (sent) {
    return (
      <section className="section pt-36 lg:pt-44">
        <div className="shell flex min-h-[50vh] max-w-2xl flex-col items-start">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brass-600 text-brass-400">
            <Check className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h1 className="mt-8 text-display-md text-balance text-bone" tabIndex={-1}>
            {t('bespoke.successTitle')}
          </h1>
          <p className="prose-body mt-5">{t('bespoke.successBody')}</p>

          {/* Only shown after a Telegram send, and it says which of the two
              things actually happened. Claiming the enquiry was copied when the
              browser refused would leave someone staring at an empty chat with
              nothing to paste. */}
          {telegramCopied !== null && (
            <p
              className={`mt-4 max-w-prose rounded-card border p-4 text-sm font-light leading-relaxed ${
                telegramCopied
                  ? 'border-brass-700/60 bg-brass-500/5 text-brass-300'
                  : 'border-danger/40 bg-danger/5 text-danger'
              }`}
            >
              {telegramCopied ? t('bespoke.telegramCopied') : t('bespoke.telegramCopyFailed')}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <WhatsAppGlyph className="h-4 w-4" aria-hidden="true" />
              {t('bespoke.successCta')}
            </a>
            <Link to="/" className="btn-secondary">
              {t('bespoke.successBack')}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // ---- Form ----------------------------------------------------------------

  return (
    <section className="section pt-36 lg:pt-44">
      <div className="shell">
        <SectionHeading
          as="h1"
          eyebrow={t('bespoke.eyebrow')}
          title={t('bespoke.title')}
          lede={t('bespoke.lede')}
          size="xl"
          className="max-w-3xl"
        />

        <Reveal className="mt-14 max-w-2xl">
        {/* Progress. Both a visual bar and a text label, the bar alone
              conveys nothing to a screen reader. */}
          <div className="mb-10">
            <p className="text-sm tabular-nums text-bone-muted">
              {t('bespoke.stepOf', { current: step, total: TOTAL_STEPS })}
            </p>
            <div
              className="mt-3 flex gap-1.5"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-label={t('bespoke.stepOf', { current: step, total: TOTAL_STEPS })}
            >
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-0.5 flex-1 transition-colors duration-base ease-enter ${
                    i < step ? 'bg-brass-500' : 'bg-ink-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error summary. Anchored links let a keyboard user jump straight to
              the offending field instead of hunting for red text. */}
          {errorList.length > 1 && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="mb-8 rounded-card border border-danger/40 bg-danger/5 p-5"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-danger">
                <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                {t('bespoke.errors.summaryTitle')}
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {errorList.map(([field, msg]) => (
                  <li key={field}>
                    <a href={`#${field}`} className="text-sm text-bone-dim underline underline-offset-4 hover:text-danger">
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (step < TOTAL_STEPS) goNext()
              else send('whatsapp')
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={step} variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <h2 ref={stepHeadingRef} tabIndex={-1} className="font-display text-display-sm text-bone focus:outline-none">
                  {t(`bespoke.step${step}Title`)}
                </h2>

                {/* ---- Step 1: dates ---- */}
                {step === 1 && (
                  <div className="mt-8 flex flex-col gap-7">
                    <Field
                      id="arrival"
                      label={t('bespoke.fields.arrival')}
                      hint={form.flexible ? t('bespoke.fields.arrivalHintFlexible') : t('bespoke.fields.arrivalHint')}
                      error={errors.arrival}
                      required={!form.flexible}
                      relaxed={form.flexible}
                    >
                      <input
                        id="arrival"
                        name="arrival"
                        type="date"
                        min={todayIso()}
                        value={form.arrival}
                        onChange={(e) => update('arrival', e.target.value)}
                        aria-invalid={Boolean(errors.arrival)}
                        aria-describedby={errors.arrival ? 'arrival-error' : 'arrival-hint'}
                        className="input"
                      />
                    </Field>

                    <Field
                      id="nights"
                      label={t('bespoke.fields.nights')}
                      hint={form.flexible ? t('bespoke.fields.nightsHintFlexible') : undefined}
                      relaxed={form.flexible}
                    >
                      <input
                        id="nights"
                        name="nights"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="60"
                        value={form.nights}
                        onChange={(e) => update('nights', e.target.value)}
                        aria-describedby={form.flexible ? 'nights-hint' : undefined}
                        className="input"
                      />
                    </Field>

                    {/* The toggle is styled as a real control rather than a bare
                        checkbox, because pressing it genuinely changes what the
                        form asks for. */}
                    <div>
                      <label
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-card border px-4 text-sm transition-colors duration-base ease-enter has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass-400 ${
                          form.flexible
                            ? 'border-brass-500 bg-brass-500/10 text-brass-300'
                            : 'border-ink-600 text-bone-dim hover:border-brass-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.flexible}
                          onChange={(e) => update('flexible', e.target.checked)}
                          className="h-5 w-5 cursor-pointer rounded-sm border-ink-600 bg-ink-850 text-brass-500 focus-visible:outline-none"
                        />
                        {t('bespoke.fields.flexible')}
                      </label>

                      {/* States the consequence in words. Announced politely so a
                          screen reader hears that the form changed without the
                          focus being pulled out of the checkbox. */}
                      <div aria-live="polite">
                        <AnimatePresence initial={false}>
                          {form.flexible && (
                            <m.p
                              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE_ENTER }}
                              className="overflow-hidden text-sm font-light leading-relaxed text-brass-300/90"
                            >
                              <span className="block pt-3">{t('bespoke.fields.flexibleNote')}</span>
                            </m.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---- Step 2: party ---- */}
                {step === 2 && (
                  <div className="mt-8 flex flex-col gap-7">
                    <div className="grid gap-7 sm:grid-cols-2">
                      <Field id="adults" label={t('bespoke.fields.adults')} error={errors.adults} required>
                        <input
                          id="adults"
                          name="adults"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max="30"
                          value={form.adults}
                          onChange={(e) => update('adults', e.target.value)}
                          aria-invalid={Boolean(errors.adults)}
                          aria-describedby={errors.adults ? 'adults-error' : undefined}
                          className="input"
                        />
                      </Field>

                      <Field id="children" label={t('bespoke.fields.children')}>
                        <input
                          id="children"
                          name="children"
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max="20"
                          value={form.children}
                          onChange={(e) => update('children', e.target.value)}
                          className="input"
                        />
                      </Field>
                    </div>

                    {/* Progressive disclosure: only asked when it is relevant. */}
                    {Number(form.children) > 0 && (
                      <Field
                        id="childrenAges"
                        label={t('bespoke.fields.childrenAges')}
                        hint={t('bespoke.fields.childrenAgesHint')}
                      >
                        <input
                          id="childrenAges"
                          name="childrenAges"
                          type="text"
                          value={form.childrenAges}
                          onChange={(e) => update('childrenAges', e.target.value)}
                          aria-describedby="childrenAges-hint"
                          className="input"
                        />
                      </Field>
                    )}
                  </div>
                )}

                {/* ---- Step 3: interests ---- */}
                {step === 3 && (
                  <div className="mt-8 flex flex-col gap-9">
                    <ChipGroup
                      name="services"
                      legend={t('bespoke.fields.services')}
                      options={SERVICE_KEYS.map((k) => ({ value: k, label: t(`bespoke.services.${k}`) }))}
                      values={form.services}
                      onToggle={(v) => toggleInList('services', v)}
                    />

                    <ChipGroup
                      name="interests"
                      legend={t('bespoke.fields.interests')}
                      hint={t('bespoke.fields.interestsHint')}
                      options={INTEREST_KEYS.map((k) => ({ value: k, label: t(`bespoke.interests.${k}`) }))}
                      values={form.interests}
                      onToggle={(v) => toggleInList('interests', v)}
                    />

                    <fieldset>
                      <legend className="field-label">{t('bespoke.fields.pace')}</legend>
                      <div className="mt-3 flex flex-col gap-2">
                        {PACE_KEYS.map((key) => (
                          <label
                            key={key}
                            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-card border px-4 py-2.5 text-sm transition-colors duration-micro ease-enter has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass-400 ${
                              form.pace === key
                                ? 'border-brass-500 bg-brass-500/10 text-brass-300'
                                : 'border-ink-600 text-bone-dim hover:border-brass-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pace"
                              value={key}
                              checked={form.pace === key}
                              onChange={() => update('pace', key)}
                              className="h-4 w-4 cursor-pointer border-ink-600 bg-ink-850 text-brass-500"
                            />
                            {t(`bespoke.pace.${key}`)}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field id="notes" label={t('bespoke.fields.notes')} hint={t('bespoke.fields.notesHint')}>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={5}
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        aria-describedby="notes-hint"
                        className="input resize-y"
                      />
                    </Field>
                  </div>
                )}

                {/* ---- Step 4: contact ---- */}
                {step === 4 && (
                  <div className="mt-8 flex flex-col gap-7">
                    <Field id="name" label={t('bespoke.fields.name')} error={errors.name} required>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className="input"
                      />
                    </Field>

                    <Field id="email" label={t('bespoke.fields.email')} error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        onBlur={() => {
                        // Validate on blur, never on keystroke, flagging a
                          // half-typed address as invalid is hostile.
                          if (form.email.trim()) setErrors(validate(['contact']))
                        }}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="input"
                      />
                    </Field>

                    <Field id="phone" label={t('bespoke.fields.phone')} hint={t('bespoke.fields.phoneHint')}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        aria-describedby="phone-hint"
                        className="input"
                      />
                    </Field>

                    <Field id="language" label={t('bespoke.fields.language')}>
                      <select
                        id="language"
                        name="language"
                        value={form.language}
                        onChange={(e) => update('language', e.target.value)}
                        className="input cursor-pointer"
                      >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="tr">Türkçe</option>
                      </select>
                    </Field>

                    <div>
                      <label className="flex cursor-pointer items-start gap-3 py-2 text-sm text-bone-dim">
                        <input
                          id="consent"
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => update('consent', e.target.checked)}
                          aria-invalid={Boolean(errors.consent)}
                          aria-describedby={errors.consent ? 'consent-error' : undefined}
                          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-ink-600 bg-ink-850 text-brass-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                        />
                        {t('bespoke.fields.consent')}
                      </label>
                      {errors.consent && (
                        <span id="consent-error" className="field-error" role="alert">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                          {errors.consent}
                        </span>
                      )}
                    </div>

                    <p className="rounded-card border border-ink-700 bg-ink-850 p-4 text-sm font-light leading-relaxed text-bone-muted">
                      {t('bespoke.sendNote')}
                    </p>
                  </div>
                )}
              </m.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-10 flex flex-col gap-3 border-t border-ink-700 pt-8 sm:flex-row sm:items-center">
              {step > 1 && (
                <button type="button" onClick={goBack} className="btn-secondary sm:order-1">
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {t('bespoke.back')}
                </button>
              )}

              {step < TOTAL_STEPS ? (
                <button type="submit" className="btn-primary sm:order-2">
                  {t('bespoke.next')}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              ) : (
                <div className="grid gap-3 sm:order-2 sm:auto-cols-fr sm:grid-flow-col">
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    <WhatsAppGlyph className="h-4 w-4" aria-hidden="true" />
                    {t('bespoke.sendWhatsapp')}
                  </button>
                  <button type="button" onClick={() => send('telegram')} className="btn-secondary whitespace-nowrap">
                    <TelegramGlyph className="h-4 w-4" aria-hidden="true" />
                    {t('bespoke.sendTelegram')}
                  </button>
                  <button type="button" onClick={() => send('email')} className="btn-secondary whitespace-nowrap">
                    <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    {t('bespoke.sendEmail')}
                  </button>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
