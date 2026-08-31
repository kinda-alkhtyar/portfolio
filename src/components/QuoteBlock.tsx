import type { ComponentPropsWithoutRef } from 'react'
import { useLocale } from '../i18n/localization'

/**
 * The hero's pull quote. Its three parts carry their own motion hook so the
 * entrance can stagger the mark, the quote and the signature rather than
 * fading the block in as one flat object.
 */
export default function QuoteBlock({ className, ...rest }: ComponentPropsWithoutRef<'figure'>) {
  const locale = useLocale()
  return (
    <figure className={className} {...rest}>
      <span
        aria-hidden="true"
        data-motion="quote-part"
        className="block font-serif text-[38px] leading-[0.6] text-purple-light/65"
      >
        &ldquo;
      </span>

      <blockquote
        data-motion="quote-part"
        className="mt-[28px] font-serif text-[18px] leading-[1.36] text-white/70"
      >
        {locale === 'ar' ? 'التصميم الجيد ليس مظهرًا فقط، بل كيف يعمل وما يتركه من شعور.' : <>Good design is not just how it looks, it&rsquo;s how it works and what it makes people feel.</>}
      </blockquote>

      <figcaption
        data-motion="quote-part"
        // Logical, so the signature overhangs the column's own leading edge in
        // both directions rather than always the left one.
        className="-ms-[4px] mt-[34px] font-script text-[54px] leading-[1.12] tracking-[0.015em] text-beige/80"
      >
        Yumna
      </figcaption>
    </figure>
  )
}
