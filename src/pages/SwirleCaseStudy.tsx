import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type { CaseStudy as CaseStudyData, CaseStudySectionId } from '../data/secondLifeCaseStudy'
import { LocalizedText } from '../i18n/localization'

/**
 * SWIRLÉ case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as the other
 * case studies.
 *
 * Order follows the data file: cups -> logo-colors -> stationery -> cover.
 *
 * All four files are 1440x1440, so the layout has to supply the entire rhythm
 * of the page — four identical squares stacked at one width would read as a
 * contact sheet. Each plate therefore gets its own size and alignment:
 * the hero sits in a 680px column beside the copy, the logo board is centred
 * and smaller, the collateral flat-lay is the one full-width plate, and the
 * closing board is right-aligned and deliberately smaller than the flat-lay so
 * the summary does not outshout the work it summarises.
 *
 * `internalFlags` / `internalNotes` are never read here. The data flags cover
 * as a closing board that must not move earlier in the page; that ordering is
 * respected by the layout below.
 */
export default function SwirleCaseStudy({ caseStudy }: { caseStudy: CaseStudyData }) {
  const { meta, sections } = caseStudy

  const section = (id: CaseStudySectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const identity = section('brand-identity')
  const applications = section('applications')
  const closing = section('closing')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const cups = image('cups.png')
  const logoBoard = image('logo-colors.png')
  const stationery = image('stationery.png')
  const coverBoard = image('cover.png')

  return (
    <CaseStudyChrome>
      {/* ══ 01 hero ════════════════════════════════════════════ */}
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px] grid grid-cols-[1fr_680px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead section={hero} width="max-w-[500px]" />

              <p className="mt-[34px] flex items-center gap-[14px] font-nav text-[11px] tracking-[0.24em] text-white/30">
                <span aria-hidden="true" className="text-[15px] text-purple-light">
                  +
                </span>
                <LocalizedText>CUP SYSTEM — THREE COLOURWAYS</LocalizedText>
              </p>
            </div>

            {cups && <Plate image={cups} />}
          </div>
        )}
      </section>

      {/* ══ 02 identity ════════════════════════════════════════ */}
      {identity && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead section={identity} width="max-w-[760px]" />

          {/* Centred and narrower than the plates on either side: the board is
              a specimen sheet, not a scene. */}
          {logoBoard && <Plate image={logoBoard} className="mx-auto mt-[52px] w-[58%]" />}
        </section>
      )}

      {/* ══ 03 applications ════════════════════════════════════ */}
      {applications && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead section={applications} width="max-w-[620px]" />

          {/* The one full-width plate on the page. The flat-lay carries the most
              detail in the set and is the only image that rewards the scale. */}
          {stationery && <Plate image={stationery} className="mt-[52px]" />}
        </section>
      )}

      {/* ══ 04 closing ═════════════════════════════════════════ */}
      {closing && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="max-w-[860px]">
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

          {/* Right-aligned and smaller than the flat-lay above: this board is a
              summary of images already shown, so it closes the page rather than
              competing with it. */}
          {coverBoard && <Plate image={coverBoard} className="mt-[52px] ml-auto w-[70%]" />}
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
