import { useRef } from 'react'

import WorkCard from '../components/WorkCard'
import { projects } from '../data/projects'
import { useMotionScope, useReducedMotion } from '../motion'
import { createRowLoop, selectedWorkIntro, type RowLoopControls } from './selectedWorkMotion'
import { useT } from '../i18n/localization'

/**
 * Card widths, in reference pixels scaled to the 1440 canvas. Both rows run a
 * mixed rhythm, so the set never repeats on an obvious beat as it loops.
 */
const ROW_ONE_WIDTHS = [312, 258, 212, 194, 300]
const ROW_TWO_WIDTHS = [256, 246, 234, 216, 320]

/** Gap between cards, in px. Must match the `gap-[8px]` on the track. */
const GAP = 8

/**
 * Copies of the card set laid end to end inside the track.
 *
 * The loop wraps by one set width, so the track only has to be wide enough
 * that a full panel is still covered at the moment it wraps: `copies × set ≥
 * panel + set`. The panel is at most 1268px and a set is ~1310px, so three
 * copies clear it at every width the desktop layout reaches.
 */
const COPIES = 3

const PANEL_BASE =
  'relative h-[214px] rounded-[14px] border border-white/10 bg-white/[0.02] p-[5px]'

/**
 * Looping panel. `touch-pan-y` is the important part: a vertical swipe still
 * scrolls the page, a horizontal one drags the row, and no wheel event is
 * intercepted anywhere.
 */
const PANEL_LOOP = `${PANEL_BASE} cursor-grab select-none touch-pan-y overflow-hidden active:cursor-grabbing`

/**
 * Reduced-motion panel. Nothing moves on its own, so the row falls back to a
 * plain horizontally scrollable strip of one set — the motion was carrying the
 * reachability, and something has to take that over.
 */
const PANEL_STATIC = `${PANEL_BASE} overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-p-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`

/**
 * The gutter arrow. It advances the row along its own direction of travel —
 * a nudge into the loop rather than a jump to an end, since the loop has none.
 */
function RowArrow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute left-full top-1/2 ml-[26px] -translate-y-1/2 cursor-pointer text-purple-light/85 hover:text-purple-light"
    >
      <svg
        viewBox="0 0 34 12"
        aria-hidden="true"
        className="h-[12px] w-[34px] fill-none stroke-current"
        strokeWidth="1.4"
      >
        <path d="M0 6h32M26.5 1 32 6l-5.5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/**
 * One work row. The number and the scroll hint hang in the left gutter
 * (`right-full`), so the panel itself keeps the hero headline's left edge and
 * the two rows stack dead flush.
 *
 * The two rows travel in opposite directions, which is what stops the block
 * reading as a pair of marquees and makes it read as one composition.
 */
function WorkRow({
  index,
  widths,
  from,
  direction,
}: {
  index: string
  widths: number[]
  from: number
  direction: -1 | 1
}) {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const controls = useRef<RowLoopControls>({ nudge: () => {} })

  /** One set, including the gap that follows its last card — the wrap period. */
  const setWidth = widths.reduce((total, width) => total + width, 0) + GAP * widths.length

  const rowRef = useMotionScope<HTMLDivElement>((helpers) =>
    createRowLoop(helpers, { direction, setWidth, controls }),
  )

  const cards = projects.slice(from, from + widths.length)

  const advance = () => {
    if (!reduced) {
      controls.current.nudge()
      return
    }

    // Reduced motion: no loop to nudge, so the arrow runs the static strip to
    // its end and back, which is all the travel there is.
    const panel = panelRef.current
    if (!panel) return
    const end = panel.scrollWidth - panel.clientWidth
    panel.scrollLeft = panel.scrollLeft >= end - 1 ? 0 : end
  }

  return (
    <div ref={rowRef} data-motion="work-row" className="relative">
      <div
        data-motion="work-gutter"
        className="absolute right-full top-1/2 mr-[-3px] w-[72px] -translate-y-1/2 text-center"
      >
        <p className="font-display text-[50px] leading-none tracking-[0.01em] text-purple-light [-webkit-text-stroke:0.75px_currentColor] [text-shadow:0_0_20px_rgba(192,143,224,0.5)]">
          {index}
        </p>
        <p className="mt-[13px] font-nav text-[10px] font-medium leading-[1.7] tracking-[0.16em] text-white/40">
          SCROLL TO
          <br />
          EXPLORE
        </p>
      </div>

      <div
        ref={panelRef}
        data-motion="work-panel"
        className={reduced ? PANEL_STATIC : PANEL_LOOP}
      >
        <div
          data-motion="work-track"
          className="flex h-full w-max gap-[8px] will-change-transform"
        >
          {Array.from({ length: reduced ? 1 : COPIES }).flatMap((_, copy) =>
            cards.map((project, i) => (
              <WorkCard
                key={`${copy}-${project.id}`}
                project={project}
                width={widths[i]}
                decorative={copy > 0}
              />
            )),
          )}
        </div>
      </div>

      <RowArrow label={`Advance work row ${index}`} onClick={advance} />
    </div>
  )
}

/**
 * Selected Work — two numbered rows read as one block, exactly as in the
 * reference. It still lives in the hero fold's content column, so row 01
 * breaks the bottom of the first screen and row 02 follows immediately.
 *
 * Both rows drift continuously in opposite directions. Hovering a card slows
 * its row rather than stopping it, focusing a card holds the row still, and
 * `prefers-reduced-motion` replaces the loop with a static scrollable strip.
 */
export default function SelectedWork() {
  const t = useT()
  // The block's own arrival, overlapping the hero's tail. The two rows keep
  // their own scopes for the loop; this one only handles the landing.
  const sectionRef = useMotionScope<HTMLElement>(selectedWorkIntro)

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="mt-[var(--work-top)] max-w-[calc(1440px_-_var(--content-pl))] pr-[var(--content-pl)]"
    >
      <h2 className="font-nav text-[16px] font-semibold leading-none tracking-[0.3em] text-beige">
        <span className="block">
          <span data-motion="work-label" className="block">
            {t('SELECTED WORK')}
          </span>
        </span>
      </h2>

      <div className="mt-[var(--work-gap)] flex flex-col gap-[30px]">
        <WorkRow index="01" widths={ROW_ONE_WIDTHS} from={0} direction={-1} />
        <WorkRow index="02" widths={ROW_TWO_WIDTHS} from={5} direction={1} />
      </div>
    </section>
  )
}
