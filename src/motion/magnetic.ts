import { useEffect, useRef } from 'react'

import { DUR, EASE, HOVER, hasFinePointer, onReducedMotionChange, prefersReducedMotion } from './config'
import { gsap } from './gsap'

export interface MagneticOptions {
  /** Share of the cursor's offset the element follows. Keep under ~0.5. */
  strength?: number
  /** Independent, usually smaller, pull for a label inside the element. */
  child?: { selector: string; strength?: number }
  /** Scale while engaged. `1` disables it. */
  scale?: number
}

/**
 * Magnetic hover: the element leans toward the cursor while it is over it and
 * springs back on leave.
 *
 * Uses `gsap.quickTo`, so pointer moves write to a pre-built tween instead of
 * allocating a new one per event. Skipped entirely on coarse pointers (there
 * is no hover to respond to) and under reduced motion.
 *
 * Returns a cleanup that removes the listeners and clears the transform.
 */
export function magnetic(element: HTMLElement, options: MagneticOptions = {}): () => void {
  if (prefersReducedMotion() || !hasFinePointer()) return () => {}

  const { strength = 0.32, child, scale = 1 } = options
  const inner = child ? element.querySelector<HTMLElement>(child.selector) : null
  const innerStrength = child?.strength ?? strength * 0.5

  const settle = { duration: DUR.slow, ease: EASE.expo }
  const toX = gsap.quickTo(element, 'x', settle)
  const toY = gsap.quickTo(element, 'y', settle)
  const toInnerX = inner ? gsap.quickTo(inner, 'x', settle) : null
  const toInnerY = inner ? gsap.quickTo(inner, 'y', settle) : null

  const onMove = (event: PointerEvent) => {
    const box = element.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)

    toX(dx * strength)
    toY(dy * strength)
    toInnerX?.(dx * innerStrength)
    toInnerY?.(dy * innerStrength)
  }

  const onEnter = () => {
    if (scale !== 1) gsap.to(element, { scale, ...HOVER })
  }

  const onLeave = () => {
    toX(0)
    toY(0)
    toInnerX?.(0)
    toInnerY?.(0)
    if (scale !== 1) gsap.to(element, { scale: 1, ...HOVER })
  }

  element.addEventListener('pointerenter', onEnter)
  element.addEventListener('pointermove', onMove)
  element.addEventListener('pointerleave', onLeave)
  // A pointer released outside the element never fires `pointerleave`.
  element.addEventListener('pointercancel', onLeave)

  return () => {
    element.removeEventListener('pointerenter', onEnter)
    element.removeEventListener('pointermove', onMove)
    element.removeEventListener('pointerleave', onLeave)
    element.removeEventListener('pointercancel', onLeave)
    gsap.killTweensOf([element, inner].filter(Boolean) as HTMLElement[])
    gsap.set(element, { clearProps: 'transform' })
    if (inner) gsap.set(inner, { clearProps: 'transform' })
  }
}

/**
 * React binding for {@link magnetic}. Attach the returned ref to the element:
 * `<button ref={useMagnetic<HTMLButtonElement>()}>`.
 *
 * Re-binds when the reduced-motion setting changes, so turning motion off
 * releases the element immediately rather than at the next navigation.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
  const ref = useRef<T>(null)
  // Read once: the pull is a fixed property of the element, not live state.
  const settings = useRef(options)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let cleanup = magnetic(element, settings.current)
    const unsubscribe = onReducedMotionChange(() => {
      cleanup()
      cleanup = magnetic(element, settings.current)
    })

    return () => {
      unsubscribe()
      cleanup()
    }
  }, [])

  return ref
}
