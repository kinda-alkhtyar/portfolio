import { BEAT, DUR, EASE, ROLE, STAGGER, gsap, hasFinePointer, parallax } from '../motion'
import { HERO_CEILING, armHeroGate, introWillRun } from './introGate'

/**
 * Home hero — one cinematic scene.
 *
 * The fold is treated as a shot rather than a list of reveals: a single camera
 * (one shared `perspective` on the decorative track), four layers sitting at
 * different depths in front of it, and three movements that own strictly
 * separate transform channels so they can all run at once without fighting.
 *
 *   entrance   autoAlpha, scale / scaleY, yPercent (headline), z
 *   parallax   yPercent (tulip, ring, guide)
 *   live       x, y, rotationX, rotationY, scale (bloom) — one ticker writing
 *              camera drift + per-layer idle + the pointer spring as a sum
 *   exit       z, scale / scaleY, xPercent / yPercent (marks)
 *
 * The camera is the stage element's own `x` / `y`, which nothing else touches,
 * so the group floats as one body underneath the four layers living inside it.
 *
 * `z` is the one channel two movements share, and they share it in sequence:
 * the entrance flies each layer in from depth to exactly z 0, and the exit is
 * not created until the entrance has finished writing it (see `buildExit`).
 * That is also why the composition is pixel-identical to the reference at
 * rest — every layer settles at z 0, scale 1, no rotation, so the shared
 * perspective changes nothing about the geometry that was measured.
 *
 * Written for `useMotionScope`, which runs it before paint, skips it entirely
 * under reduced motion, and reverts the whole context on unmount. The returned
 * cleanup detaches the pointer listeners, the scroll triggers and the exit.
 */

/* ── the camera ────────────────────────────────────────────────────── */

const SCENE = {
  /** Long lens. Short enough to read as depth, long enough to never skew. */
  perspective: '1400px',
  /**
   * The vanishing point sits on the backdrop ring's centre — 319px in from the
   * right of the 1440 track, 487px down, riding `--hero-lift` with the rest of
   * the group — rather than on the middle of the viewport. The four layers then
   * foreshorten toward the bloom, which is what makes them read as one scene
   * shot from one camera instead of four elements that happen to have depth.
   */
  origin: 'calc(100% - 319px) calc(487px - var(--hero-lift))',
  /**
   * Same point, on the mirrored Arabic fold: the ring is taken from the left
   * of the track there, so its centre is a plain 319px in. Only the anchor
   * moves — the lens, the depths and every tween below are untouched.
   */
  originRtl: '319px calc(487px - var(--hero-lift))',
} as const

/**
 * How far behind the camera each layer starts. The order is the composition's
 * depth order, not decoration: the guide is furthest out, the ring behind the
 * bloom, the bloom nearest, the marks between.
 */
const ARRIVE = {
  /** Per headline line, so the three do not arrive on one flat plane. */
  line: [-64, -104, -46],
  tulip: -150,
  ring: -230,
  guide: -300,
  mark: -170,
} as const

/**
 * The first of the page's three bloom settles, and the longest. Belief takes
 * 1.45s and the CTA 1.25s, so the same gesture quietens each time it returns
 * instead of reading as the same trick played three times.
 */
const SETTLE = 1.7

/* ── the live scene ────────────────────────────────────────────────── */

/**
 * Max px of lean and max degrees of tilt per layer. One depth ladder: the
 * bloom is closest to camera and answers most, the ring sits behind it, the
 * guide is deepest and barely moves. The rotations are deliberately under a
 * degree and a half — past that a hairline circle and a 1px rule start to
 * shimmer, and the scene stops reading as restrained.
 */
const DEPTH = {
  tulip: { lean: 18, rotX: 0.85, rotY: 1.15 },
  mark: { lean: 14, rotX: 0.6, rotY: 0.9 },
  ring: { lean: 10, rotX: 0.5, rotY: 0.7 },
  guide: { lean: 6, rotX: 0, rotY: 0.4 },
} as const

