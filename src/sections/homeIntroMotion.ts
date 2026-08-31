import { EASE, ROLE, getLenis, gsap } from '../motion'
import { FIELD_END, INTRO_PLANES, PLANE_OPEN } from './introPlanes'
import { consumeIntro, releaseHero } from './introGate'

/**
 * Home — the cinematic opening.
 *
 * One shot, three movements, no cuts:
 *
 *   1  the dark plum world, which is the fold's own ground and nothing else
 *   2  a field of twelve portfolio works uncovering across three depth layers
 *      on one travelling camera, two of them passing it and leaving, then the
 *      ten that remain drawn bodily onto a single vanishing point
 *   3  the tulip clip emerging out of that same point, opening, and dissolving
 *      into the live hero bloom it was shot as
 *
 * What makes it one experience rather than an animation, a video and a website
 * played in sequence is that all three movements share a coordinate system.
 * The stage's vanishing point is written onto the **live hero bloom's
 * centroid**, measured off the page at setup, so the works collapse into the
 * exact pixel the flower then opens from. The clip is mounted inside the
 * hero's own scene wearing the hero tulip's positioning classes, so it *is*
 * the still's box at every breakpoint. And the fold is not started afterwards
 * — it is released mid-shot, so the headline is already sliding out of its
 * masks while the flower is still resolving from video into image.
 *
 * Channels, kept strictly disjoint so nothing ever fights:
 *
 *   stage     autoAlpha — the layer being live at all
 *   ground    autoAlpha — the plum backdrop clearing to the identical real one
 *   lens      perspective + perspective-origin, written once, never animated
 *   camera    x / y / z — the lateral drift and the push through the field
 *   plane     x / y (the perspective solve, then the drift, then the vacuum's
 *             pull), z (arrival, then a camera pass for two of them, then the
 *             vacuum), scale (the vacuum only), autoAlpha
 *   frame     clipPath — the uncover, and nothing else ever writes it
 *   art       scale — the settle behind each wipe
 *   plate     autoAlpha — the emergence and the final dissolve
 *   veil      opacity — the controlled fade over the clip's bright opening
 *
 * Nothing is scrubbed and nothing is pinned: the opening runs on its own clock
 * because it is a shot, not a scroll. Lenis is stopped for its duration and
 * handed back at the end — no `overflow: hidden` anywhere, which would take
 * the scrollbar out and shift the layout underneath by its width.
 *
 * Written for `useMotionScope`: it runs before paint, is skipped entirely
 * under reduced motion — which *is* the reduced-motion fallback, since the
 * stage and the plate also render nothing then and the fold is simply entered
 * — and reverts the context on unmount. The returned cleanup releases the
 * fold, stops the clip, unbinds everything and restores the scroll.
 */

/* ── the camera ────────────────────────────────────────────────────── */

/**
 * Longer than the hero's 1400px. The field spans roughly -1180 to +1050 of
 * total z once the camera and the two passes are added in, and a shorter lens
 * would skew the outermost planes and blow the passes out as they come
 * forward. It also stays comfortably clear of the singularity at z = P.
 */
const PERSPECTIVE = 1800

/**
 * Where the hero bloom's mass sits inside the tulip's box, as a fraction of
 * it. Measured off `tulip.png`'s alpha channel: the flower head — the top 46%
 * of the cut-out — has its centroid at (0.4458, 0.2465). The stage's vanishing
 * point is written onto this point on the live element, so "into the distance"
 * and "where the flower is" are the same direction.
 */
const BLOOM = { x: 0.4458, y: 0.2465 } as const

/** Fallback vanishing point if the hero tulip cannot be read: px in from the
    right of the viewport, and a fraction of its height. */
const ORIGIN_FALLBACK = { right: 367, top: 0.45 } as const

/**
 * The camera move: one continuous push through the field, accelerating, with
 * a lateral drift across it.
 *
 * Both channels pay for themselves twice. The drift is multiplied by each
 * plane's own projected scale on the way to the screen, so it is already a
 * depth-correct parallax before any plane drifts on its own. The push grows
 * the near layer ~21% and the far layer ~13% over the same move, which is the
 * difference between travelling *through* a field and zooming one — and it
 * keeps accelerating into the vacuum, where the camera lunges forward while
 * the field is pulled back past it.
 */
