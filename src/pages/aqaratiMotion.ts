import { BEAT, DUR, ROLE, STAGGER, TRIGGER, gsap, parallax } from '../motion'

/**
 * AQARATI SYRIA — the case study as a product being presented.
 *
 * SECOND LIFE is a set of drawings: every plate there unrolls out of a
 * clip-path, because its subject is a printed identity. AQARATI's subject is a
 * working product, so nothing here is uncovered — **the screens are brought
 * forward**. Each plate arrives out of depth on a shared perspective, settles
 * to exactly z 0, and the copy beside it leads in from the side the layout
 * already puts it on. No frame on this page is ever clipped; that gesture
 * belongs to the other project and is deliberately left there.
 *
 * What ties it to the rest of the portfolio: the shared `BEAT` grid, the
 * `ROLE` easing set, the house `parallax()` helper, and the same channel
 * discipline every other page follows.
 *
 *   figure    autoAlpha, x / y px, z — the arrival; xPercent / yPercent — the
 *             scrubbed drift, which no arrival ever writes
 *   image     scale — the settle behind the arrival, and nothing else
 *   type      autoAlpha, x / y px, and z on the title
 *   rules     scaleX from the left
 *
 * **The flagged captures are never scaled.** `properties-ar.png` is clipped
 * mid-search-bar with no navbar, and `cities-map-en.png` shows the map with
 * its listing counts empty; the page already contains both rather than running
 * them full-bleed. Motion follows the same rule — those two are placed and
 * nothing more, so no frame of any animation ever renders them larger than the
 * layout asks for.
 *
 * Written for `useMotionScope`: it runs before paint, is skipped entirely
 * under reduced motion (leaving the page exactly as authored), and reverts the
 * context on unmount. The returned cleanup kills every scroll trigger.
 */

/* ── depth ─────────────────────────────────────────────────────────── */

/**
 * One lens for the whole page. Long enough that a 700px-wide screen arriving
 * from 220px of depth foreshortens by about a seventh — read as approach, not
 * as perspective distortion.
 */
const PERSPECTIVE = 1500

/**
 * How far back each screen starts, in px of z. The ladder is the page's
 * emphasis order rather than its reading order: the login screen is the
 * product's one decisive moment and comes from furthest away, the two flagged
 * captures barely move at all.
 */
const DEPTH = {
  title: -120,
  hero: -180,
  lang: [-110, -150],
  listings: -60,
  map: -140,
  login: -220,
} as const

/**
 * Sideways lead, in px. Every column enters from the side the layout already
 * puts it on, so the motion agrees with the composition instead of cutting
 * across it. The multilingual pair is the one place two neighbours lead in
 * opposite directions.
 */
const LEAD = {
  lang: [-22, 22],
  accountsCopy: -18,
  accountsScreen: 26,
  aboutScreen: -14,
  aboutCopy: 14,
} as const

/**
 * The settle behind each arrival: how far over the image starts and how long
 * it takes to reach its authored size. `0` opts a screen out entirely — the
 * two flagged captures and the closing screen all take that path.
 */
const SETTLE = { hero: 1.8, lang: 1.5, login: 2 } as const
const OVER = { hero: 1.05, lang: 1.045, login: 1.06 } as const

/**
 * Scrubbed drift, in % of the layer's own dimension.
 *
 * The multilingual pair is the only *horizontal* drift on the site: two
 * renderings of one screen easing apart as you pass them, which is the whole
 * point of that section. It is kept under a percent and a half — about 7px on
 * a 620px plate — because anything more reads as a layout bug rather than as
 * depth.
 */
const DRIFT = { hero: -3, lang: [-1.1, 1.1], map: -4.5 } as const

/**
 * Seconds the top of the page holds when it is already on screen at setup, so
 * the case study opens once rather than twice. Skipped when the visitor has
 * scrolled to it, where the reveal should answer the scroll.
 */
const HANDOFF = 0.9

/* ── readers ───────────────────────────────────────────────────────── */

type PlateParts = {
  figure: HTMLElement
  image: HTMLElement | null
  caption: HTMLElement | null
}

