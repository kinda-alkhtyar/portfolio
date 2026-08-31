import HeroTulipMedia from '../components/HeroTulipMedia'
import IntroStage from '../components/IntroStage'
import IntroTulipPlate from '../components/IntroTulipPlate'
import Navbar from '../components/Navbar'
import PlusMark from '../components/PlusMark'
import QuoteBlock from '../components/QuoteBlock'
import ScrollIndicator from '../components/ScrollIndicator'
import SiteFooter from '../components/SiteFooter'
import Belief from '../sections/Belief'
import Hero from '../sections/Hero'
import HomeCta from '../sections/HomeCta'
import SelectedWork from '../sections/SelectedWork'
import WhatIDo from '../sections/WhatIDo'
import { siteFooterMotion } from '../components/siteFooterMotion'
import { heroMotion } from '../sections/heroMotion'
import { homeFlowMotion } from '../sections/homeFlowMotion'
import { homeIntroMotion } from '../sections/homeIntroMotion'
import { useMotionScope } from '../motion'
import { useLocale } from '../i18n/localization'

/**
 * Homepage.
 *
 * The first screen is the reference fold: every offset inside it is measured
 * off `assets/references/home-reference.png`, so those values are literal
 * reference pixels on a 1440 canvas.
 *
 * The fold's decorative layers — backdrop, tulip track and the right-edge
 * overlay — are pinned to a box exactly one viewport tall (`--screen`) rather
 * than to the wrapper. The wrapper itself is free to grow past the first
 * screen, which is what lets the Selected Work rows break the bottom of the
 * fold the way the reference shows them, without the tulip stretching or the
 * scroll indicator sliding down to the end of the block.
 *
 * Everything under it shares the left-anchored `.home-section` column (see
 * `global.css`), so it lines up with the hero headline and the work rows at
 * any width.
 */
