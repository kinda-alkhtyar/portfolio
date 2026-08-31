# PROJECT_STATE

Current state only. Update this file as work progresses.

## Bilingual EN / AR
- English remains on the original routes; Arabic is route-derived at `/ar`,
  `/ar/work`, `/ar/about`, `/ar/contact` and `/ar/work/:slug`.
- `src/i18n/localization.tsx` owns locale detection, UI strings, localized
  route generation, the EN / AR switcher state and document `lang` / `dir`.
- `src/i18n/caseStudiesArabic.ts` localizes the shared case-study data rather
  than duplicating any page component. Project names and software/brand names
  remain unchanged.
- Arabic uses true document RTL, right-aligned copy and form controls, logical
  flex flow, isolated LTR contact values, and Tahoma/Arial Arabic fallbacks.
  Artwork, images, videos, logos and decorative motion scenes retain their
  authored visual orientation.
- GSAP, ScrollTrigger, Lenis, page transitions, project ordering and assets
  are unchanged.
- **The Arabic Home fold is mirrored per layer, not shifted as one block.**
  The old single `translate: -708px` moved the scene, the copy and the quote
  by the same amount, which put the copy over the bloom and the quote in the
  middle of the canvas. Each decorative layer now takes from the physical
  left the offset it holds from the right in English (ring 13, guide 224,
  bloom + intro plate 62, marks 626 / 46, scroll hint 107) and the copy
  column is right-anchored on the English gutter, capped at 580px so its
  left edge lands at x 744 — 72px clear of the bloom's box and 119px clear
  of the ring. The rules live in `@layer utilities` in `global.css`: they
  override Tailwind arbitrary utilities on the same elements, and layer
  order, not specificity, is what decides that.
- The pull quote is the one layer that is *not* mirrored. The photograph is
  not flipped with the layout, so the pocket the bloom leaves inside the
  ring is on the flower's own side in Arabic (its ink runs to x 140 between
  y 310 and y 530). The Arabic quote takes the low pocket instead — 158px at
  x 36, top 600, riding `--hero-lift` but not `--quote-lift`, since that
  extra rise would walk it back into the petals.
- The Selected Work rows run the *same* loop in both languages. The only
  thing the document direction decides is which way the copies wrap: the
  `w-max` track's overflow hangs off the panel's end, so under LTR the window
  sits on the first copy and the position wraps down through `-setWidth`,
  while under RTL it sits on the last copy and the same wrap walks the row off
  the end of the copies and snaps back. `createRowLoop` picks the range from
  `document.documentElement.dir`; speed, the two opposed directions, drag,
  hover slow-down and the glide are one shared object.
- Arabic hero placement pass 2: the mirrored group (ring, guide, bloom +
  intro plate, both marks, quote) rides one `--ar-group-x: 36px` shift left,
  so its internal spacing is fixed by construction; the copy column sits 20px
  up on a relative offset (Selected Work keeps its flow position); Arabic hero
  type steps up one notch (headline 96, eyebrow 22, subtitle 22, CTA 25), so
  the Arabic fold now runs ~35px taller than the English one; the Arabic
  'أعمال مختارة' label stays right-aligned at 18px.
- Selected Work is a block narrower than its column, so RTL was resolving the
  over-constrained margins on the left and drifting the whole section right of
  the English track. `margin-right: auto` pins the section box back on the
  English gutter: the rows start at the English far-left x and the heading
  stays on the section's own right edge. Track, loop, drag, hover and card
  order are untouched.
- The Arabic closing CTA (`.ar-home-cta`, set from `HomeCta`) keeps the tulip
  visual in its authored physical-left corner and puts the whole text group on
  the right. A straight mirror of the English offsets was wrong — it threw the
  pill and the sparkle into the left half, on top of the tulip. The group is
  re-laid from the right edge in the English band's own rhythm instead:
  rule `right: --content-pl`, headline margin 109, divider 480, button wrap
  573, sparkle 933, so the four gaps match English taken from the other side
  and the pill stops ~230px clear of the visual. The pill's arrow points left
  in Arabic (same branch the hero CTA uses). Only insets are written; section
  height, colours, type and every `data-motion` hook are unchanged.
- The tulip veil is now `var(--tulip-veil, VEIL)`. Mirrored, the box no longer
  sits under the page gradient's right shoulder, so the English 30% centre
  painted a ground under the page tone and `lighten` kept it — the black plate.
  RTL re-projects the same gradient (radii and stops unchanged) at
  `calc(924px - var(--tulip-shift)) 27%`. Mask, blend and playback untouched.
- The Arabic quote now sits at top 465 (raised a further 90px); its left
  offset, width, leading and motion are unchanged.
- Arabic-only placement pass: the right-hand copy column takes an extra 120px
  off its right margin (margin-right = --content-pl + 180px), and the Arabic
  'أعمال مختارة' label is 18px with a 33px right margin on its h2 (the GSAP-
  owned work-label span and the moving rows are untouched).
- Arabic hero type is re-metricked rather than poured into the English
  scale: headline 88px / 1.24 (Tahoma's Arabic content area is 1.21em, which
  the English 107px / 1.05 line clip would cut through), eyebrow 20px with
  the name set in Arabic, subtitle 20px, and the primary CTA's arrow points
  left. The block's height matches the English one to within a pixel, so
  Selected Work starts at the same y in both languages.
- **The Arabic /work hero is mirrored per layer too**, in the same
  `@layer utilities` block. Ring 9, bloom -4 and the three marks 131 / -1 /
  347 each take from the physical left the offset they hold from the right of
  the 1288 track in English, so the group lands on the far left in the
  reference arrangement; the lede takes its 628px from the right, putting its
  left edge at x 354 against the bloom box's 352 — the same 2px clearance
  English holds on the other side. Title and eyebrow need no rule: RTL already
  right-aligns them on the page gutter. `workMotion` mirrors the two origins
  that were written from an edge (`SCENE.originRtl` for the shared vanishing
  point, `100% 50%` for the title/eyebrow lines); every timing, easing, depth
  value, pointer channel and the plate camera is untouched, as are the filter
  pills, grid, pagination and English /work.
- **Arabic /about and /contact are mirrored the same way**, on the 1440 track.
  Both pages author every layer with a physical `left`, and the mirror of a box
  at [L, L+W] is [1440-L-W, 1440-L] — whose distance from the right edge is L
  exactly. So each rule is the element's own English `left` re-read as a
  `right`: width-agnostic, and every internal gap survives by construction.
  /about — statement (eyebrow, both rules, headline, lede) on the 86px gutter
  from the right, ring 748, bloom 795, guides 1155 / 1024, marks 862 / 1272 /
  775, pull quote 1183, so the quote still sits 16px off the bloom inside the
  ring and RTL right-aligns its lines toward the bloom the way the English ones
  hug it from the left. /contact — statement on 96, detail stack 96, panel 730,
  ring 757, bloom 812, marks 776 / 1239 / 1249 / 1268, dotted fields 1298 /
  1192; the stem still runs on behind the panel and the stack still clears the
  bloom by 149px, both English relationships read from the other edge. Hero
  rules and the contact row hairlines draw from `transform-origin: right` so
  they still grow out of the gutter; `aboutMotion` / `contactMotion` add an
  `originRtl` for the shared vanishing point (385 / 397 px). Nothing else in
  either timeline, the pointer lean, the idle ticker, the form, the links or
  the card band changed, and the English pages are byte-identical.
- **The Arabic /about card band is re-voiced, not rebuilt.** Every offset
  inside a card is an authored physical `left` on the 396px card, so the
  mirror is the same transform as everywhere else — that number re-read as a
  `right` (icon 28, label / title / tick 119, body and all four lower blocks
  32, corner mark 41, numeral flipped to left 24). On top of the mirror:
  the shell drops to a 5% hairline, a 16px corner and one quiet graduation
  with the bloom halved and moved to the Arabic reading corner, so it reads as
  a page block rather than a lit UI panel; the numeral goes 70 -> 104px at
  7.5% as the card's graphic ground; label 12/700, title 30/700 and a 34px
  tick give three separate weights instead of two near-equal ones; the body
  drops to 152 at 1.75 leading and 84% white, which is both the air and the
  Arabic readability fix. Lower content follows: services 248 on two equal
  columns (five services, three even rows), divider 352, languages 374; stats
  288; tools 288 on 68px tiles spread `space-between` across 332 with 12px
  labels at 50%. The corner mark moves to 442 to clear the taller Arabic
  content. Copy is new on all three cards, the stats read `3 / +50 / +20`,
  and card 03 is titled `أدواتي`.
- **The /about side rails lose their words in Arabic, not their mark.**
  Arabic in `writing-mode: vertical-rl` renders rotated glyphs and the left
  rail runs bottom-to-top, which reads as an accident; the two hairlines stay
  as a quiet tick on each gutter. Both `rail` hooks are untouched, so the
  entrance is unchanged.
- No `data-motion` hook, timing, ease, depth value or hover binding changed in
  `aboutMotion`, and English /about is byte-identical.

## Completed
- React + TypeScript + Vite initialized
- Tailwind CSS v4 configured
- GSAP, Lenis, React Router installed
- Homepage matched to `home-reference.png` at 1440px desktop
  (navbar, hero, buttons, quote, cards, decorative marks — all offsets are
  literal reference pixels measured off the 1440 x 1088 reference canvas)
- Real tulip image integrated and positioned
- All three Selected Work cards now use the real images from
  `src/assets/images/home/` — no placeholders remain
- Visual correction pass against the reference (verified by headless render at
  1440x1088 and pixel-diffing both images): navbar pill/logo/word positions now
  exact, headline raised ~9px and its leading tightened (footprint 329 -> 318),
  tulip re-placed so its bloom bbox matches the reference and no longer collides
  with the quote, card row widened to 1000px (3 x 318 + 22 gaps), quote block
  repositioned and re-proportioned, buttons and scroll indicator nudged to match.
- Known deviation: Anton renders shorter caps than the reference display face, so
  the headline cannot fill the reference block height. The slack is split between
  the headline->subtitle and buttons->SELECTED WORK gaps, which leaves the subtitle
  and buttons ~10px above their reference y. SELECTED WORK and the cards stay
  anchored on the reference.
- Hero composition correction pass (headless render at 1440x1088 diffed against
  the reference): the tulip was oversized, so its bloom crowded COMMUNICATION on
  the left and overlapped the quote block on the right. Tulip re-placed at
  left 698 / top 157 / width 610 (was 688 / 155 / 668) — its bloom bbox now
  matches the reference (775..1141 x, top 162) with a clean gap to both the
  headline and the quote. The thin backdrop ring was refitted to the reference
  arc (left 745 / top 181 / size 612, was 734 / 131 / 547) so it still reads as
  sitting behind the bloom.
- Verified unchanged and already reference-exact: quote block (text left 1170,
  top 438 vs reference 1168 / 437), scroll indicator, headline, buttons, cards.
- Fixed: the global reset (`* { margin: 0; padding: 0 }`) was unlayered and
  silently overrode every Tailwind margin/padding utility. It is now inside
  `@layer base` in `src/styles/global.css`.

- Right hero composition is now right-anchored, not left-positioned: the tulip,
  backdrop ring, dashed guide, quote/signature and their two plus marks use
  `right-[...]` offsets, so the group tracks the right edge. Sizes, vertical
  positions and the spacing between these elements are unchanged; the group now
  sits 70px right of its old reference x. This supersedes the left-based x
  offsets quoted above (tulip left 698, ring left 745, quote left 1170).

