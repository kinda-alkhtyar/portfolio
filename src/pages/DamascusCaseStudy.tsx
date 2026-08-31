import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type {
  DamascusCaseStudy as DamascusData,
  DamascusSectionId,
} from '../data/damascusCaseStudy'

/**
 * DAMASCUS case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as the other
 * case studies.
 *
 * One asset, one section. The project is a single poster, so there is no
 * process, no series and no second plate.
 *
 * The sheet is 993x1418 — the lowest-resolution hero in the portfolio — so the
 * plate is capped at 640px and never goes full-bleed or above 700px, where the
 * caming lines and jasmine petals soften. It is shown whole: the border
 * ornament and the corner blossoms are part of the composition, so nothing here
 * crops the frame. Wide margins on both sides and deep space above and below
 * are the point rather than a side effect.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function DamascusCaseStudy({ caseStudy }: { caseStudy: DamascusData }) {
  const { meta, sections } = caseStudy

  const section = (id: DamascusSectionId) => sections.find((entry) => entry.id === id)
  const poster = section('poster')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const sheet = all.find((entry) => entry.file === 'damascus-poster-cover.jpeg')

  return (
    <CaseStudyChrome>
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {poster && (
          <div className="mt-[86px] pb-[40px]">
            <SectionHead section={poster} className="mx-auto w-[640px]" width="w-full" />

            {/* Whole sheet, uncropped, centred, capped at 640px because of the
                source resolution. */}
            {sheet && <Plate image={sheet} className="mx-auto mt-[64px] w-[640px]" />}
          </div>
        )}
      </section>

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
