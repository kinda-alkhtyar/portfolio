import {
  CaseStudyChrome,
  CaseStudyHeader,
  CaseStudyOutro,
  Plate,
  SectionHead,
} from '../components/caseStudyUi'
import type { WahjCaseStudy as WahjData, WahjSectionId } from '../data/wahjCaseStudy'

/**
 * WAHJ case study page.
 *
 * Desktop-first, static: no `data-motion` hooks and no GSAP. Chrome and plate
 * styling come from `components/caseStudyUi.tsx`, the same system as the other
 * case studies.
 *
 * Order follows the data file: cover -> brand-identity-board ->
 * skincare-packaging -> shopping-bags.
 *
 * All four files are 1440x1440, so the layout carries the whole rhythm of the
 * page: the hero is centred and contained, the identity board sits small in a
 * left column beside its copy, the packaging plate is the one full-width
 * moment, and the closing bags are right-aligned and clearly smaller. Two of
 * those sizes are decided by the data rather than by taste — the identity
 * board is held to 560px so the business card inside it does not become
 * readable, and the bags close smaller than the packaging because they already
 * appear as a panel of that same board.
 *
 * `internalFlags` / `internalNotes` are never read here.
 */
export default function WahjCaseStudy({ caseStudy }: { caseStudy: WahjData }) {
  const { meta, sections } = caseStudy

  const section = (id: WahjSectionId) => sections.find((entry) => entry.id === id)
  const hero = section('hero')
  const identity = section('brand-identity')
  const packaging = section('packaging')
  const closing = section('closing')

  /** Images are addressed by filename so the layout never depends on array order. */
  const all = sections.flatMap((entry) => entry.images)
  const image = (file: string) => all.find((entry) => entry.file === file)

  const cover = image('cover.png')
  const identityBoard = image('brand-identity-board.png')
  const packagingShot = image('skincare-packaging.png')
  const bags = image('shopping-bags.png')

  return (
    <CaseStudyChrome>
      {/* ══ 01 hero ════════════════════════════════════════════ */}
      <section className="home-section mx-auto pt-[74px]">
        <CaseStudyHeader meta={meta} />

        {hero && (
          <div className="mt-[64px]">
            <SectionHead section={hero} width="max-w-[720px]" />

            {/* Contained rather than full-bleed: a 1440 square at the full
                column height would push the whole page below the fold. */}
            {cover && <Plate image={cover} className="mx-auto mt-[46px] w-[84%]" />}
          </div>
        )}
      </section>

      {/* ══ 02 identity ════════════════════════════════════════ */}
      {identity && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="grid grid-cols-[560px_1fr] items-start gap-[64px]">
            {/* Held small on purpose: the board contains a business card whose
                contact details are placeholders. */}
            {identityBoard && <Plate image={identityBoard} />}

            <div className="sticky top-[48px]">
              <SectionHead section={identity} width="max-w-[520px]" />
            </div>
          </div>
        </section>
      )}

      {/* ══ 03 packaging ═══════════════════════════════════════ */}
      {packaging && (
        <section className="home-section mx-auto mt-[132px]">
          <SectionHead section={packaging} width="max-w-[620px]" />

          {/* The one full-width plate on the page. */}
          {packagingShot && <Plate image={packagingShot} className="mt-[52px]" />}
        </section>
      )}

      {/* ══ 04 closing ═════════════════════════════════════════ */}
      {closing && (
        <section className="home-section mx-auto mt-[132px]">
          <div className="max-w-[860px]">
            <p className="flex items-center gap-[16px]">
              <span className="font-nav text-[13px] tracking-[0.24em] text-purple-light">
                {closing.index}
              </span>
              <span aria-hidden="true" className="h-px w-[38px] bg-white/20" />
              <span className="font-nav text-[13px] tracking-[0.28em] text-beige">
                {closing.eyebrow.toUpperCase()}
              </span>
            </p>

            <h2 className="mt-[20px] font-display text-[76px] leading-[1.02] tracking-[0.01em] text-white">
              {closing.title}
            </h2>

            <div className="mt-[24px] space-y-[16px]">
              {closing.body.map((paragraph) => (
                <p key={paragraph} className="font-serif text-[18px] leading-[1.55] text-white/65">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right-aligned and smaller than the packaging plate: these bags also
              appear inside the identity board, so they close quietly. */}
          {bags && <Plate image={bags} className="mt-[52px] ml-auto w-[62%]" />}
        </section>
      )}

      <CaseStudyOutro meta={meta} />
    </CaseStudyChrome>
  )
}
