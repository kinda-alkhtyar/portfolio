import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type { FleureCaseStudy as FleureData } from '../data/fleureCaseStudy'

export default function FleureCaseStudy({ caseStudy }: { caseStudy: FleureData }) {
  const { meta, sections } = caseStudy
  const identity = sections.find((section) => section.id === 'identity')
  const montage = identity?.images.find((image) => image.file === 'cover.png')

  return (
    <CaseStudyChrome>
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {identity && (
          <div className="mt-[86px]">
            <SectionHead section={identity} className="mx-auto w-[900px]" width="max-w-[720px]" />
            {montage && <Plate image={montage} className="mx-auto mt-[56px] w-[900px]" />}
          </div>
        )}
      </section>

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
