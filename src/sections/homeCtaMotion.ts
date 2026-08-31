import { BEAT, DUR, EASE, ROLE, STAGGER, TRIGGER, gsap, hasFinePointer, magnetic } from '../motion'

/**
 * The closing CTA — the last thing the page says, and the handoff into the
 * footer.
 *
 * It is built as an invitation rather than an announcement, so the order is
 * deliberately conversational: the hairline opens the section, the statement
 * lands line by line, the supporting layer (the vertical rule and the sparkle)
 * arrives only once the type has stopped moving, and the pill is last — it is
 * the one thing the visitor is meant to act on, so nothing else is still
 * moving when it settles.
 *
 * The tulip runs underneath all of it on a slow scale settle, which is what
 * gives the band depth without any of the type having to travel.
 *
 * The handoff: past the entrance the section keeps one very small scrubbed
 * lift, so the band is still easing into place as the footer comes up under
 * it. It is transform-only and single-digit px — the point is that the page
 * arrives at its end rather than stopping at it.
 *
 * Channels, so nothing collides:
 *   - masked type owns `yPercent` on the line, `clipPath` on its wrapper
 *   - the entrance owns `autoAlpha` / `y` px / `scale` / `scaleX` / `scaleY`
 *   - the scrubbed far plane owns `yPercent` / `scale` on the tulip wrapper
 *   - the scrubbed handoff owns `y` px on the band, which nothing else touches
 *   - the magnetic pull owns `x` / `y` / `scale` on the pill itself, one level
 *     inside the wrapper the entrance moves
 */

/**
 * Vertical slack on the statement's mask, in % of the line's height, and the
 * start offset that parks the line just past the bottom of its clip.
 *
 * Montserrat 800 at `leading-[0.97]` overflows its line box modestly — far
 * less than Anton does — so the clip only needs to be grown by about a quarter
 * of a line for nothing to be cropped at rest.
 */
const MASK = { slack: 26, rise: 130 } as const

const clipFor = (slack: number) => `inset(-${slack}% 0% -${slack}% 0%)`

/** The scrubbed far plane, start to end of the section's travel. */
const PLANE = {
  from: { yPercent: 5, scale: 1.028 },
  to: { yPercent: -5.5, scale: 1 },
} as const

/**
 * The page's third and last bloom settle — the shortest and shallowest of the
 * three (hero 1.6s, Belief 1.45s), so the gesture fades out of the page rather
 * than being played at full strength a third time.
 */
const SETTLE = 1.25

/** The tail lift that hands the band to the footer, in px. */
const HANDOFF = -7

/** Max px the pointer may move each layer. */
const LEAN = { sparkle: 6, sparkleY: 4, plane: 7, planeY: 5 }