- Homepage below the hero matched to the FULL-PAGE reference
  (`home-reference.png`, 941 x 1672, updated 2026-08-29 — it now covers the
  whole page, not just the hero fold). Offsets below the fold are reference
  pixels scaled by 1440/941 = 1.5303, with the left gutter pinned to
  `--content-pl` (86px) so everything stays aligned with the hero headline.
  The reference's own gutter is proportionally wider (131px at 1440); the hero
  wins that tie, so the below-fold content column is ~11% wider than the
  reference's.
- Selected Work is one block of two numbered rows inside the fold's content
  column: five mixed-width full-bleed cards per row in a bordered panel, an
  arrow in the right gutter, and the `01` / `02` number + SCROLL TO EXPLORE
  hint hanging in the left gutter (`right-full`). Row 01 deliberately breaks
  the bottom of the first screen. The gutter label is drawn slightly smaller
  than the reference's because 86px is all the room there is. The rows now
  loop continuously — see the Selected Work motion section below.
- `--work-top` went 52px -> 195px to put SELECTED WORK on its reference y.
- The fold's decorative layers (backdrop, tulip track, right-edge overlay) are
  now pinned to `--screen` (`calc(100svh / var(--page-zoom))`) instead of to
  their wrapper, so the wrapper can grow past one screen for the work rows
  without stretching the tulip or dropping the scroll indicator.
- WHAT I DO: eyebrow above a three-column grid split by hairlines; 58px purple
  numerals, 36px Anton titles, 17px Oswald body.
- DESIGN IS COMMUNICATION: stacked beige eyebrow + rule on the left gutter,
  107px Anton statement (matched to the hero headline size) with a beige dot,
  serif note and Allura signature, and a bloom-scale crop of `tulip.png` filling
  the right third inside a thin frame, bleeding off the canvas edge.
- Closing CTA: three-line grotesk headline in purple-light, hairline divider,
  one outlined LET'S TALK pill, gold sparkle, tulip leaves entering bottom-left.
- Footer is one line: YA + copyright left, nav optically centred, location
  right-aligned on the gutter.
- `WorkCard` is now the reference card — full-bleed cover, scrim, project name
  over the bottom-left corner, width passed in by the row. `projects.ts` holds
  the ten homepage cards; only three project photographs exist locally, so each
  card takes one of them with its own crop.
- Montserrat 700/800 was added to the Google Fonts link in `index.html` and
  exposed as `--font-grotesk`: the CTA headline is the one place the reference
  leaves the condensed display face for a wide geometric grotesque. No package
  was installed.
- Not verified by render: no headless browser is available in this project, so
  the below-fold geometry is measured off the reference, not pixel-diffed.
- The NOURA / STERLUX / DENTELLE card mockups and the multi-bloom tulip
  photograph in the reference do not exist locally; the local tulip and the
  three project photos stand in for them.
- Unbuilt links are inert `href="#"`, as in `Navbar.tsx`. No email address or
  social URLs are real.

## Important files
- `src/pages/Home.tsx`
- `src/components/IntroStage.tsx`
- `src/components/IntroTulipPlate.tsx`
- `src/sections/homeIntroMotion.ts`
- `src/sections/introPlanes.ts`
- `src/sections/introGate.ts`
- `src/sections/Hero.tsx`
- `src/sections/SelectedWork.tsx`
- `src/components/Navbar.tsx`
- `src/components/HeroTulip.tsx`
- `src/components/WorkCard.tsx`
- `src/sections/WhatIDo.tsx`
- `src/sections/Belief.tsx`
- `src/sections/HomeCta.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/QuoteBlock.tsx`
- `src/components/ScrollIndicator.tsx`
- `src/styles/global.css`
- `src/data/projects.ts`

## Assets
- Reference: `src/assets/references/home-reference.png`
- Homepage images: `src/assets/images/home/`
- Card crops are tuned via `coverPosition` / `coverZoom` / `coverFit` in
  `src/data/projects.ts`. The Home Selected Work covers now run zoom-free (every
  `coverZoom` was dropped) so each card shows the largest crop its ratio allows;
  AQARATI no longer uses `coverFit: 'contain'` — its 1280x631 hero shot crops
  horizontally only under `cover`, so a centred crop keeps the villa and the
  headline and the card is full-bleed like the other nine. `/work` is untouched.

## Pending task
- WORK / PROJECTS page implemented at `/work` against the 1440px desktop reference.
- Uses the existing navbar, visual system, tulip, and local homepage project imagery.
- Dedicated project grid imagery does not exist yet, so the five-card composition
  reuses the three available local project assets with page-specific crops.

## Not built yet (do NOT build)
- Mobile version / responsive layout
- Project case study pages

## Motion foundation (global)
- `src/motion/` now carries the full premium layer: `config.ts` (EASE incl. the
  registered CustomEases expo/silk/drift/snapIn, DUR, STAGGER, LERP, TRIGGER, Z,
  reduced-motion + fine-pointer probes, `onReducedMotionChange`), `gsap.ts`
  (ScrollTrigger + CustomEase + SplitText, all free in GSAP 3.15),
  `reveal.ts`, `parallax.ts`, `magnetic.ts`, `CustomCursor.tsx`, `stringTune.ts`.
- Lenis stays the only scroll engine. `useSmoothScroll` now re-boots on a
  reduced-motion change, refreshes ScrollTrigger after fonts/load, and stamps
  `data-motion="ready"|"reduced"` on <html>.
- `useMotionScope` setups may now return a cleanup (what `reveal`/`parallax`
  hand back); it also re-evaluates when the reduced-motion setting flips.
- `CustomCursor` is mounted in `App.tsx` beside the route tree. Dot + lagging
  ring, driven by `data-cursor` / `data-cursor-label`. Renders nothing on
  coarse pointers or under reduced motion. Native cursor stays visible unless a
  page opts into `.cursor-none`.
- `stringTune.ts` is a ref-counted, opt-in boot with both scroll modes forced
  to native so it cannot fight Lenis. Nothing uses it yet.
- `global.css` gained a motion support block: `[data-reveal]` hides only while
  `data-motion="ready"`, so a JS failure never blanks the page.
- `CustomCursor` is zone-scoped: it fades in only inside an element marked
  `data-cursor-zone`, and the Home hero fold is currently the only zone.

## Home hero motion
- `src/sections/heroMotion.ts` holds the whole fold — entrance, depth, exit —
  run through `useMotionScope` from `src/pages/Home.tsx` (scope = the fold div).
- **One camera.** The decorative `.home-track` is tagged `data-motion="hero-scene"`
  and given a shared `perspective: 1400px` whose `perspective-origin` sits on the
  backdrop ring's centre (`calc(100% - 319px) calc(487px - var(--hero-lift))`),
  not on the viewport centre — so the bloom, ring, guide and marks foreshorten
  toward the same vanishing point. Written straight to `el.style` (GSAP would
  try to interpolate the `calc()`) and cleared in the cleanup.
- **Layout is unchanged.** Every layer rests at z 0 / scale 1 / no rotation, so
  the shared perspective is a no-op on the reference geometry at rest.
- **Channels.** entrance = `autoAlpha` / `scale` / `scaleY` / `yPercent` (headline)
  / `z`; scroll parallax = `yPercent` (tulip, ring, guide); pointer = `x` / `y` /
  `rotationX` / `rotationY`; exit = `z` / `scale` / `scaleY` / `xPercent` /
  `yPercent` (marks). `z` is shared by the entrance and the exit **in sequence**:
  the exit is not built until the entrance timeline finishes (`tl.call(buildExit)`),
  so the two never own a channel at once and each exit `to` records the settled
  rest value as its start.
- **Opening choreography.** Same beat-grid order as before, upgraded to depth:
  the three headline lines close their own z from -64 / -104 / -46 (own
  `transformPerspective: 1200`, `transformOrigin: 0% 50%` so the left edge never
  drifts off the gutter) while sliding out of their masks; the tulip walks in
  from z -150 with a 0.975 scale over 1.7s; ring z -230, guide z -300, marks
  z -170 assemble around it on the existing delays. No bounce, no overshoot.
- **Living depth — one ticker, two summed terms.** `x`/`y`/`rotationX`/`rotationY`
  on every decorative layer are written by a single `gsap.ticker` callback
  through `quickSetter` (no tween allocation per frame), as
  `pointer + idle`, never one or the other:
  - *camera* — a shared drift on the stage element's own `x`/`y` (`CAMERA`
    ±1.6/±1.2px, ~103s and ~134s periods), so the whole group floats as one
    rigid body against the fixed backdrop and vignette. An order of magnitude
    slower than any layer's own drift. The headline and the right-edge overlay
    (quote, scroll hint) sit outside the stage and are not touched.
  - *pointer* — tulip 18px / 0.85° / 1.15°, marks 14px / 0.6° / 0.9°, ring
    10px / 0.5° / 0.7°, guide 6px / 0° / 0.4°, followed by a **velocity-aware
    damped spring**, not a lerp. Hand speed is read off the target each frame
    and smoothed (`POINTER.speedLerp` 0.12, full at `speedFull` 3.2 normalised
    units/s); it grades both ends of the spring — `omega` 5.2 → 3.8 (a flick
    lags further behind) and `zeta` 1.02 → 0.9 (a flick overruns once and
    settles; a slow hand never overshoots at all). Semi-implicit Euler with `dt`
    clamped to 33ms keeps it stable. After `POINTER.rest` 0.9s of stillness the
    target decays to 0, so the layers ease back into the drift.
  - *focus* — a continuous 0..1 reading of the hand's distance to the ring
    (`FOCUS.inner` 0.55r → `outer` 1.15r, smoothstepped, then lerped at 0.045).
    It **redistributes** authority rather than adding any: the bloom gains
    `+0.3` of lean and `+0.008` of scale, the ring/guide/marks give up `0.55`
    of their own lean and idle. Deliberately **not** applied to pointer
    rotation — the tilt ceiling has to stay a ceiling or the hairline ring
    shimmers. No opacity is touched. The cursor's bloom state is a Schmitt
    trigger on the same smoothed value (on 0.55 / off 0.32), so it cannot
    chatter at the boundary; the ring is measured on a 250ms cadence inside the
    ticker so no frame forces a synchronous layout.
  - *idle* — roughly a fifth of the pointer's authority (tulip 3.6/4.6px,
    0.26°/0.32°; marks 2.6/3.2px; ring 1.8/2.3px; guide 1/1.4px, 0.09°), each
    layer on its own clock (`rate` 1 / 0.83 / 0.61 / 0.44 — the depth ladder
    expressed as time). Every channel is two sines at the golden ratio
    (`IDLE_HARMONIC` 1.618) with per-layer and per-channel phase offsets, so
    the drift is quasi-periodic: fully deterministic (cannot jitter) and
    non-repeating (no learnable loop). Fades in over `IDLE_RAMP` 2.4s on a
    smoothstep, so the entrance still lands on the authored reference pixel.
  - *breathing* — the bloom alone gets `scale` (`breath` 0.0035, ~2px on a
    610px image) on a 33s wave, enabled from the same `tl.call` that builds the
    exit so it never overlaps the entrance's settle. The exit does not touch
    tulip `scale`, so the channel has one owner from then on.
  - The headline is deliberately not a layer — display type this size has to
    stay still to stay crisp.
  - The ticker runs regardless of pointer type (idle is autonomous); only the
    listeners are behind `hasFinePointer()`. Removed with
    `gsap.ticker.remove(tick)` in the cleanup.
