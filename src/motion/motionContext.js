import { createContext, useContext } from 'react'

// Context and hook live apart from the provider component so the provider file
// exports a component and nothing else, which is what Vite's fast refresh
// needs in order to hot-replace it without dropping the Lenis instance.

export const MotionContext = createContext({
  /** Lenis instance, or null under reduced motion. */
  lenis: null,
  /** Visitor has asked for reduced motion. */
  reduced: false,
  /** Pointer is a mouse or trackpad, not a finger. */
  fine: false,
  /** The intro curtain will play this session. Fixed for the session. */
  introRunning: false,
  /** The intro curtain has finished (or was never going to run). */
  introDone: true,
  completeIntro: () => {},
})

export const useMotion = () => useContext(MotionContext)