export default function Home() {
  const locale = useLocale()
  // The Arabic fold is mirrored per layer rather than shifted as one block;
  // these hooks are the only markup the mirror needs (see `global.css`).
  const ar = locale === 'ar'
  // Scoped to the fold: every hero tween, trigger and pointer listener is
  // created inside this element's gsap.context and reverted with it.
  const heroRef = useMotionScope<HTMLDivElement>(heroMotion)
  // Opt-in: the footer component itself runs no scope, so the same footer on a
  // case study page is left untouched.
  const footerRef = useMotionScope<HTMLElement>(siteFooterMotion)
  // The cross-section depth continuum. Scoped to the below-fold column, so it
  // picks up WHAT I DO, Belief and the CTA and never the hero fold.
  const flowRef = useMotionScope<HTMLDivElement>(homeFlowMotion)
  // The cinematic opening. Declared last so it is set up after `heroMotion`
  // has written the fold's initial states — it reads the hero tulip's rest box
  // to place the stage's vanishing point on the bloom. It is skipped under
  // reduced motion and on every visit after the first, and `IntroStage` /
  // `IntroTulipPlate` render nothing in those cases, so the fold is simply
  // entered as it is today.
  const introRef = useMotionScope<HTMLDivElement>(homeIntroMotion)

  return (
    <>
      {/* Deliberately outside `.home-canvas`: the canvas carries
          `zoom: var(--page-zoom)` on the short desktop breakpoints, and a
          zoomed ancestor rescales `position: fixed` descendants and the
          viewport units inside them. Out here the stage is in true viewport
          pixels, which is what lets its plum ground be pixel-identical to the
          fold's own backdrop. */}
      <IntroStage ref={introRef} />

      <main className="home-page home-canvas relative overflow-hidden bg-bg">
        {/* ══ hero fold ═════════════════════════════════════════════ */}
        <div ref={heroRef} data-cursor-zone className="relative overflow-hidden">
          {/* ── backdrop ───────────────────────────────────────────── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[var(--screen)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_66%_34%,#26123A_0%,#150C22_45%,#0C0713_100%)]" />

            {/* The hero's 3D stage. `heroMotion` gives this one element the
                shared perspective and puts its vanishing point on the backdrop
                ring, so the bloom, ring, guide and marks inside it foreshorten
                toward the same point instead of each having depth of its own.
                Layout is untouched: every layer rests at z 0. */}
            <div
              data-motion="hero-scene"
              className={`home-track absolute inset-y-0 left-0 right-0 ${ar ? 'ar-hero-scene' : ''}`}
            >
              {/* thin ring behind the bloom */}
              <div
                data-motion="ring"
                className="absolute right-[13px] top-[calc(181px_-_var(--hero-lift))] hidden size-[612px] rounded-full border border-white/35 lg:block"
              />

              {/* dashed guide line */}
              <div
                data-motion="guide"
                className="absolute right-[224px] top-[calc(207px_-_var(--hero-lift))] hidden h-[566px] w-px bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.22)_12%,rgba(255,255,255,0.22)_88%,transparent)] lg:block"
              />

              {/* The bloom, as live media. Same box, same `data-motion` tag,
                  same everything `heroMotion` writes to it — the clip simply
                  replaces the still inside it once it is presenting frames,
                  and falls back to that still under reduced motion or if the
                  file never arrives. See `HeroTulipMedia`. */}
              <HeroTulipMedia data-motion="tulip" className="absolute right-[calc(62px_+_var(--tulip-shift))] top-[calc(147px_-_var(--hero-lift))] w-[610px]" />

              <PlusMark data-motion="mark" className="ar-mark-a absolute right-[626px] top-[calc(259px_-_var(--hero-lift))] text-[20px] leading-none" />
              <PlusMark data-motion="mark" className="ar-mark-b absolute right-[46px] top-[calc(576px_-_var(--hero-lift))] text-[20px] leading-none" />

              {/* The opening's tulip clip, in the scene rather than over it:
                  it wears the still's own positioning classes, so it inherits
                  `.home-track`'s centring, `--tulip-shift`, `--hero-lift` and
                  the canvas `zoom` and is the still's box at every breakpoint
                  with nothing measured. Last in the stage so it covers the
                  bloom it is about to dissolve into, and still under the edge
                  vignette below, so the two are lit identically on the way
                  through. Renders nothing under reduced motion or on a
                  return visit. */}
              <IntroTulipPlate />
            </div>

            {/* edge vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_45%,rgba(6,3,11,0.75)_100%)]" />
          </div>

          {/* ── content ────────────────────────────────────────────── */}
          <div className="home-fill relative z-10 flex flex-col pb-[var(--page-pb)] pt-[var(--page-pt)]">
            <Navbar variant="fixed" top="var(--page-pt)" />

            {/* hero left column: nudged 30px right of the shared content gutter */}
            <div className="translate-x-[30px] pl-[var(--content-pl)]">
              <div className={ar ? 'ar-hero-copy' : ''}>
                <Hero />
              </div>
              <SelectedWork />
            </div>
          </div>

          {/* right-edge overlay: same track, above the content */}
          <div className="home-track pointer-events-none absolute inset-x-0 top-0 z-10 h-[var(--screen)]">
            <QuoteBlock className={`pointer-events-auto absolute right-[64px] top-[calc(341px_-_var(--hero-lift)_-_var(--quote-lift))] hidden w-[136px] lg:block ${ar ? 'ar-hero-quote' : ''}`} />

            <ScrollIndicator data-motion="scroll-hint" className={`pointer-events-auto absolute bottom-[80px] right-[107px] hidden lg:flex ${ar ? 'ar-hero-hint' : ''}`} />
          </div>
        </div>

        {/* ══ below the fold ════════════════════════════════════════ */}
        <div ref={flowRef} className="relative z-10">
          <WhatIDo />
          <Belief />
          <HomeCta />
          <SiteFooter ref={footerRef} />
        </div>
      </main>
    </>
  )
}