/**
 * The idle life of the scene, in the same units as `DEPTH` — roughly a fifth
 * of the pointer's authority, so the hand always outranks the breathing.
 *
 * `rate` is the layer's own clock: the bloom lives fastest, the marks a little
 * behind it, the ring slower, the dashed guide slowest of all. That is the
 * depth ladder expressed as time rather than distance, and it is what keeps
 * the four layers from ever drifting as one block.
 *
 * `breath` is the bloom's scale. 0.35% — under a pixel and a half on a 610px
 * image, which is the point: it should be felt as the image being alive, never
 * seen as a zoom.
 */
const IDLE = {
  tulip: { x: 3.6, y: 4.6, rotX: 0.26, rotY: 0.32, breath: 0.0035, rate: 1 },
  mark: { x: 2.6, y: 3.2, rotX: 0.2, rotY: 0.26, breath: 0, rate: 0.83 },
  ring: { x: 1.8, y: 2.3, rotX: 0.12, rotY: 0.16, breath: 0, rate: 0.61 },
  guide: { x: 1, y: 1.4, rotX: 0, rotY: 0.09, breath: 0, rate: 0.44 },
} as const

/**
 * Base angular speeds in radians per second, one per channel, deliberately
 * unrelated to each other. Periods land between roughly 14s and 30s.
 */
const IDLE_HZ = { x: 0.36, y: 0.29, rotX: 0.23, rotY: 0.31, breath: 0.19 } as const

/**
 * The second harmonic sits at the golden ratio of the first, so the two never
 * come back into phase and the drift has no period a viewer can learn. This is
 * why the motion is quasi-periodic rather than random: it is fully
 * deterministic, so it can never jitter, but it never repeats either.
 */
const IDLE_HARMONIC = 1.618
const IDLE_MIX = 0.62

/** Seconds the idle takes to fade up, so the entrance lands on its mark. */
const IDLE_RAMP = 2.4
/** Seconds after the entrance before the bloom starts breathing. */
const BREATH_RAMP = 1.6

/**
 * The camera itself.
 *
 * A single drift applied to the whole decorative stage, so the group floats as
 * one rigid body while the layers inside it live at their own rates. That is
 * the difference between a scene shot on a hand-held camera and a set of
 * elements that each happen to move: a camera translates everything together.
 *
 * Periods are around 100s and 130s, an order of magnitude slower than any
 * layer's own drift, and the amplitude is under two pixels — at that speed it
 * is never seen as movement, only felt as the frame not being nailed down.
 * The headline sits outside this stage and is not touched.
 */
const CAMERA = { x: 1.6, y: 1.2, hzX: 0.061, hzY: 0.047 } as const

/**
 * The pointer follow, as a damped spring rather than a lerp — because the
 * quality being chased here is *inertia*, and a lerp has none: it responds
 * identically to a slow deliberate move and a flick.
 *
 * Both ends of the spring are graded by how fast the hand is actually moving:
 *
 *   calm  tight and critically damped — the scene tracks a slow, considered
 *         movement precisely, with no overrun at all
 *   fast  looser and just under critical — the scene falls behind a flick,
 *         runs a little past the mark once, and settles
 *
 * `zetaFast` is 0.9, which is one small overrun and done. Anything under ~0.7
 * starts to visibly oscillate, which would read as a game, not a camera.
 */
const POINTER = {
  /** Natural frequency in rad/s. Lower = more lag. */
  omegaCalm: 5.2,
  omegaFast: 3.8,
  /** Damping ratio. 1 never overshoots; 0.9 overruns once. */
  zetaCalm: 1.02,
  zetaFast: 0.9,
  /** Normalised units/sec at which the fast end is fully reached. */
  speedFull: 3.2,
  /** Per-frame smoothing of the measured hand speed, at 60fps. */
  speedLerp: 0.12,
  /** Once the hand has been still this long, its authority eases back to 0. */
  rest: 0.9,
  /** Per-frame decay of that authority once at rest, at 60fps. */
  decay: 0.988,
} as const

