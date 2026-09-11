import tulip from '../assets/images/home/tulip.png'
import { useMotionScope } from '../motion'
import { homeCtaMotion } from './homeCtaMotion'
import { useLocale, useT } from '../i18n/localization'

/** The closing statement, one masked line each instead of one block split by `<br />`. */
const STATEMENT = ['LET\u2019S CREATE', 'SOMETHING', 'MEMORABLE.']

/**
 * The closing call to action: a three-line grotesk headline on the left, a
 * hairline, then one outlined pill on the right. This is the single place the
 * reference leaves Anton for a wide geometric face, so it runs on
 * `--font-grotesk` rather than `--font-display`.
 *
 * Motion hooks only, no layout change:
 *   - the statement renders its lines as `block` spans rather than `<br />`
 *     (identical line boxes, but each line can now be masked from JS)
 *   - the tulip sits inside a plane wrapper that carries its offsets, so the
 *     image itself keeps its authored `rotate-[8deg]` untouched
 *   - the pill is wrapped in a positioning div, so the entrance can own the
 *     wrapper's `y` while the magnetic pull owns the pill's own `x`/`y`
 *
 * Every hidden state is set from JS, so reduced motion and a JS failure both
 * leave the section exactly as authored.
 */
export default function HomeCta() {
  const locale = useLocale()
  const t = useT()
  const ar = locale === 'ar'
  const statement = ar ? ['لنبتكر', 'شيئًا', 'لا يُنسى.'] : STATEMENT
  const sectionRef = useMotionScope<HTMLElement>(homeCtaMotion)

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${ar ? 'ar-home-cta' : ''}`}
    >
      {/* tulip leaves entering from the bottom-left corner */}
      <div
        aria-hidden="true"
        data-motion="cta-plane"
        className="pointer-events-none absolute -left-[70px] -top-[150px] w-[320px]"
      >
        <img
          src={tulip}
          alt=""
          aria-hidden="true"
          data-motion="cta-tulip"
          className="w-full max-w-none rotate-[8deg] opacity-95"
        />
      </div>

      <div data-motion="cta-band" className="home-section relative pb-[52px] pt-[49px]">
        <span
          aria-hidden="true"
          data-motion="cta-rule"
          className="absolute left-[var(--content-pl)] right-0 top-0 h-px bg-white/10"
        />

        <div className="relative">
          <h2 className="ml-[109px] font-grotesk text-[52px] font-extrabold leading-[0.97] tracking-[0.005em] text-purple-light">
            {statement.map((line) => (
              <span key={line} className="block">
                <span data-motion="cta-line" className="block">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <span
            aria-hidden="true"
            data-motion="cta-divider"
            className="absolute left-[640px] top-[-17px] h-[161px] w-px bg-white/14"
          />

          <div data-motion="cta-button-wrap" className="absolute left-[733px] top-[21px]">
            <a
              href="https://wa.me/905513403447?text=Hi%20Yumna%2C%20I%20came%20across%20your%20portfolio%20and%20I%E2%80%99d%20like%20to%20discuss%20a%20project%20with%20you"
              target="_blank"
              rel="noreferrer"
              data-motion="cta-button"
              className="group inline-flex h-[88px] items-center gap-[40px] rounded-full border border-purple-light/70 px-[46px] font-nav text-[28px] font-semibold leading-none tracking-[0.05em] text-white transition-colors hover:border-purple-light hover:text-purple-light"
            >
              <span data-motion="cta-button-label">{t("LET'S TALK")}</span>
              <svg
                viewBox="0 0 34 12"
                aria-hidden="true"
                className={`h-[12px] w-[34px] shrink-0 fill-none stroke-current transition-transform duration-300 ${
                  ar ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
                strokeWidth="1.5"
              >
                {/* The arrow points the way the language reads. */}
                <path
                  d={ar ? 'M34 6H2M7.5 1 2 6l5.5 5' : 'M0 6h32M26.5 1 32 6l-5.5 5'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <span
            aria-hidden="true"
            data-motion="cta-sparkle"
            className="pointer-events-none absolute left-[1093px] top-[8px] text-[22px] leading-none text-beige/85"
          >
            &#10022;
          </span>
        </div>
      </div>
    </section>
  )
}
