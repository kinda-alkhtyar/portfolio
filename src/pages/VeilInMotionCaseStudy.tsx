import { CaseStudyChrome, CaseStudyHeader, CaseStudyOutro, EYEBROW } from '../components/caseStudyUi'
import { getVeilInMotionCaseStudy } from '../data/veilInMotionCaseStudy'
import { useLocale } from '../i18n/localization'
import { reveal, useMotionScope } from '../motion'

export default function VeilInMotionCaseStudy() {
  const locale = useLocale()
  const { meta, video } = getVeilInMotionCaseStudy(locale)
  const scopeRef = useMotionScope<HTMLElement>(({ q }) => reveal(q('[data-veil-reveal]')))

  return (
    <CaseStudyChrome ref={scopeRef}>
      <section className="home-section mx-auto pt-[74px] [&_h1]:max-w-[650px] [&_h1]:text-[64px]">
        <CaseStudyHeader meta={meta} />
        <div className="mt-[72px]">
          <p data-veil-reveal className={EYEBROW}>
            {locale === 'ar' ? '01 — إعلان أزياء بالذكاء الاصطناعي' : '01 — AI FASHION COMMERCIAL'}
          </p>
          <div data-veil-reveal className="mx-auto mt-[28px] w-full max-w-[820px] overflow-hidden rounded-[11px] border border-white/12 bg-surface">
            <video
              src={video}
              controls
              playsInline
              preload="auto"
              aria-label={meta.title}
              className="mx-auto block h-auto max-h-[80svh] w-full object-contain object-center"
            />
          </div>
        </div>
      </section>
      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
