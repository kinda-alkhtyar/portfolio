import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import { useMotionScope } from '../motion'
import type { CaseStudy as CaseStudyData, CaseStudySectionId } from '../data/secondLifeCaseStudy'
import { secondLifeMotion } from './secondLifeMotion'
import { LocalizedText } from '../i18n/localization'

/**
 * SECOND LIFE case study page.
 *
 * Desktop-first. The layout below is unchanged; the only additions are
 * `data-motion` hooks, which `secondLifeMotion` reads through the scope
 * mounted on the chrome. It is the one case study that opts in — the other
 * seven pass nothing to the shared components and render exactly as before.
 *
 * The reading order is fixed by the layout below rather than by the data —
 * hero, identity pair, passport pair, main UI, supporting UI, applications
 * pair, closing image — so the section list in the data file stays free to be
 * reordered without disturbing the page.
 *
 * Shared chrome and plate styling live in `components/caseStudyUi.tsx`, so
 * every project page renders in the same visual system.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function CaseStudy({ caseStudy }: { caseStudy: CaseStudyData }) {
  const { meta, sections } = caseStudy

  const section = (id: CaseStudySectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const identity = section('brand-identity')
  const passport = section('material-passport')
  const archive = section('digital-archive')
  const applications = section('applications')
  const closing = section('closing')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const heroShot = image('home-desktop.png')
  const logoBoard = image('logo-system.png')
  const identityBoard = image('visual-identity.png')
  const tag = image('mockup-material-tag.png')
  const passportBook = image('mockup-material-passport.png')
  const materials = image('materials-desktop.png')
  const projectsShot = image('projects-desktop.png')
  const collections = image('collections-desktop.png')
  const about = image('about-desktop.png')
  const marbleLabel = image('mockup-marble-label.png')
  const sampleBox = image('mockup-sample-box.png')
  const crate = image('mockup-shipping-crate.png')

  const scopeRef = useMotionScope<HTMLElement>(secondLifeMotion)

  return (
    <CaseStudyChrome ref={scopeRef}>
      {/* ══ hero ═══════════════════════════════════════════════ */}
      <section data-motion="cs-intro" className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px]">
            <SectionHead data-motion="cs-head-hero" section={hero} width="max-w-[720px]" />
            {heroShot && <Plate data-motion="cs-hero-plate" image={heroShot} className="mt-[46px]" />}
          </div>
        )}
      </section>

      {/* ══ identity pair ══════════════════════════════════════ */}
      {identity && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead data-motion="cs-head-identity" section={identity} width="max-w-[760px]" />

          <div className="mt-[52px] grid grid-cols-2 items-start gap-[26px]">
            {logoBoard && <Plate data-motion="cs-identity" image={logoBoard} />}
            {identityBoard && <Plate data-motion="cs-identity" image={identityBoard} />}
          </div>
        </section>
      )}

      {/* ══ passport pair ══════════════════════════════════════ */}
      {passport && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead data-motion="cs-head-passport" section={passport} width="max-w-[760px]" />

          <div className="mt-[52px] grid grid-cols-2 items-start gap-[26px]">
            {tag && <Plate data-motion="cs-passport" image={tag} />}
            {passportBook && <Plate data-motion="cs-passport" image={passportBook} />}
          </div>
        </section>
      )}

      {/* ══ main UI ════════════════════════════════════════════ */}
      {archive && (
        <section className="home-section mx-auto mt-[132px]">
          {/* The archive screen is the only portrait file in the set
              (941 x 1672). It is shown whole in a narrow tall column beside
              the copy rather than cropped into a landscape row. */}
          <div className="grid grid-cols-[1fr_500px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead data-motion="cs-head-archive" section={archive} width="max-w-[560px]" />

              <p data-motion="cs-note" className="mt-[34px] flex items-center gap-[14px] font-nav text-[11px] tracking-[0.24em] text-white/30">
                <span aria-hidden="true" className="text-[15px] text-purple-light">
                  +
                </span>
                <LocalizedText>MATERIAL ARCHIVE — FULL PAGE</LocalizedText>
              </p>
            </div>

            {materials && <Plate data-motion="cs-tall" image={materials} />}
          </div>

          {projectsShot && <Plate data-motion="cs-wide" image={projectsShot} className="mt-[74px]" />}
        </section>
      )}

      {/* ══ supporting UI ══════════════════════════════════════ */}
      <section className="home-section mx-auto mt-[74px]">
        <div className="grid w-[76%] grid-cols-2 items-start gap-[24px]">
          {collections && <Plate data-motion="cs-support" image={collections} />}
          {about && <Plate data-motion="cs-support" image={about} />}
        </div>
      </section>

      {/* ══ applications pair ══════════════════════════════════ */}
      {applications && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead data-motion="cs-head-applications" section={applications} width="max-w-[760px]" />

          <div className="mt-[52px] grid grid-cols-2 items-start gap-[26px]">
            {marbleLabel && <Plate data-motion="cs-application" image={marbleLabel} />}
            {sampleBox && <Plate data-motion="cs-application" image={sampleBox} />}
          </div>
        </section>
      )}

      {/* ══ closing ════════════════════════════════════════════ */}
      {closing && (
        <section className="home-section mx-auto mt-[132px]">
          {/* Same composition as `SectionHead` at a larger size, so the motion
              reads it with the same function. */}
          <div data-motion="cs-closing-copy" className="max-w-[860px]">
            <p className="flex items-center gap-[16px]">
              <span className="font-nav text-[13px] tracking-[0.24em] text-purple-light">
                {closing.index}
              </span>
              <span aria-hidden="true" className="h-px w-[38px] bg-white/20" />
              <span className="font-nav text-[13px] tracking-[0.28em] text-beige">
                {closing.eyebrow.toUpperCase()}
              </span>
            </p>

            <h2 className="mt-[20px] font-display text-[76px] leading-[1.02] tracking-[0.01em] text-white">
              {closing.title}
            </h2>

            <div className="mt-[24px] space-y-[16px]">
              {closing.body.map((paragraph) => (
                <p key={paragraph} className="font-serif text-[18px] leading-[1.55] text-white/65">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {crate && <Plate data-motion="cs-crate" image={crate} className="mt-[52px]" />}
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
