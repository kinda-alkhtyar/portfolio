import type { ComponentPropsWithoutRef } from 'react'

import tulipSrc from '../assets/images/home/tulip.png'

/**
 * The photographic purple tulip cut-out behind the hero.
 * Purely decorative — the PNG keeps its own transparency, so it composites
 * straight onto the backdrop gradient with no additional treatment.
 *
 * Extra props are forwarded to the `<img>` so callers can tag it for motion.
 */
export default function HeroTulip({ className, ...rest }: ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      src={tulipSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      fetchPriority="high"
      width={1086}
      height={1448}
      className={className}
      {...rest}
    />
  )
}
