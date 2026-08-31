import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type {
  StillHumanCaseStudy as StillHumanData,
  StillHumanSectionId,
} from '../data/stillHumanCaseStudy'

/**
 * STILL HUMAN case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as the other
 * case studies.
 *
 * One asset, one section. The project is a single poster, so there is no
 * process, no series and no second plate — the page is the sheet and the space
 * around it.
 *
 * The poster is 1985x2835 and is shown whole: never cropped, never
 * full-bleed. It sits in a centred 660px plate, inside the range the data file
 * records, with the copy above held to the same column so the eye travels
 * straight down the centre of the page and the margins do the rest.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function StillHumanCaseStudy({ caseStudy }: { caseStudy: StillHumanData }) {
  const { meta, sections } = caseStudy

  const section = (id: StillHumanSectionId) => sections.find((entry) => entry.id === id)
  const poster = section('poster')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const sheet = all.find((entry) => entry.file === 'cover.png')

  return (
    <CaseStudyChrome>
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {poster && (
          <div className="mt-[86px]">
            <SectionHead section={poster} className="mx-auto w-[660px]" width="w-full" />

            {/* Whole sheet, uncropped, centred. The composition depends on the
                density of lone figures around the red umbrella, so nothing here
                may tighten the frame. */}
            {sheet && <Plate image={sheet} className="mx-auto mt-[64px] w-[660px]" />}
          </div>
        )}
      </section>

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
