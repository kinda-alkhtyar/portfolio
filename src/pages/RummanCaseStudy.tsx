import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type { RummanCaseStudy as RummanData, RummanSectionId } from '../data/rummanCaseStudy'
import { LocalizedText } from '../i18n/localization'

/**
 * RUMMAN SKINCARE case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as the other
 * case studies.
 *
 * Order follows the data file: cover -> logo -> serum-mockup.
 *
 * Sizing follows the files. `logo.png` is 1774x887 and is the only landscape
 * asset, so it takes the full content width as an identity band. Both mockups
 * are 1280 square and soften above roughly 1100px, so neither is ever full
 * width: the hero is contained at 86% (~1090px) and the closing product shot
 * sits in a 720px column beside its copy.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function RummanCaseStudy({ caseStudy }: { caseStudy: RummanData }) {
  const { meta, sections } = caseStudy

  const section = (id: RummanSectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const identity = section('brand-identity')
  const product = section('product-detail')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const cover = image('cover.png')
  const logoBoard = image('logo.png')
  const serum = image('serum-mockup.png')

  return (
    <CaseStudyChrome>
      {/* ══ 01 hero ════════════════════════════════════════════ */}
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px]">
            <SectionHead section={hero} width="max-w-[720px]" />

            {/* Contained large rather than full-bleed: the file is 1280 square
                and would soften stretched across the full column. */}
            {cover && <Plate image={cover} className="mx-auto mt-[46px] w-[86%]" />}
          </div>
        )}
      </section>

      {/* ══ 02 identity ════════════════════════════════════════ */}
      {identity && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead section={identity} width="max-w-[760px]" />

          {/* Full-width band: the only landscape asset in the project, and wide
              enough (1774px) to hold the whole column. */}
          {logoBoard && <Plate image={logoBoard} className="mt-[52px]" />}
        </section>
      )}

      {/* ══ 03 product detail ══════════════════════════════════ */}
      {product && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[1fr_720px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead section={product} width="max-w-[480px]" />

              <p className="mt-[34px] flex items-center gap-[14px] font-nav text-[11px] tracking-[0.24em] text-white/30">
                <span aria-hidden="true" className="text-[15px] text-purple-light">
                  +
                </span>
                <LocalizedText>LABEL SYSTEM — IN HAND</LocalizedText>
              </p>
            </div>

            {serum && <Plate image={serum} />}
          </div>
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
