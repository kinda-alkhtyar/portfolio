import { useLayoutEffect, useRef, useState } from 'react'

import { onReducedMotionChange, prefersReducedMotion } from './config'
import { ScrollTrigger, gsap } from './gsap'

type MotionSetup = (helpers: {
  /** The scoped root element. */
  scope: HTMLElement
  /** Query elements inside the scope, e.g. `q('[data-motion="card"]')`. */
  q: (selector: string) => HTMLElement[]
}) => void | (() => void)

/**
 * Runs `setup` inside a `gsap.context` scoped to the returned ref, before
 * paint (so initial hidden states never flash) and reverted on unmount
 * (so every tween and ScrollTrigger created inside is cleaned up).
 *
 * `setup` may return its own cleanup — that is what the `reveal` and
 * `parallax` utilities hand back, and it runs before the context reverts, so
 * text splits are undone while their elements are still in the DOM.
 *
 * Under `prefers-reduced-motion` the setup never runs at all, which leaves
 * the page in its natural, fully visible state — and flipping the setting
 * mid-session re-evaluates rather than waiting for a navigation.
 */
export function useMotionScope<T extends HTMLElement>(setup: MotionSetup) {
  const ref = useRef<T>(null)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 767.98px)').matches)

  useLayoutEffect(() => {
    const media = window.matchMedia('(max-width: 767.98px)')
    const update = () => setPhone(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => onReducedMotionChange(setReduced), [])

  useLayoutEffect(() => {
    const scope = ref.current
    if (!scope || reduced) return
    // These desktop scenes use fixed distances and pinned media. Phone pages
    // read in normal flow; Home retains its existing mobile choreography.
    if (phone && scope.matches('.work-page, .about-page, .contact-page, .case-study-page')) return

    let teardown: void | (() => void)

    const ctx = gsap.context(() => {
      teardown = setup({
        scope,
        q: (selector) => gsap.utils.toArray<HTMLElement>(selector, scope),
      })
    }, scope)

    // The scope's own tweens change layout height; triggers below it need it.
    ScrollTrigger.refresh()

    return () => {
      teardown?.()
      ctx.revert()
    }
    // `setup` describes the section's entrance, which runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, phone])

  return ref
}
