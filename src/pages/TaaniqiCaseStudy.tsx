import { CaseStudyChrome, CaseStudyHeader, CaseStudyOutro, Plate, SectionHead } from '../components/caseStudyUi'
import { getTaaniqiCaseStudy } from '../data/taaniqiCaseStudy'
import { useLocale } from '../i18n/localization'
import { reveal, useMotionScope } from '../motion'

export default function TaaniqiCaseStudy() {
  const { meta, images, sections } = getTaaniqiCaseStudy(useLocale())
  const scopeRef = useMotionScope<HTMLElement>(({ q }) => reveal(q('[data-taaniqi-reveal]')))

  return (
    <CaseStudyChrome ref={scopeRef}>
      <section className="home-section mx-auto pt-[74px] [&_h1]:max-w-[650px] [&_h1]:text-[64px]">
        <CaseStudyHeader meta={meta} />
      </section>
      {sections.map((section, index) => (
        <section key={section.index} className={`home-section mx-auto ${index === 0 ? 'mt-[64px]' : 'mt-[132px]'}`}>
          <SectionHead data-taaniqi-reveal section={section} width="max-w-[720px]" />
          <Plate
            data-taaniqi-reveal
            image={images[index]!}
            className={`mx-auto mt-[52px] ${index === 0 ? 'max-w-[390px]' : 'max-w-[820px]'}`}
          />
        </section>
      ))}
      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
