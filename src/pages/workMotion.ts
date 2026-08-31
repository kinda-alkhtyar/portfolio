import {
  BEAT,
  DUR,
  EASE,
  HOVER,
  ROLE,
  STAGGER,
  gsap,
  hasFinePointer,
  magnetic,
  parallax,
  prefersReducedMotion,
} from '../motion'

/**
 * /work — the page as one continuous shot.
 *
 * Built on the same grammar as the Home fold rather than a new one: a single
 * camera over the scene, layers living at their own depths, and strictly
 * separate transform channels so the entrance, the scroll, the pointer and
 * the page/filter swap can all be running at once without ever fighting for
 * a property.
 *
 * The page is one screen tall by design, so the "camera" is not a long scrub
 * over a tall document — there is no room for one here and none was invented.
 * It is four things instead, and together they are what makes the page read
 * as a shot rather than as a grid with hover states:
 *
 *   1. a dolly — both plates (header, work field) arrive out of depth on one
 *      shared push-in, with their own layers arriving deeper still inside it
 *   2. a depth ladder on whatever scroll room the viewport actually leaves,
 *      so the header recedes and hands the foreground to the work field
 *   3. per-project reveals: one language (a clipped edge pass out of depth),
 *      four phrasings, weighted by the project's motion tier
 *   4. a swap that is a scene change rather than an opacity crossfade
 *
 *   entrance   autoAlpha, yPercent (masked type), scale, z, clipPath (cards)
 *   scroll     y / opacity (plates), yPercent (tulip, ring, marks)
 *   live       x, y, rotationX, rotationY, scale (bloom) — one ticker writing
 *              camera drift + per-layer idle + the pointer follow as a sum
 *   cards      z / y / clipPath (reveal), rotationX / rotationY (tilt),
 *              scale (focus pull), and x / y / scale on the cover image only
 *   swap       autoAlpha, x, z, clipPath, scale
 *
 * Nothing here changes a layout, type, spacing or colour value: every layer
 * rests at z 0, scale 1, no rotation and no clip, so the shared perspective is
 * a no-op on the reference geometry and the page still measures as authored.
 *
 * Written for `useMotionScope`, which runs it before paint, skips it entirely
 * under reduced motion and reverts the context on unmount. The returned
 * cleanup detaches the listeners, the ticker and the scroll triggers.
 */

/* ── the camera ────────────────────────────────────────────────────── */

const SCENE = {
  /** Long lens — deep enough to read, never short enough to skew. */
  perspective: '1400px',
  /**
   * The vanishing point sits on the backdrop ring's centre (right 9px + half
   * of its 367px box, top -21px + the same), not on the middle of the header.
   * Tulip, ring and marks then foreshorten toward the same point, which is
   * what makes them read as one group shot from one camera.
   */
  origin: 'calc(100% - 192.5px) 162.5px',
  /* Arabic mirrors the group to the physical left, so the same vanishing
     point is measured from the left edge instead. Identical distances, one
     camera, nothing about the depth ladder changes. */
  originRtl: '192.5px 162.5px',
} as const

/** The Arabic layout is mirrored, so the origins above swap with it. */
const isRtl = () => document.documentElement.dir === 'rtl'

/**
 * The two plates the page is cut from, and the one lens they share.
 *
 * `dolly` is how far behind the camera each plate opens; `scroll` is how far
 * it travels once the visitor moves. The header lags the page (positive y —
 * it falls behind, so it reads as further away) and gives up a little light
 * as it goes; the work field runs slightly ahead of the page (negative y),
 * which is the entire handoff: the header recedes, the work comes forward.
 */
const PLATE = {
  perspective: 1600,
  dolly: { header: -56, field: -40 },
  scroll: { headerY: 15, headerFade: 0.86, fieldY: -12 },
  /** A little lag is what separates a camera move from a scrollbar. */
  scrub: 0.55,
  /**
   * Below this much document scroll there is no camera move to make, and a
   * zero-length ScrollTrigger would only ever sit at one end of it.
   */
  minRoom: 60,
} as const

/** How far behind the camera each layer starts, in px of z. */
const ARRIVE = {
  eyebrow: -34,
  title: -88,
  tulip: -130,
  ring: -190,
  mark: -150,
  filter: -70,
} as const

/**
 * The bloom's scale settle. Shorter than the Home hero's 1.7s on purpose —
 * /work is the second thing a visitor sees, and the gesture should read as a
 * quieter reprise rather than the same performance played twice.
 */
const SETTLE = 1.35

