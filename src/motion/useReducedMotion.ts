import { useEffect, useState } from 'react'

import { onReducedMotionChange, prefersReducedMotion } from './config'

/**
 * The reduced-motion setting as React state, so a component can *render*
 * differently rather than only animate differently.
 *
 * `useMotionScope` already skips its setup under reduced motion, which is
 * enough when the reduced state is simply "the finished layout, unanimated".
 * It is not enough when the motion was also carrying the content — a looping
 * row, for instance, has to fall back to a plainly scrollable one.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => onReducedMotionChange(setReduced), [])
  return reduced
}