- **Bloom cursor pulse.** `STATES` entries may now declare an optional `pulse`
  multiplier; only `bloom` does (1.07, `CURSOR.pulse` 1.9s half-period, yoyo).
  It starts in `sizeRing`'s `onComplete` so it breathes around the settled size,
  and a press cancels it — a target about to be hit should not be moving. Killed
  explicitly in the cursor teardown because an `onComplete`-created tween is not
  recorded by the `gsap.context`.
- **Not done: the optional tulip light-response.** Painting a highlight over a
  transparent PNG cut-out needs either a `filter` or a `mask-image` of the same
  1086x1448 asset — the first breaks the transform/opacity-only rule, the second
  adds a second decode of a large image on the compositor path. Not worth the
  60fps risk for the gain; revisit when the hero moves to WebGL.
- **Cinematic exit.** One scrubbed timeline (`scrub: 0.8`) over the first 0.9 of a
  viewport, triggered off the fold, no pinning and no wheel handling. Layered
  starts: tulip 0 (z +118, comes forward past the text), ring 0.05 (z -70 +
  scale 1.11, opens out as it recedes), hero text 0.09 (z -100 + scale 0.99 on
  its own `transformPerspective: 1600` / `0% 45%` origin, set once inside
  `buildExit` rather than tweened from 0), guide 0.13 (z -150 + scaleY 0.74,
  compresses from its top), marks 0.17 (z -110 + a ±230/±150 xPercent scatter off
  the vanishing point). Selected Work is untouched — its existing intro is
  already on stage and drifting while this plays.
- **Exit tension.** The exit tweens no longer run on `ease: 'none'`. A linear
  scrubbed tween is a direct readout of the scrollbar, which is what makes depth
  exits feel mechanical; these are in-out curves graded by how much each layer
  should resist, so the first stretch of scroll barely moves them (the fold
  holds), then it releases through the middle and lands soft: text
  `power3.inOut` (holds longest — it is still being read), tulip `power2.inOut`,
  ring and guide `EASE.silk`, marks `power1.inOut` (least held — they signal the
  release). `EXIT_AT`, the `EXIT` values, `range` and `scrub` are all unchanged,
  so the choreography is identical and only its shape in time moved. Nothing
  pins and no scroll is intercepted — the whole effect is four curves.
- **Cursor.** `CustomCursor` gained `link` / `button` / `bloom` beside the existing
  `default` / `hover` / `view` / `hidden`. Hero CTAs are tagged
  `data-cursor="button"` (primary) and `data-cursor="link"` (secondary). The
  bloom sits in the `pointer-events-none` backdrop under the full-width content
  wrapper, so it cannot be hovered: `heroMotion` toggles `data-cursor="bloom"` on
  the zone by proximity to the ring (radius 0.52 x its width, re-measured at most
  every 250ms) and re-announces it with a synthetic bubbling `pointerover` from
  the element actually under the cursor, so the existing `closest()` lookup picks
  it up and any real link/button still wins by being nearer in the tree. No hit
  areas were added, so nothing new intercepts clicks or the work-row drag.
- The headline is masked by markup, not SplitText: `Hero.tsx` renders the three
  lines as `block overflow-hidden` spans instead of `<br />`. Rendering is
  identical (same line boxes, same total height) and the clip is font-metric
  independent, so the reveal cannot depend on when Anton finishes loading.
- Hooks used: `data-motion` = hero-scene, hero-text, hero-eyebrow, hero-line,
  hero-subtitle, hero-cta, tulip, ring, guide, mark, quote-part, scroll-hint;
  the navbar is queried as `header` so /work's shared `Navbar` is left untouched.
- `PlusMark`, `QuoteBlock` and `ScrollIndicator` now forward extra props (as
  `HeroTulip` already did) so they can be tagged without wrappers.
- Reduced motion still skips the whole scope (no perspective is written at all),
  and the cleanup detaches the pointer listeners, the parallax triggers, the exit
  timeline + its ScrollTrigger, the entrance (which also cancels the pending
  `buildExit`) and the inline perspective.
- Not verified by render: no headless browser here, so the depth values below are
  measured reasoning, not a pixel diff. See the note in **Needs visual check**.

## Needs visual check (Home hero)
- Bloom exit depth: the tulip advances to z +118 (~9% larger) while the fold
  scrolls away. Confirm it never crowds the quote block on the way out.
- Ring exit: z -70 with scale 1.11 nets ~1.07x. Confirm the hairline circle does
  not clip the right edge of the track at 1440.
- Headline recede: `perspective(1600px)` is written on the hero `<section>` once
  the entrance ends. Matrix is the identity at rest, so Anton should stay crisp —
  worth a look at 100% zoom.
- Short-viewport canvases (`--page-zoom` 0.93 / 0.87 / 0.8 / 0.73): the
  perspective origin tracks `--hero-lift`, but the whole stage is inside a
  `zoom`ed canvas, so the depth reads slightly differently there.
