import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import Navbar from './Navbar'
import SiteFooter from './SiteFooter'
import type { CaseStudyImage, CaseStudyMeta } from '../data/secondLifeCaseStudy'
import { useLocale, useLocalizedPath, useT } from '../i18n/localization'

/**
 * The case study visual system, established by SECOND LIFE and shared by every
 * project page so the two cannot drift apart.
 *
 * Desktop-first and static: this file declares no `data-motion` hooks of its
 * own and imports no GSAP. `Plate` and `SectionHead` forward any extra props
 * to their root element — the same arrangement `PlusMark`, `QuoteBlock` and
 * `HeroTulip` use — so a page that wants to animate them can tag them from the
 * outside without a wrapper. A page that passes nothing renders exactly as it
 * did before; only SECOND LIFE opts in today.
 *
 * `internalFlags` / `internalNotes` are never read in this file. They are
 * production notes, and nothing here may put them into the DOM.
 */

const PLATE = 'overflow-hidden border border-white/12 bg-surface'

export const EYEBROW = 'font-nav text-[13px] tracking-[0.28em] text-beige'
const CAPTION = 'mt-[13px] font-nav text-[12px] tracking-[0.16em] text-white/35'

/** Structural shape shared by every project's section type. */
export interface SectionLike {
  index: string
  eyebrow: string
  title: string
  body: string[]
}

export function Plate({
  image,
  className = '',
  frameClass = '',
  ...rest
}: {
  image: CaseStudyImage
  className?: string
  frameClass?: string
} & ComponentPropsWithoutRef<'figure'>) {
  return (
    <figure className={className} {...rest}>
      <div className={`${PLATE} ${frameClass}`}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>
      {image.caption && <figcaption className={CAPTION}>{image.caption}</figcaption>}
    </figure>
  )
}

export function SectionHead({
  section,
  className = '',
  width = 'max-w-[620px]',
  ...rest
}: {
  section: SectionLike
  className?: string
  width?: string
} & ComponentPropsWithoutRef<'header'>) {
  return (
    <header className={className} {...rest}>
      <p className="flex items-center gap-[16px]">
        <span className="font-nav text-[13px] tracking-[0.24em] text-purple-light">
          {section.index}
        </span>
        <span aria-hidden="true" className="h-px w-[38px] bg-white/20" />
        <span className={EYEBROW}>{section.eyebrow.toUpperCase()}</span>
      </p>

      <h2 className="mt-[20px] font-display text-[54px] leading-[1.04] tracking-[0.01em] text-white">
        {section.title}
      </h2>

      <div className={`mt-[22px] space-y-[16px] ${width}`}>
        {section.body.map((paragraph) => (
          <p key={paragraph} className="font-serif text-[17px] leading-[1.55] text-white/65">
            {paragraph}
          </p>
        ))}
      </div>
    </header>
  )
}

/**
 * Page shell: backdrop, navbar and footer.
 *
 * Extra props are forwarded to the `<main>` — React 19, so `ref` is a plain
 * prop — which lets a page mount a motion scope on the shell without a
 * wrapper, the same way `Home` scopes the shared `SiteFooter`.
 */
export function CaseStudyChrome({
  children,
  ...rest
}: { children: ReactNode } & ComponentProps<'main'>) {
  return (
    // `case-study-page` carries no styling of its own in English; it is the
    // hook the Arabic case-study type rules are scoped to, so every project
    // page reads in one voice without per-page CSS.
    <main className="case-study-page home-canvas relative min-w-[1180px] overflow-hidden bg-bg" {...rest}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--screen)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(66%_62%_at_70%_28%,#26123A_0%,#150C22_46%,#0C0713_100%)]" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto w-full max-w-[1440px] pt-[43px]">
          <Navbar variant="fixed" top="43px" />
        </div>

        {children}

        <div className="mx-auto mt-[86px] w-full max-w-[1440px]">
          <SiteFooter />
        </div>
      </div>
    </main>
  )
}

/** Back link, title block and the four-column facts strip. */
export function CaseStudyHeader({ meta }: { meta: CaseStudyMeta }) {
  const path = useLocalizedPath()
  const locale = useLocale()
  const t = useT()
  return (
    <>
      <Link
        to={path('/work')}
        className="font-nav text-[12px] tracking-[0.26em] text-white/45 transition-colors hover:text-purple-light"
      >
        <span aria-hidden="true">{locale === 'ar' ? '→' : '←'}</span> {t('BACK TO WORK')}
      </Link>

      <div className="mt-[46px] flex items-end justify-between border-b border-white/12 pb-[34px]">
        <div>
          <p className={EYEBROW}>{meta.category.toUpperCase()}</p>
          <h1 className="mt-[16px] font-display text-[104px] leading-[0.92] tracking-[0.01em] text-white">
            {meta.title}
          </h1>
          <p className="mt-[14px] font-nav text-[19px] tracking-[0.2em] text-purple-light">
            {meta.subtitle.toUpperCase()}
          </p>
        </div>

        <p className="w-[398px] pb-[10px] font-serif text-[18px] leading-[1.5] text-white/70">
          {meta.intro}
        </p>
      </div>

      <dl className="mt-[30px] grid grid-cols-4 gap-[24px] border-b border-white/12 pb-[38px]">
        {meta.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-nav text-[11px] tracking-[0.26em] text-white/35">
              {fact.label.toUpperCase()}
            </dt>
            <dd className="mt-[9px] font-nav text-[15px] leading-[1.45] tracking-[0.04em] text-white/80">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}

/** Closing strip: project stamp and the route back to the grid. */
export function CaseStudyOutro({ meta }: { meta: CaseStudyMeta }) {
  const path = useLocalizedPath()
  const locale = useLocale()
  const t = useT()
  return (
    <section className="home-section mx-auto mt-[110px]">
      <div className="flex items-center justify-between border-t border-white/12 pt-[36px]">
        <p className="font-nav text-[11px] tracking-[0.34em] text-white/30">
          {meta.title} — {meta.year}
        </p>
        <Link
          to={path('/work')}
          className="flex h-[50px] items-center gap-[18px] rounded-full border border-white/30 px-[28px] font-nav text-[15px] tracking-[0.1em] text-white transition-colors hover:border-purple-light hover:text-purple-light"
        >
          {t('ALL PROJECTS')}
          <span aria-hidden="true" className="text-beige">
            {locale === 'ar' ? '←' : '→'}
          </span>
        </Link>
      </div>
    </section>
  )
}