/**
 * Focus choreography.
 *
 * A continuous 0..1 reading of how close the hand is to the bloom, used to
 * shift authority *between* layers rather than to add a new effect: as the
 * pointer approaches, the bloom takes on a little more presence and the
 * precision layer around it gives up a little of its own motion. The scene
 * does not gain energy, it redistributes it — which is why it reads as
 * attention rather than as a hover state.
 *
 * Nothing here touches opacity, so nothing becomes harder to read.
 */
const FOCUS = {
  /** Distance band, as a fraction of the ring's radius. */
  inner: 0.55,
  outer: 1.15,
  /** Per-frame approach of the smoothed value, at 60fps. ~0.6s to settle. */
  lerp: 0.045,
  /** Extra scale the bloom carries at full focus. 0.8%, ~5px of 610. */
  present: 0.008,
  /** Extra motion authority the bloom carries at full focus. */
  gain: 0.3,
  /** How much of their own motion the other layers give up at full focus. */
  quiet: 0.55,
  /** Schmitt trigger for the cursor's bloom state — no flicker at the edge. */
  cursorOn: 0.55,
  cursorOff: 0.32,
} as const

/** The bloom drifts this much of its own height across the fold. */
const SCROLL_DRIFT = { tulip: 7, ring: 4.5, guide: 3 }

/* ── the exit ──────────────────────────────────────────────────────── */

/**
 * The handoff into Selected Work. Every value is a depth move, so the fold
 * dissolves as a camera move rather than as a fade: the text plane falls back,
 * the bloom comes forward past it, the ring opens out as it recedes, the guide
 * compresses away and the marks scatter off the vanishing point.
 *
 * Nothing pins, nothing touches the scroll position, and the whole thing is
 * spent inside the first 0.9 of a screen — Selected Work is already on stage
 * and already drifting while the hero is still leaving.
 */
const EXIT = {
  /** Fraction of a viewport the handoff is spread over. */
  range: 0.9,
  scrub: 0.8,
  text: { z: -100, scale: 0.99 },
  tulip: { z: 118 },
  ring: { z: -70, scale: 1.11 },
  guide: { z: -150, scaleY: 0.74 },
  mark: { z: -110 },
} as const

/** Where each layer starts inside the 0..1 handoff. Layered, never a cut. */
const EXIT_AT = { tulip: 0, ring: 0.05, text: 0.09, guide: 0.13, mark: 0.17 } as const

/**
 * The tension in the handoff.
 *
 * A scrubbed tween on a linear ease leaves at exactly the rate the wheel turns,
 * which is why most depth exits feel mechanical: the scene is a direct readout
 * of the scrollbar. These are in-out curves instead, so the first stretch of
 * scroll barely moves the layer — the fold resists, and the reader feels it
 * hold — and then it releases through the middle and lands soft.
 *
 * Graded by how much each layer should resist. The text plane holds longest,
 * because it is the thing still being read; the marks hold least, because they
 * are the detail that signals the release has happened.
 *
 * No scroll is intercepted and nothing is pinned — the whole effect is the
 * shape of four curves.
 */
const EXIT_EASE = {
  tulip: 'power2.inOut',
  ring: EASE.silk,
  text: 'power3.inOut',
  guide: EASE.silk,
  mark: 'power1.inOut',
} as const

/**
 * The two plus marks scatter off the ring's centre along the diagonal they
 * already sit on — the upper-left one up and out, the lower-right one down and
 * out. Percentages of their own tiny glyph box, so this is ~25px of drift.
 */
const MARK_SCATTER = [
  { xPercent: -230, yPercent: -150 },
  { xPercent: 230, yPercent: 90 },
] as const

/** Radius around the bloom that switches the cursor to its bloom state. */
const BLOOM_REACH = 0.52
/** Do not re-measure the bloom more often than this while tracking, in ms. */
const BLOOM_REMEASURE = 250

