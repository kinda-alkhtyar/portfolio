import {
  BEAT,
  DUR,
  ROLE,
  STAGGER,
  gsap,
  hasFinePointer,
  prefersReducedMotion,
} from '../motion'

/**
 * /contact — one screen, one shot.
 *
 * The same grammar as /about, played quieter still. The page never scrolls, so
 * everything hangs off a single entrance on the shared `BEAT` grid:
 *
 *   1. the left statement opens — label, rule, the two headline lines, lede
 *   2. the decorative group arrives out of depth on the right and stays alive
 *      (tulip, ring and marks lean toward the pointer and breathe on their own
 *      clocks, exactly as they do on /about and /work)
 *   3. the contact rows draw their hairlines, then the form panel settles and
 *      its fields arrive last
 *
 * Every layer rests at z 0, scale 1 and no rotation, so the shared perspective
 * is a no-op on the authored geometry and the page still measures as designed.
 *
 * Written for `useMotionScope`: run before paint, skipped entirely under
 * reduced motion, context-reverted on unmount. The returned cleanup detaches
 * the pointer listeners and the ticker.
 */

/* ── the camera ────────────────────────────────────────────────────── */

const SCENE = {
  perspective: '1400px',
  /** The vanishing point sits on the backdrop ring's centre. */
  origin: '1043px 372px',
  /* Arabic mirrors the group to the physical left, so the same point is
     measured from the left edge (1440 - 1043). One camera either way. */
  originRtl: '397px 372px',
} as const

/** The Arabic layout is mirrored, so the origin above swaps with it. */
const isRtl = () => document.documentElement.dir === 'rtl'

/** How far behind the camera each layer opens, in px of z. */
const ARRIVE = {
  eyebrow: -34,
  title: -88,
  lede: -50,
  tulip: -130,
  ring: -190,
  mark: -150,
  row: -60,
  panel: -120,
  field: -40,
} as const

/** The bloom's scale settle — a quieter reprise of the Home hero's. */
const SETTLE = 1.3

/* ── the live scene ────────────────────────────────────────────────── */

/** Max px of lean and max degrees of tilt per layer: one depth ladder. */
const DEPTH = {
  tulip: { lean: 13, rotX: 0.65, rotY: 0.9 },
  mark: { lean: 10, rotX: 0.46, rotY: 0.7 },
  ring: { lean: 7, rotX: 0.34, rotY: 0.48 },
} as const

/** The idle life of the group, at roughly a fifth of the pointer's authority. */
const IDLE = {
  tulip: { x: 2.8, y: 3.5, rotX: 0.18, rotY: 0.24, breath: 0.003, rate: 1 },
  mark: { x: 2, y: 2.5, rotX: 0.15, rotY: 0.18, breath: 0, rate: 0.83 },
  ring: { x: 1.4, y: 1.8, rotX: 0.08, rotY: 0.12, breath: 0, rate: 0.61 },
} as const

/** Base angular speeds, rad/s, one per channel and deliberately unrelated. */
const IDLE_HZ = { x: 0.36, y: 0.29, rotX: 0.23, rotY: 0.31, breath: 0.19 } as const

/** Second harmonic at the golden ratio of the first: quasi-periodic drift. */
const PHI = 1.618

/** Pointer follow smoothing. Long enough to read as weight, not as lag. */
const FOLLOW = 0.12

type Layer = 'tulip' | 'mark' | 'ring'

interface Live {
  kind: Layer
  /** Per-element phase, so two marks never breathe in lockstep. */
  seed: number
  set: (vars: gsap.TweenVars) => void
  reset: () => void
}

const wave = (t: number, hz: number, phase: number) =>
  (Math.sin(t * hz + phase) + Math.sin(t * hz * PHI + phase * PHI) * 0.5) / 1.5