/** Scroll travel per decorative layer, as a percentage of its own height. */
const DRIFT = { tulip: 9.7, ring: 16, mark: 120 } as const

/* ── the live scene ────────────────────────────────────────────────── */

/**
 * Max px of lean and max degrees of tilt per layer — one depth ladder, with
 * the bloom nearest the camera and the hairline ring furthest back. The
 * rotations stay under a degree: past that a 1px circle starts to shimmer.
 */
const DEPTH = {
  tulip: { lean: 14, rotX: 0.7, rotY: 0.95 },
  mark: { lean: 11, rotX: 0.5, rotY: 0.75 },
  ring: { lean: 8, rotX: 0.36, rotY: 0.52 },
} as const

/**
 * The idle life of the group, in the same units as `DEPTH` and at roughly a
 * fifth of its authority, so the hand always outranks the breathing. `rate`
 * is each layer's own clock — the depth ladder expressed as time, which is
 * what keeps the three planes from ever drifting as one block.
 */
const IDLE = {
  tulip: { x: 3, y: 3.8, rotX: 0.2, rotY: 0.26, breath: 0.003, rate: 1 },
  mark: { x: 2.2, y: 2.7, rotX: 0.16, rotY: 0.2, breath: 0, rate: 0.83 },
  ring: { x: 1.5, y: 1.9, rotX: 0.09, rotY: 0.13, breath: 0, rate: 0.61 },
} as const

/** Base angular speeds, rad/s, one per channel and deliberately unrelated. */
const IDLE_HZ = { x: 0.36, y: 0.29, rotX: 0.23, rotY: 0.31, breath: 0.19 } as const

/**
 * The second harmonic sits at the golden ratio of the first, so the drift is
 * quasi-periodic: fully deterministic (it cannot jitter) and non-repeating
 * (there is no loop to learn).
 */
const IDLE_HARMONIC = 1.618
const IDLE_MIX = 0.62
/** Seconds the idle takes to fade up, so the entrance lands on its mark. */
const IDLE_RAMP = 2.4

/** The camera itself: a slow drift on the stage, common to every layer. */
const CAMERA = {
  x: 1.4,
  y: 1.1,
  hzX: (2 * Math.PI) / 97,
  hzY: (2 * Math.PI) / 127,
} as const

/**
 * Pointer follow. A plain damped approach rather than the hero's
 * velocity-graded spring: this page leans, it never flicks.
 */
const POINTER = {
  /** Per-frame approach at 60fps. */
  lerp: 0.075,
  /** Once the hand has been still this long, its authority eases back to 0. */
  rest: 0.9,
  decay: 0.988,
} as const

/* ── the grid ──────────────────────────────────────────────────────── */

const CARD = {
  /** Each card's own camera, so a tilt never skews toward the grid's centre. */
  perspective: 900,
  /** Cover scale while hovered — and the headroom the parallax travels inside. */
  cover: 1.06,
  /** Max px the cover drifts against the pointer, capped by that headroom. */
  drift: 10,
  /** Slack kept between the cover's edge and its window's, in px. */
  bleed: 1,
  /**
   * The focus pull. Hovering one card lifts it a fraction and settles the
   * rest a fraction further back — depth separation rather than a highlight,
   * which is why the numbers are this small. Transform only.
   */
  lift: 1.008,
  recede: 0.994,
} as const

/**
 * The card radius, repeated here because every clip has to carry it: an
 * `inset()` without `round` would square the corners for the whole reveal.
 * Matches `rounded-[11px]` on the article in `ProjectGridCard`.
 */
const RADIUS = '11px'
const clipOf = (t: number, r: number, b: number, l: number) =>
  `inset(${t}% ${r}% ${b}% ${l}% round ${RADIUS})`

/**
 * One reveal language, four phrasings. Each is a closed clip named for the
 * direction the card *opens* in, so a set of cards can arrive differently
 * without any of them spinning, flipping or sliding like a carousel.
 */
const EDGE = {
  /** Uncovers upward off its own bottom edge — the signature lead move. */
  rise: clipOf(100, 0, 0, 0),
  /** Uncovers downward off its top edge. */
  fall: clipOf(0, 0, 100, 0),
  /** A crop pass rightward off the left edge. */
  wipeR: clipOf(0, 100, 0, 0),
  /** The same pass, mirrored. */
  wipeL: clipOf(0, 0, 0, 100),
  /** Opens out of its own horizontal centre band. */
  iris: clipOf(50, 0, 50, 0),
  /** At rest. Cleared entirely once the reveal lands. */
  open: clipOf(0, 0, 0, 0),
} as const

