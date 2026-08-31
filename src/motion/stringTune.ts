import StringTune, { type StringModule } from '@fiddle-digital/string-tune'

import { hasFinePointer, prefersReducedMotion } from './config'

let refCount = 0
let booted: StringTune | null = null

/**
 * The attribute-driven effect layer.
 *
 * StringTune ships its own smooth-scroll engine, which would fight Lenis, so
 * this boots it with both scroll modes forced to `default` (native): Lenis
 * stays the only thing smoothing the page, and StringTune is used purely for
 * the pointer- and layout-driven modules GSAP has no equivalent for
 * (`StringMarquee`, `StringTilt`, `StringSpotlight`, `StringMasonry`,
 * `StringGlide`). Scroll-driven work stays on ScrollTrigger.
 *
 * Reference-counted, so several components can ask for it and the instance is
 * only destroyed once the last one unmounts. Nothing on the site uses it yet —
 * this is the door, not a room.
 *
 * ```ts
 * useEffect(() => acquireStringTune([StringMarquee]), [])
 * ```
 */
export function acquireStringTune(modules: Array<typeof StringModule> = []): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion() || !hasFinePointer()) {
    return () => {}
  }

  if (!booted) {
    const tune = StringTune.getInstance()
    // Lenis owns scrolling. StringTune only observes it.
    tune.scrollDesktopMode = 'default'
    tune.scrollMobileMode = 'default'
    tune.start(60)
    booted = tune
  }

  modules.forEach((module) => booted?.use(module))
  refCount += 1

  return () => {
    refCount -= 1
    if (refCount > 0 || !booted) return

    booted.destroy()
    booted = null
  }
}

/** The live instance, or `null` when no component has asked for it. */
export const getStringTune = () => booted