const CAMERA = {
  from: { x: 26, y: -14, z: -150 },
  settled: { x: -30, y: 16, z: 190 },
  through: { x: -38, y: 22, z: 430 },
} as const

/**
 * The vacuum.
 *
 * The field does not recede — it is drawn onto the vanishing point itself,
 * which is the hero bloom's centroid, so the last thing before the flower is
 * the whole portfolio being absorbed into the exact pixel it opens from.
 * `depth` is added to each plane's own resting z and `scale` compounds it, so
 * a plane arrives at the drain at roughly a fifth of its size with nothing
 * left to see.
 *
 * The window is 0.70s end to end: 0.198s of stagger across the ten remaining
 * planes plus a 0.50s pull. It lands at 4.10, which is after the clip's plate
 * has begun lighting at 4.00 and before the ground clears at 4.20 — so the
 * flower is already coming up out of the point the field is disappearing
 * into, and no cue belonging to the video moved to make room for it.
 */
const COLLAPSE = {
  at: 3.4,
  stagger: 0.022,
  run: 0.5,
  depth: -2600,
  scale: 0.42,
} as const

/* ── the clip ──────────────────────────────────────────────────────── */

/**
 * The playback window. The file is 5.04s at 24fps, but its first half second
 * is a static hold on the bright frame — nothing opens there, and the veil
 * would be spending its budget on dead time. Starting at 0.55 puts the clip's
 * own brightness fall-off under the veil's release from the first frame shown.
 */
const CLIP = { from: 0.55, end: 5.04 } as const
const CLIP_RUN = CLIP.end - CLIP.from

/**
 * The controlled fade, fitted rather than guessed.
 *
 * Sampled border luminance of the clip, against the ~17 of the backdrop it is
 * composited onto:
 *
 *     clip t   0.55   1.00   1.25   1.50   1.75   2.00
 *     luma      220    156    108     62     32     24
 *     veil    0.955  0.935  0.901  0.798  0.390  0.000
 *
 * The bottom row is the veil opacity that holds the composite at or under the
 * backdrop's own tone. Tweening 0.955 -> 0 across those 1.45s on `power3.in`
 * tracks it to within about 0.02 for the whole descent — which is why the clip
 * appears to be *lit* out of the plum rather than faded up over it.
 */
const VEIL = { from: 0.955, run: 1.45 } as const

/* ── the beat sheet, in seconds ────────────────────────────────────── */

const CUE = {
  /** The two preload gates. The stage is up and indistinguishable from the
      page at both, so waiting at either is invisible — this is the whole
      loading strategy: never a spinner, only a held frame of something that
      already looks finished. */
  coversReady: 0.02,
  /** Backstop for the clip's download priority; see `promoteClip`. */
  promoteClip: 0.8,
  clipReady: 3.95,

  /** The plum ground clearing to the identical real one underneath. */
  ground: 4.2,
  groundRun: 0.95,

  /** The clip is lit, then started. */
  plate: 4.0,
  plateIn: 0.6,
  clip: 4.25,

  dissolveRun: 0.85,
} as const

/**
 * The handoff, derived from the clip rather than written down beside it, so
 * the beat sheet cannot drift out of step if the playback window is retuned.
 *
 *   `LEAD`     the dissolve starts this far *before* the clip ends, so the
 *              flower is still opening as it hands over. A frozen last frame
 *              is the one thing that would announce the seam.
 *   `OVERLAP`  how long after the flower starts opening the fold is released.
 *
 * The fold used to be held back to the last two thirds of a second, so the
 * headline arrived once the bloom was essentially finished — the copy read as
 * a second event rather than as part of the shot. It is now released a beat
 * *into* the clip, while the plum ground is still clearing (`CUE.ground` at
 * 4.2, over 0.95s), so the headline slides out of its masks and the subtitle
 * and buttons land while the flower is still opening behind them. Nothing
 * about the video moved: `plate`, `clip`, the veil, `ground`, `LEAD` and
 * `DISSOLVE_AT` are all where they were.
 */
const LEAD = 0.45
const OVERLAP = 0.15

const CLIP_ENDS = CUE.clip + CLIP_RUN
const DISSOLVE_AT = CLIP_ENDS - LEAD
const HERO_AT = CUE.clip + OVERLAP

/** Longest either gate will hold the shot before going on regardless. */
const WAIT = { covers: 2.5, clip: 3.5 } as const

/** How long a refused opening takes to clear the screen. */
const SKIP_RUN = 0.45

