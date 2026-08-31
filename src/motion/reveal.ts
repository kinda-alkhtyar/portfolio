import { DUR, EASE, STAGGER, TRIGGER, prefersReducedMotion } from './config'
import { SplitText, gsap } from './gsap'

export type RevealMode =
  /** Opacity only. For elements that must not move (rules, marks). */
  | 'fade'
  /** Opacity + upward travel. The default. */
  | 'rise'
  /** Media uncovering from a clip, no opacity change. */
  | 'mask'
  /** Text split to lines, each rising out of its own mask. */
  | 'lines'
  /** Text split to words. */
  | 'words'
  /** Text split to characters. Use sparingly — one headline per page. */
  | 'chars'

export interface RevealOptions {
  mode?: RevealMode
  /** Travel distance in px for `rise` / text modes. */
  y?: number
  duration?: number
  ease?: string
  /** Between elements, or between lines/words/chars within one element. */
  stagger?: number
  delay?: number
  /** ScrollTrigger `start`. Defaults to the shared reveal line. */
  start?: string
  /** Replay when scrolled back past. Off by default — replays read as cheap. */
  repeat?: boolean
  /** Drive every target from one trigger instead of each from itself. */
  trigger?: Element | null
  onComplete?: () => void
}

const TEXT_MODES = new Set<RevealMode>(['lines', 'words', 'chars'])

/**
 * The house reveal.
 *
 * Scroll-triggered, transform/opacity only, and a no-op under reduced motion —
 * where it deliberately sets nothing, so the target is simply already visible.
 *
 * Returns a cleanup that kills the tweens, their triggers and any text split.
 * Inside `useMotionScope` you can return it from the setup function and the
 * scope will call it on unmount.
 *
 * ```ts
 * const ref = useMotionScope<HTMLElement>(({ q }) => reveal(q('[data-reveal]')))
 * ```
 */
export function reveal(targets: gsap.DOMTarget, options: RevealOptions = {}): () => void {
  if (prefersReducedMotion()) return () => {}

  const elements = gsap.utils.toArray<HTMLElement>(targets)
  if (elements.length === 0) return () => {}

  const {
    mode = 'rise',
    y = mode === 'chars' ? 40 : 28,
    duration = TEXT_MODES.has(mode) ? DUR.slow : DUR.base,
    ease = EASE.expo,
    stagger = TEXT_MODES.has(mode) ? STAGGER.text : STAGGER.base,
    delay = 0,
    start = mode === 'mask' ? TRIGGER.media : TRIGGER.reveal,
    repeat = false,
    trigger = null,
    onComplete,
  } = options

  const splits: SplitText[] = []
  const tweens: gsap.core.Tween[] = []

  const scrollTrigger = (self: Element) => ({
    trigger: trigger ?? self,
    start,
    toggleActions: repeat ? ('play reverse play reverse' as const) : ('play none none none' as const),
    once: !repeat,
  })

  elements.forEach((element, index) => {
    const offset = delay + (trigger ? index * stagger : 0)
    const common = { duration, ease, delay: offset, scrollTrigger: scrollTrigger(element) }

    if (TEXT_MODES.has(mode)) {
      const type = mode === 'lines' ? 'lines' : mode === 'words' ? 'words' : 'chars'
      // `mask` gives each part its own overflow clip, so the text slides out
      // from behind its own line box rather than fading in place.
      const split = SplitText.create(element, { type, mask: type, autoSplit: true })
      splits.push(split)

      const parts = split[type] as HTMLElement[]
      tweens.push(gsap.from(parts, { ...common, yPercent: 110, stagger, onComplete }))
      return
    }

    if (mode === 'mask') {
      tweens.push(
        gsap.fromTo(
          element,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { ...common, clipPath: 'inset(0% 0% 0% 0%)', onComplete },
        ),
      )
      return
    }

    tweens.push(
      gsap.from(element, {
        ...common,
        autoAlpha: 0,
        y: mode === 'fade' ? 0 : y,
        onComplete,
      }),
    )
  })

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
    splits.forEach((split) => split.revert())
  }
}
