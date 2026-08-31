import { BEAT, DUR, ROLE, STAGGER, TRIGGER, gsap, parallax } from '../motion'

/**
 * SECOND LIFE — the case study as a set of drawings being laid down.
 *
 * The page needed a language of its own. Home is a cinematic fold with a
 * camera and living decorative layers; /work is a depth grid you reach into.
 * A case study is neither — it is read, in order, at length, and its subject
 * is a body of finished work. So the device here is architectural rather than
 * atmospheric: **every plate uncovers**. A clip-path opens each frame from its
 * top edge downward, taking the frame's hairline border with it, while the
 * image inside settles out of a small over-scale behind it. Nothing on this
 * page pops, slides in from the side, or bounces; sheets are unrolled.
 *
 * What ties it to the rest of the portfolio: the shared `BEAT` grid, the
 * `ROLE` easing set (subjects drift, structure is silk, support is expo), the
 * house parallax helper, and the same channel discipline every other page
 * follows.
 *
 *   frame     clipPath — the uncover, and nothing else ever writes it
 *   image     scale — the settle behind the wipe, and the tall screen's push
 *   figure    y px + z (arrival depth) and yPercent (scrubbed drift)
 *   type      autoAlpha + y px, and clipPath on the two display headlines,
 *             which wipe themselves rather than rising out of a wrapper —
 *             no mask element exists in the shared markup and none was added
 *   rules     scaleX from the left
 *
 * Deliberately **not** done: the Home depth continuum (`homeFlowMotion`) is
 * not applied here. It holds sections at exactly z 0 while they are read,
 * which is safe for type, but this page is almost entirely large bitmaps and
 * a scrubbed 3D transform on their containers would resample them for the
 * whole scroll. The plate rhythm is this page's spine instead.
 *
 * Written for `useMotionScope`: it runs before paint, is skipped entirely
 * under reduced motion (leaving the page exactly as authored), and reverts
 * the context on unmount. The returned cleanup kills every scroll trigger.
 */

/* ── the uncover ───────────────────────────────────────────────────── */

/**
 * The page's one repeated gesture. `inset(0% 0% 100% 0%)` hides the frame
 * behind its own bottom edge; opening it to zero unrolls the plate downward
 * from its top edge, hairline border included.
 */
const WIPE = { closed: 'inset(0% 0% 100% 0%)', open: 'inset(0% 0% 0% 0%)' } as const

/**
 * The two display headlines wipe themselves, because the shared markup has no
 * mask element and adding one would change the DOM every case study renders.
 * The slack is vertical only, so a descender is never clipped at rest.
 */
const TYPE_SLACK = 14
const TYPE_CLOSED = `inset(-${TYPE_SLACK}% 0% 100% 0%)`
const TYPE_OPEN = `inset(-${TYPE_SLACK}% 0% -${TYPE_SLACK}% 0%)`

/**
 * How long the image behind each wipe takes to reach its authored size, and
 * how far over it starts. The ladder is the page's emphasis order: supporting
 * plates do not settle at all, the closing crate takes the longest.
 */
const SETTLE = { plate: 1.6, tall: 2, crate: 1.9 } as const
const OVER = { plate: 1.06, crate: 1.09 } as const

/** Arrival depth, px of z, for the two sections that are staged rather than read. */
const DEPTH = { perspective: 1200, application: [-90, -130], crate: -70 } as const

/**
 * Scrubbed drift, in % of the layer's own height.
 *
 * The identity pair is asymmetric so two boards of near-identical weight stop
 * reading as one block; the passport pair is deliberately *opposing*, which is
 * the only place on the site two neighbours move against each other — a tag
 * and the book it belongs to, separating as you pass them.
 */
const DRIFT = {
  identity: [-3.2, -6.4],
  passport: [-3.5, 3.5],
  tall: -5,
  crate: -4,
} as const

/**
 * Seconds a section holds when it is already on screen at setup, so the top of
 * the page lands after the title block instead of alongside it. Skipped when
 * the visitor has scrolled to it, where the reveal should answer the scroll.
 */
const HANDOFF = 0.9

/* ── helpers ───────────────────────────────────────────────────────── */

type PlateParts = {
  figure: HTMLElement
  frame: HTMLElement | null
  image: HTMLElement | null
  caption: HTMLElement | null
}

