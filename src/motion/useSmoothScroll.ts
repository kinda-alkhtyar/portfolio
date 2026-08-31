import { useEffect } from 'react'
import Lenis from 'lenis'

import { onReducedMotionChange, prefersReducedMotion } from './config'
import { gsap, ScrollTrigger } from './gsap'

let instance: Lenis | null = null

/** The live smooth-scroll instance, or `null` under reduced motion. */
export const getLenis = () => instance

/**
 * Mounts Lenis once, at the app root, and drives it from the GSAP ticker so
 * scrolling and every ScrollTrigger share a single rAF loop.
 *
 * Lenis scrolls the window itself, so ScrollTrigger needs no scrollerProxy —
 * it only needs `update()` on every Lenis frame and a `refresh()` once the
 * page has settled.
 *
 * It also stamps `data-motion` on `<html>`: `ready` when motion is running,
 * `reduced` when it is not. CSS uses that flag to decide whether a
 * `[data-reveal]` element may start hidden, so a JS failure or a reduced-motion
 * user can never end up with permanently invisible content.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const root = document.documentElement

    /** Boots (or re-boots) the engine for the current motion preference. */
    const start = () => {
      if (prefersReducedMotion()) {
        root.dataset.motion = 'reduced'
        return () => {
          delete root.dataset.motion
        }
      }

      root.dataset.motion = 'ready'

      const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
      instance = lenis

      const raf = (time: number) => lenis.raf(time * 1000)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // Fonts and images land after mount and change every trigger position.
      const refresh = () => ScrollTrigger.refresh()
      document.fonts?.ready.then(refresh).catch(() => {})
      window.addEventListener('load', refresh)

      return () => {
        window.removeEventListener('load', refresh)
        gsap.ticker.remove(raf)
        lenis.destroy()
        instance = null
        delete root.dataset.motion
      }
    }

    let stop = start()

    // Honour the setting being flipped mid-session, not just at mount.
    const unsubscribe = onReducedMotionChange(() => {
      stop()
      stop = start()
    })

    return () => {
      unsubscribe()
      stop()
    }
  }, [])
}
