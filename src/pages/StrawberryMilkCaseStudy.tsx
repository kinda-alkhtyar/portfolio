import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type { StrawberryMilkCaseStudy as StrawberryMilkData } from '../data/strawberryMilkCaseStudy'

export default function StrawberryMilkCaseStudy({
  caseStudy,
}: {
  caseStudy: StrawberryMilkData
}) {
  const { meta, sections } = caseStudy
  const hero = sections.find((section) => section.id === 'hero')
  const contact = sections.find((section) => section.id === 'contact')
  const homeScreen = hero?.images.find((image) => image.file === 'home-desktop.png')
  const contactScreen = contact?.images.find((image) => image.file === 'contact-desktop.png')

  return (
    <CaseStudyChrome>
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px]">
            <SectionHead section={hero} width="max-w-[720px]" />
            {homeScreen && <Plate image={homeScreen} className="mt-[46px]" />}
          </div>
        )}
      </section>

      {contact && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead section={contact} width="max-w-[720px]" />
          {contactScreen && <Plate image={contactScreen} className="mt-[52px]" />}
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
