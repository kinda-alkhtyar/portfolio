import { FLOW, gsap } from '../motion'

/**
 * The page depth continuum — the one piece of motion that belongs to no
 * section.
 *
 * Every below-fold section was already animated well on its own, and that was
 * exactly the problem: five self-contained performances with hard cuts between
 * them. This gives them a shared room. Each section sits slightly back on one
 * perspective while it is off-screen, comes forward as it arrives, holds at its
 * authored depth for the whole time it is readable, and falls back as it leaves
 * the top of the viewport. Scrolling the page then reads as travelling through
 * a stack of planes rather than past a list of blocks.
 *
 * Three decisions worth keeping:
 *
 *   1. **It holds at exactly z 0 while the section is being read.** A 3D
 *      transform resamples text, so a section that is permanently scaled by a
 *      fraction of a percent is a section with permanently soft type. The
 *      arrival finishes well before the section is centred and the departure
 *      starts well after, which leaves a long untransformed plateau in the
 *      middle. It also means the last section on the page — which can never
 *      scroll far enough to depart — simply rests at its designed size.
 *
 *   2. **The hero fold is deliberately excluded.** Selected Work lives inside
 *      it, and that row derives its drag scale from the panel's rendered width
 *      against its layout width; a scrubbed transform on an ancestor would feed
 *      straight into the drag maths. The fold also pins its decorative layers
 *      to `--screen`. The fold carries its own parallax instead.
 *
 *   3. **The amplitude is tiny on purpose** — `recede` is ~1.6% of foreshorten
 *      at this perspective. It is meant to be felt at the seams between
 *      sections, not seen within one.
 *
 * Channel: `z` (plus the perspective it needs) on the `<section>` element,
 * which no section timeline touches — they all animate their own children.
 */
export function homeFlowMotion({ q }: { q: (selector: string) => HTMLElement[] }) {
  const sections = q('section')
  if (sections.length === 0) return () => {}

  const base = { transformPerspective: FLOW.perspective, transformOrigin: '50% 50%' }

  const tweens = sections.flatMap((section) => [
    /* Arrive: from the back plane to the authored one, finished a quarter of
       the way up the viewport — early enough that the section is never read
       while it is still travelling. */
    gsap.fromTo(
      section,
      { z: FLOW.recede, ...base },
      {
        z: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 75%',
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      },
    ),

    /* Depart: only once the section's bottom has passed well above the fold.
       Written as a `fromTo` rather than a `to` so its start is pinned at z 0.
       A plain `to` records its start lazily, which — with `immediateRender`
       off and the arrival tween writing the same property — would capture
       whatever depth the section happened to be at on first render. */
    gsap.fromTo(
      section,
      { z: 0, ...base },
      {
        z: FLOW.recede,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: 'bottom 25%',
          end: 'bottom top',
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      },
    ),
  ])

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  }
}
