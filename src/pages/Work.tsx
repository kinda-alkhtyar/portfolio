import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import HeroTulip from '../components/HeroTulip'
import Navbar from '../components/Navbar'
import ProjectGridCard from '../components/ProjectGridCard'
import { workProjects } from '../data/workProjects'
import { gsap, prefersReducedMotion, useMotionScope } from '../motion'
import { markFilter, swapIn, swapOut, workMotion } from './workMotion'
import { useLocale, useT } from '../i18n/localization'

const filters = ['ALL PROJECTS', 'BRANDING', 'UI/UX DESIGN', 'GRAPHIC DESIGN', 'AI VIDEO / MOTION'] as const
const PER_PAGE = 5
const TRACK_WIDTH = 423

const pad = (value: number) => String(value).padStart(2, '0')

function NavigationArrow({ direction, disabled, onClick }: { direction: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  const locale = useLocale()
  return (
    <button
      data-motion="arrow"
      type="button"
      aria-label={locale === 'ar' ? (direction === 'left' ? 'المشاريع السابقة' : 'المشاريع التالية') : `${direction} projects`}
      disabled={disabled}
      onClick={onClick}
      className="flex size-[44px] items-center justify-center rounded-full border border-white/25 text-[25px] font-light text-white/80 transition-colors hover:border-purple-light hover:text-purple-light disabled:cursor-default disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:text-white/80"
    >
      {direction === 'left' ? '←' : '→'}
    </button>
  )
}

export default function Work() {
  const t = useT()
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('ALL PROJECTS')
  const [page, setPage] = useState(0)
  const directionRef = useRef<1 | -1>(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const sparkRef = useRef<HTMLSpanElement>(null)
  /** Set by `swap()` so the entrance effect below only runs after a real swap. */
  const enteringRef = useRef(false)
  /** Skips the mark on the first render, where nothing has been chosen yet. */
  const markedRef = useRef(false)

  const filtered = useMemo(
    () => (activeFilter === 'ALL PROJECTS' ? workProjects : workProjects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(currentPage * PER_PAGE, currentPage * PER_PAGE + PER_PAGE)

  const cards = () => gsap.utils.toArray<HTMLElement>('[data-motion="card"]', gridRef.current)

  /* The whole scene — entrance, decorative depth, grid reveal, card tilt,
     filter and arrow response — lives in `workMotion`, run before paint and
     skipped entirely under reduced motion. */
  const scopeRef = useMotionScope<HTMLElement>(workMotion)

  /* Pagination / filter swap.
     Outgoing cards leave in the navigation direction, incoming cards arrive
     from the opposite side. Transform + opacity only, so nothing reflows. */
  useLayoutEffect(() => {
    if (!enteringRef.current) return
    enteringRef.current = false
    const items = cards()
    if (!items.length) return

    swapIn(items, directionRef.current)
    // `cards` reads a ref; the swap is keyed on what is being shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilter])

  /* The active filter's mark is drawn in on each change, never on mount —
     at mount the pill is still arriving on the entrance timeline, and the
     mark should belong to the choice rather than to the page load. */
  useLayoutEffect(() => {
    if (!markedRef.current) {
      markedRef.current = true
      return
    }
    markFilter(sparkRef.current)
  }, [activeFilter])

  function swap(direction: 1 | -1, apply: () => void) {
    const items = cards()
    if (prefersReducedMotion() || window.matchMedia('(max-width: 767.98px)').matches || !items.length) {
      apply()
      return
    }

    directionRef.current = direction
    enteringRef.current = true
    swapOut(items, direction, apply)
  }

  function goToPage(next: number) {
    if (next === currentPage || next < 0 || next > pageCount - 1) return
    swap(next > currentPage ? 1 : -1, () => setPage(next))
  }

  function selectFilter(filter: (typeof filters)[number]) {
    if (filter === activeFilter) return
    swap(1, () => {
      setActiveFilter(filter)
      setPage(0)
    })
  }

  const trackFilled = Math.round((TRACK_WIDTH * (currentPage + 1)) / pageCount)

  return (
    <main ref={scopeRef} className="work-page relative min-h-[1088px] min-w-[1180px] overflow-hidden bg-bg px-[78px] pb-[39px] pt-[37px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(62%_70%_at_68%_35%,#211130_0%,#120a1c_52%,#0b0712_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(115%_100%_at_50%_50%,transparent_48%,rgba(2,1,6,.72)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1288px]">
        <div className="-mx-[39px]">
          <Navbar variant="fixed" top="37px" />
        </div>

        {/* The two plates the page's camera moves between. Both are existing
            sections, tagged rather than added: `workMotion` dollies them in on
            the entrance and separates them in depth as the page scrolls, so
            nothing about the layout, the box model or the order changes. */}
        <section data-motion="plate" className="relative mt-[84px] h-[213px] border-b border-white/15">
          {/* The pb/-mb pair gives the mask room for descenders without
              changing the line box, so the reveal costs no layout. */}
          <p className="work-eyebrow block overflow-hidden pb-[0.12em] -mb-[0.12em] font-nav text-[17px] tracking-[0.24em] text-beige">
            <span data-motion="eyebrow-line" className="block">{t('SELECTED PROJECTS')}</span>
          </p>
          <h1 className="work-title mt-[13px] block overflow-hidden pb-[0.08em] -mb-[0.08em] font-display text-[108px] leading-[0.94] tracking-[0.01em] text-white">
            <span data-motion="title-line" className="block">{t('MY WORK')}</span>
          </h1>
          <p data-motion="lede" className="absolute left-[628px] top-[69px] w-[306px] font-serif text-[18px] leading-[1.38] text-white/70">
            {locale === 'ar' ? <>أصمّم هويات وتجارب رقمية تمنح<br />العلامات حضورًا أوضح، وتحوّل<br />الأفكار إلى تجارب بصرية تُفهم،<br />تُتذكّر، وتدفع الجمهور للتفاعل.</> : <>A selection of branding, digital and<br />UI/UX projects that reflect my approach<br />to design and problem solving.</>}
          </p>

          {/* The decorative stage. It spans the section's padding box exactly,
              so every offset inside it is measured from the same edges as
              before — the wrapper exists only to carry one shared camera and
              the group's own drift. */}
          <div data-motion="work-scene" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div data-motion="ring" className="absolute right-[9px] -top-[21px] size-[367px] rounded-full border border-white/10" />
            <HeroTulip data-motion="tulip" className="absolute -right-[4px] -top-[34px] h-[475px] w-[356px] object-contain object-center" />
            <span data-motion="mark" className="work-mark-a absolute right-[131px] -top-[21px] text-[22px] text-purple-light">+</span>
            <span data-motion="mark" className="work-mark-b absolute -right-[1px] top-[129px] text-[29px] text-white/20">+</span>
            <span data-motion="mark" className="work-mark-c absolute right-[347px] top-[138px] text-[20px] text-purple-light">+</span>
          </div>
        </section>

        <section data-motion="field" className="mt-[30px]">
          <div className="flex h-[43px] items-start justify-between">
            <div className="flex gap-[14px]">
              {filters.map((filter) => {
                const isActive = filter === activeFilter
                return (
                  <button
                    key={filter}
                    data-motion="filter"
                    type="button"
                    onClick={() => selectFilter(filter)}
                    className={`h-[40px] rounded-full px-[24px] font-nav text-[13px] tracking-[0.06em] transition-colors ${isActive ? 'bg-gradient-to-r from-[#c985ec] to-[#e3a5f6] font-semibold text-bg' : 'border border-white/25 text-white/90 hover:border-purple-light'}`}
                  >
                    {t(filter)}{isActive && <span ref={sparkRef} className="ml-[15px] inline-block text-[18px]">✦</span>}
                  </button>
                )
              })}
            </div>
            <p data-motion="sort" className="pt-[13px] font-nav text-[11px] tracking-[0.28em] text-white/35">
              {t('SORT BY')} <span className="ml-[19px] tracking-[0.08em] text-white/75">{t('LATEST')}</span><span className="ml-[13px] text-beige">↓</span>
            </p>
          </div>

          <div ref={gridRef} dir={activeFilter === 'ALL PROJECTS' && currentPage === 0 ? 'ltr' : undefined} data-motion="grid" className="mt-[30px] grid h-[512px] grid-cols-[1.44fr_1fr_1fr] grid-rows-2 gap-[12px]">
            {pageItems.map((project, index) => <ProjectGridCard key={project.title} project={project} featured={index === 0} />)}
          </div>

          <footer data-motion="footer" className="relative mt-[22px] flex h-[45px] items-center justify-center">
            <div className="absolute left-0 flex items-center gap-[25px]">
              <span className="font-nav text-[14px] tracking-[0.22em] text-purple-light">{pad(currentPage + 1)} / {pad(pageCount)}</span>
              <span className="h-px bg-white/65 transition-all duration-300" style={{ width: `${trackFilled}px` }} />
              <span className="h-px bg-white/10 transition-all duration-300" style={{ width: `${TRACK_WIDTH - trackFilled}px` }} />
            </div>
            <div className="flex gap-[13px]">
              <NavigationArrow direction="left" disabled={currentPage === 0} onClick={() => goToPage(currentPage - 1)} />
              <NavigationArrow direction="right" disabled={currentPage >= pageCount - 1} onClick={() => goToPage(currentPage + 1)} />
            </div>
            <p className="absolute right-0 font-nav text-[11px] tracking-[0.42em] text-purple-light">{t('SHOWCASING MINDFUL DESIGN')}</p>
          </footer>
        </section>
      </div>
    </main>
  )
}
