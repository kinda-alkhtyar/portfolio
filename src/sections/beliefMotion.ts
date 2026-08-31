import { BEAT, DUR, EASE, ROLE, STAGGER, TRIGGER, gsap, hasFinePointer } from '../motion'

/**
 * DESIGN IS COMMUNICATION — the image-led scene.
 *
 * Where WHAT I DO assembles a grid tier by tier, this band is composed in
 * planes. Three of them, and they are what make it read as one scene rather
 * than a stack of effects:
 *
 *   far   — the tulip crop, moving strongly behind its window, turned slightly
 *           in perspective and drifting a couple of percent of scale
 *   mid   — the thin frame, the hairline and the plus marks: fixed in the
 *           layout, revealed with delayed precision, leaning to the pointer
 *   near  — the type, which does not move on scroll at all
 *
 * The type is deliberately the still plane. Parallaxed display type at this
 * size stops being legible while it travels, and the depth reads perfectly well
 * from the tulip moving against a statement that holds.
 *
 * The frame is treated as a proscenium: it never moves, so the image travelling
 * inside it is what the eye reads as depth. That is also why nothing here pins
 * or touches the scroll position — the whole effect is one scrubbed transform.
 *
 * Channels, so the three motions never collide:
 *   - masked type owns `yPercent` on the line, `clipPath` on its wrapper
 *   - the entrance owns `autoAlpha` / `y` px / `scale` / `scaleX` / `clipPath`
 *   - the scrubbed plane owns `yPercent` / `z` / `rotationY` / `scale`
 *   - the pointer owns `x` / `y` px and `rotationX`
 */

/**
 * Vertical slack on each mask, in % of the masked line's height, and the start
 * offset that parks the line just past the bottom of its clip.
 *
 * The statement runs Anton at `leading-[0.9]`, so its glyphs overflow their own
 * line box by a wide margin — hence the much looser clip. A negative `inset()`
 * grows the clip beyond the border box, so nothing is ever cropped at rest.
 */
const MASK = {
  label: { slack: 20, rise: 124 },
  statement: { slack: 34, rise: 138 },
} as const

const clipFor = (slack: number) => `inset(-${slack}% 0% -${slack}% 0%)`

/**
 * The scrubbed plane, start → end of the section's travel.
 *
 * Safe by a wide margin: the crop window is 640x474 and the image is drawn at
 * 1810x2413 with 348px of headroom above and 1591px below, so even the extremes
 * here never bring an edge into the window.
 */
const PLANE = {
  from: { yPercent: 6, z: -28, rotationY: 1.1, scale: 1 },
  to: { yPercent: -9.5, z: 48, rotationY: -1.1, scale: 1.025 },
} as const

/**
 * The page's second bloom settle: shorter and shallower than the hero's 1.6s,
 * longer than the CTA's 1.25s. The same gesture, quietening each time.
 */
const SETTLE = 1.45

/** Max px / degrees the pointer may move a plane. */
const LEAN = { plane: 11, planeY: 7, tilt: 0.6, mark: 9 }