/**
 * The shared `Plate` renders `figure > div.frame > img` with an optional
 * `figcaption`. Reading the three out of the figure keeps every hook on the
 * page in one file rather than spread through markup eight projects share.
 */
const plate = (figure: HTMLElement): PlateParts => ({
  figure,
  frame: figure.firstElementChild as HTMLElement | null,
  image: figure.querySelector('img'),
  caption: figure.querySelector('figcaption'),
})

type HeadParts = {
  row: HTMLElement | null
  rule: HTMLElement | null
  title: HTMLElement | null
  body: HTMLElement[]
}

/**
 * The shared `SectionHead` — and the closing block, which repeats its shape
 * inline — render `p(index · rule · eyebrow)`, `h2`, then a stack of body
 * paragraphs. The closing block is read with the same function precisely
 * because it is the same composition at a larger size.
 */
const head = (header: HTMLElement): HeadParts => ({
  row: header.querySelector('p'),
  rule: header.querySelector('span[aria-hidden="true"]'),
  title: header.querySelector('h2'),
  body: gsap.utils.toArray<HTMLElement>('div > p', header),
})

export function secondLifeMotion({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const timelines: gsap.core.Timeline[] = []
  const stops: Array<() => void> = []

  /** Held only while a section is on screen at setup — see `HANDOFF`. */
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

  /* ── initial states ───────────────────────────────────────────
     Written before the first paint, and never reached at all under
     reduced motion, where the page simply renders as authored. */

  const plates = q('figure').map(plate)
  const heads = q('[data-motion^="cs-head-"]')
  const closingCopy = q('[data-motion="cs-closing-copy"]')

  plates.forEach(({ frame, caption }) => {
    gsap.set(frame, { clipPath: WIPE.closed })
    gsap.set(caption, { autoAlpha: 0, y: 10 })
  })

  const setHead = (parts: HeadParts) => {
    gsap.set(parts.row, { autoAlpha: 0, y: 14 })
    gsap.set(parts.rule, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(parts.title, { clipPath: TYPE_CLOSED, y: 16 })
    gsap.set(parts.body, { autoAlpha: 0, y: 18 })
  }

  const headParts = [...heads, ...closingCopy].map(head)
  headParts.forEach(setHead)

  /**
   * Places one head on the beat grid. The rule draws in under the index
   * before the title opens, so the structure is on the page before the
   * statement is — which is the whole reason this page reads as drawn.
   */
  const playHead = (
    tl: gsap.core.Timeline,
    parts: HeadParts,
    at: number,
    subject: number = DUR.hero,
  ) => {
    tl.to(parts.row, { autoAlpha: 1, y: 0, duration: DUR.base }, at)
      .to(parts.rule, { scaleX: 1, duration: DUR.slow, ease: ROLE.structure }, at + BEAT.lead)
      .to(
        parts.title,
        { clipPath: TYPE_OPEN, y: 0, duration: subject, ease: ROLE.subject },
        at + BEAT.lead,
      )
      .to(
        parts.body,
        { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose },
        at + BEAT.structure,
      )
  }

  /**
   * The uncover, plus the settle behind it. `over: 0` opts a plate out of the
   * settle entirely — the supporting pair takes that path, so the quietest
   * beat on the page is a wipe and nothing else.
   */
  const playPlate = (
    tl: gsap.core.Timeline,
    parts: PlateParts,
    at: number,
    {
      wipe = DUR.epic,
      over = OVER.plate,
      settle = SETTLE.plate,
    }: { wipe?: number; over?: number; settle?: number } = {},
  ) => {
    tl.to(parts.frame, { clipPath: WIPE.open, duration: wipe, ease: ROLE.structure }, at)
    if (over > 0 && parts.image) {
      gsap.set(parts.image, { scale: over, transformOrigin: '50% 50%' })
      // Starts with the wipe and finishes well after it: the plate is fully
      // uncovered while the image is still coming to rest behind it.
      tl.to(parts.image, { scale: 1, duration: settle, ease: ROLE.subject }, at)
    }
    tl.to(parts.caption, { autoAlpha: 1, y: 0, duration: DUR.base }, at + wipe * 0.55)
  }

  const find = (hook: string) => q(`[data-motion="${hook}"]`)
  const platesOf = (hook: string) => find(hook).map(plate)
  const headOf = (hook: string) => {
    const [element] = find(hook)
    return element ? head(element) : null
  }

  /* ══ the title block ═══════════════════════════════════════════
     The one timeline on the page with no scroll trigger: it is the page
     opening, and it waits out the route wipe exactly as /work does. The
     shared `CaseStudyHeader` carries no hooks of its own — the seven other
     case studies render it untouched — so its parts are read off the one
     element that is unambiguous inside the section, the `h1`. */
  const [intro] = find('cs-intro')
  const [title] = intro ? gsap.utils.toArray<HTMLElement>('h1', intro) : []
  const back = intro ? gsap.utils.toArray<HTMLElement>('a', intro)[0] : null
  const category = (title?.previousElementSibling as HTMLElement | null) ?? null
  const subtitle = (title?.nextElementSibling as HTMLElement | null) ?? null
  const lede = (title?.parentElement?.nextElementSibling as HTMLElement | null) ?? null
  const facts = q('dl > div')

  gsap.set([back, category, subtitle, lede], { autoAlpha: 0, y: 16 })
  gsap.set(title, { clipPath: TYPE_CLOSED, y: 20 })
  gsap.set(facts, { autoAlpha: 0, y: 14 })

  const opening = gsap.timeline({ delay: 0.35, defaults: { ease: ROLE.support } })
  timelines.push(opening)

  opening
    .to(back, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.open)
    .to(category, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.open + BEAT.lead)
    .to(
      title,
      { clipPath: TYPE_OPEN, y: 0, duration: DUR.epic, ease: ROLE.subject },
      BEAT.subject,
    )
    .to(subtitle, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.structure)
    .to(lede, { autoAlpha: 1, y: 0, duration: DUR.slow }, BEAT.structure + BEAT.lead)
    // The facts strip fills in like a spec table — the most architectural
    // moment in the opening, so it takes the tightest stagger on the page.
    .to(facts, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.tight }, BEAT.support)

  /* ══ hero ══════════════════════════════════════════════════════
     Held behind the title block on load, so the page opens once rather
     than twice. The hero plate is the first uncover a visitor sees and
     takes the longest wipe of the upper half of the page. */
  const heroHead = headOf('cs-head-hero')
  const [heroPlate] = platesOf('cs-hero-plate')

  if (heroPlate) {
    const tl = stage(heroPlate.figure, TRIGGER.media)
    const lead = handoff(heroPlate.figure)
    if (heroHead) playHead(tl, heroHead, lead + BEAT.open, DUR.epic)
    playPlate(tl, heroPlate, lead + BEAT.detail, { wipe: DUR.epic * 1.15 })
  }

  /* ══ identity pair ═════════════════════════════════════════════
     Asymmetric on purpose. Two boards of near-identical weight side by
     side will read as one object unless something separates them, so the
     right board opens a full beat later, settles faster, and drifts twice
     as far as the left one on the way past. */
  const identityHead = headOf('cs-head-identity')
  const identity = platesOf('cs-identity')

  if (identity.length) {
    const [left, right] = identity
    const tl = stage(identity[0].figure)
    if (identityHead) playHead(tl, identityHead, BEAT.open)
    playPlate(tl, left, BEAT.detail)
    playPlate(tl, right, BEAT.detail + BEAT.structure, { settle: SETTLE.plate * 0.85 })
  }

  identity.forEach(({ figure }, index) => {
    stops.push(
      parallax(figure, {
        yPercent: DRIFT.identity[index] ?? DRIFT.identity[0],
        trigger: figure,
        scrub: 0.7,
      }),
    )
  })

  /* ══ passport pair ═════════════════════════════════════════════
     The tag and the book it belongs to. They uncover together — they are
     one object in the story — and then drift *against* each other as the
     section passes, which is the only opposing pair on the site. */
  const passportHead = headOf('cs-head-passport')
  const passport = platesOf('cs-passport')

  if (passport.length) {
    const tl = stage(passport[0].figure)
    if (passportHead) playHead(tl, passportHead, BEAT.open)
    passport.forEach((parts, index) => {
      playPlate(tl, parts, BEAT.detail + index * STAGGER.loose)
    })
  }

  passport.forEach(({ figure }, index) => {
    stops.push(
      parallax(figure, {
        yPercent: DRIFT.passport[index] ?? 0,
        trigger: figure,
        scrub: 0.8,
      }),
    )
  })

  /* ══ the tall archive screen ═══════════════════════════════════
     The one portrait file in the set, shown whole beside a sticky column.
     The layout already holds the copy still while the screen travels; the
     motion only makes that relationship visible — the longest wipe on the
     page, the slowest settle, and a drift that lets the screen rise past
     the held caption. No scrubbed transform is applied inside its frame:
     a permanent over-scale would crop a full-page capture at rest. */
  const archiveHead = headOf('cs-head-archive')
  const [tall] = platesOf('cs-tall')
  const note = find('cs-note')
  const [wide] = platesOf('cs-wide')

  if (tall) {
    gsap.set(note, { autoAlpha: 0, y: 12 })

    const tl = stage(tall.figure, TRIGGER.media)
    if (archiveHead) playHead(tl, archiveHead, BEAT.open)
    tl.to(note, { autoAlpha: 1, y: 0, duration: DUR.base }, BEAT.support)
    playPlate(tl, tall, BEAT.subject, {
      wipe: DUR.epic * 1.35,
      settle: SETTLE.tall,
    })

    stops.push(parallax(tall.figure, { yPercent: DRIFT.tall, trigger: tall.figure, scrub: 0.85 }))
  }

  if (wide) {
    const tl = stage(wide.figure, TRIGGER.media)
    playPlate(tl, wide, handoff(wide.figure) + BEAT.open, { wipe: DUR.epic * 1.1 })
  }

  /* ══ supporting UI ═════════════════════════════════════════════
     The quietest beat on the page, and the only plates that do not settle
     behind their wipe: two secondary screens with no section head of
     their own should not perform. A wipe, a short stagger, nothing else. */
  const support = platesOf('cs-support')

  if (support.length) {
    const tl = stage(support[0].figure, TRIGGER.media)
    support.forEach((parts, index) => {
      playPlate(tl, parts, BEAT.open + index * STAGGER.loose, { wipe: DUR.hero, over: 0 })
    })
  }

  /* ══ applications ══════════════════════════════════════════════
     Staged rather than read: two product mockups that arrive out of
     depth on their own perspective, at two different distances, so the
     pair has a near and a far rather than a left and a right. */
  const applicationsHead = headOf('cs-head-applications')
  const applications = platesOf('cs-application')

  if (applications.length) {
    const tl = stage(applications[0].figure)
    if (applicationsHead) playHead(tl, applicationsHead, BEAT.open)

    applications.forEach((parts, index) => {
      gsap.set(parts.figure, {
        transformPerspective: DEPTH.perspective,
        z: DEPTH.application[index] ?? DEPTH.application[0],
        y: 24,
      })

      const at = BEAT.detail + index * BEAT.structure
      tl.to(parts.figure, { z: 0, y: 0, duration: DUR.epic, ease: ROLE.subject }, at)
      playPlate(tl, parts, at)
    })
  }

  /* ══ closing ═══════════════════════════════════════════════════
     The final strong beat, and the only place the page raises its voice.
     The closing block repeats the section-head composition at 76px, so it
     is played by the same function with a longer subject; the crate then
     takes the deepest arrival, the widest over-scale, the longest wipe and
     a drift of its own, and it is the last thing moving before the outro. */
  const closingHead = closingCopy.length ? head(closingCopy[0]) : null
  const [crate] = platesOf('cs-crate')

  if (crate) {
    const tl = stage(closingCopy[0])
    if (closingHead) playHead(tl, closingHead, BEAT.open, DUR.epic)

    gsap.set(crate.figure, {
      transformPerspective: DEPTH.perspective,
      z: DEPTH.crate,
      y: 30,
    })
    tl.to(crate.figure, { z: 0, y: 0, duration: DUR.epic, ease: ROLE.subject }, BEAT.support)
    playPlate(tl, crate, BEAT.support, {
      wipe: DUR.epic * 1.35,
      over: OVER.crate,
      settle: SETTLE.crate,
    })

    stops.push(parallax(crate.figure, { yPercent: DRIFT.crate, trigger: crate.figure, scrub: 0.8 }))
  }

  /* ══ outro ═════════════════════════════════════════════════════
     Quieter than everything above it. The page has finished speaking; this
     is the door out, not a final gesture. */
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
