/**
 * Motion tokens for the whole site.
 *
 * Everything animated on the portfolio pulls its easing, duration and stagger
 * from here, so the timing language stays consistent across pages instead of
 * being re-guessed at every call site.
 *
 * The named custom eases (`silk`, `expo`, `drift`) are registered in `gsap.ts`
 * — this file only names them, so importing tokens never pulls in GSAP.
 */

export const EASE = {
  /** Default reveal easing — long, decelerating tail. */
  base: 'power3.out',
  /** Reserved for hero-scale elements that need a slower settle. */
  hero: 'power4.out',
  /** Outgoing elements: accelerate away. */
  exit: 'power2.in',

  /**
   * The premium set. Long, almost-flat tails — the reason agency motion reads
   * as "expensive" rather than fast. Registered as GSAP CustomEases.
   */
  /** Expo-out (0.16, 1, 0.3, 1). The house reveal ease. */
  expo: 'expo-out',
  /** Symmetric in-out (0.65, 0, 0.35, 1). Swaps, morphs, route moves. */
  silk: 'silk',
  /** Very long settle (0.19, 1, 0.22, 1). Hero and full-bleed media only. */
  drift: 'drift',
  /** Sharp in (0.895, 0.03, 0.685, 0.22). Exits that must feel decisive. */
  snapIn: 'snap-in',
} as const

export const DUR = {
  /** Micro-interactions. Kept inside the 150–300ms band. */
  micro: 0.22,
  swap: 0.3,
  quick: 0.45,
  base: 0.65,
  slow: 0.9,
  hero: 1.05,
  /** Full-bleed media and headline masks. */
  epic: 1.4,
} as const

export const STAGGER = {
  tight: 0.06,
  base: 0.08,
  loose: 0.1,
  /** Per-line/per-word text stagger. */
  text: 0.055,
} as const

/**
 * The page's beat grid, in seconds from a section timeline's start.
 *
 * Every Home section places its tiers on these marks. That is the whole point:
 * a visitor scrolling Hero → Selected Work → WHAT I DO → Belief → CTA → Footer
 * should hear one rhythm repeated at different volumes, not five sections each
 * inventing their own. Where a composition genuinely needs an off-beat, it is
 * written as `BEAT.x + BEAT.lead` so the offset is still read against the grid.
 */
export const BEAT = {
  /** The section's first mark — a label, a rule, the thing that opens it. */
  open: 0,
  /** A half-step. Used to offset a companion from the beat it belongs to. */
  lead: 0.08,
  /** The subject: headline, numerals, statement, media. */
  subject: 0.16,
  /** Structure: rules, frames, columns settling into place. */
  structure: 0.34,
  /** Detail: marks, dots, sparkles, the precision layer. */
  detail: 0.58,
  /** Supporting copy. */
  support: 0.74,
  /** The last thing to arrive. */
  close: 0.96,
} as const

/**
 * Easing by role, not by taste.
 *
 * The three custom eases were already the house set; this names which one a
 * given tier gets, so "the statement" moves the same way in every section and
 * "a hairline drawing in" moves the same way in every section.
 */
export const ROLE = {
  /** Subjects and media: the longest, flattest tail. */
  subject: EASE.drift,
  /** Structure: symmetric, so a line drawing in has no visible launch. */
  structure: EASE.silk,
  /** Everything else. */
  support: EASE.expo,
} as const

/** One timing for every hover response on the page. */
export const HOVER = { duration: DUR.base, ease: EASE.expo } as const

/**
 * Cursor timings. The dot is near the pointer, the ring trails it — that gap
 * is the entire effect, so the two are named rather than derived.
 */
export const CURSOR = {
  /** State swaps (hover / view / hidden). */
  state: DUR.swap,
  /** Zone fades, asymmetric: arriving is announced, leaving is not. */
  zoneIn: DUR.quick,
  zoneOut: DUR.swap,
  /** Ring scale multiplier while the pointer is held down. */
  press: 0.82,
  pressIn: DUR.micro,
  /**
   * Half-period of the ring's idle pulse, for states that declare one. Long
   * and even — it is a depth cue for something that cannot be clicked, not an
   * attention grab.
   */
  pulse: 1.9,
} as const

/**
 * The page depth continuum.
 *
 * Each below-fold section sits at `recede` on a shared perspective while it is
 * off-screen and returns to exactly z 0 before it is read, so nothing is ever
 * rendered at a size other than the one it was designed at — which also keeps
 * the type crisp, since a 3D transform resamples it.
 */
export const FLOW = { perspective: 1600, recede: -26 } as const

/** Interpolation factors for frame-loop follows (magnetic). */
export const LERP = {
  cursor: 0.16,
  cursorRing: 0.1,
  magnetic: 0.22,
} as const

/** Shared ScrollTrigger positions, so reveals fire on one consistent line. */
export const TRIGGER = {
  /** Standard reveal line: element is ~18% into the viewport. */
  reveal: 'top 82%',
  /** Later line for large media that would otherwise fire off-screen. */
  media: 'top 90%',
  /** Scrub range for parallax layers. */
  parallaxStart: 'top bottom',
  parallaxEnd: 'bottom top',
} as const

/**
 * Layer scale. Every fixed/absolute overlay picks its z from here so the
 * stack stays legible: content 0–10, chrome 20–30, route wipe 50, cursor 60.
 */
export const Z = {
  content: 10,
  chrome: 20,
  nav: 30,
  overlay: 50,
  cursor: 60,
} as const

/** Read live (not cached) so the OS setting can change mid-session. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Subscribes to changes of the reduced-motion setting and returns an
 * unsubscribe. Lets every motion hook tear its work down the moment the user
 * turns motion off, instead of only honouring the setting at mount.
 */
export function onReducedMotionChange(handler: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const listener = (event: MediaQueryListEvent) => handler(event.matches)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

/** True for touch/pen-first devices, where hover-driven motion should not run. */
export function hasFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}
