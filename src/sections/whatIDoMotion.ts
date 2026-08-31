import { BEAT, DUR, EASE, HOVER, ROLE, STAGGER, TRIGGER, gsap, hasFinePointer, parallax } from '../motion'

/**
 * WHAT I DO — editorial entrance.
 *
 * The section's own language, deliberately unlike the hero (which arrives as
 * one composition) and unlike Selected Work (which never stops): here the block
 * builds in reading order and then holds still. Label, columns, numerals,
 * hairlines, titles, body — each tier waits for the one above it to settle, so
 * the grid assembles rather than appears.
 *
 * The masks are applied here rather than in the markup. A `clip-path` inset
 * with vertical slack clips the rise without ever cropping a glyph that
 * overflows its own line box — Anton and Oswald both sit tight on `leading-none`
 * — and because it is set from JS, reduced motion and a JS failure both leave
 * the type completely untouched.
 *
 * Channel discipline, as in the hero, so nothing collides:
 *   - entrance owns `autoAlpha` / `y` px / `scaleY` on the column and its rule
 *   - masked type owns `yPercent`
 *   - scroll depth owns `yPercent` on the column
 *   - the pointer lean owns `x` / `y` px on an inner wrapper
 *   - hover owns `y` px on the numeral and title, which only carry `yPercent`
 */

/** Vertical slack on each mask, in % of the masked line's height. */
const MASK_SLACK = 20
const MASK_CLIP = `inset(-${MASK_SLACK}% 0% -${MASK_SLACK}% 0%)`
/** Start offset that parks a masked line just past the bottom of its clip. */
const RISE = 100 + MASK_SLACK + 4

/**
 * Scroll drift per column, in % of the column's own height. Uneven on purpose:
 * three equal offsets would read as one moving block instead of three planes.
 */
const DRIFT = [-2.4, -5.2, -3.4]

/** Max px each column leans toward the pointer. Multiplied while hovered. */
const LEAN = [5, 8, 5.5]
const LEAN_HOVER = 1.6

/** Hover lift, px. Small enough to read as depth rather than as a button. */
const LIFT = { index: -7, title: -3 }

export function whatIDoMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const label = q('[data-motion="wid-label"]')
  const cols = q('[data-motion="wid-col"]')
  const inners = q('[data-motion="wid-inner"]')
  const indexes = q('[data-motion="wid-index"]')
  const titles = q('[data-motion="wid-title"]')
  const bodies = q('[data-motion="wid-body"]')
  const rules = q('[data-motion="wid-rule"]')
  const mark = q('[data-motion="wid-mark"]')

  const lines = [...label, ...indexes, ...titles]
  const masks = lines
    .map((line) => line.parentElement)
    .filter((el): el is HTMLElement => el !== null)

  /* ── initial states ──────────────────────────────────────────────
     Written before the first paint by `useMotionScope`, and skipped
     entirely under reduced motion, where the section simply renders. */
  gsap.set(masks, { clipPath: MASK_CLIP })
  gsap.set(lines, { yPercent: RISE })
  gsap.set(cols, { autoAlpha: 0, y: 26 })
  gsap.set(bodies, { autoAlpha: 0, y: 16 })
  gsap.set(rules, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(mark, { autoAlpha: 0, scale: 0.7 })

  /* ── entrance ───────────────────────────────────────────────────
     One timeline off one trigger, so the three columns keep their
     relationship instead of each firing at its own scroll position. */
  const tl = gsap.timeline({
    defaults: { ease: ROLE.support },
    scrollTrigger: { trigger: scope, start: TRIGGER.reveal, once: true },
  })

  tl.to(label, { yPercent: 0, duration: DUR.hero, ease: ROLE.subject }, BEAT.open)
    .to(cols, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose }, BEAT.subject)
    // The numerals are the heading tier here — longest travel, slowest ease.
    .to(indexes, { yPercent: 0, duration: DUR.epic, ease: ROLE.subject, stagger: 0.09 }, BEAT.subject + BEAT.lead)
    // The hairlines draw down through the settled columns, one after the next.
    .to(rules, { scaleY: 1, duration: DUR.hero, ease: ROLE.structure, stagger: STAGGER.loose }, BEAT.structure)
    .to(titles, { yPercent: 0, duration: DUR.hero, ease: ROLE.subject, stagger: 0.09 }, BEAT.detail - BEAT.lead)
    .to(mark, { autoAlpha: 1, scale: 1, duration: DUR.base }, BEAT.detail + BEAT.lead)
    .to(bodies, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose }, BEAT.support)

  /* ── scroll depth ───────────────────────────────────────────────
     A few px of differential drift as the section passes. Scrubbed with
     lag so the columns trail the page rather than track the scrollbar. */
  const stopParallax = cols.map((col, i) =>
    parallax(col, {
      yPercent: DRIFT[i % DRIFT.length],
      trigger: scope,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    }),
  )

  /* ── pointer lean + hover ───────────────────────────────────────
     One delegated listener for the whole section. `quickTo` retargets a
     live tween per channel, so a pointermove costs a couple of writes. */
  let stopPointer = () => {}

  if (hasFinePointer()) {
    const settle = { duration: 1.1, ease: EASE.expo }
    const leaners = inners.map((el, i) => ({
      base: LEAN[i % LEAN.length],
      toX: gsap.quickTo(el, 'x', settle),
      toY: gsap.quickTo(el, 'y', settle),
    }))

    let hovered = -1

    const lean = (nx: number, ny: number) => {
      leaners.forEach(({ toX, toY, base }, i) => {
        // The hovered block follows a little harder — the magnetic part.
        const depth = i === hovered ? base * LEAN_HOVER : base
        toX(nx * depth)
        toY(ny * depth * 0.6)
      })
    }

    const lift = (index: number, on: boolean) => {
      gsap.to(indexes[index], { y: on ? LIFT.index : 0, ...HOVER })
      gsap.to(titles[index], { y: on ? LIFT.title : 0, ...HOVER })
    }

    const onMove = (event: PointerEvent) => {
      const box = scope.getBoundingClientRect()
      lean(
        gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width) * 2 - 1),
        gsap.utils.clamp(-1, 1, ((event.clientY - box.top) / box.height) * 2 - 1),
      )
    }

    const onOver = (event: PointerEvent) => {
      const col = (event.target as Element | null)?.closest?.<HTMLElement>(
        '[data-motion="wid-col"]',
      )
      const next = col ? cols.indexOf(col) : -1
      if (next === hovered) return
      if (hovered >= 0) lift(hovered, false)
      hovered = next
      if (hovered >= 0) lift(hovered, true)
    }

    const onLeave = () => {
      if (hovered >= 0) lift(hovered, false)
      hovered = -1
      lean(0, 0)
    }

    scope.addEventListener('pointermove', onMove, { passive: true })
    scope.addEventListener('pointerover', onOver, { passive: true })
    scope.addEventListener('pointerleave', onLeave)

    stopPointer = () => {
      scope.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerover', onOver)
      scope.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf([...inners, ...indexes, ...titles])
    }
  }

  return () => {
    stopPointer()
    stopParallax.forEach((stop) => stop())
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
