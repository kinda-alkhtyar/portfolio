import { Link } from 'react-router-dom'

import type { Project } from '../data/projects'

/**
 * Selected Work card.
 *
 * In the reference the cards are full-bleed covers inside the row panel —
 * no footer bar, no chrome — with the project name set over the bottom-left
 * corner on a soft scrim. Height comes from the row panel; width is passed in,
 * because both rows run their own mixed-width rhythm. The cover is decorative
 * (`alt=""`) — the card is named by the project title beside it — and the scrim
 * is weighted to hold contrast under a title that wraps to three or four lines.
 *
 * The `data-motion` hooks are read by `selectedWorkMotion.ts`, which owns the
 * tilt, the cover parallax and the title response. Nothing here animates on its
 * own, so a card rendered under reduced motion is simply the static card.
 *
 * `decorative` marks the repeated copies that make the row loop seamless: they
 * are hidden from assistive tech by their wrapper and taken out of the tab
 * order here, so the ten projects are still announced and tabbed exactly once.
 */
export default function WorkCard({
  project,
  width,
  decorative = false,
}: {
  project: Project
  width: number
  decorative?: boolean
}) {
  return (
    <Link
      to={`/work/${project.slug}`}
      style={{ width }}
      data-motion="work-card"
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className="group relative h-full shrink-0 overflow-hidden rounded-[9px] bg-purple-dark/70"
    >
      <img
        src={project.cover}
        alt=""
        data-motion="work-card-media"
        style={{
          objectPosition: project.coverPosition,
          transform: project.coverZoom ? `scale(${project.coverZoom})` : undefined,
        }}
        className={`size-full ${project.coverFit === 'contain' ? 'object-contain' : 'object-cover'}`}
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,4,14,0.94)_0%,rgba(8,4,14,0.82)_22%,rgba(8,4,14,0.6)_45%,rgba(8,4,14,0.28)_68%,rgba(8,4,14,0)_92%)]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[9px] ring-1 ring-inset ring-white/8 transition-colors group-hover:ring-purple-light/55"
      />

      <h3
        data-motion="work-card-title"
        className="absolute bottom-[19px] left-[22px] max-w-[150px] font-nav text-[21px] font-semibold leading-[1.12] tracking-[0.02em] text-white"
      >
        {project.title}
      </h3>

      {/* Hover rule. Sits under the title without occupying layout, so the
          card's spacing is untouched whether it is drawn or not. */}
      <span
        aria-hidden="true"
        data-motion="work-card-rule"
        className="absolute bottom-[11px] left-[22px] h-px w-[38px] origin-left scale-x-0 bg-purple-light/75"
      />
    </Link>
  )
}
