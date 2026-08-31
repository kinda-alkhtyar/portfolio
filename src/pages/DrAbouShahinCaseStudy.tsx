import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type {
  DrAbouShahinCaseStudy as DrAbouShahinData,
  DrAbouShahinSectionId,
} from '../data/drAbouShahinCaseStudy'
import { LocalizedText } from '../i18n/localization'

/**
 * DR. MOUHAMMAD ABOU SHAHIN case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as SECOND
 * LIFE and AQARATI, so the pages cannot drift apart.
 *
 * Section order follows the data file: home -> services -> about ->
 * patient-info -> contact.
 *
 * Every image here is a tall full-page capture (roughly 1:1.8 to 1:2.1), so
 * none of them is ever full-bleed. Each sits in a fixed column beside its copy,
 * and the column is sized by the file's own aspect rather than by a shared
 * width: home.png and contact.png are 864 and 863 wide, the other three are
 * 941, so a single width would render them at different scales. The two
 * narrower captures get 480px and the three wider ones 560px, which lands them
 * at roughly the same rendered height. Sides alternate for reading rhythm.
 *
 * `internalFlags` / `internalNotes` are never read here. The known artwork
 * defects on services.png and contact.png stay internal; the only thing they
 * change on this page is that neither capture is enlarged.
 */
export default function DrAbouShahinCaseStudy({ caseStudy }: { caseStudy: DrAbouShahinData }) {
  const { meta, sections } = caseStudy

  const section = (id: DrAbouShahinSectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const services = section('services')
  const about = section('about')
  const patientInfo = section('patient-info')
  const contact = section('contact')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const homeShot = image('home.png')
  const servicesShot = image('services.png')
  const aboutShot = image('about.png')
  const patientInfoShot = image('patient-info.png')
  const contactShot = image('contact.png')

  return (
    <CaseStudyChrome>
      {/* ══ 01 hero ════════════════════════════════════════════ */}
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px] grid grid-cols-[1fr_480px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead section={hero} width="max-w-[560px]" />

              <p className="mt-[34px] flex items-center gap-[14px] font-nav text-[11px] tracking-[0.24em] text-white/30">
                <span aria-hidden="true" className="text-[15px] text-purple-light">
                  +
                </span>
                <LocalizedText>HOMEPAGE — FULL PAGE</LocalizedText>
              </p>
            </div>

            {homeShot && <Plate image={homeShot} />}
          </div>
        )}
      </section>

      {/* ══ 02 services ════════════════════════════════════════ */}
      {services && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[560px_1fr] items-start gap-[64px]">
            {servicesShot && <Plate image={servicesShot} />}

            <div className="sticky top-[48px]">
              <SectionHead section={services} width="max-w-[520px]" />
            </div>
          </div>
        </section>
      )}

      {/* ══ 03 about ═══════════════════════════════════════════ */}
      {about && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[1fr_560px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead section={about} width="max-w-[520px]" />
            </div>

            {aboutShot && <Plate image={aboutShot} />}
          </div>
        </section>
      )}

      {/* ══ 04 patient info ════════════════════════════════════ */}
      {patientInfo && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[560px_1fr] items-start gap-[64px]">
            {patientInfoShot && <Plate image={patientInfoShot} />}

            <div className="sticky top-[48px]">
              <SectionHead section={patientInfo} width="max-w-[520px]" />
            </div>
          </div>
        </section>
      )}

      {/* ══ 05 contact ═════════════════════════════════════════ */}
      {contact && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[1fr_480px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead section={contact} width="max-w-[520px]" />
            </div>

            {contactShot && <Plate image={contactShot} />}
          </div>
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
