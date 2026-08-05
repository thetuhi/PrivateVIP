import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'

// ─────────────────────────────────────────────────────────────────────────────
// Cursor
//
// An accent ring that trails the pointer. It is an ENHANCEMENT, never a
// replacement: the native cursor stays visible at all times, nothing anywhere
// sets `cursor: none`, and if this component fails to mount, fails to animate,
// or is blocked outright, the page is exactly as usable as it was without it.
//
// An earlier version hid the system cursor and drew a dot in its place. That
// is fragile in the way that matters most: any failure between `cursor: none`
// taking effect and the script painting leaves the visitor with no pointer at
// all. Browsers also disagree about which elements inherit `cursor: none`, so
// the replacement was never going to behave the same in Chrome, Edge, Firefox
// and Safari. The ring has no such problem, because the real pointer is always
// underneath it.
//
// State comes from the DOM by delegation, so no component has to know the
// cursor exists. Any element can opt in with `data-cursor`:
//
//   <a> / <button>               ring widens            (implicit)
//   data-cursor="view"           ring widens, labelled
//   data-cursor-label="Explore"  overrides the label
//   data-cursor="hide"           ring fades out
//
// Rendered only for fine pointers, large screens and when motion is allowed.
// On touch it never mounts, so there is no listener and no element.
// ─────────────────────────────────────────────────────────────────────────────

const SIZE = { default: 34, hover: 56, view: 88 }

export default function Cursor() {
  const { fine, reduced } = useMotion()
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const [label, setLabel] = useState('')

  const active = fine && !reduced

  useGSAP(
    () => {
      if (!active) return

      const ring = ringRef.current
      if (!ring) return

      gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 })

      // quickTo reuses one tween per property instead of allocating a new one
      // on every mousemove. At 120Hz that is the difference between a handful
      // of objects and several thousand a second.
      //
      // The ring lags the pointer deliberately. Because the native arrow is
      // still visible and exactly on target, that gap reads as a halo
      // following the hand, not as a cursor failing to keep up.
      const xTo = gsap.quickTo(ring, 'x', { duration: 0.42, ease: EASE.precise })
      const yTo = gsap.quickTo(ring, 'y', { duration: 0.42, ease: EASE.precise })

      let visible = false
      let mode = 'default'

      const onMove = (e) => {
        xTo(e.clientX)
        yTo(e.clientY)
        if (!visible) {
          visible = true
          if (mode !== 'hide') gsap.to(ring, { opacity: 1, duration: 0.3, overwrite: 'auto' })
        }
      }

      const onLeave = () => {
        visible = false
        gsap.to(ring, { opacity: 0, duration: 0.2, overwrite: 'auto' })
      }

      const applyMode = (next, nextLabel) => {
        if (next === mode) return
        mode = next

        if (next === 'hide') {
          gsap.to(ring, { opacity: 0, duration: 0.15, overwrite: 'auto' })
          return
        }

        if (next === 'view') setLabel(nextLabel || 'View')

        gsap.to(ring, {
          width: SIZE[next] ?? SIZE.default,
          height: SIZE[next] ?? SIZE.default,
          borderColor: next === 'default' ? 'rgba(192,160,98,0.4)' : 'rgba(192,160,98,0.85)',
          backgroundColor: next === 'view' ? 'rgba(192,160,98,0.12)' : 'rgba(192,160,98,0)',
          opacity: visible ? 1 : 0,
          duration: 0.42,
          ease: EASE.luxe,
          overwrite: 'auto',
        })

        gsap.to(labelRef.current, {
          opacity: next === 'view' ? 1 : 0,
          duration: 0.25,
          ease: EASE.luxe,
          overwrite: 'auto',
        })
      }

      const onOver = (e) => {
        const target = e.target instanceof Element ? e.target : null
        if (!target) return

        const flagged = target.closest('[data-cursor]')
        if (flagged) {
          applyMode(flagged.dataset.cursor, flagged.dataset.cursorLabel)
          return
        }

        const interactive = target.closest('a, button, label, [role="button"]')
        applyMode(interactive ? 'hover' : 'default')
      }

      // A small contraction on press. Porsche register: the control
      // acknowledges the input before the page does.
      const onDown = () => gsap.to(ring, { scale: 0.84, duration: 0.16, ease: EASE.precise, overwrite: 'auto' })
      const onUp = () => gsap.to(ring, { scale: 1, duration: 0.34, ease: EASE.luxe, overwrite: 'auto' })

      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mouseover', onOver, { passive: true })
      window.addEventListener('mousedown', onDown, { passive: true })
      window.addEventListener('mouseup', onUp, { passive: true })
      document.documentElement.addEventListener('mouseleave', onLeave)

      return () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseover', onOver)
        window.removeEventListener('mousedown', onDown)
        window.removeEventListener('mouseup', onUp)
        document.documentElement.removeEventListener('mouseleave', onLeave)
      }
    },
    { dependencies: [active] },
  )

  if (!active) return null

  return (
    // pointer-events-none on both the layer and the ring, so the decoration can
    // never intercept a click whatever state it is left in.
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block" aria-hidden="true">
      {/* Size is animated rather than scaled so the 1px border stays 1px at
          every state; a scaled ring reaches a 3px border at the largest size
          and reads as a different object.

          Animating width/height is otherwise forbidden on this site because it
          triggers layout. It is safe here and only here: the element is
          position:fixed with no siblings and no flow to disturb, and `contain`
          scopes the layout and paint work to the element itself. */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 flex items-center justify-center rounded-full border will-change-transform"
        style={{
          width: SIZE.default,
          height: SIZE.default,
          borderColor: 'rgba(192,160,98,0.4)',
          contain: 'layout paint',
        }}
      >
        <span
          ref={labelRef}
          className="select-none text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-brass-300 opacity-0"
        >
          {label}
        </span>
      </div>
    </div>
  )
}
