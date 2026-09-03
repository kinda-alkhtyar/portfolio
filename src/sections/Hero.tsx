import { Link } from 'react-router-dom'
import QuoteBlock from '../components/QuoteBlock'
import { primaryButton, secondaryButton } from '../styles/buttons'
import { useLocalizedPath, useLocale, useT } from '../i18n/localization'

/**
 * The headline is authored as three block lines rather than `<br />`-separated
 * text so each one can sit in its own overflow clip. Rendering is identical —
 * a block span breaks exactly where the `<br />` did, and the clip is the line
 * box, whose height comes from `leading-[1.05]`, not from the glyphs — but it
 * gives the entrance a real mask to slide the line out of.
 */
const HEADLINE = ['VISUAL', 'COMMUNICATION', 'DESIGNER']

/**
 * The same statement, broken the same way: one word a line, read top to
 * bottom as `مصمّمة تواصل بصري`. Anton's caps and Tahoma's Arabic are not the
 * same object, though, so the Arabic block is re-metricked below rather than
 * poured into the English one — 107px on a 1.05 leading is a line box of
 * 112px, and Tahoma's Arabic content area alone is 1.21em, which the
 * headline's own overflow clip would cut through.
 */
const HEADLINE_AR = ['مصمّمة', 'تواصل', 'بصري']

export default function Hero() {
  const t = useT()
  const locale = useLocale()
  const path = useLocalizedPath()
  const ar = locale === 'ar'
  const headline = ar ? HEADLINE_AR : HEADLINE
  return (
    // `hero-text` is the hero's near plane: the whole text block recedes as one
    // object on the way out, which is what makes the bloom coming forward past
    // it read as depth rather than as two unrelated tweens.
    <section data-motion="hero-text" className="home-hero-copy mt-[var(--hero-top)]">
      <p
        data-motion="hero-eyebrow"
        className={
          ar
            ? 'font-nav text-[22px] font-semibold leading-none text-beige'
            : 'font-nav text-[18px] font-semibold leading-none tracking-[0.5em] text-beige'
        }
      >
        {ar ? 'يمنى المعلّم' : 'YUMNA AL-MUALLEM'}
      </p>

      <h1
        className={
          ar
            ? 'mt-[6px] font-display text-[96px] leading-[1.24] text-white'
            : '-mt-[2px] font-display text-[107px] leading-[1.05] tracking-[0.005em] text-white'
        }
      >
        {headline.map((line) => (
          <span key={line} className="block overflow-hidden">
            <span data-motion="hero-line" className="block">
              {line}
            </span>
          </span>
        ))}
      </h1>

      <p
        data-motion="hero-subtitle"
        className={`flex items-center gap-[25px] font-nav font-medium text-purple-light ${
          ar
            ? 'mt-[calc(var(--hero-gap-sub)_-_12px)] text-[22px] leading-[1.6]'
            : 'mt-[var(--hero-gap-sub)] text-[19px] leading-none tracking-[0.3em]'
        }`}
      >
        {t('GRAPHIC DESIGN')}
        <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-purple-light" />
        {t('UI/UX DESIGN')}
      </p>

      <div className="mt-[var(--hero-gap-cta)] flex flex-wrap items-center gap-[30px]">
        <Link
          to={path('/work')}
          data-motion="hero-cta"
          data-cursor="button"
          className={primaryButton}
        >
          {t('VIEW PROJECTS')}
          <svg
            viewBox="0 0 28 12"
            aria-hidden="true"
            className={`h-[12px] w-[28px] shrink-0 fill-none stroke-current transition-transform duration-300 ${
              ar ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
            }`}
            strokeWidth="1.5"
          >
            {/* The arrow points the way the language reads. */}
            <path
              d={ar ? 'M28 6H2M7 1 2 6l5 5' : 'M0 6h26M21 1l5 5-5 5'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <Link to={path('/about')} data-motion="hero-cta" data-cursor="link" className={secondaryButton}>
          {t('ABOUT ME')}
          <svg
            viewBox="0 0 22 22"
            aria-hidden="true"
            className="size-[22px] shrink-0 fill-none stroke-current"
            strokeWidth="1.4"
          >
            <circle cx="11" cy="7.4" r="4" />
            <path d="M3.8 19.2c0-4 3.2-6.6 7.2-6.6s7.2 2.6 7.2 6.6" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      {/* The pull quote, phone widths only.

          On desktop it hangs in the pocket the bloom leaves inside the ring
          and is placed from `Home` (see `global.css` for the Arabic pocket);
          at phone width there is no ring and no pocket, so the same block
          closes the stacked fold instead — the signature still ends the hero,
          which is the relationship the composition is actually built on.

          Its three parts carry the same `data-motion="quote-part"` hooks the
          desktop one does, and `heroMotion` collects them with `q(...)`, so it
          takes the hero's own staggered entrance with nothing added there. The
          desktop block stays `hidden lg:block`, so exactly one of the two is
          ever visible. */}
      <QuoteBlock className="home-hero-quote-mobile mt-[40px] lg:hidden" />
    </section>
  )
}