type Edge = Exclude<keyof typeof EDGE, 'open'>

/**
 * Reveal weight by motion tier.
 *
 * `lead` is the portfolio's strongest product work (see `workProjects.ts`):
 * it gets the longest travel, the deepest arrival and the most room on either
 * side, so it reads as the subject of the shot. `support` — the branding and
 * poster work — arrives faster and from further back, filling the frame
 * around the lead rather than competing with it.
 */
const REVEAL = {
  lead: { z: -142, y: 34, dur: 1.6, cover: 1.11, coverY: 4, gap: 0.14, tilt: 1.9 },
  support: { z: -78, y: 22, dur: 0.92, cover: 1.07, coverY: 2, gap: 0.075, tilt: 3 },
} as const

/** Extra depth each successive support card gives up, so the field has a back. */
const SUPPORT_STEP = -13

/**
 * The support phrasings, cycled in DOM order. Four of them against a page of
 * at most four support cards means no visitor ever sees the same edge pass
 * twice in one set.
 */
const SUPPORT_EDGES: Edge[] = ['wipeR', 'iris', 'wipeL', 'fall']

/**
 * Seconds the grid waits when it is already on screen at load. Short enough
 * that the featured card is still opening while the title is settling — the
 * header and the first work arrive as one move, not as two — and skipped
 * entirely when the visitor scrolled to the grid, where the reveal should
 * answer the scroll immediately.
 */
const GRID_LEAD = 0.55

/* ── the swap ──────────────────────────────────────────────────────── */

/**
 * Filter / pagination as a scene change. The outgoing set recedes and closes
 * against the edge it is travelling toward; the incoming set opens off the
 * opposite edge from a controlled spatial offset. Transform, opacity and
 * clip-path only, so nothing reflows and nothing repaints a blur.
 */
const SWAP = {
  /** Px each card travels sideways. */
  shift: 30,
  /** Px of z it gives up on the way out, so the set recedes as it leaves. */
  depth: -92,
  out: 0.24,
  /** Px of z the incoming set opens from — shallower than a first load. */
  arrive: -70,
} as const

/* ── filters ───────────────────────────────────────────────────────── */

const FILTER = { lift: -3, scale: 1.035 } as const

/* ── helpers shared with the page ──────────────────────────────────── */

const clamp = gsap.utils.clamp(-1, 1)

const tierOf = (card: HTMLElement) =>
  card.dataset.tier === 'lead' ? REVEAL.lead : REVEAL.support

/**
 * A card carries no clip at rest. It matters for more than tidiness: a
 * clip-path on the article would cut the `outline-offset-2` focus ring on the
 * link inside it, so every reveal hands the property back when it lands.
 */
const unclip = (items: HTMLElement | HTMLElement[]) =>
  gsap.set(items, { clearProps: 'clipPath' })

/**
 * Sends the current set away in the direction of travel. `apply` swaps the
 * React state once the last card has left, so nothing ever reflows mid-tween.
 */
export function swapOut(items: HTMLElement[], direction: 1 | -1, apply: () => void) {
  gsap.killTweensOf(items)
  gsap.to(items, {
    autoAlpha: 0,
    // The hover's focus pull may have left a card off 1; the scene change
    // owns the set now, so it takes every card back to a known scale.
    scale: 1,
    x: -direction * SWAP.shift,
    z: SWAP.depth,
    // Closes against the edge it is leaving through, so the set reads as
    // passing out of frame rather than as dimming in place.
    clipPath: direction === 1 ? EDGE.wipeL : EDGE.wipeR,
    transformPerspective: CARD.perspective,
    duration: SWAP.out,
    ease: EASE.snapIn,
    stagger: { each: 0.03, from: direction === 1 ? 'start' : 'end' },
    onComplete: apply,
  })
}

/**
 * Brings the incoming set in from the opposite side and a little further out,
 * opening off the leading edge. Lead work takes the longer settle here too,
 * so a filtered page still has a subject.
 */
export function swapIn(items: HTMLElement[], direction: 1 | -1) {
  const from: Edge = direction === 1 ? 'wipeR' : 'wipeL'

  items.forEach((card, index) => {
    const tier = tierOf(card)
    const order = direction === 1 ? index : items.length - 1 - index

    gsap.fromTo(
      card,
      {
        autoAlpha: 0,
        scale: 1,
        x: direction * SWAP.shift,
        z: SWAP.arrive,
        clipPath: EDGE[from],
        transformPerspective: CARD.perspective,
      },
      {
        autoAlpha: 1,
        x: 0,
        z: 0,
        clipPath: EDGE.open,
        duration: tier === REVEAL.lead ? DUR.epic : DUR.slow,
        ease: ROLE.subject,
        delay: order * 0.055,
        onComplete: () => unclip(card),
      },
    )
  })
}