/** Keys that mean "get me to the page". All of them also scroll it. */
const SKIP_KEYS = new Set([
  'Escape',
  'Enter',
  ' ',
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  'Home',
  'End',
])

export function homeIntroMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const ground = q('[data-intro="ground"]')
  const lens = q('[data-intro="lens"]')
  const camera = q('[data-intro="camera"]')
  const planes = q('[data-intro="plane"]')

  // The plate lives inside the hero's scene, not inside this scope, so it is
  // looked up rather than queried. Tweens created here still belong to the
  // context and are still reverted with it — `scope` bounds selector text,
  // not targets.
  const plate = document.querySelector<HTMLElement>('.home-canvas [data-motion="intro-plate"]')
  const video = document.querySelector<HTMLVideoElement>('.home-canvas [data-intro="video"]')
  const veil = document.querySelector<HTMLElement>('.home-canvas [data-intro="veil"]')
  const heroTulip = document.querySelector<HTMLElement>('.home-canvas [data-motion="tulip"]')

  /* ── the vanishing point ────────────────────────────────────────
     Read off the live hero tulip, so the works recede into the point the
     bloom arrives at — on every short-viewport breakpoint and at any width,
     with nothing measured by hand and nothing to keep in sync.

     `heroMotion` has already written the still's arrival transform by now, so
     it is neutralised for the one measurement and put straight back. GSAP
     rewrites it from its own cache on the next frame either way. */
  const vanishingPoint = (): { x: number; y: number } => {
    if (heroTulip) {
      const previous = heroTulip.style.transform
      heroTulip.style.transform = 'none'
      const box = heroTulip.getBoundingClientRect()
      heroTulip.style.transform = previous
      if (box.width > 0) {
        return { x: box.left + box.width * BLOOM.x, y: box.top + box.height * BLOOM.y }
      }
    }
    return {
      x: window.innerWidth - ORIGIN_FALLBACK.right,
      y: window.innerHeight * ORIGIN_FALLBACK.top,
    }
  }

  const origin = vanishingPoint()

  // Written to the style rather than through GSAP: the fallback carries a
  // `calc()`, which GSAP would try to read as an interpolatable pair.
  //
  // The lens holds the perspective and the camera holds the move, because a
  // `translateZ` on the element that *owns* the perspective is not projected
  // by it — the camera has to be a child to be able to dolly at all.
  lens.forEach((el) => {
    el.style.perspective = `${PERSPECTIVE}px`
    el.style.perspectiveOrigin = `${origin.x}px ${origin.y}px`
  })
  camera.forEach((el) => {
    el.style.transformStyle = 'preserve-3d'
  })

  /* ── initial states ──────────────────────────────────────────────
     Inside the layout effect, so the stage is already covering before the
     first paint and the un-entered fold behind it is never seen. */
  gsap.set(scope, { autoAlpha: 1 })
  gsap.set(camera, { ...CAMERA.from })

  /* ── solving the field ──────────────────────────────────────────
     Each plane is authored by where it should *appear*, but it lives at its
     own depth on a perspective whose vanishing point is off-centre (it sits
     on the hero bloom), so depth moves it. Solve for the transform that puts
     it back:

         s = P / (P - z)                     the plane's projected scale
         x = (D - O)(1/s - 1) - W/2          compensation, plus centring

     `D` is the authored centre, `O` the measured vanishing point, `W` the
     plane's own rendered box. Read once here from `offsetWidth` — the stage
     is outside `.home-canvas`, so it carries no `zoom` and layout px are
     screen px — which makes the authored composition exact at any viewport
     rather than only at the 1440 it was drawn on.

     `sink` is the same solve run backwards: the transform that puts the
     plane's centre *on* the vanishing point. That is what the collapse pulls
     toward, so the field does not merely recede into the distance — it
     converges on the exact pixel the flower is about to open from. */
  const field = planes.map((plane, index) => {
    const spec = INTRO_PLANES[index]
    const scale = PERSPECTIVE / (PERSPECTIVE - spec.z)
    const halfW = plane.offsetWidth / 2
    const halfH = plane.offsetHeight / 2
    // The authored centre, resolved from the CSS percentages already on the
    // element, so the data stays the single source of the composition.
    const anchor = { x: plane.offsetLeft, y: plane.offsetTop }
    const spread = 1 / scale - 1

    return {
      plane,
      spec,
      art: plane.querySelector<HTMLElement>('[data-intro="art"]'),
      frame: plane.querySelector<HTMLElement>('[data-intro="frame"]'),
      base: {
        x: (anchor.x - origin.x) * spread - halfW,
        y: (anchor.y - origin.y) * spread - halfH,
      },
      sink: { x: origin.x - anchor.x - halfW, y: origin.y - anchor.y - halfH },
      // How far this plane sits from the drain, which is the order the
      // vacuum takes them in.
      reach: Math.hypot(anchor.x - origin.x, anchor.y - origin.y),
    }
  })

  field.forEach(({ plane, spec, art, frame, base }) => {
    gsap.set(plane, {
      x: base.x + spec.drift.x0,
      y: base.y + spec.drift.y0,
      z: spec.z + spec.arrive,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
    })
    if (frame) gsap.set(frame, { clipPath: spec.closed })
    if (art) gsap.set(art, { scale: spec.over, transformOrigin: '50% 50%' })
  })

  /** The vacuum takes the planes nearest the drain first. */
  const collapsing = field
    .filter((entry) => !entry.spec.pass)
    .sort((a, b) => a.reach - b.reach)

  if (plate) gsap.set(plate, { autoAlpha: 0 })
  if (veil) gsap.set(veil, { opacity: VEIL.from })

  /* ── holding the page ───────────────────────────────────────────
     Stopped, not hijacked, and without `overflow: hidden` — taking the
     scrollbar out would shift the layout underneath by its width, and the
     one thing an opening must never do is move the page it is opening. */
  const lenis = getLenis()
  lenis?.stop()

  let over = false
  let released = false
  let scrolling = false

  const restoreScroll = () => {
    if (scrolling) return
    scrolling = true
    lenis?.start()
  }

  const releaseFold = () => {
    if (released) return
    released = true
    releaseHero()
  }

  /* ── the clip ───────────────────────────────────────────────────
     Primed as early as it can be and started exactly on its cue. Seeking to
     the playback window on `loadedmetadata` warms the decoder, so `play()` at
     the cue is immediate rather than a first-frame stall. */
  let clipReady = video ? video.readyState >= 3 : true
  let clipFailed = !video

  function onClipReady() {
    clipReady = true
    resume()
  }

  function onClipError() {
    clipFailed = true
    clipReady = true
    resume()
  }

  function onClipMeta() {
    try {
      if (video) video.currentTime = CLIP.from
    } catch {
      // A seek this early can be refused; `startClip` sets it again.
    }
  }

  if (video) {
    video.muted = true
    video.addEventListener('canplaythrough', onClipReady)
    video.addEventListener('canplay', onClipReady)
    video.addEventListener('error', onClipError)
    video.addEventListener('loadedmetadata', onClipMeta)
    if (video.readyState >= 1) onClipMeta()
  }

  function startClip() {
    if (!video || clipFailed) {
      // Nothing to hand over from. Take the shot to the handoff rather than
      // lifting the veil off a still, bright frame.
      skip()
      return
    }
    try {
      video.currentTime = CLIP.from
    } catch {
      // Non-fatal: playback starts wherever the buffer allows.
    }
    const started = video.play()
    // Muted + playsInline autoplay is permitted everywhere, but a refusal
    // must not leave the opening stranded on a frame that never moves.
    if (started) started.catch(() => skip())
  }

  /* ── the covers ─────────────────────────────────────────────────── */

  const artwork = planes
    .map((plane) => plane.querySelector<HTMLImageElement>('[data-intro="art"]'))
    .filter((img): img is HTMLImageElement => img !== null)

  const coversReady = () => artwork.every((img) => img.complete && img.naturalWidth > 0)

  /**
   * Hand the bandwidth over to the clip.
   *
   * The plates are wanted at 0.3s and the clip at 4.25s, so the clip ships as
   * `preload="metadata"` and is promoted here — either the moment the covers
   * have landed, or unconditionally at 0.8s, whichever comes first. Metadata
   * is still enough to have seeked to the playback window and warmed the
   * decoder in the meantime, so the promotion resumes a download that has
   * already found its way to the right part of the file.
   */
  function promoteClip() {
    if (video && video.preload !== 'auto') video.preload = 'auto'
  }

  function onCover() {
    if (coversReady()) promoteClip()
    resume()
  }

  artwork.forEach((img) => {
    img.addEventListener('load', onCover)
    img.addEventListener('error', onCover)
  })

  /* ── the shot ───────────────────────────────────────────────────── */

  const tl = gsap.timeline({ onComplete: finish })

  /** What the timeline is waiting for, if anything, and its patience. */
  let waitingFor: (() => boolean) | null = null
  let ceiling: gsap.core.Tween | null = null
  let exit: gsap.core.Timeline | null = null

  function resume() {
    if (!waitingFor || !waitingFor()) return
    waitingFor = null
    ceiling?.kill()
    ceiling = null
    tl.play()
  }

  /** Hold the shot at this cue until `ready`, or for at most `limit`. */
  const holdFor = (ready: () => boolean, limit: number) => () => {
    if (ready()) return
    waitingFor = ready
    tl.pause()
    ceiling = gsap.delayedCall(limit, () => {
      waitingFor = null
      ceiling = null
      tl.play()
    })
  }

  tl.call(holdFor(coversReady, WAIT.covers), undefined, CUE.coversReady).call(
    promoteClip,
    undefined,
    CUE.promoteClip,
  )

  if (coversReady()) promoteClip()

  /* ── the camera ─────────────────────────────────────────────────
     Two moves on one body. The lateral drift is multiplied by each plane's
     own projected scale on its way to the screen, so it is already a
     depth-correct parallax before any plane drifts on its own; the z push is
     the continuous travel *through* the field, accelerating so the shot gains
     momentum rather than cruising. The push grows the near layer ~21% and the
     far layer ~13% over the same move, which is the difference between
     travelling through a field and zooming one. */
  tl.to(camera, { ...CAMERA.settled, duration: FIELD_END, ease: 'power1.in' }, 0)

  /* ── the field ──────────────────────────────────────────────────
     Twelve planes, no two sharing a size, an aspect, an entry edge, a depth,
     a drift or a beat. Entry intervals close from 0.28s to 0.10s and the
     wipes shorten from 1.05s to 0.52s, so the momentum is in the rhythm — the
     field looks spontaneous and is choreographed to the frame. */
  field.forEach(({ plane, spec, art, frame, base }) => {
    // The drift, as one linear tween spanning the whole field. Linear because
    // this is a camera-relative travel, not a gesture, and because a plane is
    // uncovered partway through it — so it is already moving when it appears,
    // which is what makes the field feel alive rather than assembled.
    tl.to(
      plane,
      {
        x: base.x + spec.drift.x1,
        y: base.y + spec.drift.y1,
        duration: FIELD_END,
        ease: 'none',
      },
      0,
    )

    // The uncover: frame and hairline unroll off one edge while the artwork
    // settles out of its over-scale behind them, and the plane closes the last
    // of its arrival depth. The site's own device, borrowed from the case
    // studies rather than invented here.
    if (frame) {
      tl.to(frame, { clipPath: PLANE_OPEN, duration: spec.wipe, ease: ROLE.structure }, spec.at)
    }
    tl.to(plane, { z: spec.z, duration: spec.settle, ease: ROLE.subject }, spec.at).to(
      plane,
      { autoAlpha: spec.rest, duration: spec.wipe * 0.8, ease: ROLE.support },
      spec.at,
    )

    if (art) tl.to(art, { scale: 1, duration: spec.settle, ease: ROLE.subject }, spec.at)

    // The two that pass the camera. Both sit well off the vanishing point, so
    // coming forward throws them out of frame rather than blowing them up in
    // place — and both are gone before the collapse, so the field flows
    // through rather than only accumulating.
    if (spec.pass) {
      tl.to(
        plane,
        { z: spec.pass.to, duration: spec.pass.run, ease: 'power2.in' },
        spec.pass.at,
      ).to(
        plane,
        { autoAlpha: 0, duration: spec.pass.fade, ease: 'power1.in' },
        spec.pass.at + spec.pass.run - spec.pass.fade,
      )
    }
  })

  /* ── the collapse ───────────────────────────────────────────────
     The vacuum. Not a recession — every remaining plane is pulled onto the
     vanishing point itself, because `sink` is the transform that puts its
     centre exactly there and the depth carries it the rest of the way. So the
     portfolio is not filed away into the distance, it is drawn into the one
     pixel the flower opens from, which the clip then lights.

     Ordered by distance from that point, nearest first, so the suction reads
     as a wave propagating outward rather than as twelve tweens starting at
     once. `power3.in` on all four channels: barely moving, then gone. */
  tl.to(camera, { ...CAMERA.through, duration: COLLAPSE.run, ease: 'power3.in' }, COLLAPSE.at)

  collapsing.forEach(({ plane, spec, sink }, index) => {
    const at = COLLAPSE.at + index * COLLAPSE.stagger

    tl.to(
      plane,
      {
        x: sink.x,
        y: sink.y,
        z: spec.z + COLLAPSE.depth,
        scale: COLLAPSE.scale,
        duration: COLLAPSE.run,
        ease: 'power3.in',
      },
      at,
    ).to(
      plane,
      { autoAlpha: 0, duration: COLLAPSE.run * 0.55, ease: 'power2.in' },
      at + COLLAPSE.run * 0.45,
    )
  })

  // The plum ground clears to the real one, which is the same image — so this
  // is invisible, and from here everything on screen is the live page.
  tl.to(ground, { autoAlpha: 0, duration: CUE.groundRun, ease: EASE.silk }, CUE.ground)

  // The clip: lit under a near-opaque veil, gated on being playable, started.
  if (plate) {
    tl.to(plate, { autoAlpha: 1, duration: CUE.plateIn, ease: 'power2.out' }, CUE.plate)
  }

  tl.call(holdFor(() => clipReady, WAIT.clip), undefined, CUE.clipReady).call(
    startClip,
    undefined,
    CUE.clip,
  )

  if (veil) tl.to(veil, { opacity: 0, duration: VEIL.run, ease: 'power3.in' }, CUE.clip)

  // The fold starts under the plate, a beat after the flower does — so the
  // headline is already moving while the bloom opens, and the two read as one
  // shot rather than as a handover.
  tl.call(releaseFold, undefined, HERO_AT)

  // The match dissolve. Everything below the flower head is already
  // coincident — the clip and the still share a locked camera — so what
  // actually crosses here is one bloom resolving into another, in the same
  // box, in the same light, at the same size.
  if (plate) {
    tl.to(plate, { autoAlpha: 0, duration: CUE.dissolveRun, ease: EASE.silk }, DISSOLVE_AT)
  }

  /* ── the ways out ───────────────────────────────────────────────── */

  function teardownClip() {
    if (!video) return
    video.removeEventListener('canplaythrough', onClipReady)
    video.removeEventListener('canplay', onClipReady)
    video.removeEventListener('error', onClipError)
    video.removeEventListener('loadedmetadata', onClipMeta)
    video.pause()
  }

  function finish() {
    if (over) return
    over = true
    consumeIntro()
    releaseFold()
    restoreScroll()
    teardownClip()
    gsap.set(scope, { autoAlpha: 0, pointerEvents: 'none' })
  }

  /**
   * Refuse the opening — the visitor asked, autoplay was blocked, or the file
   * failed. One path for all three, so the graceful degradation is the same
   * code the skip control exercises.
   */
  function skip() {
    if (over) return
    over = true
    waitingFor = null
    ceiling?.kill()
    ceiling = null
    tl.kill()
    consumeIntro()
    releaseFold()
    restoreScroll()
    teardownClip()

    // Created outside the context (this runs from an event or a callback), so
    // it is tracked and killed by the cleanup rather than by the revert.
    exit = gsap.timeline({ onComplete: () => gsap.set(scope, { pointerEvents: 'none' }) })
    exit.to(scope, { autoAlpha: 0, duration: SKIP_RUN, ease: EASE.silk }, 0)
    if (plate) exit.to(plate, { autoAlpha: 0, duration: SKIP_RUN, ease: EASE.silk }, 0)
  }

  function onKey(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (!SKIP_KEYS.has(event.key)) return
    skip()
  }

  function onClick() {
    skip()
  }

  scope.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)

  return () => {
    scope.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey)
    artwork.forEach((img) => {
      img.removeEventListener('load', onCover)
      img.removeEventListener('error', onCover)
    })
    ceiling?.kill()
    exit?.kill()
    tl.kill()
    teardownClip()
    // Never leave the fold waiting on an opening that is no longer running,
    // or the page locked to an opening that has been unmounted.
    releaseFold()
    restoreScroll()
    lens.forEach((el) => {
      el.style.perspective = ''
      el.style.perspectiveOrigin = ''
    })
    camera.forEach((el) => {
      el.style.transformStyle = ''
    })
  }
}