export function contactMotion({ scope, q }: { scope: HTMLElement; q: (s: string) => HTMLElement[] }) {
  if (prefersReducedMotion()) return

  const stage = q('[data-motion="contact-scene"]')[0]

  /* One lens over the decorative group. */
  if (stage) {
    stage.style.perspective = SCENE.perspective
    stage.style.perspectiveOrigin = isRtl() ? SCENE.originRtl : SCENE.origin
  }

  const layers: Layer[] = ['tulip', 'mark', 'ring']
  const live: Live[] = layers.flatMap((kind) =>
    q(`[data-motion="${kind}"]`).map((el, index) => ({
      kind,
      seed: index * 1.7 + (kind === 'tulip' ? 0 : kind === 'mark' ? 0.9 : 2.3),
      set: gsap.quickSetter(el, 'css') as (vars: gsap.TweenVars) => void,
      reset: () => {
        el.style.transform = ''
      },
    })),
  )

  /* ── entrance ──────────────────────────────────────────────────── */

  const tl = gsap.timeline({ defaults: { ease: ROLE.support } })

  tl.from(
    q('[data-motion="eyebrow-line"]'),
    { yPercent: 110, z: ARRIVE.eyebrow, duration: DUR.slow, ease: ROLE.subject },
    BEAT.open,
  )
    .from(
      q('[data-motion="rule"]'),
      { scaleX: 0, duration: DUR.slow, ease: ROLE.structure, stagger: STAGGER.tight },
      BEAT.open + BEAT.lead,
    )
    .from(
      q('[data-motion="title-line"]'),
      {
        yPercent: 112,
        z: ARRIVE.title,
        duration: DUR.epic,
        ease: ROLE.subject,
        stagger: STAGGER.base,
      },
      BEAT.subject,
    )
    .from(
      q('[data-motion="lede-line"]'),
      { yPercent: 105, autoAlpha: 0, z: ARRIVE.lede, duration: DUR.slow, stagger: STAGGER.text },
      BEAT.structure,
    )
    .from(
      q('[data-motion="ring"]'),
      { autoAlpha: 0, scale: 0.9, z: ARRIVE.ring, duration: DUR.epic, ease: ROLE.subject },
      BEAT.open + BEAT.lead,
    )
    .from(
      q('[data-motion="tulip"]'),
      { autoAlpha: 0, scale: 1.06, z: ARRIVE.tulip, duration: SETTLE, ease: ROLE.subject },
      BEAT.open,
    )
    .from(
      q('[data-motion="mark"]'),
      { autoAlpha: 0, scale: 0.5, z: ARRIVE.mark, duration: DUR.slow, stagger: STAGGER.loose },
      BEAT.detail,
    )
    .from(
      q('[data-motion="panel"]'),
      { autoAlpha: 0, y: 34, z: ARRIVE.panel, duration: DUR.hero, ease: ROLE.subject },
      BEAT.structure,
    )
    .from(
      q('[data-motion="row-rule"]'),
      { scaleX: 0, duration: DUR.slow, ease: ROLE.structure, stagger: STAGGER.tight },
      BEAT.structure + BEAT.lead,
    )
    .from(
      q('[data-motion="row-part"]'),
      { autoAlpha: 0, y: 16, z: ARRIVE.row, duration: DUR.base, stagger: 0.045 },
      BEAT.support,
    )
    .from(
      q('[data-motion="field"]'),
      { autoAlpha: 0, y: 14, z: ARRIVE.field, duration: DUR.base, stagger: STAGGER.tight },
      BEAT.support + BEAT.lead,
    )
    .from(
      q('[data-motion="send"]'),
      { autoAlpha: 0, y: 12, duration: DUR.slow, ease: ROLE.subject },
      BEAT.close,
    )

  /* ── the live scene ────────────────────────────────────────────── */

  const pointer = { x: 0, y: 0 }
  const eased = { x: 0, y: 0 }
  let breathing = false

  const onMove = (event: PointerEvent) => {
    const box = scope.getBoundingClientRect()
    pointer.x = gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width - 0.5) * 2)
    pointer.y = gsap.utils.clamp(-1, 1, ((event.clientY - box.top) / box.height - 0.5) * 2)
  }
  const onLeave = () => {
    pointer.x = 0
    pointer.y = 0
  }

  const fine = hasFinePointer()
  if (fine) {
    window.addEventListener('pointermove', onMove, { passive: true })
    scope.addEventListener('pointerleave', onLeave)
  }

  const tick = () => {
    if (!breathing) return

    eased.x += (pointer.x - eased.x) * FOLLOW
    eased.y += (pointer.y - eased.y) * FOLLOW
    const time = gsap.ticker.time

    live.forEach(({ kind, seed, set }) => {
      const depth = DEPTH[kind]
      const idle = IDLE[kind]
      const clock = time * idle.rate

      set({
        x: eased.x * depth.lean + wave(clock, IDLE_HZ.x, seed) * idle.x,
        y: eased.y * depth.lean + wave(clock, IDLE_HZ.y, seed + 1.1) * idle.y,
        rotationX: -eased.y * depth.rotX + wave(clock, IDLE_HZ.rotX, seed + 2.2) * idle.rotX,
        rotationY: eased.x * depth.rotY + wave(clock, IDLE_HZ.rotY, seed + 3.3) * idle.rotY,
        scale: 1 + (idle.breath ? wave(clock, IDLE_HZ.breath, seed) * idle.breath : 0),
        force3D: true,
      })
    })
  }
  gsap.ticker.add(tick)

  /* The group only starts breathing once it has finished arriving, so the
     entrance owns x / y / rotation on its own and the two never fight. */
  tl.call(() => {
    breathing = true
  })

  return () => {
    if (fine) {
      window.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerleave', onLeave)
    }
    gsap.ticker.remove(tick)
    // Killing the entrance also cancels its pending call, so unmounting
    // mid-entrance can never start the ticker after the teardown has run.
    tl.kill()
    // The group's drift is written by `quickSetter`, not by a tween, so the
    // context has nothing recorded for it to revert.
    live.forEach(({ reset }) => reset())
    if (stage) {
      stage.style.perspective = ''
      stage.style.perspectiveOrigin = ''
    }
  }
}
