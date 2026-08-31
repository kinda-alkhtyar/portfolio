import type { ComponentPropsWithoutRef } from 'react'
import { useT } from '../i18n/localization'

/** Extra props are forwarded so callers can tag the indicator for motion. */
export default function ScrollIndicator({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const t = useT()
  return (
    <div className={`flex items-end gap-[31px] ${className ?? ''}`} {...rest}>
      <div className="flex flex-col items-center gap-[27px]">
        <span aria-hidden="true" className="text-[20px] leading-none text-purple-light/70">
          +
        </span>

        <span
          className="font-nav text-[13px] font-medium leading-none tracking-[0.45em] text-white/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          {t('SCROLL')}
        </span>
      </div>

      <span className="flex h-[56px] w-[31px] items-start justify-center rounded-full border border-white/45 pt-[9px]">
        <span className="size-[5px] rounded-full bg-white/85" />
      </span>
    </div>
  )
}
