import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion, hasFinePointer } from './gsap'
import { MotionContext } from './motionContext'
import { setLenisInstance, getLenisInstance, getServerLenisInstance, subscribeLenis } from './lenisStore'

// ─────────────────────────────────────────────────────────────────────────────
// MotionProvider
//
// Owns the global facts every animated component needs: the scroll instance,
// whether motion is wanted, whether there is a real pointer, and whether the
// intro curtain is still running.
//
// It also owns the one hard integration in this codebase, driving Lenis from
// GSAP's ticker and feeding its position back into ScrollTrigger. Both libraries
// want the frame loop; only one can have it. GSAP wins, Lenis is stepped inside
// it, and ScrollTrigger updates from Lenis rather than from the native scroll
// event that Lenis has taken over. Get it wrong in either direction and pinned
// sections drift a frame behind the content.
// ─────────────────────────────────────────────────────────────────────────────

const INTRO_SEEN_KEY = 'pvi-intro-seen'

/**
 * Decided once, before first paint, and shared by the loading screen and the
 * hero. If those two disagreed the hero would either play behind a closed
 * curtain or sit frozen after it lifted.
 */
function introShouldRun() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

export default function MotionProvider({ children }) {
  const lenis = useSyncExternalStore(subscribeLenis, getLenisInstance, getServerLenisInstance)

  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [fine, setFine] = useState(hasFinePointer)
  const [introRunning] = useState(introShouldRun)
  const [introDone, setIntroDone] = useState(() => !introShouldRun())

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      /* Private mode: the intro simply plays again next session. */
    }
    setIntroDone(true)
  }, [])

  // Track both media queries live. Someone who turns on Reduce Motion mid-
  // session gets the calm version immediately, with no reload.
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: fine)')

    const onMotion = (e) => setReduced(e.matches)
    const onPointer = (e) => setFine(e.matches)

    motionQuery.addEventListener('change', onMotion)
    pointerQuery.addEventListener('change', onPointer)
    return () => {
      motionQuery.removeEventListener('change', onMotion)
      pointerQuery.removeEventListener('change', onPointer)
    }
  }, [])

  useEffect(() => {
    // Reduced motion gets the native scroller, untouched. Smooth scrolling is
    // itself a motion effect, hijacking the wheel is precisely what the
    // setting is asking us not to do.
    if (reduced) {
      setLenisInstance(null)
      document.documentElement.classList.remove('lenis-active')
      ScrollTrigger.refresh()
      return undefined
    }

    const instance = new Lenis({
      // 1.05s is where the page still feels attached to the wheel. Past ~1.4s
      // it reads as lag rather than smoothness, and every scroll-linked
      // animation inherits that sluggishness.
      duration: 1.05,
      // Exponential out: immediate response to input, long quiet settle.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Touch already has excellent native momentum, tuned by the OS.
      // Overriding it is the single most common way smooth-scroll libraries
      // make a site worse on a phone.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })

    // Lenis owns scroll position → ScrollTrigger must read from it.
    instance.on('scroll', ScrollTrigger.update)

    // GSAP owns the frame loop → Lenis is stepped inside it.
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)

    setLenisInstance(instance)
    document.documentElement.classList.add('lenis-active')

    // Late webfonts and images change document height. Without this, every
    // ScrollTrigger start/end computed before the reflow is wrong.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('load', refresh)
      instance.off('scroll', ScrollTrigger.update)
      instance.destroy()
      setLenisInstance(null)
      document.documentElement.classList.remove('lenis-active')
    }
  }, [reduced])

  const value = useMemo(
    () => ({ lenis, reduced, fine, introRunning, introDone, completeIntro }),
    [lenis, reduced, fine, introRunning, introDone, completeIntro],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