export function heroMotion({ scope, q }: { scope: HTMLElement; q: (selector: string) => HTMLElement[] }) {
  const scene = q('[data-motion="hero-scene"]')
  const text = q('[data-motion="hero-text"]')
  const eyebrow = q('[data-motion="hero-eyebrow"]')
  const lines = q('[data-motion="hero-line"]')
  const subtitle = q('[data-motion="hero-subtitle"]')
  const cta = q('[data-motion="hero-cta"]')
  const tulip = q('[data-motion="tulip"]')
  const ring = q('[data-motion="ring"]')
  const guide = q('[data-motion="guide"]')
  const marks = q('[data-motion="mark"]')
  const quote = q('[data-motion="quote-part"]')
  const hint = q('[data-motion="scroll-hint"]')

  /* ── initial states ──────────────────────────────────────────────
     Set inside the scope's layout effect, so they land before the first
     paint and nothing is ever seen in its finished position first. */
  // Written straight to the style, not through GSAP: `perspective-origin`
  // carries `calc()` and a custom property, which GSAP would try to read as an
  // interpolatable pair of numbers. It is restored in the cleanup below.
  const rtl = document.documentElement.dir === 'rtl'

  scene.forEach((el) => {
    el.style.perspective = SCENE.perspective
    el.style.perspectiveOrigin = rtl ? SCENE.originRtl : SCENE.origin
  })

  gsap.set(eyebrow, { autoAlpha: 0, y: 16 })
  // The origin sits on the gutter the lines are set against — left in English,
  // right in Arabic — so the lines grow away from it and arriving from depth
  // never nudges the headline off its content column.
  lines.forEach((line, index) => {
    gsap.set(line, {
      yPercent: 108,
      z: ARRIVE.line[index % ARRIVE.line.length],
      transformPerspective: 1200,
      transformOrigin: rtl ? '100% 50%' : '0% 50%',
    })
  })
  gsap.set(tulip, { autoAlpha: 0, scale: 0.975, z: ARRIVE.tulip, transformOrigin: '50% 62%' })
  gsap.set(ring, { autoAlpha: 0, scale: 0.94, z: ARRIVE.ring })
  gsap.set(guide, { autoAlpha: 0, scaleY: 0, z: ARRIVE.guide, transformOrigin: '50% 0%' })
  gsap.set(marks, { autoAlpha: 0, scale: 0.7, z: ARRIVE.mark })
  gsap.set([...subtitle, ...cta], { autoAlpha: 0, y: 18 })
  gsap.set(quote, { autoAlpha: 0, y: 14 })
  gsap.set(hint, { autoAlpha: 0, y: 12 })

  /* ── entrance ───────────────────────────────────────────────────
     One coordinated scene on the page's beat grid. The delay clears the
     route wipe, so arriving from /work the hero reveals into view rather
     than behind the panel.

     When the cinematic opening is running it is the thing handing over, so
     there is no wipe to clear and the fold is simply held: the timeline is
     built exactly as it always was and started by `introGate` once the tulip
     clip has landed on this scene's own bloom. The choreography below is
     untouched — only its clock starts later. */
  const gated = introWillRun()
  const tl = gsap.timeline({
    delay: gated ? 0 : 0.2,
    paused: gated,
    defaults: { ease: ROLE.support },
  })

  tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.lead)
    // The headline is the anchor: slowest ease, longest travel, led by a
    // stagger small enough that the three lines still read as one block. Each
    // line closes its own z, so they settle onto the same plane from three
    // slightly different distances instead of arriving flat.
    .to(
      lines,
      { yPercent: 0, z: 0, duration: DUR.epic, ease: ROLE.subject, stagger: 0.085 },
      BEAT.subject,
    )
    // The bloom does not zoom in, it walks out of the depth of the scene and
    // settles: 150px of z and 2.5% of scale over 1.7s on the flattest ease.
    .to(
      tulip,
      { autoAlpha: 1, scale: 1, z: 0, duration: SETTLE, ease: ROLE.subject },
      BEAT.subject + BEAT.lead,
    )
    .to(subtitle, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.detail)
    .to(cta, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.base }, BEAT.detail + BEAT.lead)
    // The precision layer assembles around the bloom once the composition is
    // legible — ring first and slowest, then the guide drawing down, then the
    // marks closing onto their coordinates.
    .to(ring, { autoAlpha: 1, scale: 1, z: 0, duration: DUR.epic, ease: ROLE.subject }, BEAT.detail)
    .to(
      guide,
      { autoAlpha: 1, scaleY: 1, z: 0, duration: DUR.hero, ease: ROLE.structure },
      BEAT.support,
    )
    .to(
      marks,
      { autoAlpha: 1, scale: 1, z: 0, duration: DUR.base, stagger: STAGGER.loose },
      BEAT.close - BEAT.lead,
    )
    .to(quote, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose }, BEAT.close)
    .to(hint, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.close + BEAT.subject)

  /* ── scroll parallax ────────────────────────────────────────────
     Percentage-based and scrubbed with a little lag, so the decorative
     group trails the page instead of being glued to the scrollbar. */
  const range = { trigger: scope, start: 'top top', end: 'bottom top', scrub: 0.6 }
  const stopParallax = [
    parallax(tulip, { yPercent: SCROLL_DRIFT.tulip, ...range }),
    parallax(ring, { yPercent: SCROLL_DRIFT.ring, ...range }),
    parallax(guide, { yPercent: SCROLL_DRIFT.guide, ...range }),
  ]

  /* ── the exit ───────────────────────────────────────────────────
     Built only once the entrance has stopped writing `z`, `scale` and
     `scaleY`, so the two movements never own a channel at the same time.
     Each `to` therefore records the layer's settled rest value as its
     start, which is exactly the value the reference was measured at. */
  let exit: gsap.core.Timeline | null = null
  /** Flipped when the bloom's settle has stopped writing `scale`. */
  let breathOn = false

  const buildExit = () => {
    // The hero text sits outside the decorative stage, so it carries its own
    // camera. Established here rather than tweened — a perspective ramping up
    // from nothing distorts wildly at the bottom of its range — and only now,
    // so the headline is composited flat for the whole entrance. At rest the
    // matrix is the identity, so the type is not resampled.
    gsap.set(text, { transformPerspective: 1600, transformOrigin: rtl ? '100% 45%' : '0% 45%' })

    exit = gsap.timeline({
      defaults: { ease: 'none', duration: 1 - EXIT_AT.mark },
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * EXIT.range)}`,
        scrub: EXIT.scrub,
        invalidateOnRefresh: true,
      },
    })

    exit
      .to(tulip, { ...EXIT.tulip, ease: EXIT_EASE.tulip }, EXIT_AT.tulip)
      .to(ring, { ...EXIT.ring, ease: EXIT_EASE.ring }, EXIT_AT.ring)
      .to(text, { ...EXIT.text, ease: EXIT_EASE.text }, EXIT_AT.text)
      .to(guide, { ...EXIT.guide, ease: EXIT_EASE.guide }, EXIT_AT.guide)

    marks.forEach((mark, index) => {
      exit?.to(
        mark,
        { ...EXIT.mark, ...MARK_SCATTER[index % MARK_SCATTER.length], ease: EXIT_EASE.mark },
        EXIT_AT.mark,
      )
    })
  }

  tl.call(() => {
    buildExit()
    breathOn = true
  })

  /* ── the handoff from the opening ───────────────────────────────
     Armed only while the cinematic opening owns the fold. The ceiling is the
     failsafe: if the opening never hands over — it failed to mount, its clip
     errored, autoplay was refused, the tab was backgrounded through the whole
     thing — the fold still opens on its own rather than staying dark. */
  let stopGate = () => {}

  if (gated) {
    const ceiling = gsap.delayedCall(HERO_CEILING, () => tl.play())
    const disarm = armHeroGate(() => {
      ceiling.kill()
      tl.play()
    })
    stopGate = () => {
      ceiling.kill()
      disarm()
    }
  }

  /* ── the living scene ───────────────────────────────────────────
     One ticker owns `x` / `y` / `rotationX` / `rotationY` on every decorative
     layer, and writes the *sum* of two things:

       idle     a quasi-periodic drift, scaled by the layer's depth and run on
                the layer's own clock, so the four planes never travel together
       pointer  the hand's authority, smoothed toward its target and decayed
                back to nothing once the hand stops

     Summing rather than switching is the whole point: the pointer bends a
     scene that is already moving, and letting go returns the layer to the
     drift instead of to a dead stop. Nothing here is random — two sine waves
     at an irrational ratio cannot jitter and cannot repeat.

     `gsap.quickSetter` writes straight into GSAP's transform cache, so a frame
     costs four property writes per layer and no tween allocation at all. The
     channels stay disjoint from the entrance, the parallax and the exit, so
     the scene is alive while it arrives, while it rests and while it leaves.

     The headline is deliberately not a layer: display type this size has to
     stay still to stay crisp. */
  const layers = [
    ...tulip.map((el) => ({ el, depth: DEPTH.tulip, idle: IDLE.tulip, subject: true })),
    ...marks.map((el) => ({ el, depth: DEPTH.mark, idle: IDLE.mark, subject: false })),
    ...ring.map((el) => ({ el, depth: DEPTH.ring, idle: IDLE.ring, subject: false })),
    ...guide.map((el) => ({ el, depth: DEPTH.guide, idle: IDLE.guide, subject: false })),
  ].map(({ el, depth, idle, subject }, index) => ({
    depth,
    idle,
    subject,
    /** Offsets the layer's whole wave set, so no two cross zero together. */
    phase: index * 1.7,
    setX: gsap.quickSetter(el, 'x', 'px'),
    setY: gsap.quickSetter(el, 'y', 'px'),
    setRotX: gsap.quickSetter(el, 'rotationX', 'deg'),
    setRotY: gsap.quickSetter(el, 'rotationY', 'deg'),
    setScale: idle.breath > 0 ? gsap.quickSetter(el, 'scale') : null,
  }))

  // The camera rides the stage itself, so its drift is common to every layer.
  const [stage] = scene
  const cameraX = stage ? gsap.quickSetter(stage, 'x', 'px') : null
  const cameraY = stage ? gsap.quickSetter(stage, 'y', 'px') : null
  const lockArabicTulipX = document.documentElement.dir === 'rtl' && scope.closest('.home-page')
  const arabicPlate = lockArabicTulipX
    ? scope.querySelector<HTMLElement>('[data-motion="intro-plate"]')
    : null
  const setArabicPlateX = arabicPlate ? gsap.quickSetter(arabicPlate, 'x', 'px') : null

  /** Two sines at an irrational ratio. Range is exactly -1..1. */
  const wave = (t: number, hz: number, phase: number) =>
    Math.sin(t * hz + phase) * IDLE_MIX +
    Math.sin(t * hz * IDLE_HARMONIC + phase * 2.1) * (1 - IDLE_MIX)

  /** Hermite smoothstep. Used for every ramp here, so nothing ever launches. */
  const smooth = (value: number) => value * value * (3 - 2 * value)

  const pointer = {
    /** Target, -1..1 from the viewport centre. */
    tx: 0,
    ty: 0,
    /** Previous frame's target, for the speed reading. */
    px: 0,
    py: 0,
    /** The spring's position and velocity. */
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    /** Smoothed hand speed in normalised units/sec. */
    speed: 0,
    still: Number.POSITIVE_INFINITY,
  }

  /* Focus + the bloom cursor state.

     The bloom lives in the `pointer-events-none` backdrop underneath the
     full-width content wrapper, so it can never be hovered directly. Both its
     focus reading and its cursor state come from proximity to the ring
     instead: the zone's own `data-cursor` is toggled, then re-announced with a
     synthetic `pointerover` from whatever is genuinely under the cursor, so
     `CustomCursor`'s existing `closest()` lookup picks it up — and a real
     button or link still wins, because it is nearer in the tree.

     The ring is measured on a 250ms cadence rather than per frame, so the
     ticker never forces a synchronous layout at 60fps. */
  const [bloom] = ring
  const hand = { target: null as Element | null, x: 0, y: 0, inside: false }
  let reach = { x: 0, y: 0, r: 0 }
  let measuredAt = Number.NEGATIVE_INFINITY
  let focus = 0
  let bloomOn = false

  const measure = (now: number) => {
    if (!bloom || now - measuredAt < BLOOM_REMEASURE / 1000) return
    measuredAt = now
    const box = bloom.getBoundingClientRect()
    reach = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
      r: box.width * BLOOM_REACH,
    }
  }

  const setBloomCursor = (next: boolean) => {
    if (next === bloomOn) return
    bloomOn = next

    if (next) scope.setAttribute('data-cursor', 'bloom')
    else scope.removeAttribute('data-cursor')

    // Re-announce from the element genuinely under the cursor. `pointerover`
    // only fires when the pointer crosses into a new element, so without this
    // the cursor would not notice the attribute until the next boundary.
    const target = hand.target?.isConnected ? hand.target : scope
    target.dispatchEvent(
      new PointerEvent('pointerover', {
        bubbles: true,
        clientX: hand.x,
        clientY: hand.y,
        pointerType: 'mouse',
      }),
    )
  }

  let elapsed = 0
  let breath = 0

  const tick = (_time: number, deltaMs: number) => {
    // Clamped so a backgrounded tab does not resume with one enormous step —
    // and low enough to keep the spring's explicit integration stable.
    const dt = Math.min(deltaMs, 33) / 1000
    const ratio = gsap.ticker.deltaRatio(60)
    elapsed += dt

    /* ── the hand ──────────────────────────────────────────────── */

    // Speed is read off the target, not the spring, so it is the hand's own
    // pace rather than the scene's reaction to it.
    const step = Math.hypot(pointer.tx - pointer.px, pointer.ty - pointer.py)
    pointer.px = pointer.tx
    pointer.py = pointer.ty
    const instant = dt > 0 ? step / dt : 0
    pointer.speed += (instant - pointer.speed) * (1 - (1 - POINTER.speedLerp) ** ratio)

    // Hand at rest: its authority eases out rather than being dropped, so the
    // layer slides back into the drift instead of snapping to it.
    pointer.still += dt
    if (pointer.still > POINTER.rest) {
      const decay = POINTER.decay ** ratio
      pointer.tx *= decay
      pointer.ty *= decay
    }

    // Grade the spring by pace: a slow hand gets a tight, critically damped
    // follow; a flick gets a looser one that runs past the mark once.
    const pace = smooth(gsap.utils.clamp(0, 1, pointer.speed / POINTER.speedFull))
    const omega = POINTER.omegaCalm + (POINTER.omegaFast - POINTER.omegaCalm) * pace
    const zeta = POINTER.zetaCalm + (POINTER.zetaFast - POINTER.zetaCalm) * pace
    const stiffness = omega * omega
    const damping = 2 * zeta * omega

    pointer.vx += (stiffness * (pointer.tx - pointer.x) - damping * pointer.vx) * dt
    pointer.vy += (stiffness * (pointer.ty - pointer.y) - damping * pointer.vy) * dt
    pointer.x += pointer.vx * dt
    pointer.y += pointer.vy * dt

    /* ── focus ─────────────────────────────────────────────────── */

    let aim = 0
    if (hand.inside) {
      measure(elapsed)
      if (reach.r > 0) {
        const distance = Math.hypot(hand.x - reach.x, hand.y - reach.y)
        const band = gsap.utils.clamp(
          0,
          1,
          (distance - reach.r * FOCUS.inner) / (reach.r * (FOCUS.outer - FOCUS.inner)),
        )
        aim = 1 - smooth(band)
      }
    }
    focus += (aim - focus) * (1 - (1 - FOCUS.lerp) ** ratio)

    // Schmitt trigger off the smoothed value: the state cannot chatter while
    // the hand hovers the boundary, which is what makes it read as a decision.
    if (focus > FOCUS.cursorOn) setBloomCursor(true)
    else if (focus < FOCUS.cursorOff) setBloomCursor(false)

    /* ── write ─────────────────────────────────────────────────── */

    // Smoothstepped fade-in, so the entrance still lands on the authored
    // reference position and the drift opens out from there.
    const life = smooth(gsap.utils.clamp(0, 1, elapsed / IDLE_RAMP))

    if (breathOn && breath < 1) breath = Math.min(1, breath + dt / BREATH_RAMP)

    const cameraDriftX = wave(elapsed, CAMERA.hzX, 0.4) * CAMERA.x * life
    cameraX?.(cameraDriftX)
    cameraY?.(wave(elapsed, CAMERA.hzY, 2.3) * CAMERA.y * life)
    if (lockArabicTulipX) setArabicPlateX?.(-cameraDriftX)

    layers.forEach((layer) => {
      const { depth, idle, phase, subject } = layer
      const t = elapsed * idle.rate
      // Focus moves authority between the layers rather than adding any: the
      // bloom gains what the precision layer around it gives up.
      //
      // It is deliberately applied to translation and scale but never to the
      // pointer's rotation: the tilt ceiling is the one value in this file
      // that guards the hairline ring and the 1px rule from shimmering, and it
      // must stay a ceiling rather than a starting point.
      const gain = subject ? 1 + focus * FOCUS.gain : 1 - focus * FOCUS.quiet
      const drift = life * gain
      const authority = depth.lean * gain

      layer.setX(
        lockArabicTulipX && subject
          ? -cameraDriftX
          : pointer.x * authority + wave(t, IDLE_HZ.x, phase) * idle.x * drift,
      )
      layer.setY(pointer.y * authority + wave(t, IDLE_HZ.y, phase + 0.9) * idle.y * drift)
      // Tilt toward the cursor: the near edge comes forward, so each layer
      // turns to face the hand rather than away from it.
      layer.setRotX(
        -pointer.y * depth.rotX + wave(t, IDLE_HZ.rotX, phase + 1.8) * idle.rotX * drift,
      )
      layer.setRotY(
        pointer.x * depth.rotY + wave(t, IDLE_HZ.rotY, phase + 2.7) * idle.rotY * drift,
      )

      if (layer.setScale && breathOn) {
        layer.setScale(
          1 + wave(t, IDLE_HZ.breath, phase + 3.6) * idle.breath * breath + focus * FOCUS.present,
        )
      }
    })
  }

  gsap.ticker.add(tick)

  /* ── pointer ────────────────────────────────────────────────────
     Listeners only — every write goes through the ticker above. */
  let stopPointer = () => {}

  if (hasFinePointer()) {
    const onMove = (event: PointerEvent) => {
      // -1..1 from the viewport centre. Viewport, not element, so the lean
      // does not jump when the pointer crosses into the fold.
      pointer.tx = gsap.utils.clamp(-1, 1, (event.clientX / window.innerWidth - 0.5) * 2)
      pointer.ty = gsap.utils.clamp(-1, 1, (event.clientY / window.innerHeight - 0.5) * 2)
      pointer.still = 0

      hand.target = event.target instanceof Element ? event.target : null
      hand.x = event.clientX
      hand.y = event.clientY
      hand.inside = true
    }

    const onLeave = () => {
      // Targets only — the ticker eases the scene back into its own drift.
      pointer.tx = 0
      pointer.ty = 0
      hand.inside = false
    }

    scope.addEventListener('pointermove', onMove, { passive: true })
    scope.addEventListener('pointerleave', onLeave)

    stopPointer = () => {
      scope.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerleave', onLeave)
      scope.removeAttribute('data-cursor')
    }
  }

  return () => {
    stopGate()
    stopPointer()
    gsap.ticker.remove(tick)
    stopParallax.forEach((stop) => stop())
    exit?.scrollTrigger?.kill()
    exit?.kill()
    // Killing the entrance also cancels the `buildExit` call, so unmounting
    // mid-entrance can never leave a scroll trigger behind.
    tl.kill()
    // The stage carries the camera drift, written by `quickSetter` rather than
    // by a tween, so the context has nothing recorded for it to revert.
    scene.forEach((el) => {
      el.style.perspective = ''
      el.style.perspectiveOrigin = ''
      el.style.transform = ''
    })
  }
}