/**
 * The active filter's mark, drawn in rather than switched on. The pill's own
 * colour change is still the CSS transition it always was — this only gives
 * the mark a way to arrive.
 */
export function markFilter(spark: HTMLElement | null) {
  if (!spark || prefersReducedMotion()) return
  gsap.fromTo(
    spark,
    { autoAlpha: 0, scale: 0.4, rotate: -140 },
    { autoAlpha: 1, scale: 1, rotate: 0, duration: DUR.slow, ease: ROLE.support },
  )
}

/* ── the scene ─────────────────────────────────────────────────────── */

export function workMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const nav = q('header')
  const eyebrow = q('[data-motion="eyebrow-line"]')
  const title = q('[data-motion="title-line"]')
  const lede = q('[data-motion="lede"]')
  const scene = q('[data-motion="work-scene"]')
  const tulip = q('[data-motion="tulip"]')
  const ring = q('[data-motion="ring"]')
  const marks = q('[data-motion="mark"]')
  const filterButtons = q('[data-motion="filter"]')
  const sort = q('[data-motion="sort"]')
  const footer = q('[data-motion="footer"]')
  const arrows = q('[data-motion="arrow"]')
  const [grid] = q('[data-motion="grid"]')
  const [plate] = q('[data-motion="plate"]')
  const [field] = q('[data-motion="field"]')

  /* ── one camera ───────────────────────────────────────────────
     Written straight to `style` rather than through GSAP: the origin is a
     `calc()` and GSAP would try to interpolate it. Cleared in the cleanup. */
  scene.forEach((el) => {
    el.style.perspective = SCENE.perspective
    el.style.perspectiveOrigin = isRtl() ? SCENE.originRtl : SCENE.origin
  })

  /* ── initial states ───────────────────────────────────────────
     Set before the first paint by `useMotionScope`, and never reached at
     all under reduced motion, where the page simply renders as authored. */
  gsap.set(nav, { autoAlpha: 0, y: -14 })
  // The two plates open out of depth. They carry no opacity of their own at
  // this point — everything inside is already hidden — so the dolly is a
  // pure push-in and never double-fades what it contains.
  gsap.set(plate, { z: PLATE.dolly.header, transformPerspective: PLATE.perspective })
  gsap.set(field, { z: PLATE.dolly.field, transformPerspective: PLATE.perspective })
  gsap.set([...eyebrow, ...title], {
    // The gutter the whole page aligns to is the edge the lines close their
    // depth on, so they never drift off it — left in English, right in Arabic.
    transformOrigin: isRtl() ? '100% 50%' : '0% 50%',
    transformPerspective: 1200,
  })
  gsap.set(eyebrow, { yPercent: 115, z: ARRIVE.eyebrow })
  gsap.set(title, { yPercent: 115, z: ARRIVE.title })
  gsap.set(lede, { autoAlpha: 0, y: 20 })
  gsap.set(tulip, { autoAlpha: 0, scale: 0.94, z: ARRIVE.tulip, transformOrigin: '50% 65%' })
  gsap.set(ring, { autoAlpha: 0, scale: 0.9, z: ARRIVE.ring })
  gsap.set(marks, { autoAlpha: 0, scale: 0.8, z: ARRIVE.mark })
  gsap.set(filterButtons, { autoAlpha: 0, y: 16, z: ARRIVE.filter, transformPerspective: 900 })
  gsap.set([...sort, ...footer], { autoAlpha: 0, y: 16 })

  /* ── entrance ─────────────────────────────────────────────────
     One timeline on the shared beat grid, so /work opens with the same
     rhythm as every Home section rather than a cadence of its own. The
     0.35s delay waits out the route wipe, so the header reveals into view
     instead of behind the panel.

     The two plate dollies run underneath the whole thing: every layer's own
     `z` is measured against a stage that is itself still coming forward,
     which is what gives the opening a depth the beat grid alone cannot. */
  const tl = gsap.timeline({ delay: 0.35, defaults: { ease: ROLE.support } })

  tl.to(nav, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.open)
    .to(plate, { z: 0, duration: DUR.epic * 1.25, ease: ROLE.subject }, BEAT.open)
    .to(eyebrow, { yPercent: 0, z: 0, duration: DUR.slow }, BEAT.open + BEAT.lead)
    .to(title, { yPercent: 0, z: 0, duration: DUR.epic, ease: ROLE.subject }, BEAT.subject)
    .to(
      tulip,
      { autoAlpha: 1, scale: 1, z: 0, duration: SETTLE, ease: ROLE.subject },
      BEAT.subject + BEAT.lead,
    )
    .to(lede, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.structure)
    .to(
      ring,
      { autoAlpha: 1, scale: 1, z: 0, duration: DUR.hero, ease: ROLE.structure },
      BEAT.structure + BEAT.lead,
    )
    // The work field starts forward while the header is still settling, so
    // the page reads as one move through the scene rather than as a header
    // that finishes and a grid that then begins.
    .to(field, { z: 0, duration: DUR.epic * 1.3, ease: ROLE.subject }, BEAT.structure)
    .to(
      filterButtons,
      { autoAlpha: 1, y: 0, z: 0, duration: DUR.slow, stagger: STAGGER.tight },
      BEAT.detail - BEAT.lead,
    )
    .to(
      marks,
      { autoAlpha: 1, scale: 1, z: 0, duration: DUR.base, stagger: STAGGER.base },
      BEAT.detail + BEAT.lead,
    )
    .to(sort, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.support)
    .to(footer, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.close)

  /* ── scroll depth ─────────────────────────────────────────────
     The decorative group drifts slower than the page. Percentage-based, so
     it holds at any canvas scale, and on `yPercent` rather than `y` — the
     ticker below owns `y` in px, and the two must never share a channel.

     One ladder, deepest layer lagging most: ring, then the marks, then the
     bloom, then the header plate itself. */
  const stopParallax = [
    parallax(tulip, {
      yPercent: DRIFT.tulip,
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    }),
    parallax(ring, {
      yPercent: DRIFT.ring,
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    }),
    parallax(marks, {
      yPercent: DRIFT.mark,
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    }),
  ]

  /* ── the plate camera ─────────────────────────────────────────
     The page's one scroll beat, and the handoff the whole composition is
     built around: the header falls behind and gives up a little light while
     the work field comes forward to take the foreground.

     Deliberately not a pin and not a hijack — this page is a single screen,
     so the move rides whatever room the viewport actually leaves and simply
     is not built when there is none. The field travels on `y` alone: it must
     stay at exactly z 0 for the whole scroll, because the card type is read
     there and a 3D transform would resample it. */
  let stopCamera = () => {}

  function buildCamera() {
    const room = document.documentElement.scrollHeight - window.innerHeight
    if (room < PLATE.minRoom) return

    const range = {
      trigger: scope,
      start: 'top top',
      end: 'bottom bottom',
      scrub: PLATE.scrub,
      invalidateOnRefresh: true,
    } as const

    const tweens = [
      plate &&
        gsap.to(plate, {
          y: PLATE.scroll.headerY,
          opacity: PLATE.scroll.headerFade,
          ease: 'none',
          scrollTrigger: range,
        }),
      field &&
        gsap.to(field, {
          y: PLATE.scroll.fieldY,
          ease: 'none',
          scrollTrigger: range,
        }),
    ].filter(Boolean) as gsap.core.Tween[]

    stopCamera = () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    }
  }

  /* ── the living group ─────────────────────────────────────────
     One ticker owns `x` / `y` / `rotationX` / `rotationY` on the three
     decorative layers and writes the *sum* of the idle drift and the
     pointer's authority. Summing rather than switching is the point: the
     hand bends a group that is already moving, and letting go returns it to
     the drift instead of to a dead stop.

     `quickSetter` writes into GSAP's transform cache, so a frame costs a
     handful of property writes and allocates nothing. */
  const layers = [
    ...tulip.map((el) => ({ el, depth: DEPTH.tulip, idle: IDLE.tulip })),
    ...marks.map((el) => ({ el, depth: DEPTH.mark, idle: IDLE.mark })),
    ...ring.map((el) => ({ el, depth: DEPTH.ring, idle: IDLE.ring })),
  ].map(({ el, depth, idle }, index) => ({
    depth,
    idle,
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

  /** Two sines at an irrational ratio. Range is exactly -1..1. */
  const wave = (t: number, hz: number, phase: number) =>
    Math.sin(t * hz + phase) * IDLE_MIX +
    Math.sin(t * hz * IDLE_HARMONIC + phase * 2.1) * (1 - IDLE_MIX)

  /** Hermite smoothstep. Every ramp here uses it, so nothing ever launches. */
  const smooth = (value: number) => value * value * (3 - 2 * value)

  const pointer = { tx: 0, ty: 0, x: 0, y: 0, still: Number.POSITIVE_INFINITY }

  let elapsed = 0
  /** The bloom breathes only once the entrance has stopped writing `scale`. */
  let breathing = false

  const tick = (_time: number, deltaMs: number) => {
    // Clamped so a backgrounded tab never resumes with one enormous step.
    const dt = Math.min(deltaMs, 33) / 1000
    const ratio = gsap.ticker.deltaRatio(60)
    elapsed += dt

    // Hand at rest: its authority eases out rather than being dropped, so the
    // group slides back into the drift instead of snapping to it.
    pointer.still += dt
    if (pointer.still > POINTER.rest) {
      const decay = POINTER.decay ** ratio
      pointer.tx *= decay
      pointer.ty *= decay
    }

    const follow = 1 - (1 - POINTER.lerp) ** ratio
    pointer.x += (pointer.tx - pointer.x) * follow
    pointer.y += (pointer.ty - pointer.y) * follow

    // Smoothstepped fade-in, so the entrance still lands on the authored
    // position and the drift opens out from there.
    const life = smooth(gsap.utils.clamp(0, 1, elapsed / IDLE_RAMP))

    cameraX?.(wave(elapsed, CAMERA.hzX, 0.4) * CAMERA.x * life)
    cameraY?.(wave(elapsed, CAMERA.hzY, 2.3) * CAMERA.y * life)

    layers.forEach(({ depth, idle, phase, setX, setY, setRotX, setRotY, setScale }) => {
      const t = elapsed * idle.rate

      setX(pointer.x * depth.lean + wave(t, IDLE_HZ.x, phase) * idle.x * life)
      setY(pointer.y * depth.lean + wave(t, IDLE_HZ.y, phase + 0.9) * idle.y * life)
      // The near edge comes forward: each layer turns to face the hand.
      setRotX(-pointer.y * depth.rotX + wave(t, IDLE_HZ.rotX, phase + 1.8) * idle.rotX * life)
      setRotY(pointer.x * depth.rotY + wave(t, IDLE_HZ.rotY, phase + 2.7) * idle.rotY * life)

      if (setScale && breathing) {
        setScale(1 + wave(t, IDLE_HZ.breath, phase + 3.6) * idle.breath * life)
      }
    })
  }

  gsap.ticker.add(tick)

  /* ── pointer ──────────────────────────────────────────────────
     Listeners only — every write goes through the ticker above. */
  let stopPointer = () => {}

  if (hasFinePointer()) {
    const onMove = (event: PointerEvent) => {
      // Read against the viewport, not the header, so the lean does not jump
      // as the pointer crosses into the decorative group.
      pointer.tx = clamp((event.clientX / window.innerWidth - 0.5) * 2)
      pointer.ty = clamp((event.clientY / window.innerHeight - 0.5) * 2)
      pointer.still = 0
    }

    const onLeave = () => {
      pointer.tx = 0
      pointer.ty = 0
    }

    scope.addEventListener('pointermove', onMove, { passive: true })
    scope.addEventListener('pointerleave', onLeave)

    stopPointer = () => {
      scope.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerleave', onLeave)
    }
  }

  /* ── the grid ─────────────────────────────────────────────────
     Every card arrives out of depth through a clipped edge pass, and no two
     cards on a page use the same pass. The variation is not decoration: the
     lead work rises off its own bottom edge over the longest travel, so it
     reads as the subject, while the support work crops in from the sides and
     the centre from further back, filling the frame around it.

     One language, four phrasings, no rotation anywhere — nothing spins, and
     nothing repeats the card beside it. */
  let stopReveal = () => {}
  let stopCards = () => {}

  if (grid) {
    const cards = gsap.utils.toArray<HTMLElement>('[data-motion="card"]', grid)

    gsap.set(cards, { transformPerspective: CARD.perspective })

    // Already on screen at load: hold briefly, so the first card opens into
    // the header's tail. Scrolled to: answer the scroll at once.
    const lead = grid.getBoundingClientRect().top < window.innerHeight ? GRID_LEAD : 0

    const reveal = gsap.timeline({
      defaults: { ease: ROLE.support },
      scrollTrigger: { trigger: grid, start: 'top 88%', once: true },
    })

    /** Which support phrasing the next support card takes. */
    let phrase = 0
    /** Where the next card lands on the reveal's own clock. */
    let cursor = lead + BEAT.open

    cards.forEach((card, index) => {
      const tier = tierOf(card)
      const isLead = tier === REVEAL.lead
      const cover = card.querySelector<HTMLElement>('[data-motion="card-media"]')

      // The featured slot is the shot's anchor whatever it holds, so it takes
      // the lead phrasing; every other lead card takes it too, and the
      // support cards cycle the remaining three.
      const edge: Edge =
        card.dataset.featured || isLead ? 'rise' : SUPPORT_EDGES[phrase++ % SUPPORT_EDGES.length]

      // Support work sits further back the later it comes, which is what
      // gives the field a back wall instead of a flat plane.
      const depth = isLead ? tier.z : tier.z + index * SUPPORT_STEP

      gsap.set(card, { autoAlpha: 0, y: tier.y, z: depth, clipPath: EDGE[edge] })
      if (cover) gsap.set(cover, { scale: tier.cover, yPercent: tier.coverY })

      // Two tweens, not one: the fade is short so the card is simply *there*
      // behind its own clip, and the long move belongs to the edge pass.
      reveal
        .to(card, { autoAlpha: 1, duration: DUR.quick }, cursor)
        .to(
          card,
          {
            y: 0,
            z: 0,
            clipPath: EDGE.open,
            duration: tier.dur,
            ease: ROLE.subject,
            onComplete: () => unclip(card),
          },
          cursor,
        )

      // The cover settles a beat behind its own card and slightly against
      // it, so the image reads as sitting inside the frame rather than
      // being painted on it.
      if (cover) {
        reveal.to(
          cover,
          { scale: 1, yPercent: 0, duration: tier.dur * 1.08, ease: ROLE.subject },
          cursor + BEAT.lead,
        )
      }

      cursor += tier.gap
    })

    stopReveal = () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
    }

    /* ── card tilt, cover parallax, focus pull ──────────────────
       One delegated listener for the whole grid, so cards arriving with a
       new page or filter are covered without rebinding anything.

       The card owns `rotationX` / `rotationY` and `scale`; the cover image
       owns `x` / `y` / `scale`. None of those channels is shared with the
       reveal or the swap — which is why a tilt can still be settling while a
       page swaps without either one stuttering.

       The parallax is capped by the headroom the hover scale actually
       creates, measured per card, so a short cover can never slide far
       enough to show the card behind it.

       The focus pull is the one addition to the hover, and it is deliberately
       almost invisible: the hovered card lifts 0.8%, its neighbours settle
       0.6% back. Depth separation, not a highlight. */
    if (hasFinePointer()) {
      type Control = {
        rotX: (value: number) => void
        rotY: (value: number) => void
        imgX: (value: number) => void
        imgY: (value: number) => void
        img: HTMLElement | null
        tilt: number
        ampX: number
        ampY: number
      }

      const settle = { duration: 0.7, ease: EASE.expo }
      const controls = new WeakMap<HTMLElement, Control>()

      const control = (card: HTMLElement): Control => {
        let found = controls.get(card)
        if (!found) {
          const img = card.querySelector<HTMLElement>('[data-motion="card-image"]')
          found = {
            rotX: gsap.quickTo(card, 'rotationX', settle),
            rotY: gsap.quickTo(card, 'rotationY', settle),
            imgX: img ? gsap.quickTo(img, 'x', settle) : () => {},
            imgY: img ? gsap.quickTo(img, 'y', settle) : () => {},
            img,
            // Lead work turns less. A stately card that barely moves reads as
            // heavier than one that follows the hand eagerly.
            tilt: tierOf(card).tilt,
            ampX: 0,
            ampY: 0,
          }
          controls.set(card, found)
        }
        return found
      }

      /** Re-measured on every enter, so a resize can never stale the cap. */
      const measure = (item: Control) => {
        const box = item.img?.getBoundingClientRect()
        const room = (size: number) => Math.max(0, (size * (CARD.cover - 1)) / 2 - CARD.bleed)
        item.ampX = box ? Math.min(CARD.drift, room(box.width)) : 0
        item.ampY = box ? Math.min(CARD.drift, room(box.height)) : 0
      }

      /** Read live: the set changes with every filter and every page. */
      const siblings = () =>
        gsap.utils.toArray<HTMLElement>('[data-motion="card"]', grid)

      let hovered: HTMLElement | null = null

      const pull = (card: HTMLElement | null) => {
        const all = siblings()
        if (!card) {
          gsap.to(all, { scale: 1, ...HOVER })
          return
        }
        gsap.to(card, { scale: CARD.lift, ...HOVER })
        gsap.to(
          all.filter((other) => other !== card),
          { scale: CARD.recede, ...HOVER },
        )
      }

      const release = (card: HTMLElement | null) => {
        if (!card) return
        const item = control(card)
        item.rotX(0)
        item.rotY(0)
        item.imgX(0)
        item.imgY(0)
        if (item.img) gsap.to(item.img, { scale: 1, ...HOVER })
      }

      const onOver = (event: PointerEvent) => {
        const card = (event.target as Element | null)?.closest?.<HTMLElement>(
          '[data-motion="card"]',
        )
        if (card === hovered) return
        release(hovered)
        hovered = card ?? null
        pull(hovered)
        if (!hovered) return
        const item = control(hovered)
        measure(item)
        if (item.img) gsap.to(item.img, { scale: CARD.cover, ...HOVER })
      }

      const onMove = (event: PointerEvent) => {
        if (!hovered) return
        const box = hovered.getBoundingClientRect()
        if (!box.width || !box.height) return
        const nx = clamp(((event.clientX - box.left) / box.width) * 2 - 1)
        const ny = clamp(((event.clientY - box.top) / box.height) * 2 - 1)
        const item = control(hovered)

        item.rotY(nx * item.tilt)
        item.rotX(-ny * item.tilt)
        // The cover moves against the pointer, which is what reads as the
        // image sitting behind the card's window rather than on it.
        item.imgX(-nx * item.ampX)
        item.imgY(-ny * item.ampY)
      }

      const onLeave = () => {
        release(hovered)
        hovered = null
        pull(null)
      }

      grid.addEventListener('pointerover', onOver, { passive: true })
      grid.addEventListener('pointermove', onMove, { passive: true })
      grid.addEventListener('pointerleave', onLeave)

      stopCards = () => {
        grid.removeEventListener('pointerover', onOver)
        grid.removeEventListener('pointermove', onMove)
        grid.removeEventListener('pointerleave', onLeave)
        onLeave()
      }
    }
  }

  /* ── filters, arrows and the scroll camera ────────────────────
     Bound from a call at the end of the entrance. The timeline owns `y` on
     the pills until it has finished, and the hover response owns it after;
     the same rule is why the plate camera is built here rather than up
     front — the entrance owns `z` on both plates until it lands, and the
     camera records z 0 / y 0 as its start only once that is true.

     The filters answer focus as well as hover, so a keyboard visitor gets
     the same feedback a pointer does. */
  let stopFilters = () => {}
  let stopArrows = () => {}

  tl.call(() => {
    breathing = true
    buildCamera()

    const lift = (button: HTMLElement, on: boolean) => {
      gsap.to(button, { y: on ? FILTER.lift : 0, scale: on ? FILTER.scale : 1, ...HOVER })
    }

    const bindings = filterButtons.map((button) => {
      const enter = () => lift(button, true)
      const leave = () => lift(button, false)

      button.addEventListener('pointerenter', enter)
      button.addEventListener('pointerleave', leave)
      button.addEventListener('focus', enter)
      button.addEventListener('blur', leave)

      return () => {
        button.removeEventListener('pointerenter', enter)
        button.removeEventListener('pointerleave', leave)
        button.removeEventListener('focus', enter)
        button.removeEventListener('blur', leave)
      }
    })

    stopFilters = () => {
      bindings.forEach((unbind) => unbind())
      gsap.killTweensOf(filterButtons)
    }

    // The pagination arrows are the page's one repeated action, so they take
    // the same magnetic pull the Home CTA does, at roughly half its strength.
    const pulls = arrows.map((arrow) => magnetic(arrow, { strength: 0.18, scale: 1.06 }))
    stopArrows = () => pulls.forEach((stop) => stop())
  })

  return () => {
    stopPointer()
    stopFilters()
    stopArrows()
    stopCards()
    stopReveal()
    stopCamera()
    gsap.ticker.remove(tick)
    stopParallax.forEach((stop) => stop())
    // Killing the entrance also cancels its pending call, so unmounting
    // mid-entrance can never bind a listener after the teardown has run.
    tl.kill()
    // The stage's camera drift is written by `quickSetter`, not by a tween,
    // so the context has nothing recorded for it to revert.
    scene.forEach((el) => {
      el.style.perspective = ''
      el.style.perspectiveOrigin = ''
      el.style.transform = ''
    })
  }
}
