import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { gsap, EASE } from '../../motion/gsap'
import { useMotion } from '../../motion/motionContext'

gsap.registerPlugin(SplitText, useGSAP)

// ─────────────────────────────────────────────────────────────────────────────
// SplitReveal
//
// Line-masked typography reveal. Each line sits inside its own overflow-hidden
// wrapper and rises from beneath it, so the text appears to be uncovered rather
// than to fly in. That distinction is most of the difference between editorial
// motion and template motion.
//
// Three things that make this safe to use everywhere:
//
// · `mask: 'lines'` builds the clipping wrappers, no manual DOM surgery.
//   · `autoSplit: true` re-splits on resize and after webfonts land. A split
//     measured against a fallback font wraps at the wrong words; without this
//     the reveal is correct for about 200ms and then wrong forever.
//   · SplitText writes `aria-label` on the container and hides the fragments
//     from assistive tech, so a screen reader reads one sentence, not 40
//     disconnected spans.
//
// Under reduced motion the element is never split at all, it renders as plain
// text with a short fade, which also keeps text selectable and copyable.
// ─────────────────────────────────────────────────────────────────────────────

export default function SplitReveal({
  children,
  as: Tag = 'div',
  /** 'lines' for headings and paragraphs, 'words' for short display strings. */
  type = 'lines',
  /** Seconds between each line. 0.08 reads as a sequence; 0.2 reads as a list. */
  stagger = 0.08,
  duration = 0.95,
  delay = 0,
  /** false plays on mount (hero); true waits for the element to be scrolled to. */
  scroll = true,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const { reduced } = useMotion()

  // SplitText replaces the element's children with its own span structure and
  // takes ownership of that DOM. React updating the text underneath it then has
  // no visible effect, the already-split nodes simply stay on screen, which is
  // what left headings stuck in the previous language after a language change
  // while every unsplit string around them updated correctly.
  //
  // The text is therefore tracked explicitly. It keys the element, so React
  // mounts a fresh node carrying the new text rather than trying to patch nodes
  // SplitText owns, and it is a dependency, so the split is rebuilt against it.
  // Reverting alone would not be enough: SplitText restores the markup it
  // captured at split time, which is the *old* text.
  const textKey = typeof children === 'string' || typeof children === 'number' ? String(children) : null

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (reduced) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            ease: 'none',
            delay,
            scrollTrigger: scroll ? { trigger: el, start: 'top 92%', once: true } : undefined,
          },
        )
        return
      }

      const split = SplitText.create(el, {
        type,
        mask: type === 'lines' ? 'lines' : 'words',
        autoSplit: true,
        linesClass: 'split-line',
        // Returning the tween hands ownership to SplitText, so a re-split on
        // resize kills the old one instead of leaving a stalled transform.
        onSplit(self) {
          const targets = type === 'lines' ? self.lines : self.words
          return gsap.from(targets, {
            yPercent: 118,
            // A hair of rotation stops a multi-line block from reading as a
            // rigid stack of shutters. Barely perceptible; does the work.
            rotate: type === 'lines' ? 1.2 : 0,
            duration,
            delay,
            stagger,
            ease: EASE.luxe,
            scrollTrigger: scroll
              ? {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                }
              : undefined,
          })
        },
      })

      return () => {
        split.revert()
      }
    },
    { scope: ref, dependencies: [reduced, type, scroll, textKey], revertOnUpdate: true },
  )

  // will-change is deliberately absent: SplitText adds it per line while the
  // tween runs and removes it after. Declaring it in CSS would promote every
  // line to its own layer permanently and cost more memory than it saves.
  return (
    <Tag key={textKey} ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