/**
 * The shared `Plate` renders `figure > div.frame > img` with an optional
 * `figcaption`. The frame is deliberately not read here: this page never
 * touches it, which is what keeps the two case studies' languages apart.
 *
 * Kept local rather than shared with `secondLifeMotion` on purpose — each
 * page's motion file stays self-contained, and this is six lines.
 */
const plate = (figure: HTMLElement): PlateParts => ({
  figure,
  image: figure.querySelector('img'),
  caption: figure.querySelector('figcaption'),
})

type HeadParts = {
  header: HTMLElement
  row: HTMLElement | null
  rule: HTMLElement | null
  title: HTMLElement | null
  body: HTMLElement[]
}

/** The shared `SectionHead`: `p(index · rule · eyebrow)`, `h2`, body stack. */
const head = (header: HTMLElement): HeadParts => ({
  header,
  row: header.querySelector('p'),
  rule: header.querySelector('span[aria-hidden="true"]'),
  title: header.querySelector('h2'),
  body: gsap.utils.toArray<HTMLElement>('div > p', header),
})

export function aqaratiMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const timelines: gsap.core.Timeline[] = []
  const stops: Array<() => void> = []

  const handoff = (element: Element) =>
    element.getBoundingClientRect().top < window.innerHeight ? HANDOFF : 0

  const stage = (trigger: Element, start: string = TRIGGER.reveal) => {
    const tl = gsap.timeline({
      defaults: { ease: ROLE.support },
      scrollTrigger: { trigger, start, once: true },
    })
    timelines.push(tl)
    return tl
  }

  const find = (hook: string) => q(`[data-motion="${hook}"]`)
  const platesOf = (hook: string) => find(hook).map(plate)
  const headOf = (hook: string) => {
    const [element] = find(hook)
    return element ? head(element) : null
  }

  /* ── initial states ───────────────────────────────────────────
     Written before the first paint, and never reached at all under
     reduced motion, where the page simply renders as authored. */

  const plates = q('figure').map(plate)
  plates.forEach(({ caption }) => gsap.set(caption, { autoAlpha: 0, y: 10 }))

  const setHead = (parts: HeadParts, x = 0) => {
    gsap.set(parts.header, { x })
    gsap.set(parts.row, { autoAlpha: 0, y: 14 })
    gsap.set(parts.rule, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(parts.title, { autoAlpha: 0, y: 20 })
    gsap.set(parts.body, { autoAlpha: 0, y: 18 })
  }

  /**
   * Places one head on the beat grid. The column slides home first, then the
   * index, the rule, the title and the copy assemble inside it — so the block
   * arrives as a panel and fills in, which is how a product page reads.
   */
  const playHead = (
    tl: gsap.core.Timeline,
    parts: HeadParts,
    at: number,
    subject: number = DUR.hero,
  ) => {
    tl.to(parts.header, { x: 0, duration: DUR.epic, ease: ROLE.subject }, at)
      .to(parts.row, { autoAlpha: 1, y: 0, duration: DUR.base }, at)
      .to(parts.rule, { scaleX: 1, duration: DUR.slow, ease: ROLE.structure }, at + BEAT.lead)
      .to(parts.title, { autoAlpha: 1, y: 0, duration: subject, ease: ROLE.subject }, at + BEAT.lead)
      .to(
        parts.body,
        { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose },
        at + BEAT.structure,
      )
  }

  /**
   * The page's one repeated gesture: a screen brought forward out of depth to
   * exactly z 0, with the image behind it easing out of a small over-scale.
   *
   * `over: 0` skips the scale entirely — the path the two flagged captures and
   * the closing screen take, so those three are placed and never resized.
   */
  const playScreen = (
    tl: gsap.core.Timeline,
    parts: PlateParts,
    at: number,
    {
      z = 0,
      x = 0,
      y = 30,
      over = 0,
      settle = SETTLE.lang,
      duration = DUR.epic,
    }: { z?: number; x?: number; y?: number; over?: number; settle?: number; duration?: number } = {},
  ) => {
    gsap.set(parts.figure, { autoAlpha: 0, x, y, z, transformPerspective: PERSPECTIVE })
    tl.to(
      parts.figure,
      { autoAlpha: 1, x: 0, y: 0, z: 0, duration, ease: ROLE.subject },
      at,
    )

    if (over > 0 && parts.image) {
      gsap.set(parts.image, { scale: over, transformOrigin: '50% 50%' })
      // Runs past the arrival on purpose: the screen is already in place while
      // its content is still coming to rest, which is what reads as focus.
      tl.to(parts.image, { scale: 1, duration: settle, ease: ROLE.subject }, at)
    }

    tl.to(parts.caption, { autoAlpha: 1, y: 0, duration: DUR.base }, at + duration * 0.55)
  }

  /* ══ the title block ═══════════════════════════════════════════
     The one timeline with no scroll trigger: it is the page opening, and
     it waits out the route wipe. The shared `CaseStudyHeader` carries no
     hooks of its own — the other case studies render it untouched — so
     its parts are read off the one unambiguous element in the section,
     the `h1`. The title comes forward rather than wiping: this page's
     whole vocabulary is approach, and it starts here. */
  const [intro] = find('aq-intro')
  const [title] = intro ? gsap.utils.toArray<HTMLElement>('h1', intro) : []
  const back = intro ? gsap.utils.toArray<HTMLElement>('a', intro)[0] : null
  const category = (title?.previousElementSibling as HTMLElement | null) ?? null
  const subtitle = (title?.nextElementSibling as HTMLElement | null) ?? null
  const lede = (title?.parentElement?.nextElementSibling as HTMLElement | null) ?? null
  const facts = q('dl > div')

  gsap.set([back, category, subtitle, lede], { autoAlpha: 0, y: 16 })
  gsap.set(title, { autoAlpha: 0, y: 24, z: DEPTH.title, transformPerspective: PERSPECTIVE })
  // The facts read as a spec row here rather than a stacked list, so they
  // assemble left to right instead of rising together.
  gsap.set(facts, { autoAlpha: 0, x: 10, y: 10 })

  const opening = gsap.timeline({ delay: 0.35, defaults: { ease: ROLE.support } })
  timelines.push(opening)

  opening
    .to(back, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.open)
    .to(category, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.open + BEAT.lead)
    .to(
      title,
      { autoAlpha: 1, y: 0, z: 0, duration: DUR.epic, ease: ROLE.subject },
      BEAT.subject,
    )
    .to(subtitle, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.structure)
    .to(lede, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.structure + BEAT.lead)
    .to(
      facts,
      { autoAlpha: 1, x: 0, y: 0, duration: DUR.slow, stagger: STAGGER.base },
      BEAT.support,
    )

  /* ══ 01 hero ═══════════════════════════════════════════════════
     The deepest arrival in the upper half of the page and the first
     statement of the gesture: the product comes to the front. Held
     behind the title block on load so the page opens once. */
  const heroHead = headOf('aq-head-hero')
  const [heroScreen] = platesOf('aq-hero')

  if (heroScreen) {
    const tl = stage(heroScreen.figure, TRIGGER.media)
    const lead = handoff(heroScreen.figure)
    if (heroHead) {
      setHead(heroHead)
      playHead(tl, heroHead, lead + BEAT.open, DUR.epic)
    }
    playScreen(tl, heroScreen, lead + BEAT.detail, {
      z: DEPTH.hero,
      y: 40,
      over: OVER.hero,
      settle: SETTLE.hero,
      duration: DUR.epic * 1.2,
    })

    stops.push(
      parallax(heroScreen.figure, {
        yPercent: DRIFT.hero,
        trigger: heroScreen.figure,
        scrub: 0.8,
      }),
    )
  }

  /* ══ 02 multilingual ═══════════════════════════════════════════
     The same screen in two languages. They lead in from opposite sides
     at two different depths, and then — the only horizontal drift on the
     site — ease apart as the section passes, so the pair reads as one
     product rendered twice rather than as two screenshots. */
  const langHead = headOf('aq-head-multilingual')
  const lang = platesOf('aq-lang')

  if (lang.length) {
    const tl = stage(lang[0].figure)
    if (langHead) {
      setHead(langHead)
      playHead(tl, langHead, BEAT.open)
    }

    lang.forEach((parts, index) => {
      playScreen(tl, parts, BEAT.detail + index * BEAT.lead, {
        z: DEPTH.lang[index] ?? DEPTH.lang[0],
        x: LEAD.lang[index] ?? 0,
        y: 26,
        over: OVER.lang,
        settle: SETTLE.lang,
      })
    })
  }

  lang.forEach(({ figure }, index) => {
    stops.push(
      parallax(figure, {
        yPercent: 0,
        xPercent: DRIFT.lang[index] ?? 0,
        trigger: figure,
        scrub: 0.85,
      }),
    )
  })

  /* ══ 03 listings ═══════════════════════════════════════════════
     A flagged capture, already contained at 82% because it is clipped
     mid-search-bar with no navbar. The motion is the most restrained on
     the page to match: the shallowest arrival, no scale, no drift. */
  const listingsHead = headOf('aq-head-listings')
  const [listings] = platesOf('aq-listings')

  if (listings) {
    const tl = stage(listings.figure)
    if (listingsHead) {
      setHead(listingsHead)
      playHead(tl, listingsHead, BEAT.open)
    }
    playScreen(tl, listings, BEAT.detail, {
      z: DEPTH.listings,
      y: 24,
      duration: DUR.hero,
    })
  }

  /* ══ 04 discovery ══════════════════════════════════════════════
     The other flagged capture — the governorate map with its counts
     empty — contained beside a sticky column. Its spatial reading comes
     from the arrival depth and from gliding past copy the layout holds
     still, never from scaling the capture. */
  const discoveryHead = headOf('aq-head-discovery')
  const [map] = platesOf('aq-map')
  const note = find('aq-note')

  if (map) {
    gsap.set(note, { autoAlpha: 0, y: 12 })

    const tl = stage(map.figure, TRIGGER.media)
    if (discoveryHead) {
      setHead(discoveryHead)
      playHead(tl, discoveryHead, BEAT.open)
    }
    tl.to(note, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.support)
    playScreen(tl, map, BEAT.subject, {
      z: DEPTH.map,
      y: 34,
      duration: DUR.epic * 1.15,
    })

    stops.push(parallax(map.figure, { yPercent: DRIFT.map, trigger: map.figure, scrub: 0.85 }))
  }

  /* ══ 05 accounts ═══════════════════════════════════════════════
     The product's one decisive screen, and the page's focal beat. The
     copy leads in from the left, the screen answers from the right out
     of the deepest z on the page, and its content takes the slowest
     settle — the eye lands here and is meant to stay. Nothing drifts:
     a focused screen should be still once it has arrived. */
  const accountsHead = headOf('aq-head-accounts')
  const [login] = platesOf('aq-login')

  if (login) {
    const tl = stage(login.figure)
    if (accountsHead) {
      setHead(accountsHead, LEAD.accountsCopy)
      playHead(tl, accountsHead, BEAT.open, DUR.epic)
    }
    playScreen(tl, login, BEAT.subject, {
      z: DEPTH.login,
      x: LEAD.accountsScreen,
      y: 32,
      over: OVER.login,
      settle: SETTLE.login,
      duration: DUR.epic * 1.25,
    })
  }

  /* ══ 06 about ══════════════════════════════════════════════════
     The quiet close. The layout mirrors — screen left, copy right — and
     so does the motion, at half the amplitude: no depth, no scale, no
     drift. The page has finished making its case. */
  const aboutHead = headOf('aq-head-about')
  const [aboutScreen] = platesOf('aq-about')

  if (aboutScreen) {
    const tl = stage(aboutScreen.figure)
    if (aboutHead) {
      setHead(aboutHead, LEAD.aboutCopy)
      playHead(tl, aboutHead, BEAT.lead)
    }
    playScreen(tl, aboutScreen, BEAT.open, {
      x: LEAD.aboutScreen,
      y: 22,
      duration: DUR.epic,
    })
  }

  /* ══ outro ═════════════════════════════════════════════════════ */
  const [outro] = gsap.utils.toArray<HTMLElement>('section:last-of-type > div', scope)

  if (outro) {
    gsap.set(outro, { autoAlpha: 0, y: 14 })
    const tl = stage(outro)
    tl.to(outro, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.open)
  }

  return () => {
    stops.forEach((stop) => stop())
    timelines.forEach((tl) => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
  }
}
