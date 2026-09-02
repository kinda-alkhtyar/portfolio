import { prefersReducedMotion } from '../motion'

/**
 * The one place the cinematic opening and the hero entrance agree on who is
 * driving the fold.
 *
 * `heroMotion` is not rewritten for the intro — it is *held*. The entrance
 * timeline is built exactly as it always was, paused at 0, and started when
 * the intro's tulip video has landed on the hero's own bloom. So the fold's
 * choreography is byte-identical whether the intro played or not; only its
 * clock starts later. The single deliberate difference is the 0.2s route-wipe
 * delay, which exists to clear `PageTransition` and has nothing to clear when
 * the intro is the thing handing over.
 *
 * The gate is also the fold's safety net. If the intro never mounts, its
 * video errors, autoplay is refused or the tab is backgrounded through the
 * whole thing, the hero must still open on its own — so every consumer arms a
 * ceiling alongside its subscription and the intro releases from its cleanup
 * as well as from its timeline.
 */

/**
 * Whether an opening is possible on this page load at all. Computed once, on
 * the first ask, so the intro overlay and `heroMotion` cannot disagree no
 * matter which of them is set up first.
 */
let decided: boolean | null = null

/** Set when an intro has actually played out (or been skipped) here. */
let consumed = false

/** Armed by `heroMotion`; emptied by `releaseHero`. */
const waiting = new Set<() => void>()
let released = false

function eligible(): boolean {
  if (typeof window === 'undefined') return false
  // The reduced-motion fallback is the absence of the intro, not a shorter
  // one: the fold is simply entered as it is.
  if (prefersReducedMotion()) return false
  // A deep link or a restored scroll position is a request for a place on the
  // page, not for an opening.
  if (window.location.hash) return false
  if (window.scrollY > 0) return false
  // The opening's plane field is authored in 1440-canvas pixels — five plates
  // placed by absolute `left` / `top` — and its camera solves against the
  // desktop hero bloom. There is no phone-width composition for it, and it
  // also costs an 8.7MB clip on a phone connection before anything is
  // readable. Below `lg` the fold is entered directly, which is the same,
  // already-supported path a return visit takes.
  if (window.matchMedia('(max-width: 1023.98px)').matches) return false
  return true
}

/**
 * True while the cinematic opening owns the fold. Safe to call from anywhere,
 * any number of times, in any order.
 */
export function introWillRun(): boolean {
  if (decided === null) decided = eligible()
  return decided && !consumed
}

/** The opening played (or was skipped). It never runs a second time. */
export function consumeIntro(): void {
  consumed = true
}

/**
 * Hold the hero entrance until the intro hands over. Re-arming resets the
 * latch, which is what makes this survive StrictMode's mount / unmount /
 * remount in development: the second setup gates again rather than finding a
 * release left behind by the first one's teardown.
 */
export function armHeroGate(onRelease: () => void): () => void {
  released = false
  waiting.add(onRelease)
  return () => waiting.delete(onRelease)
}

/** Start the fold. Idempotent — the first caller wins and the rest are no-ops. */
export function releaseHero(): void {
  if (released) return
  released = true
  const listeners = [...waiting]
  waiting.clear()
  listeners.forEach((fn) => fn())
}

/**
 * How long the fold will wait for an intro that never hands over. Comfortably
 * past the opening's ~9s, so it is a failsafe and never a participant.
 */
export const HERO_CEILING = 14