export function beliefMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const [band] = q('[data-motion="belief-band"]')
  const label = q('[data-motion="belief-label"]')
  const statement = q('[data-motion="belief-line"]')
  const dot = q('[data-motion="belief-dot"]')
  const frame = q('[data-motion="belief-frame"]')
  const rule = q('[data-motion="belief-rule"]')
  const marks = q('[data-motion="belief-mark"]')
  const note = q('[data-motion="belief-note"]')
  const signature = q('[data-motion="belief-signature"]')
  const plane = q('[data-motion="belief-plane"]')
  const tulip = q('[data-motion="belief-tulip"]')

  const maskOf = (lines: HTMLElement[]) =>
    lines.map((line) => line.parentElement).filter((el): el is HTMLElement => el !== null)

  /* ── initial states ──────────────────────────────────────────────
     Set before the first paint, and skipped whole under reduced motion,
     where the band simply renders as authored. */
  gsap.set(maskOf(label), { clipPath: clipFor(MASK.label.slack) })
  gsap.set(maskOf(statement), { clipPath: clipFor(MASK.statement.slack) })
  gsap.set(label, { yPercent: MASK.label.rise })
  gsap.set(statement, { yPercent: MASK.statement.rise })
  gsap.set(tulip, { autoAlpha: 0, scale: 1.045, transformOrigin: '50% 45%' })
  gsap.set(frame, { clipPath: 'inset(0% 0% 100% 0%)' })
  gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(marks, { autoAlpha: 0, scale: 0.7 })
  gsap.set(dot, { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 50%' })
  gsap.set(note, { autoAlpha: 0, y: 22 })
  gsap.set(signature, { autoAlpha: 0, y: 16 })

  /* ── entrance ───────────────────────────────────────────────────
     Triggered off the band, not the section: the section carries 196px
     of lead padding, and firing on that would start the scene while the
     band is still below the fold. */
  const tl = gsap.timeline({
    defaults: { ease: ROLE.support },
    scrollTrigger: { trigger: band ?? scope, start: TRIGGER.reveal, once: true },
  })

  tl.to(label, { yPercent: 0, duration: DUR.hero, ease: ROLE.subject, stagger: 0.075 }, BEAT.open)
    // The image runs under everything else and takes the longest to settle,
    // so the scene is still arriving while the statement is already readable.
    .to(tulip, { autoAlpha: 1, scale: 1, duration: SETTLE, ease: ROLE.subject }, BEAT.lead)
    .to(statement, { yPercent: 0, duration: DUR.epic, ease: ROLE.subject, stagger: 0.1 }, BEAT.subject + BEAT.lead)
    // The precision layer lands only once the type has stopped moving.
    .to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.epic, ease: ROLE.structure }, BEAT.detail - BEAT.lead)
    .to(rule, { scaleX: 1, duration: DUR.hero, ease: ROLE.structure }, BEAT.detail + BEAT.lead)
    .to(marks, { autoAlpha: 1, scale: 1, duration: DUR.base, stagger: STAGGER.loose }, BEAT.support)
    .to(dot, { autoAlpha: 1, scale: 1, duration: DUR.base }, BEAT.support + BEAT.lead)
    .to(note, { autoAlpha: 1, y: 0, duration: DUR.epic }, BEAT.close - BEAT.lead)
    .to(signature, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.close + BEAT.lead)

  /* ── the far plane ──────────────────────────────────────────────
     One scrubbed tween on the wrapper inside the crop window, so the
     image travels, turns and grows as a single object. `z` under a
     perspective is what keeps it from reading as a flat slide. */
  const drift = gsap.fromTo(
    plane,
    { ...PLANE.from, transformPerspective: 1400, transformOrigin: '50% 50%' },
    {
      ...PLANE.to,
      ease: 'none',
      scrollTrigger: {
        trigger: scope,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    },
  )

  /* ── pointer depth ──────────────────────────────────────────────
     Tiny, and on channels the scrub does not use, so the two compose
     instead of fighting. Fine pointers only. */
  let stopPointer = () => {}

  if (hasFinePointer()) {
    const settle = { duration: 1.2, ease: EASE.expo }
    const planeX = plane.map((el) => gsap.quickTo(el, 'x', settle))
    const planeY = plane.map((el) => gsap.quickTo(el, 'y', settle))
    const planeTilt = plane.map((el) => gsap.quickTo(el, 'rotationX', settle))
    const markX = marks.map((el) => gsap.quickTo(el, 'x', settle))
    const markY = marks.map((el) => gsap.quickTo(el, 'y', settle))

    const lean = (nx: number, ny: number) => {
      planeX.forEach((to) => to(nx * LEAN.plane))
      planeY.forEach((to) => to(ny * LEAN.planeY))
      planeTilt.forEach((to) => to(-ny * LEAN.tilt))
      markX.forEach((to) => to(nx * LEAN.mark))
      markY.forEach((to) => to(ny * LEAN.mark * 0.6))
    }

    const onMove = (event: PointerEvent) => {
      const box = scope.getBoundingClientRect()
      lean(
        gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width) * 2 - 1),
        gsap.utils.clamp(-1, 1, ((event.clientY - box.top) / box.height) * 2 - 1),
      )
    }

    const onLeave = () => lean(0, 0)

    scope.addEventListener('pointermove', onMove, { passive: true })
    scope.addEventListener('pointerleave', onLeave)

    stopPointer = () => {
      scope.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf([...plane, ...marks])
    }
  }

  return () => {
    stopPointer()
    drift.scrollTrigger?.kill()
    drift.kill()
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