export function homeCtaMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const [band] = q('[data-motion="cta-band"]')
  const rule = q('[data-motion="cta-rule"]')
  const lines = q('[data-motion="cta-line"]')
  const divider = q('[data-motion="cta-divider"]')
  const sparkle = q('[data-motion="cta-sparkle"]')
  const buttonWrap = q('[data-motion="cta-button-wrap"]')
  const [button] = q('[data-motion="cta-button"]')
  const plane = q('[data-motion="cta-plane"]')

  const maskOf = (items: HTMLElement[]) =>
    items.map((line) => line.parentElement).filter((el): el is HTMLElement => el !== null)

  /* ── initial states ──────────────────────────────────────────────
     Set before the first paint, and skipped whole under reduced motion,
     where the section simply renders as authored. */
  gsap.set(maskOf(lines), { clipPath: clipFor(MASK.slack) })
  gsap.set(lines, { yPercent: MASK.rise })
  gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(divider, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(sparkle, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
  gsap.set(buttonWrap, { autoAlpha: 0, y: 26, scale: 0.965, transformOrigin: '50% 50%' })
  gsap.set(plane, { autoAlpha: 0, scale: 1.045, transformOrigin: '30% 70%' })

  /* ── entrance ───────────────────────────────────────────────────
     One timeline off one trigger on the band, so the tiers keep their
     relationship instead of each firing at its own scroll line. */
  const tl = gsap.timeline({
    defaults: { ease: ROLE.support },
    scrollTrigger: { trigger: band ?? scope, start: TRIGGER.reveal, once: true },
  })

  tl
    // The hairline opens the section: it is the only thing that moves first.
    .to(rule, { scaleX: 1, duration: DUR.hero, ease: ROLE.structure }, BEAT.open)
    // The leaves run under everything and take the longest to settle, so the
    // band is still arriving while the statement is already readable.
    .to(plane, { autoAlpha: 1, scale: 1, duration: SETTLE, ease: ROLE.subject }, BEAT.lead)
    .to(lines, { yPercent: 0, duration: DUR.epic, ease: ROLE.subject, stagger: STAGGER.loose }, BEAT.subject)
    // The supporting layer lands only once the type has stopped moving.
    .to(divider, { scaleY: 1, duration: DUR.hero, ease: ROLE.structure }, BEAT.detail + BEAT.lead)
    .to(sparkle, { autoAlpha: 1, scale: 1, duration: DUR.base }, BEAT.support)
    // The pill is last, and alone: nothing else is in motion when it settles.
    .to(buttonWrap, { autoAlpha: 1, y: 0, scale: 1, duration: DUR.epic }, BEAT.close - BEAT.lead)

  /* ── the far plane ──────────────────────────────────────────────
     One scrubbed tween on the leaves' wrapper, so the crop drifts and
     eases out of its over-scale across the whole section. */
  const drift = gsap.fromTo(plane, PLANE.from, {
    ...PLANE.to,
    ease: 'none',
    scrollTrigger: {
      trigger: scope,
      start: TRIGGER.parallaxStart,
      end: TRIGGER.parallaxEnd,
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  })

  /* ── handoff into the footer ────────────────────────────────────
     A single-digit lift over the section's last stretch of travel. Small
     enough that no edge visibly shifts, large enough that the band reads
     as settling into the footer rather than butting against it. */
  const handoff = gsap.fromTo(
    band ?? scope,
    { y: 0 },
    {
      y: HANDOFF,
      ease: 'none',
      scrollTrigger: {
        trigger: band ?? scope,
        start: 'bottom 92%',
        end: 'bottom 58%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    },
  )

  /* ── the magnetic pill ──────────────────────────────────────────
     The shared `magnetic` helper: it opts out on coarse pointers and
     under reduced motion on its own, and clears its transform on
     teardown. The label is pulled at well under the pill's strength,
     which is what makes the button feel weighted rather than sliding. */
  const stopMagnetic = button
    ? magnetic(button, {
        strength: 0.24,
        scale: 1.03,
        child: { selector: '[data-motion="cta-button-label"]', strength: 0.1 },
      })
    : () => {}

  /* ── pointer depth ──────────────────────────────────────────────
     Tiny, on channels the scrub does not use, so the two compose.
     The type never leans — display copy this size stops reading while
     it moves, exactly as in the Belief band. */
  let stopPointer = () => {}

  if (hasFinePointer()) {
    const settle = { duration: 1.2, ease: EASE.expo }
    const planeX = plane.map((el) => gsap.quickTo(el, 'x', settle))
    const planeY = plane.map((el) => gsap.quickTo(el, 'y', settle))
    const sparkX = sparkle.map((el) => gsap.quickTo(el, 'x', settle))
    const sparkY = sparkle.map((el) => gsap.quickTo(el, 'y', settle))

    const lean = (nx: number, ny: number) => {
      planeX.forEach((to) => to(nx * LEAN.plane))
      planeY.forEach((to) => to(ny * LEAN.planeY))
      sparkX.forEach((to) => to(nx * LEAN.sparkle))
      sparkY.forEach((to) => to(ny * LEAN.sparkleY))
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
      gsap.killTweensOf([...plane, ...sparkle])
    }
  }

  return () => {
    stopPointer()
    stopMagnetic()
    handoff.scrollTrigger?.kill()
    handoff.kill()
    drift.scrollTrigger?.kill()
    drift.kill()
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
