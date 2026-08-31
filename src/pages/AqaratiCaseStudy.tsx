import {
  LocalizedText,
} from '../i18n/localization'
import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import { useMotionScope } from '../motion'
import type { AqaratiCaseStudy as AqaratiData, AqaratiSectionId } from '../data/aqaratiCaseStudy'
import { aqaratiMotion } from './aqaratiMotion'

/**
 * AQARATI SYRIA case study page.
 *
 * Desktop-first. The layout below is unchanged; the only additions are
 * `data-motion` hooks, which `aqaratiMotion` reads through the scope mounted
 * on the chrome. Chrome and plate styling come from
 * `components/caseStudyUi.tsx`, the same system as SECOND LIFE, so the two
 * pages cannot drift apart — their motion is deliberately different, but the
 * markup they animate is identical.
 *
 * Section and image order follow `aqaratiCaseStudy.ts` exactly. Two screens
 * are deliberately held back from full width because their `internalFlags`
 * record real defects: `properties-ar.png` is clipped mid-search-bar with the
 * navbar missing, and `cities-map-en.png` shows the map with almost every
 * governorate pin reading zero. Both are contained rather than full-bleed so
 * the page does not enlarge their problems.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function AqaratiCaseStudy({ caseStudy }: { caseStudy: AqaratiData }) {
  const { meta, sections } = caseStudy

  const section = (id: AqaratiSectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const multilingual = section('multilingual')
  const listings = section('listings')
  const discovery = section('discovery')
  const accounts = section('accounts')
  const about = section('about')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const homeAr = image('home-ar.png')
  const homeEn = image('home-en.png')
  const homeTr = image('home-tr.png')
  const properties = image('properties-ar.png')
  const citiesMap = image('cities-map-en.png')
  const login = image('login-tr.png')
  const aboutShot = image('about-de.png')

  const scopeRef = useMotionScope<HTMLElement>(aqaratiMotion)

  return (
    <CaseStudyChrome ref={scopeRef}>
      {/* ══ 01 hero ════════════════════════════════════════════ */}
      <section data-motion="aq-intro" className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px]">
            <SectionHead data-motion="aq-head-hero" section={hero} width="max-w-[720px]" />
            {homeAr && <Plate data-motion="aq-hero" image={homeAr} className="mt-[46px]" />}
          </div>
        )}
      </section>

      {/* ══ 02 multilingual ════════════════════════════════════ */}
      {multilingual && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead data-motion="aq-head-multilingual" section={multilingual} width="max-w-[760px]" />

          <div className="mt-[52px] grid grid-cols-2 items-start gap-[26px]">
            {homeEn && <Plate data-motion="aq-lang" image={homeEn} />}
            {homeTr && <Plate data-motion="aq-lang" image={homeTr} />}
          </div>
        </section>
      )}

      {/* ══ 03 listings ════════════════════════════════════════ */}
      {listings && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead data-motion="aq-head-listings" section={listings} width="max-w-[760px]" />

          {/* Contained: the capture is clipped mid-search-bar and has no
              navbar, so it is not shown at full width. */}
          {properties && <Plate data-motion="aq-listings" image={properties} className="mt-[52px] w-[82%]" />}
        </section>
      )}

      {/* ══ 04 discovery ═══════════════════════════════════════ */}
      {discovery && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[1fr_620px] items-start gap-[64px]">
            <div className="sticky top-[48px]">
              <SectionHead data-motion="aq-head-discovery" section={discovery} width="max-w-[520px]" />

              <p className="mt-[34px] flex items-center gap-[14px] font-nav text-[11px] tracking-[0.24em] text-white/30">
                <span aria-hidden="true" className="text-[15px] text-purple-light">
                  +
                </span>
                <LocalizedText>GOVERNORATE MAP — FULL PAGE</LocalizedText>
              </p>
            </div>

            {/* Contained beside the copy rather than full-bleed: the capture
                shows the map with its listing counts empty. */}
            {citiesMap && <Plate data-motion="aq-map" image={citiesMap} />}
          </div>
        </section>
      )}

      {/* ══ 05 accounts ════════════════════════════════════════ */}
      {accounts && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[1fr_700px] items-start gap-[56px]">
            <SectionHead data-motion="aq-head-accounts" section={accounts} width="max-w-[460px]" />
            {login && <Plate data-motion="aq-login" image={login} />}
          </div>
        </section>
      )}

      {/* ══ 06 about ═══════════════════════════════════════════ */}
      {about && (
        <section className="home-section mx-auto mt-[110px]">
          <div className="grid grid-cols-[700px_1fr] items-start gap-[56px]">
            {aboutShot && <Plate data-motion="aq-about" image={aboutShot} />}
            <SectionHead data-motion="aq-head-about" section={about} width="max-w-[460px]" />
          </div>
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
