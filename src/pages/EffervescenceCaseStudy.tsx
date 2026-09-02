import { CaseStudyChrome, CaseStudyHeader, CaseStudyOutro, EYEBROW } from '../components/caseStudyUi'
import type { EffervescenceCaseStudy as EffervescenceData } from '../data/effervescenceCaseStudy'
import { LocalizedText } from '../i18n/localization'

export default function EffervescenceCaseStudy({ caseStudy }: { caseStudy: EffervescenceData }) {
  const { meta, video } = caseStudy

  return (
    <CaseStudyChrome>
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        <div className="mt-[72px]">
          <p className={EYEBROW}><LocalizedText>01 — MOTION STUDY</LocalizedText></p>
          <div className="mx-auto mt-[28px] aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-[11px] border border-white/12 bg-surface">
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label="Effervescence commercial soda motion study"
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
