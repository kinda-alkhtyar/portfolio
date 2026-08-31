import { TRIGGER, prefersReducedMotion } from './config'
import { gsap } from './gsap'

export interface ParallaxOptions {
  /**
   * Vertical travel across the whole scroll range, as a percentage of the
   * element's own height. Negative moves against the scroll (the layer reads
   * as further away); positive moves with it.
   */
  yPercent?: number
  /** Horizontal counterpart, same sign convention. */
  xPercent?: number
  /** End scale, e.g. `1.12` for a slow push on full-bleed media. */
  scale?: number
  /** Element whose travel through the viewport drives the tween. */
  trigger?: Element | null
  start?: string
  end?: string
  /**
   * Scrub smoothing in seconds. A little lag is what separates parallax that
   * feels expensive from parallax that feels glued to the scrollbar.
   */
  scrub?: number | boolean
}

/**
 * Scrubbed parallax for decorative layers.
 *
 * Percentage-based so it holds at any viewport size, transform-only so it
 * stays on the compositor, and a no-op under reduced motion — the guideline
 * that matters most here, since parallax is the effect most likely to make
 * motion-sensitive visitors ill.
 *
 * Returns a cleanup that kills the tween and its ScrollTrigger.
 */
export function parallax(target: gsap.DOMTarget, options: ParallaxOptions = {}): () => void {
  if (prefersReducedMotion()) return () => {}

  const elements = gsap.utils.toArray<HTMLElement>(target)
  if (elements.length === 0) return () => {}

  const {
    yPercent = -12,
    xPercent = 0,
    scale,
    trigger = null,
    start = TRIGGER.parallaxStart,
    end = TRIGGER.parallaxEnd,
    scrub = 0.6,
  } = options

  const tweens = elements.map((element) =>
    gsap.to(element, {
      yPercent,
      xPercent,
      scale,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? element, start, end, scrub, invalidateOnRefresh: true },
    }),
  )

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  }
}
