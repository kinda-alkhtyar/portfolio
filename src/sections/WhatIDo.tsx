import PlusMark from '../components/PlusMark'
import { useMotionScope } from '../motion'
import { whatIDoMotion } from './whatIDoMotion'
import { useLocale, useT } from '../i18n/localization'

const services = [
  {
    index: '01',
    title: 'BRAND IDENTITY',
    body: 'Crafting visual identities that are strategic, timeless, and unforgettable.',
  },
  {
    index: '02',
    title: 'GRAPHIC DESIGN',
    body: 'Designing strong, effective visuals that communicate with clarity and impact.',
  },
  {
    index: '03',
    title: 'UI/UX DESIGN',
    body: 'Designing intuitive digital experiences that are elegant, seamless, and user-centered.',
  },
]

/**
 * Three services, split by full-height hairlines. The eyebrow sits above the
 * grid so the rules only run beside the numbered columns, as in the reference.
 *
 * The top gap is short because this section lands under the hero fold's own
 * `--page-pb`; the two together make the reference's gap under row 02.
 *
 * Motion hooks only, no layout change: each masked line is a bare `block` span
 * (the clip itself is set from JS, see `whatIDoMotion`), and the hairlines moved
 * from a painted `border-l` to a 1px span sitting exactly where that border was
 * — the border box is still there, just transparent, so the grid measures the
 * same but the line is now an element that can be drawn in.
 */
export default function WhatIDo() {
  const locale = useLocale()
  const t = useT()
  const localizedServices = locale === 'ar' ? [
    { index: '01', title: 'الهوية البصرية', body: 'أصمم هويات بصرية استراتيجية، راسخة، وقابلة للتذكر.' },
    { index: '02', title: 'التصميم الجرافيكي', body: 'أبتكر حلولًا بصرية قوية توصل الفكرة بوضوح وتأثير.' },
    { index: '03', title: 'تصميم UI/UX', body: 'أصمم تجارب رقمية بديهية وأنيقة تتمحور حول المستخدم.' },
  ] : services
  const sectionRef = useMotionScope<HTMLElement>(whatIDoMotion)

  return (
    <section ref={sectionRef} className="home-section pt-[36px]">
      <h2 className="font-nav text-[16px] font-semibold leading-none tracking-[0.3em] text-beige">
        <span className="block">
          <span data-motion="wid-label" className="block">
            {t('WHAT I DO')}
          </span>
        </span>
      </h2>

      <div className="wid-group relative mt-[26px] grid grid-cols-3">
        <PlusMark
          data-motion="wid-mark"
          className="absolute right-[168px] top-[14px] text-[22px] leading-none"
        />
        {localizedServices.map(({ index, title, body }, i) => (
          <div
            key={index}
            data-motion="wid-col"
            className={`relative pr-[70px] ${i > 0 ? 'border-l border-transparent pl-[70px]' : ''}`}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                data-motion="wid-rule"
                className="absolute -left-px top-0 h-full w-px bg-white/12"
              />
            )}

            <div data-motion="wid-inner">
              <p className="font-display text-[58px] leading-none tracking-[0.01em] text-purple-light">
                <span className="block">
                  <span data-motion="wid-index" className="block">
                    {index}
                  </span>
                </span>
              </p>

              <h3 className="mt-[22px] font-display text-[36px] leading-none tracking-[0.015em] text-white">
                <span className="block">
                  <span data-motion="wid-title" className="block">
                    {title}
                  </span>
                </span>
              </h3>

              <p
                data-motion="wid-body"
                className="mt-[26px] max-w-[290px] font-nav text-[17px] font-normal leading-[1.75] text-white/55"
              >
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
