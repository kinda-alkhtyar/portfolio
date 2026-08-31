import { BEAT, DUR, ROLE, STAGGER, gsap, magnetic } from '../motion'

/**
 * The footer — deliberately the quietest scene on the page.
 *
 * Everything above it has been building: the CTA ends on a magnetic pill and a
 * scrubbed lift. The footer's job is to catch that and stop, so every value
 * here is smaller and softer than the CTA's — half its travel, no masks, no
 * scrubbed planes, no parallax. The band drifts up a few px as one object,
 * which is what makes it read as the continuation of the CTA's handoff rather
 * than a new section announcing itself.
 *
 * It is opt-in: `SiteFooter` carries the hooks but runs no scope of its own, so
 * the same component on a case study page renders completely untouched. Only
 * `Home` mounts this. That is the same arrangement the hero uses for the shared
 * `Navbar`.
 *
 * Channels, so nothing collides:
 *   - the entrance owns `autoAlpha` / `y` px / `scale` / `scaleX`
 *   - the magnetic pull owns `x` / `y` px on the nav items, and is bound only
 *     once the entrance has finished writing their `y`
 */

/** Entrance travel, in px. Roughly half the CTA's, on purpose. */
const RISE = { band: 14, logo: 12, item: 12 } as const

/**
 * The nav items' magnetic pull. Well under the CTA pill's 0.24 and with no
 * scale at all — at this size the response should be felt, not seen.
 */
const MAGNET = 0.14

export function siteFooterMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const [band] = q('[data-motion="footer-band"]')
  const rule = q('[data-motion="footer-rule"]')
  const logo = q('[data-motion="footer-logo"]')
  const note = q('[data-motion="footer-note"]')
  const items = q('[data-motion="footer-link"]')
  const meta = q('[data-motion="footer-meta"]')

  /* ── initial states ──────────────────────────────────────────────
     Set before the first paint, and skipped whole under reduced motion,
     where the footer simply renders as authored. */
  gsap.set(band ?? scope, { y: RISE.band })
  gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' })
  // Left origin, so the wordmark settles out of its scale without its edge
  // sliding off the gutter the whole column is aligned to.
  gsap.set(logo, { autoAlpha: 0, scale: 0.94, y: RISE.logo, transformOrigin: '0% 50%' })
  gsap.set(note, { autoAlpha: 0, y: RISE.item })
  gsap.set(items, { autoAlpha: 0, y: RISE.item })
  gsap.set(meta, { autoAlpha: 0, y: RISE.item })

  /* ── entrance ───────────────────────────────────────────────────
     The shared `TRIGGER.reveal` line (`top 82%`) cannot be used here: the
     footer is the last element on the page, so at maximum scroll its top
     never travels higher than its own height above the viewport bottom —
     on a tall viewport that line is never crossed and the footer would
     stay hidden. Firing just inside the bottom edge is always reachable. */
  const magnets: (() => void)[] = []

  const tl = gsap.timeline({
    defaults: { ease: ROLE.support },
    scrollTrigger: { trigger: band ?? scope, start: 'top bottom-=24', once: true },
    // The pull is bound only after the entrance has stopped writing `y`, so
    // the two never own the same channel at the same time.
    onComplete: () => {
      items.forEach((item) => magnets.push(magnetic(item, { strength: MAGNET })))
    },
  })

  tl
    // The band arrives as one object — this is the CTA's lift, continued.
    .to(band ?? scope, { y: 0, duration: 1.25, ease: ROLE.subject }, BEAT.open)
    .to(rule, { scaleX: 1, duration: DUR.hero, ease: ROLE.structure }, BEAT.open)
    .to(logo, { autoAlpha: 1, scale: 1, y: 0, duration: DUR.slow }, BEAT.lead)
    .to(note, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.subject + BEAT.lead)
    .to(items, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.tight }, BEAT.structure)
    .to(meta, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.structure + BEAT.lead)

  return () => {
    magnets.forEach((stop) => stop())
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
