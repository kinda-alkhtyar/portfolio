import type { ComponentPropsWithoutRef } from 'react'

/** Extra props are forwarded so callers can tag the mark for motion. */
export default function PlusMark({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none text-purple-light/45 ${className ?? ''}`}
      {...rest}
    >
      +
    </span>
  )
}
