// ─────────────────────────────────────────────────────────────────────────────
// Lenis instance store.
//
// The scroll instance is external mutable state: it is created by an effect,
// lives outside React, and consumers need to re-render when it appears or goes
// away. Holding it in useState would mean calling a setter synchronously inside
// an effect body, a cascading render, and the thing React's own guidance tells
// you not to do.
//
// This is the sanctioned alternative: a tiny store with a subscribe function,
// read through useSyncExternalStore. Publishing is a plain function call, not a
// state update, so there is no extra render pass on mount.
// ─────────────────────────────────────────────────────────────────────────────

let instance = null
const listeners = new Set()

export function setLenisInstance(next) {
  if (instance === next) return
  instance = next
  listeners.forEach((listener) => listener())
}

export function getLenisInstance() {
  return instance
}

/** Server/prerender snapshot. There is no scroll instance outside the browser. */
export function getServerLenisInstance() {
  return null
}

export function subscribeLenis(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