- Bloom cursor radius (0.52 x the ring's width) is a feel value; check where it
  switches on relative to the visible bloom.

## Checks
- `npm run build` passes (tsc + vite)
- `npm run lint` (oxlint) clean

## Repo status
- Nothing committed. Nothing deployed.

## Motion system (desktop)
- `src/motion/` is the single home for motion: `config.ts` (EASE / DUR /
  STAGGER tokens + `prefersReducedMotion`), `gsap.ts` (registers ScrollTrigger,
  sets global defaults), `useSmoothScroll.ts` (Lenis driven off the GSAP ticker,
  one shared rAF loop), `useMotionScope.ts` (scoped `gsap.context` that runs
  before paint and reverts on unmount, and is skipped entirely under reduced
  motion), `PageTransition.tsx` (reusable dark-purple wipe, ~0.8s, defers the
  rendered route until the panel covers).
- `App.tsx` mounts smooth scroll and wraps `<Routes location={...}>` in
  `PageTransition`, so every future page gets the transition for free.
- Elements opt in with `data-motion="…"` attributes; no loose gsap calls.
- `/work` is animated — see the **/work motion** section below.
- Not animated yet: mobile, Project.

## Selected Work motion (Home)
- `src/sections/selectedWorkMotion.ts` drives both rows through `useMotionScope`
  from `SelectedWork.tsx`. Row 01 travels left (`direction: -1`), row 02 right.
- Seamless loop: the track holds `COPIES = 3` sets of the five cards and is
  translated on one `x`, wrapped into `[-setWidth, 0)` where
  `setWidth = sum(widths) + 8 * count` (1316 / 1312). Copy two begins exactly one
  set after copy one, so the wrap lands on an identical pixel — no seam, no reset.
- One accumulator (`state.pos`) owns the position. The ticker adds the drift
  (22px/s), a drag adds its delta, the arrow and keyboard focus tween it via
  `glide()`. The drift is suspended while a glide or drag is active, so control
  hands back smoothly instead of jumping.
- `state.rate` is a separate channel: card hover eases it to 0.15 (slowed, never
  stopped), keyboard focus to 0, release back to 1.
- Card micro-interactions, all delegated off the panel with a `WeakMap` of
  `quickTo` setters built on first hover: max 3.2 degree tilt via
  `transformPerspective`, cover parallax 14px against the pointer at scale 1.05,
  title lift 4px and a hairline rule drawing in from the left.
- Duplicated cards carry `aria-hidden` + `tabIndex={-1}`, so the ten projects are
  announced and tabbed exactly once. Focusing a card holds the row and glides it
  inside the panel.
- No wheel handler anywhere; the panel is `touch-action: pan-y`, so vertical page
  scroll is never intercepted. Drags over 6px suppress the click so a drag never
  opens a project.
- Under `prefers-reduced-motion` the row renders ONE set in an
  `overflow-x-auto` panel and the arrow runs it end-to-start — the loop was
  carrying reachability, so something has to take that over.
- Pointer deltas are divided by the canvas `zoom` factor, so dragging tracks the
  cursor on the short-viewport scaled layout too.
- Open accessibility question: WCAG 2.2.2 wants a pause control for motion
  running past 5s. Hover slows and keyboard focus stops the rows, but there is
  no dedicated pause button yet.

## WHAT I DO motion (Home)
- `src/sections/whatIDoMotion.ts`, run through `useMotionScope` from
  `WhatIDo.tsx` (scope = the section). One timeline off one ScrollTrigger on the
  section (`top 82%`, `once`), so the three columns keep their relationship
  instead of each firing at its own scroll position.
- Order: label (masked rise), columns fade/rise staggered, numerals (masked,
  longest travel), hairlines draw down, titles (masked), plus mark, body last.
- Masks are `clip-path` insets set from JS, not `overflow-hidden` in the markup:
  the inset carries 20% vertical slack so a glyph overflowing its `leading-none`
  line box is never cropped at rest, and reduced motion / a JS failure leaves the
  type completely untouched.
- The hairlines moved from a painted `border-l` to a 1px absolute span at
  `-left-px`; the border box is kept but transparent, so the grid measures
  identically and the line is now an element that can be drawn with `scaleY`.
- Scroll depth: per-column parallax at -2.4 / -5.2 / -3.4 yPercent, scrubbed 0.6.
  Uneven on purpose — three equal offsets would read as one moving block.
- Pointer: one delegated listener leans each column's inner wrapper 5 / 8 / 5.5px
  toward the cursor (x1.6 on the hovered one — the magnetic part), and the
  hovered column lifts its numeral 7px and title 3px. Fine pointer only.
- Channel split so nothing collides: entrance owns `autoAlpha`/`y` px/`scaleY`,
  masked type owns `yPercent`, column depth owns `yPercent`, the lean owns `x`/`y`
  px on the inner wrapper, hover owns `y` px on the numeral and title.
- Hooks: `data-motion` = wid-label, wid-col, wid-inner, wid-index, wid-title,
  wid-body, wid-rule, wid-mark. No other section touched.

## Belief / DESIGN IS COMMUNICATION motion (Home)
- `src/sections/beliefMotion.ts`, run through `useMotionScope` from
  `Belief.tsx` (scope = the section, ScrollTrigger fires off the inner band —
  the section carries 196px of lead padding and triggering on that would start
  the scene while the band is still below the fold).
- Composed in three planes: far = the tulip crop moving behind its window;
  mid = the frame, hairline and plus marks, fixed in layout and revealed with
  delayed precision; near = the type, which does not move on scroll at all.
  Display type this size stops being legible while it travels, so the depth is
  carried entirely by the image moving against a statement that holds.
- The frame is treated as a proscenium: it never moves, which is what makes the
  image travelling inside it read as depth. Nothing pins, nothing touches the
  scroll position — the whole effect is one scrubbed transform.
- Entrance order: eyebrow (masked, per line), tulip (1.7s scale settle, running
  under everything), statement lines (masked), frame clip-wipe, hairline
  `scaleX`, plus marks, the beige dot, serif note, signature last.
- The eyebrow and the statement render their lines as `block` spans instead of
  `<br />` so each line can be masked; line boxes are identical. Masks are
  negative `clip-path` insets set from JS — 20% slack on the eyebrow, 34% on the
  statement, which runs Anton at `leading-[0.9]` and overflows its line box hard.
- Far plane: a new `absolute inset-0` wrapper inside the existing crop window
  (zero visual change — the image keeps its offsets), scrubbed 0.7 from
  `yPercent 7 / z -34 / rotationY 1.4 / scale 1` to
  `yPercent -11 / z 62 / rotationY -1.4 / scale 1.025` under
  `transformPerspective: 1400`. The crop window is 640x474 against an image drawn
  at 1810x2413 with 348px of headroom above and 1591px below, so no extreme here
  brings an edge into the window.
- Pointer: the plane leans 12/8px and tilts 0.7 degrees on `rotationX`, the marks
  lean 10px. All on channels the scrub does not use, so the two compose.
- Channels: masked type owns `yPercent` + `clipPath` on its wrapper, entrance
  owns `autoAlpha`/`y` px/`scale`/`scaleX`/`clipPath`, the plane owns
  `yPercent`/`z`/`rotationY`/`scale`, the pointer owns `x`/`y` px + `rotationX`.
- Hooks: `data-motion` = belief-band, belief-label, belief-line, belief-dot,
  belief-frame, belief-rule, belief-mark, belief-note, belief-signature,
  belief-plane, belief-tulip.

## Closing CTA motion (Home)
- `src/sections/homeCtaMotion.ts`, run through `useMotionScope` from
  `HomeCta.tsx` (scope = the section, ScrollTrigger fires off the inner band).
- Order, built as an invitation rather than an announcement: the top hairline
  opens the section (`scaleX` from the left), the leaves settle underneath on a
  1.6s scale, the three statement lines rise masked, then the supporting layer
  (vertical rule `scaleY`, sparkle) once the type has stopped, and the pill
  last and alone — nothing else is moving when it settles.
- The section has no eyebrow and no supporting paragraph in the reference, so
  the "label" beat is carried by the top hairline and the "supporting copy"
  beat by the vertical rule + sparkle. No copy was added.
- Handoff into the footer: one scrubbed -7px lift on the band over its last
  stretch of travel (`bottom 92%` -> `bottom 58%`), transform-only, so the page
  arrives at its end instead of stopping at it.
- The pill uses the shared `magnetic()` helper (strength 0.24, scale 1.03,
  label pulled at 0.1). It opts out on coarse pointers and under reduced motion
  itself, and clears its transform on teardown.
- Masks are negative `clip-path` insets set from JS (26% slack — Montserrat 800
  at `leading-[0.97]` overflows far less than Anton), so reduced motion and a JS
  failure both leave the section exactly as authored.
- Markup changes are motion hooks only, no layout change: the statement renders
  its lines as `block` spans instead of `<br />`, the tulip moved inside a plane
  wrapper carrying its offsets (the image keeps its authored `rotate-[8deg]`),
  and the pill gained a positioning wrapper so the entrance owns the wrapper's
  `y` while the magnetic pull owns the pill's own `x`/`y`.
- Channels: masked type owns `yPercent` + `clipPath`, the entrance owns
  `autoAlpha`/`y` px/`scale`/`scaleX`/`scaleY`, the far plane owns
  `yPercent`/`scale`, the handoff owns `y` px on the band, the pointer lean owns
  `x`/`y` px on the plane and the sparkle.
- Hooks: `data-motion` = cta-band, cta-rule, cta-line, cta-divider, cta-sparkle,
  cta-button-wrap, cta-button, cta-button-label, cta-plane, cta-tulip.

## Footer motion (Home only)
- `src/components/siteFooterMotion.ts`, run through `useMotionScope` from
  `Home.tsx` — not from `SiteFooter` itself. The component carries the hooks but
  mounts no scope, so the same footer inside `caseStudyUi.tsx` renders untouched;
  `Home` opts in by passing the scope ref. Same arrangement the hero uses for the
  shared `Navbar`.
- Deliberately the quietest scene on the page: half the CTA's travel (14/12px),
  no masks, no scrubbed planes, no parallax.
- Order: the band drifts up as one object (the CTA's -7px handoff, continued),
  the top hairline draws in `scaleX` from the left, the wordmark settles out of
  a 0.94 scale on a left transform origin, the copyright, the four nav items on
  a tight stagger, then the location note.
- The shared `TRIGGER.reveal` line (`top 82%`) is unusable here: the footer is
  the last element on the page, so at maximum scroll its top never rises higher
  than its own height above the viewport bottom — on a tall viewport that line
  is never crossed and the footer would stay hidden. It fires on
  `top bottom-=24` instead, which is always reachable.
- The footer has no social icons; the nav row is the contact-side item, so it
  takes the magnetic response — `magnetic()` at strength 0.14 with no scale
  (against the CTA pill's 0.24 + 1.03). It is bound in the timeline's
  `onComplete`, so the entrance has stopped writing `y` before the pull owns it.
- The pull is bound to the `<li>`, not the `<a>`: a flex item is blockified and
  can take a transform, while the inline anchor cannot — and the `<li>`
  shrink-wraps the link, so hovering the two is the same gesture.
- `SiteFooter` now forwards `ComponentProps<'footer'>` (React 19, so `ref` is a
  plain prop), matching `PlusMark` / `QuoteBlock` / `ScrollIndicator`.
- Channels: the entrance owns `autoAlpha`/`y` px/`scale`/`scaleX`, the magnetic
  pull owns `x`/`y` px on the nav items. No page transition work was added.
- Hooks: `data-motion` = footer-band, footer-rule, footer-logo, footer-note,
  footer-link, footer-meta.

## Final motion polish pass (Home only)
- Goal was continuity, not new effects: every section already animated well on
  its own, which was the problem — five self-contained performances with hard
  cuts between them.
- **One rhythm.** `config.ts` gained `BEAT` (open / lead / subject / structure /
  detail / support / close), the beat grid every Home section now places its
  tiers on, and `ROLE` (subject = drift, structure = silk, support = expo), which
  assigns an ease by tier rather than by taste. Hero, Selected Work, WHAT I DO,
  Belief, CTA and the footer were all re-timed onto it; offsets moved by at most
  ~0.06s each, so the feel is unchanged and the relationships are now explicit.
- **One depth continuum.** `src/sections/homeFlowMotion.ts`, scoped to the
  below-fold column from `Home.tsx`. Each `<section>` sits at `FLOW.recede`
  (-26px z on a 1600 perspective, ~1.6% of foreshorten) while off-screen, arrives
  by `top 75%`, holds at exactly z 0 for the whole readable stretch, and departs
  from `bottom 25%`. The plateau is deliberate: a 3D transform resamples text, so
  nothing is ever read at a size other than the one it was designed at, and the
  last section — which can never scroll far enough to depart — rests correctly.
  The depart tween is a `fromTo` so its start is pinned at z 0 rather than
  captured lazily from whatever the arrival wrote.
- **The hero fold is excluded from the continuum on purpose.** Selected Work
  lives inside it and derives its drag scale from the panel's rendered width
  against its layout width, so a scrubbed ancestor transform would feed into the
  drag maths; the fold also pins its decorative layers to `--screen`. It keeps
  its own parallax instead.
- **Hero -> Selected Work was the one remaining hard cut.** `selectedWorkIntro`
  (in `selectedWorkMotion.ts`, run from a section-level scope in
  `SelectedWork.tsx`) gives the block a landing that overlaps the hero's tail:
  masked SELECTED WORK label, rows, then the gutter numerals. Opacity and `y`
  only — no scale anywhere in that subtree, for the drag reason above — and the
  loop is never touched, so the rows fade in already drifting. The handoff delay
  is conditional: applied only when the block is inside the viewport at setup
  (the normal load), skipped when the visitor scrolled to it.
- **Repetition reduced.** The same bloom scale-settle occurred three times at
  1.6 / 1.7 / 1.6s; it now descends 1.6 (hero) -> 1.45 (Belief) -> 1.25 (CTA)
  with matching over-scale trims (1.06 -> 1.045, 1.07 -> 1.045), so the gesture
  quietens each time it returns instead of reading as one trick played thrice.
- **Scroll depth rebalanced** to a single curve across the page: Belief stays the
  peak but came down (yPercent 7/-11 -> 6/-9.5, z -34/62 -> -28/48, rotationY
  1.4 -> 1.1), the CTA dropped to 5/-5.5 with a 1.028 over-scale, and CTA pointer
  lean went 10/7 and 9/6 -> 7/5 and 6/4. Hero and WHAT I DO were already light
  and are unchanged.
- **Hover consistency.** `HOVER` (DUR.base + expo) is now the one hover timing;
  `whatIDoMotion`'s lift and `magnetic`'s scale both use it. The magnetic
  *follow* stays at DUR.slow — the lag is what makes it feel weighted.
- **Cursor.** Timings moved out of `LERP.cursor * 3` arithmetic into a named
  `CURSOR` block: dot follow 0.48s -> 0.16s (it now reads as the pointer rather
  than trailing it), ring 0.62s, so the dot/ring gap does the work. State swaps
  ease on silk, zone fades are asymmetric (quick in, swap out), and a press
  response was added — the ring tightens to 0.82 of its state scale on
  pointerdown and releases on up/cancel/leave, composed with the state scale
  rather than overwriting it.
- **StringTune was considered and not used.** Its modules (marquee, tilt,
  spotlight, glide) all duplicate something the page already does in GSAP —
  and the marquee would replace the Selected Work loop, which carries the drag,
  keyboard-focus, `aria-hidden` duplicate handling and reduced-motion fallback.
  Adopting it would have cost accessibility for no motion gain. `stringTune.ts`
  stays the unused door it was.
- Unchanged and verified: no layout, type, spacing, colour or copy edits; no
  scroll hijacking; no WebGL; `/work` and the case studies untouched (the flow
  scope is Home-only and the footer motion stays opt-in); reduced motion still
  skips every scope entirely; every scope still returns its cleanup.
- Still open: the WCAG 2.2.2 pause control for the Selected Work rows.

## /work motion
- `src/pages/workMotion.ts` holds the whole page, run through `useMotionScope`
  from `Work.tsx` (scope = the `<main>`). Same grammar as the Home fold, not a
  new one: one camera, layers at their own depths, strictly separate transform
  channels. `Work.tsx` carries no motion of its own beyond the two swap effects.
- **The page is one screen tall, and the motion says so.** No pin, no hijack,
  no wheel handler, no added scroll length: the "camera" is a dolly on the
  entrance, a short depth handoff over whatever scroll room the viewport
  actually leaves, per-project reveals, and a swap that is a scene change.
- **Two plates.** The header `<section>` is `data-motion="plate"` and the
  filters/grid/footer `<section>` is `data-motion="field"` — both existing
  elements, tagged rather than added, so the box model is untouched. Each
  carries `transformPerspective: 1600` and opens out of depth on the entrance
  (header z -56, field z -40) underneath every layer's own arrival, so the
  opening is a push-in rather than a stagger.
- **One camera** over the decorative group is unchanged: the tulip, ring and
  three marks live in the `data-motion="work-scene"` wrapper spanning the
  header's padding box, `perspective: 1400px` with `perspective-origin` on the
  ring's centre (`calc(100% - 192.5px) 162.5px`), written to `el.style` and
  cleared in the cleanup.
- **Channels.** entrance = `autoAlpha` / `yPercent` (masked type) / `scale` /
  `z` / `clipPath` (cards); scroll = `y` + `opacity` (plates), `yPercent`
  (tulip 9.7, ring 16, marks 120); live = `x` / `y` / `rotationX` /
  `rotationY` / `scale` (bloom breath); cards = `z` / `y` / `clipPath`
  (reveal) + `rotationX`/`rotationY` (tilt) + `scale` (focus pull), with
  `x`/`y`/`scale` on the cover image only; swap = `autoAlpha` / `x` / `z` /
  `clipPath` / `scale`.
- **Entrance** is still on the shared `BEAT` grid with `ROLE` easing: nav +
  header dolly, eyebrow (z -34), MY WORK (z -88, own `transformPerspective:
  1200`, `0% 50%` origin), tulip (z -130, 1.35s), lede, ring (z -190), the
  field dolly starting at `BEAT.structure` so the work is already coming
  forward while the header settles, filters (z -70), marks (z -150), sort,
  footer. The 0.35s route-wipe delay is unchanged.
- **The scroll handoff.** `buildCamera()` runs from the entrance's `tl.call`,
  after the timeline has finished owning `z` on both plates, and only when
  `document.documentElement.scrollHeight - innerHeight >= 60`. The header lags
  the page (`y +15`, `opacity` -> 0.86) while the field runs ahead of it
  (`y -12`), scrubbed at 0.55 with `invalidateOnRefresh`. The field travels on
  `y` alone and stays at exactly z 0 for the whole scroll — card type is read
  there and a 3D transform would resample it.
- **Per-project reveals: one language, four phrasings.** Every card arrives
  out of depth through a clipped edge pass, `inset(... round 11px)` so the
  corners never square. `rise` (uncovers upward off its bottom edge) is the
  lead move; support cards cycle `wipeR` / `iris` / `wipeL` / `fall` in DOM
  order, so no two cards on a page use the same pass and none of them rotates.
  Each card hands `clipPath` back via `clearProps` on complete — a clip on the
  article would cut the link's `outline-offset-2` focus ring.
- **Hierarchy is data, not taste.** `workProjects.ts` gained `tier?: 'lead'`
  on SECOND LIFE, AQARATI SYRIA and DR. MOUHAMMAD ABOU SHAHIN; `ProjectGridCard`
  emits it as `data-tier`. Lead: z -142, y 34, 1.6s, cover 1.11, 0.14s gap,
  tilt ceiling 1.9°. Support: z -78 stepping -13 deeper per card, y 22, 0.92s,
  cover 1.07, 0.075s gap, tilt 3°. Nothing visual branches on the tier.
- **`GRID_LEAD` is 0.95 -> 0.55**, so the featured card is still opening while
  the title settles: the header and the first work read as one move. Skipped
  entirely when the visitor scrolled to the grid.
- **Card tilt + cover parallax** are unchanged in mechanism — one delegated
  pointer listener on the grid, card owns the rotations, cover image owns
  `x`/`y`/`scale`, drift capped per card by the headroom `scale` creates
  (`(size × 0.06)/2 − 1px`, re-measured on every enter). The tilt ceiling is
  now per tier rather than a flat 2.6°.
- **Focus pull** is the one hover addition and is deliberately near-invisible:
  the hovered card goes to `scale` 1.008, its neighbours to 0.994, on the
  shared `HOVER` timing. Transform only, no shadow, no filter, no blur.
  `scale` is free of the reveal and reset by `swapOut`.
- **Swap as a scene change.** Out: `autoAlpha` 0, `x` -30 against the travel,
  `z -92`, and the clip closing against the edge it leaves through, on
  `EASE.snapIn` with a 0.03 stagger from the leading edge. In: per card, from
  the opposite edge at `z -70` with a 0.055 delay ladder, lead cards on
  `DUR.epic` and support on `DUR.slow`, `ROLE.subject`, clip opening and then
  cleared. No opacity-only crossfade anywhere.
- **Filters** are unchanged: lift 3px / scale 1.035 on the shared `HOVER`,
  bound from the entrance's `onComplete` to `focus`/`blur` as well as the
  pointer; the active pill's `✦` is drawn in on each change, never on mount.
  **Arrows** keep `magnetic()` at strength 0.18 / scale 1.06.
- No layout, type, spacing, colour, copy or route change; no new package; no
  WebGL; no scroll hijacking and no wheel handler; reduced motion still skips
  the whole scope, and `swapOut` / `swapIn` / `markFilter` check it themselves
  because they run outside it. The cleanup detaches the pointer and grid
  listeners, the filter and arrow bindings, the ticker, the plate camera, all
  three parallax triggers, the reveal trigger and the inline perspective.
- Not verified by render: no headless browser here, so the depth values are
  measured reasoning rather than a pixel diff.

## Needs visual check (/work)
- The `clipPath` reveals: confirm `inset(... round 11px)` tracks the card's
  own radius exactly during the pass, and that `iris` on a 140px card is tall
  enough to read as an opening rather than a flicker.
- The plate handoff at typical laptop heights (900px viewport leaves ~190px of
  scroll): `y +15 / -12` may read as too little there and too much on a short
  window. Tune `PLATE.scroll` if the two plates look like they detach.
- Marks at `yPercent: 120`: the three spans are 20/22/29px, so they travel
  24–41px on different clocks. Confirm none of them drifts into the lede.
- Focus pull at 0.994: confirm the hairline card borders do not shimmer as the
  neighbours settle back.
- Cover parallax on the two short cards (140px): the cap leaves ~3.2px of
  vertical travel there, which may read as nothing. Raise `CARD.cover` if so.
- Title recede: `perspective(1200px)` stays on the MY WORK line after the
  entrance, and the header plate now carries `perspective(1600px)` on top of
  it. Anton at 108px should stay crisp — worth a look at 100% zoom.
- Tulip lean at 14px inside `overflow-hidden`: confirm the bloom's right edge
  never reveals a hard clip against the page edge.

## SECOND LIFE case study motion (`/work/second-life` only)
- `src/pages/secondLifeMotion.ts`, run through `useMotionScope` from
  `CaseStudy.tsx` (scope = the `<main>` rendered by `CaseStudyChrome`).
  `CaseStudy.tsx` is the SECOND LIFE page only — the other seven case studies
  have their own page components and stay completely static.
- **The device is the uncover.** Every plate opens with a `clipPath` inset
  (`inset(0% 0% 100% 0%)` → 0) that unrolls the frame downward from its top
  edge, hairline border included, while the image inside settles out of a small
  over-scale behind it. Nothing on the page pops, slides sideways or bounces.
  That is what makes it read as editorial/architectural rather than cinematic
  (Home) or dimensional (/work), while still being the same language: shared
  `BEAT` grid, `ROLE` easing, the house `parallax()` helper, one cleanup.
- **Shared components were extended, not rewritten.** `Plate`, `SectionHead`
  and `CaseStudyChrome` in `caseStudyUi.tsx` now forward extra props to their
  root element (`figure` / `header` / `main`, the last including `ref` — React
  19) — the same arrangement `PlusMark`, `QuoteBlock`, `HeroTulip` and
  `SiteFooter` already use. The seven other case studies pass nothing and their
  DOM is byte-identical. No `data-motion` hook and no GSAP import was added to
  the shared file.
- **The shared `CaseStudyHeader` was left completely untouched**, so the title
  block's parts are read off the one unambiguous element inside the section —
  the `h1` — via `previousElementSibling` / `nextElementSibling`. Adding hooks
  there would have changed the DOM of all eight pages for the benefit of one.
- **Channels**: frame owns `clipPath`; the image owns `scale`; the figure owns
  `y` px + `z` (arrival) and `yPercent` (scrubbed drift); type owns
  `autoAlpha` + `y` px; the two display headlines also own `clipPath` — they
  wipe *themselves* (a negative inset with 14% vertical slack) rather than
  rising out of a mask, because the shared markup has no mask element and none
  was added. Rules own `scaleX` from the left.
- **Opening** (the one timeline with no ScrollTrigger, delay 0.35 for the route
  wipe): back link, category, the 104px title self-wiping, subtitle, intro,
  then the four-column facts strip filling in on the tightest stagger on the
  page — the most architectural moment in the opening.
- **Hero** holds 0.9s when it is on screen at setup, so the page opens once
  rather than twice; skipped when the visitor scrolled to it.
- **Identity pair — asymmetric.** Two boards of near-identical weight read as
  one object unless something separates them: the right board opens a full beat
  later, settles 15% faster, and drifts twice as far (-6.4 vs -3.2 yPercent).
- **Passport pair — opposing.** Tag and book uncover together (they are one
  object in the story) then drift *against* each other, ±3.5 yPercent scrubbed
  at 0.8. The only opposing pair on the site.
- **The tall archive screen** takes the longest wipe (1.9s), the slowest settle
  (2s) and a -5 yPercent drift, so it rises past the `sticky` copy column the
  layout already holds still. Deliberately **no** scrubbed transform inside its
  frame: a permanent over-scale would crop a full-page capture at rest.
- **Supporting UI** is the quietest beat and the only pair that does not settle
  behind its wipe (`over: 0`) — two secondary screens with no head of their own
  should not perform.
- **Applications** are staged rather than read: both figures arrive from z
  (-90 and -130 on a 1200 perspective) so the pair has a near and a far rather
  than a left and a right.
- **Closing** is the final strong beat. The closing block repeats the
  `SectionHead` composition at 76px, so the same function plays it with a
  longer subject; the crate then takes the deepest arrival (z -70), the widest
  over-scale (1.09), the longest wipe and its own -4 yPercent drift. The outro
  is quieter than everything above it — a door out, not a gesture.
- **Deliberately not done:** the Home depth continuum (`homeFlowMotion`) is not
  applied here. It holds sections at exactly z 0 while they are read, which is
  safe for type, but this page is almost entirely large bitmaps and a scrubbed
  3D transform on their containers would resample them for the whole scroll.
  The plate rhythm is this page's spine instead.
- No layout, type, spacing, colour or copy changed; no new content, no image
  edits, no WebGL, no scroll hijacking and no wheel handler. Every plate on the
  page is played by exactly one timeline, so nothing can be left clipped.
  Reduced motion skips the whole scope, a JS failure leaves the page fully
  readable (all initial states are written from JS), and the cleanup kills
  every timeline, ScrollTrigger and parallax.
- Not verified by render: no headless browser here.

## Needs visual check (SECOND LIFE)
- The 104px `h1` and 76px closing `h2` wipe themselves with 14% vertical
  slack. Confirm no descender or accent is clipped at rest in Anton.
- Passport opposing drift at ±3.5%: on ~620px-square plates that is ±22px each
  way. Confirm the pair still reads as a pair rather than as a mistake.
- The tall screen's -5% drift against the sticky column: confirm the caption
  never collides with the plate at the bottom of the section.
- Plate wipes clip the frame's hairline border. Confirm the border does not
  shimmer along the wipe edge on the two largest plates.

## AQARATI SYRIA case study motion (`/work/aqarati` only)
- `src/pages/aqaratiMotion.ts`, run through `useMotionScope` from
  `AqaratiCaseStudy.tsx` (scope = the `<main>` from `CaseStudyChrome`). The
  other six static case studies are untouched.
- **The device is approach, not the uncover.** SECOND LIFE unrolls every plate
  out of a `clipPath` because its subject is a printed identity; AQARATI's
  subject is a working product, so no frame on this page is ever clipped —
  each screen arrives out of depth on one shared 1500px perspective, settles to
  exactly z 0, and the copy beside it leads in from the side the layout already
  puts it on. Same portfolio language (`BEAT` grid, `ROLE` easing, house
  `parallax()`, one cleanup), different vocabulary.
- **No shared-component change was needed** — `Plate`, `SectionHead` and
  `CaseStudyChrome` already forward extra props (added for SECOND LIFE), and
  `CaseStudyHeader` is again left untouched, its parts read off the `h1`.
- **Channels**: the figure owns `autoAlpha` + `x`/`y` px + `z` (arrival) and
  `xPercent`/`yPercent` (scrubbed drift, which no arrival writes); the image
  owns `scale`; type owns `autoAlpha` + `x`/`y` px, plus `z` on the title;
  rules own `scaleX`. The frame div is never written at all.
- **Flagged captures are never scaled.** `properties-ar.png` (clipped
  mid-search-bar, no navbar) and `cities-map-en.png` (map with empty counts)
  are already contained at 82% / beside the copy; the motion follows the same
  rule — `over: 0`, so they are placed and nothing more and no frame of any
  animation renders them larger than the layout asks. The closing about screen
  takes the same path for a different reason: it should be quiet.
- **Opening** (no ScrollTrigger, delay 0.35 for the route wipe): back link,
  category, the 104px title coming forward from z -120, subtitle, intro, then
  the facts strip assembling left to right (`x` 10 → 0) rather than rising
  together — the spec-row reading, and the counterpart to SECOND LIFE's
  tight vertical stagger.
- **Hero** is the deepest arrival of the upper page (z -180, 1.68s) with a
  1.05 settle and a -3 yPercent drift; it holds 0.9s when on screen at load so
  the page opens once.
- **Multilingual pair** leads in from opposite sides (x ∓22) at two depths
  (-110 / -150), then eases apart on ±1.1 `xPercent` — the only horizontal
  scrubbed drift on the site, ~7px on a 620px plate.
- **Listings** is the most restrained beat on the page: shallowest arrival
  (z -60), `DUR.hero`, no scale, no drift.
- **Discovery** reads spatially from its arrival (z -140) and a -4.5 yPercent
  glide past the `sticky` column, never from scaling the capture.
- **Accounts is the focal beat**: copy leads from x -18, the login screen
  answers from x +26 out of z -220 — the deepest on the page — and its content
  takes the slowest settle (2s). Nothing drifts there: a focused screen should
  be still once it has arrived.
- **About** mirrors the layout (screen left, copy right) at half amplitude —
  no depth, no scale, no drift — and the outro is quieter still.
- No layout, type, spacing, colour or copy changed; no new content, no image
  edits, no WebGL, no scroll hijacking. A figure is only ever hidden by the
  branch that also reveals it, so an unclaimed plate can never be left blank.
  Reduced motion skips the whole scope, a JS failure leaves the page fully
  readable, and the cleanup kills every timeline, ScrollTrigger and parallax.
- Not verified by render: no headless browser here.

## Needs visual check (AQARATI SYRIA)
- The 104px `h1` arrives from z -120 on a 1500 perspective — about 8% of
  foreshorten. Confirm Anton is crisp once it settles at z 0.
- Multilingual ±1.1 `xPercent`: confirm the pair still reads as aligned inside
  the 26px grid gap at the extremes of the scroll range.
- Login at z -220 on a 700px column is roughly a seventh of foreshorten.
  Confirm it reads as approach rather than as a perspective skew.
- The two flagged captures take no scale at all by design; confirm they still
  feel like part of the same page rather than under-animated.

## Home cinematic intro (Home only)
- `src/sections/homeIntroMotion.ts`, run through `useMotionScope` from
  `Home.tsx` (scope = `IntroStage`'s root, declared **last** so it is set up
  after `heroMotion` has written the fold's initial states). Markup is
  `src/components/IntroStage.tsx` (the plane stage) and
  `src/components/IntroTulipPlate.tsx` (the clip); the composition data is
  `src/sections/introPlanes.ts`; the handoff with the fold is
  `src/sections/introGate.ts`.
- **One shot, three movements, no cuts.** The dark plum world -> a field of
  twelve works uncovering across three depth layers on one travelling camera,
  two of them passing it and leaving, then the ten that remain drawn bodily
  into a single vanishing point -> the tulip clip emerging from that same
  point, opening, and dissolving into the live hero bloom. ~9.1s end to end.
- **It is one experience because all three movements share a coordinate
  system.** Three things do that work:
  - The stage's vanishing point is written onto the **live hero bloom's
    centroid**, read off the page at setup (`getBoundingClientRect` with the
    element's transform neutralised for the one measurement, because
    `heroMotion` has already written its arrival transform). The bloom's mass
    sits at (0.4458, 0.2465) of the tulip's box — measured off `tulip.png`'s
    alpha channel — so the works collapse into the exact pixel the flower then
    opens from. Correct at every `--page-zoom` breakpoint and any width, with
    nothing measured by hand.
  - The clip is mounted **inside the hero's own scene**, as a sibling of
    `HeroTulip` wearing the same positioning classes, so it inherits
    `.home-track`'s centring, `--tulip-shift`, `--hero-lift` and the canvas
    `zoom`. It is the still's box by construction. It also sits under the
    fold's edge vignette exactly as the still does.
  - The fold is not *started* afterwards, it is **released mid-shot**, so the
    headline is already sliding out of its masks while the flower is still
    resolving from video into image.
- **The clip's first frame is the hero's `tulip.png`.** Measured against the
  still's alpha: subject bbox matches to within 0.2% of the frame in both
  axes, centroid to within 0.2%, and the stem/leaf band holds that
  registration for the whole 5s while only the bloom opens. So the plate needs
  **no corrective scale or offset at all**, and the ending is a true match
  dissolve — everything below the flower head is already coincident and only
  one bloom resolves into another.
- **The bright first frame is hidden by a fitted curve, not a guess.** Sampled
  border luminance of the clip against the ~17 of the backdrop it composites
  onto: 220 / 156 / 108 / 62 / 32 / 24 at clip t 0.55 / 1.0 / 1.25 / 1.5 /
  1.75 / 2.0. The veil opacity that holds the composite at or under the
  backdrop's tone is 0.955 / 0.935 / 0.901 / 0.798 / 0.390 / 0. Tweening
  0.955 -> 0 over those 1.45s on `power3.in` tracks it to within ~0.02 for the
  whole descent, which is why the clip reads as *lit* out of the plum rather
  than faded up over it. Playback starts at 0.55, not 0 — the first half
  second is a static hold on the bright frame and the veil should not spend
  its budget on dead time.
- **The plate is feathered, not butted.** Its ground settles ~9 luma below the
  backdrop, which is invisible as a gradient and reads as a rectangle as an
  edge. Two crossed linear-gradient masks (`mask-composite: intersect`); the
  top feather is only 3.5% because the bloom touches the frame there.
- **The plane stage is mounted outside `.home-canvas`**, as a sibling of
  `<main>`, because the canvas carries `zoom: var(--page-zoom)` and a zoomed
  ancestor rescales `position: fixed` descendants and the viewport units in
  them. Out there its plum ground is the fold's backdrop gradient and vignette
  character for character — and since the fold's backdrop is one viewport tall
  once `zoom` is applied, the two resolve to the same pixels. The opening
  therefore starts *in* the dark plum world, and clearing the ground later is
  invisible because what is underneath is the same image.
- **The artwork stage is a field, not a set of plates.** Twelve planes across
  three depth layers — far (z -880..-620), mid (-430..-200), near (-90..+60) —
  authored as a coverage map rather than guessed: **78.7% of the frame carries
  artwork, 16.6% of it is two or three planes deep, and six planes are cut by
  a viewport edge.** The remaining plum is breathing room; full coverage would
  read as a collage. No two planes share a size, an aspect, an entry edge, a
  depth, a drift direction or a beat.
- **Twelve real works, ten of them the existing covers.** The two additions
  were chosen for what the field needed: SECOND LIFE's `mockup-shipping-crate`
  is the darkest photograph in the portfolio and anchors the far layer without
  lifting the plum, and RUMMAN's `serum-mockup` is the only close-up of a hand
  and survives being enlarged as it passes the camera. Both already existed;
  no asset was added or edited.
- **These planes deliberately do NOT rest at z 0** — the exception to the
  house rule the hero and /work follow, because here the subject *is*
  near/mid/far. A resting z on a shared perspective moves a plane on screen
  (the vanishing point is off-centre, it sits on the hero bloom), so
  `left`/`top` in `introPlanes.ts` are where the plane should **appear** and
  `homeIntroMotion` solves for the transform that puts it there:
  `x = (D - O)(1/s - 1) - W/2`, with `s = P/(P - z)`, computed at setup from
  the measured vanishing point and the plane's own `offsetWidth`. The stage
  carries no `zoom`, so layout px are screen px and the composition is exact
  at any viewport rather than only at the 1440 it was drawn on.
- **Depth then pays for itself three times, all of it physically correct
  rather than faked.** A far plane is authored large and projects small; the
  camera's lateral drift is multiplied by each plane's own `s`, so far planes
  parallax less than near ones for free; and the camera's z push grows the
  near layer ~21% against the far layer's ~13%, which is the difference
  between travelling *through* a field and zooming one. Per-plane `drift`
  adds authored motion on top, scaled up for the near layer, landing the
  screen travel at roughly 65px far, 110px mid, 195px near.
- **The camera is `preserve-3d`, so the browser depth-sorts the planes
  itself** — a plane coming forward passes in front of the field with no
  z-index bookkeeping. The array is still ordered back to front, which is both
  the paint order and a readable statement of the ladder.
- **Two planes pass the camera and leave.** RUMMAN's serum at 1.95s and
  SWIRLÉ at 2.60s creep forward on `power2.in`; both sit well off the
  vanishing point, so growth throws them out of frame rather than blowing them
  up in place. Both are gone before the collapse, so the field flows through
  rather than only accumulating — and the ten that remain are the ten that get
  absorbed.
- **The rhythm carries the momentum.** Entry intervals close from 0.28s to
  0.10s and wipes shorten from 1.05s to 0.52s, all irregular, so the field
  looks spontaneous and is choreographed to the frame. Each plane's drift is
  one linear tween spanning the whole field, so a plane is already travelling
  when it is uncovered — the field feels alive rather than assembled. The
  uncover is the case studies' own device: a `clipPath` inset unrolls the
  frame and its hairline off one edge (a different edge each time; DAMASCUS,
  the focal plane, opens from its own centre) while the artwork settles out of
  an over-scale behind it. No type, no captions, no titles.
- **The collapse is a vacuum, not a recession.** Every remaining plane is
  pulled bodily onto the vanishing point — `sink` is the transform that puts
  its centre exactly there, and the depth (`z -2600` on top of its own resting
  z, `scale 0.42`) carries it the rest of the way, so a plane arrives at the
  drain at about a fifth of its size with nothing left to see. The portfolio
  is not filed away into the distance; it is drawn into the one pixel the
  flower opens from. Ordered by distance from that point, **nearest first**,
  so the suction reads as a wave propagating outward. `power3.in` on all four
  channels: barely moving, then gone.
- **The vacuum is 0.70s end to end** (0.198s of stagger across ten planes plus
  a 0.50s pull), landing at 4.10 — after the clip's plate begins lighting at
  4.00 and before the ground clears at 4.20. So the flower is already coming
  up out of the point the field is disappearing into. **No cue belonging to
  the video moved**: `plate` 4.0, `clipReady` 3.95, `clip` 4.25, the veil,
  `ground` 4.2, `LEAD`, `COVER`, `DISSOLVE_AT` and `HERO_AT` are all
  untouched, as are Hero motion, layout, type, colour and every other section.
- **Three DOM levels per plane**, so every transform channel has exactly one
  owner and the four movements never fight: `plane` owns x/y (the perspective
  solve, then the drift, then the vacuum's pull), z (arrival, then a pass for
  two of them, then the vacuum), scale (vacuum only) and autoAlpha; `frame`
  owns clipPath and nothing else ever writes it; `art` owns scale. Transform,
  opacity and clip-path only — no filters, no blur, no layout properties.
- **The tone ladder is graded on the result, not the multiplier**, because the
  twelve artworks are nowhere near equally bright: the white sheets (STILL
  HUMAN, SECOND LIFE, DR ABOU SHAHIN) take far more plum wash than their rung
  asks for, the already-dark ones (the crate, AQARATI) take less, and DAMASCUS
  takes almost none because it is the one artwork already living in the site's
  own colour — which is why it is the focal plane.
- **`heroMotion` was changed in two places only**: the entrance timeline is
  built `paused` when `introWillRun()`, and a gate is armed that starts it. The
  choreography is untouched — only its clock starts later. The one deliberate
  difference is the 0.2s route-wipe delay, which is dropped when the intro is
  driving because there is no wipe to clear.
- **Preload is prioritised, never a spinner.** The clip ships
  `preload="metadata"` and is promoted to `auto` once the plane covers have
  landed (backstop at 0.8s), because the covers are wanted at 0.3s and the clip
  at 4.25s. Two gates hold the shot — on the covers (ceiling 2.5s) and on the
  clip being playable (ceiling 3.5s) — and both sit at cues where the stage is
  indistinguishable from the finished page, so waiting is invisible. Seeking to
  the playback window on `loadedmetadata` warms the decoder, so `play()` on the
  cue is immediate.
- **Reduced motion is the absence of the intro, not a shorter one.**
  `introWillRun()` is false, `IntroStage` and `IntroTulipPlate` render `null`,
  `heroMotion` never gates, and (as before) `useMotionScope` skips every scope,
  so the fold is simply entered. Flipping the setting mid-intro tears it down
  and hands the fold over. The intro is also skipped on a deep link, a restored
  scroll position, and every visit after the first.
- **Refusable, and one code path for all three ways out.** A click anywhere, a
  SKIP control bottom-right, or Escape / Enter / Space / the scroll keys — and
  the same `skip()` handles a blocked autoplay and a failed file, so the
  graceful degradation is the code the button exercises. `HERO_CEILING` (14s)
  is the last failsafe: if the opening never hands over at all, the fold opens
  on its own.
- **No layout shift and no scroll hijacking.** Lenis is stopped for the
  opening's duration and handed back at the end; there is deliberately **no**
  `overflow: hidden`, which would take the scrollbar out and move the page the
  opening is opening. Nothing is scrubbed, nothing is pinned, no wheel handler
  was added. No new package, no WebGL, no new asset — the five covers come
  from `projectCovers.ts` and the clip is the file already in the repo.
- **The clip lives at `src/assets/images/intro/tulip-opening.mp4`**, not the
  `src/assets/hero-intro/` path the task named. 1244x1660, 24fps, 5.04s,
  8.7MB, h264 with an unused AAC track (muted).
- Not verified by render: no headless browser here, so the composition and the
  depth values are measured reasoning, not a pixel diff.

## Home hero bloom is live media (`src/components/HeroTulipMedia.tsx`)
- The fold's tulip is now `tulip-opening.mp4`, not `tulip.png`. Only the media
  changed: the component's **root** carries `data-motion="tulip"` and the
  still's own positioning classes, so `heroMotion` finds the same element in
  the same box and every channel it owns (entrance from z -150, scroll
  parallax, pointer lean, idle breath, exit to z +118) is untouched.
- **The box is pinned, not inferred.** `tulip.png` is 1086 x 1448 — exactly
  3:4 — so `w-[610px]` resolved to 813.333px tall. The root states that height
  literally, so the box is identical at every `--page-zoom` breakpoint and
  under `--tulip-shift` / `--hero-lift`, with no layout shift whether the file
  arrives early, late or never.
- **The still is the fallback, not a base layer** (superseded below, in
  *Hero tulip: the clip is the only visible media*). `HeroTulip` renders unchanged
  underneath and is what is painted until the clip has decoded the frame it was
  asked for; the clip then fades over it in 420ms. Subject registration between
  the two is within 0.2% of the frame in both axes, so what crosses is the
  light, not the picture. A refused autoplay, a failed file or reduced motion
  therefore degrade to exactly the previous hero.
- **No new stage: the hero clip shadows the opening's plate.** On the intro
  path it is started by the same `armHeroGate` release the hero entrance waits
  on, seeked to the plate's own `currentTime` — so the plate's existing
  dissolve at `DISSOLVE_AT` crosses two identical frames of the same file, and
  the opening resolves straight into the live hero. `homeIntroMotion`,
  `IntroTulipPlate`, `introGate` and `heroMotion` are all unchanged.
- **Off the intro path** (return visit, deep link, restored scroll) it starts at
  **t = 2.0s**. The file opens on a near-white ground — sampled border luma
  247 / 225 / 158 / 48 / 11 at 0 / 0.55 / 1.0 / 1.5 / 2.0s against the
  backdrop's ~17 — which the opening hides behind its fitted veil. The hero has
  no veil, so it joins the clip where the ground has already arrived.
- Plays **once and holds its last frame** (no loop): after the ground settles
  the motion is a slow, subtle opening and a loop would announce itself at the
  cut. An `IntersectionObserver` pauses it offscreen and resumes it back.
  `preload="metadata"`, promoted to `auto` at 1.2s — after the plate's own
  0.8s promotion, so the intro's covers keep their bandwidth lead.
- `Work.tsx` still uses `HeroTulip` directly and is untouched.
- Not verified by render: no headless browser here. Confirm the 420ms crossfade
  is invisible under the plate, and that the clip's masked ground does not read
  as a rectangle in the resting fold.

## Home intro + hero polish pass
- **AQARATI and DR. MOUHAMMAD ABOU SHAHIN are now the field's two subjects**,
  not two of twelve peers. They are the only *interfaces* in the portfolio and
  this is a UI/UX opening, so they are authored as the pair a case study would
  show: the desktop portal (`w-46%`, 2/1, near z -110) low and left at
  34% / 62%, the clinic app (`w-22%`, 8/17, near z -55) standing in front of it
  at 60% / 46%. Both arrive from ~500 further back, take roughly twice the
  wipe (1.30 / 1.18), settle for 1.55 / 1.45s and drift about a third as far
  as the field does — the camera passes them rather than the reverse. Wash
  drops to 0.14 / 0.16 against the field's 0.30-0.60, because a screen graded
  into the plum is a texture and not a screen. Both are all but uncropped by
  `object-cover`: 1280x631 in 2/1 and 864x1821 in 8/17 are their own ratios to
  within ~1%.
- **DAMASCUS and WAHJ moved back to the mid layer** (z -90 -> -300, -40 ->
  -260, with wash 0.12 -> 0.30 and 0.24 -> 0.36) because they used to sit in
  front of both subjects. Nothing else in the field changed; all twelve planes,
  both camera passes and the vacuum are as they were. Entry order is now
  0.22 / 0.50 / 0.72 / 0.86 / **0.98 aqarati** / 1.10 / 1.24 / 1.56 /
  **1.66 dr-abou** / 1.78 / 1.90 / 2.18, and the last settle lands at 3.11,
  still clear of `FIELD_END` 3.40.
- **The hero copy no longer waits for the bloom.** `HERO_AT` was
  `DISSOLVE_AT - 0.62` (7.67s) — the fold opened once the flower had
  essentially finished, so the headline read as a second event. It is now
  `CUE.clip + 0.15` (4.40s), a beat *into* the clip and while the plum ground
  is still clearing, so the headline slides out of its masks and the subtitle
  and buttons land at ~5.03 / 5.11 with the bloom still opening behind them.
  **No video cue moved**: `plate` 4.0, `clip` 4.25, the veil, `ground` 4.2,
  `LEAD` and `DISSOLVE_AT` 8.29 are all untouched, and `heroMotion`'s own
  choreography is byte-identical — only its clock starts earlier.
- **The hero clip is masked to the bloom, so there is no plate.** The clip's
  ground is not uniform: sampled as an 8x10 luma grid on its last frame against
  the fold's ~17-25, the top and left borders sit at 10 (below the backdrop, so
  they vanish into it) but the bottom band and right column carry a lit studio
  floor at 45-58 — which is what read as a rectangle. A symmetric feather
  cannot fix that, because the bloom touches the top edge and the floor touches
  only two. The mask is now **one ellipse pinned to the bloom's own centroid**
  (`radial-gradient(70% 56% at 45% 29%, ...)`): solid across the flower head
  and stem, half strength through the leaves, gone before either hot band. The
  live clip supplies only the part of the picture that moves; the still
  underneath — a clean transparent cut-out with no ground at all — owns the
  rest, and the two register to within 0.2%. One mask layer, so no
  `mask-composite` to get wrong in any engine. The mp4 was not edited and no
  blend mode is used, so the colours are exactly as before.
- **The clip now joins the file on the plate's clock, not the fold's.** Because
  the fold is released at 4.40 the plate is still on its bright frames then, so
  `HeroTulipMedia` waits (one rAF poll, 2.6s failsafe) until the plate reaches
  `HOLD_FROM` = 2.0s and starts there. The two then run frame-locked to the end
  and the plate's dissolve crosses two identical pictures. A skipped, stalled
  or failed plate falls straight through to `HOLD_FROM`.
- **After the bloom, the tulip is `heroMotion`'s alone.** The clip does not
  loop; it holds its last frame and the idle drift, breath, pointer depth and
  scroll exit carry it from there, exactly as they did the `<img>`. Reduced
  motion is unchanged on every point above: no stage, no planes, no clip, the
  still fold.
- Not verified by render: no headless browser here. The plane geometry above is
  solved arithmetic (`s = 1800/(1800-z)` against the 1440x1088 canvas), not a
  pixel diff.

## Hero tulip: the ground is replaced, not faded
- **The clip's ground is now the fold's own backdrop.** A mask alone could only
  fade the difference out: the clip's plum sits ~10 luma **under** the page
  (measured behind this box — rgb(23,13,37) top-left, rgb(26,14,42) centre,
  rgb(12,7,19) bottom-right), so wherever the mask was opaque the deficit was
  fully present. That is what read as black around the flower and as a plate at
  the edges. Three layers replace it instead:
  - **`VEIL`** — the fold's own `radial-gradient(70% 60% at 66% 34%, #26123A,
    #150C22 45%, #0C0713)` re-projected into the box's coordinates
    (`165% 80% at 30% 27%`, solved from the box being 610 x 813 at right 62 /
    top 147 on the 1440 x 1088 canvas), painted **under** the clip.
  - **the clip, `mix-blend-mode: lighten`** over it — per channel the brighter
    of the two. Every pixel darker than the page becomes the page exactly;
    every pixel brighter stays the photograph, so the flower's colour is
    untouched and the composite is *the page plus the flower's light*. It can
    never be darker than the page, so a dark plate is arithmetically excluded.
    Blending works because veil and clip are siblings inside the masked group —
    `heroMotion`'s transform isolates the box, so a blend reaching for the page
    would have found nothing, but one reaching for a sibling is fine.
  - **`SHAPE`** — five long-feathered ellipses (head, stem, both leaves, base)
    fitted to the envelope the subject sweeps across the clip, sampled at
    2.0 / 2.6 / 3.2 / 3.8 / 4.4 / 5.0s: every pixel the flower is brighter than
    the page at any of them. Generous, not tight — with the veil underneath the
    mask only has to keep the veil near the flower, so nothing is clipped.
  - **`EDGE`** — bottom 13% and right 10%, plus a hairline at top and left. The
    lit studio floor is *brighter* than the page, so `lighten` keeps it and only
    a mask removes it; the leaf bases fade into the page with it.
- The two masks are **nested** (edge outside, shape inside) rather than
  intersected in one layer list, so the shape stays a plain union and no engine
  has to agree about `mask-composite`.
- **What the earlier passes got wrong.** The single bloom-centred ellipse cut
  the stem and both leaves once the still stopped filling the periphery; the
  four-ellipse union that replaced it still dimmed the left petal tip, the left
  leaf tip and most of the right leaf (verified by marking every pixel where the
  clip is 25 luma over the page and the mask is under 0.6). Neither could do
  anything about the ~10 luma deficit itself, which is what the veil is for.
- Verified by compositing real frames over the fold's reconstructed backdrop at
  the box's real 610 x 813 at 2.0 / 3.2 / 4.4 / 5.0s: no rectangle, no black,
  no clipped petal or leaf, nothing cut but the floor band.
- Unchanged: the mp4, `tulip.png` as the fallback and its crossfade, the box,
  `data-motion="tulip"`, every `heroMotion` channel, the plate-clock sync,
  play-once-and-hold, the offscreen pause, the intro and every other section.
- Not verified by render: no headless browser here, and the veil is matched to
  the backdrop on the 1440 x 1088 reference canvas. At other viewport heights,
  and while `heroMotion` moves the box, the veil drifts a few RGB units off the
  page behind it — a slow gradient mismatch inside a feathered mask, never an
  edge, but it is the thing to look at first if the box ever reads as a tint.

## Needs visual check (Home cinematic intro)
- **The field at 1440x1088.** The composition was authored as a coverage map
  (78.7% covered, 16.6% overlapping, six planes edge-cropped) and has never
  been seen. Watch for plates that read as tiling rather than overlapping in
  depth — that is the failure mode.
- **The perspective solve.** Every plane's on-screen position depends on
  `offsetWidth` and the measured vanishing point being read correctly at
  setup. If a plane lands somewhere other than its authored `left`/`top`, the
  solve is the first suspect. It is not recomputed on resize, so a mid-intro
  resize will shift the composition.
- **The two camera passes** (RUMMAN serum at 1.95s, SWIRLE at 2.60s). Confirm
  each really exits the frame rather than stalling large in the middle, and
  that the browser's own depth sort puts them in front of the field.
- **The vacuum.** This is the beat the whole stage is built for: confirm the
  ten planes converge on the bloom point rather than merely receding, that
  0.70s reads as elegant rather than abrupt, and that the nearest-first
  ordering reads as a wave rather than as a stagger.
- **The seam into the clip.** The vacuum lands at 4.10 and the plate begins
  lighting at 4.00, so the two overlap by design. Confirm the flower appears
  to come up out of the point the field vanished into.
- **The tone ladder** across twelve mixed artworks: confirm the white sheets
  sit back from DAMASCUS rather than glaring, and that the far layer at rest
  0.50-0.60 still reads as artwork rather than as smudges.
- **60fps.** Twelve planes on one perspective, all transform/opacity/clip-path,
  but this is the heaviest moment on the site — worth a profile, especially
  during the vacuum when all ten are moving at once.
- Short-viewport breakpoints (`--page-zoom` 0.93 / 0.87 / 0.8 / 0.73): the
  field is in true viewport pixels while the vanishing point is read off a
  zoomed element — confirm the collapse still converges on the bloom there.
- The SKIP control's position (bottom-right, outside the zoom) against the
  scroll indicator's slot, which is inside it.

- /about built against `about-reference.png` on the 1440 x 1088 canvas:
  eyebrow + rule, 80px display headline, serif lede with purple-light
  highlights, the tulip/ring/dotted-guide group holding the right half with
  the pull quote and signature inside it, and the three-card band
  (WHAT I DO / 3 YEARS / WHAT I USE) with side rails. Route wired at
  `/about`; the navbar ABOUT link is live. Motion is `src/pages/aboutMotion.ts`
  — one entrance on the shared BEAT grid, the /work pointer-lean + idle drift
  on the decorative group, and a card lift. No new packages or assets.

## /contact (built)
- `src/pages/Contact.tsx` + `src/pages/contactMotion.ts`, wired at `/contact` in
  `App.tsx`; the navbar CONTACT link is no longer inert.
- Authored against `contact-reference.png` in literal reference pixels on the
  same 1440 x 1088 canvas as `/about`: left statement (CONTACT ME eyebrow +
  rule, two-line Anton headline, EB Garamond lede), a 568px detail stack
  (email / phone / WhatsApp rows split by hairlines, then a LANGUAGES +
  AVAILABILITY band), and a 632px message panel at left 726 / top 517.
- Decorative group reuses `HeroTulip` and `PlusMark` under one shared camera
  (`data-motion="contact-scene"`), plus two dotted CSS fields.
- The reference has no footer, so the page has none.
- Form is controlled React state, labels are `sr-only`, `required` on name /
  email / message. No backend exists, so submit composes a `mailto:` to
  almuallemyumna@gmail.com rather than pretending to send.
- Motion is the `/about` grammar, quieter: one BEAT-grid entrance (eyebrow,
  rule, headline lines, lede, tulip/ring/marks out of depth, panel, hairlines,
  rows, fields, then the send button) plus the shared pointer-lean + idle-drift
  ticker. Buttons and links respond via CSS transitions only. No new packages.
- Known deviation (same as Home): Anton is far less condensed than the
  reference display face, so the headline is set at 80px to keep the two lines
  inside the 96 -> ~756 column and clear of the ring, which makes its caps
  shorter than the reference's.
- Not verified by render: no headless browser in this project, so the geometry
  is measured off the reference, not pixel-diffed.

## /contact refinement pass (single-screen composition)
- Root cause of the drift from the reference: the statement block sat in flow
  *after* `<Navbar />` (50px tall), so its offsets were navbar-relative while
  the detail stack and the form panel were wrapper-relative. Everything above
  the fold rendered ~50px low against the panel. The statement is now
  `absolute inset-x-0 top-0` like the other two, so the whole page reads off
  one origin: page y = 28 (`main`'s pt) + the authored offset.
- Tulip + ring regrouped on the reference: ring 572px at left 757 / page-top
  114 (its centre 1043 / 400 — it clears the navbar and runs on behind the
  panel), tulip 382 x 510 at left 812 / page-top 80. The tulip now carries the
  source PNG's own 0.75 ratio, so `object-contain` no longer letterboxed it to
  315px wide; the stem runs on under the panel exactly as in the reference
  instead of the bloom being shrunk to fit above it. Camera origin moved to
  `1043px 372px` to stay on the ring's centre.
- Panel moved up and resized to the reference: left 730 / page-top 517 /
  w 628, pt 46, field gaps 22px (was 16), so it measures 505px tall and ends
  at page y 1022 with the reference's 64px of air under it.
- Detail stack re-rhythmed: top 481 (page 509), w 567, row heights 108 / 117 /
  142 / 112 so the three hairlines land on the reference's 617 / 735 / 878.
  Badges are 64px on the top three rows and 52px on the bottom band. The
  WhatsApp row hangs from its top (`items-start pt-20`) rather than centring,
  because the reference levels its badge with the label, not with the pill.
- LANGUAGES / AVAILABILITY now share one top edge, one 52px badge and one 26px
  gap, with the second half starting on the reference's 458px column, so the
  two labels sit on the same line.
- Headline leading 1.05 -> 1.12 with -0.01em tracking: the two lines land on
  the reference's y and the block stays clear of the ring. The Anton cap-height
  deviation noted above is unchanged.
- Copy, colours, typography, form behaviour and all motion are untouched.

## Navbar: `variant` prop (About + Contact only)
- `Navbar` now takes `variant?: 'flow' | 'fixed'`, default `'flow'`. `'flow'` is
  the original markup byte for byte, so Home, `/work` and the case studies are
  untouched.
- `'fixed'` wraps the same bar in `position: fixed; inset-x-0; top-0` with
  `pt-[28px]`, so at rest it lands on exactly the pixel the flow version did
  and then stays there while the page scrolls under it. It sits on `Z.nav`
  (30) — above every page layer, still under the `PageTransition` wipe (50).
- A 50px `aria-hidden` spacer is rendered where the bar used to be, so lifting
  it out of the flow costs no layout shift. This matters on `/about`, whose
  hero band is a flow sibling of the navbar; on `/contact` everything is
  absolute so it is a no-op either way.
- Readability layer: `bg-bg/60` + `backdrop-blur-[14px]`, masked to fade out
  over its bottom 42% so there is no hard edge at rest.
- CTA clipping fix: the fixed shell centres a `w-full max-w-[1440px]` track
  instead of the pages' hard `w-[1440px]`, so under 1440px the bar shrinks with
  the viewport rather than running off the edge of the pages' 1440px
  min-width (which `body { overflow-x: hidden }` was cutting). Right padding
  goes 23px -> 34px in this variant only, which balances it against the logo's
  50px left inset. Height, logo, links, gaps and CTA alignment are otherwise
  identical, and identical between the two pages.
- `/about` and `/contact` pass `variant="fixed"`. No typography, colour, copy,
  route or motion changes.

## Navbar CTA: Home is the source of truth (About + Contact)
- The `fixed` variant no longer overrides anything on the `<header>`: the bar
  is now one shared element with no per-variant class, so LET'S TALK has Home's
  width, height, `px-[22px]`, `rounded-full`, `text-[20px]`, `h-[50px]` and
  `items-center` alignment on every page by construction, not by matching.
- Horizontal position: the fixed shell's inner wrapper is full-bleed like
  Home's bar instead of a centred `max-w-[1440px]` track, so the CTA ends
  `pr-[23px]` from the viewport edge exactly as on Home. The wrapper carries
  `pl-[max(0px,calc((100%-1440px)/2))]` — the same left inset the 1440 track
  used to give it — so the logo does not move at any viewport width.
- Net effect vs the previous pass: the CTA moves right by 11px at/below 1440px
  wide, and by `(vw-1440)/2 + 11` above it (e.g. ~251px at 1920), because Home
  puts its CTA on the viewport edge rather than on the 1440 content track. It
  still cannot be clipped, since the bar spans the viewport rather than the
  pages' 1440px min-width.
- Sticky behaviour, backdrop, spacer, `Z.nav` and motion are unchanged.

## Navbar CTA: 115px right inset on the fixed variant
- The fixed shell's wrapper gained `pr-[115px]`, so the bar's right edge — and
  with it the nav group and LET'S TALK — sits 115px in from the viewport edge.
  The `<header>`'s own `pr-[23px]` still applies inside that, putting the CTA
  138px off the edge.
- The nav group and the CTA move together, keeping their 47px gap; the CTA's
  own box (size, height, padding, radius, border, font) and the logo's position
  are untouched, as is the sticky behaviour.
- Fixed variant only. Home, /work and the case studies render the bar directly
  and are unchanged.
- This supersedes the "CTA sits on the viewport edge exactly like Home" note
  above: Home's own geometry put the button too far right in practice, so the
  fixed variant deliberately insets it instead.
