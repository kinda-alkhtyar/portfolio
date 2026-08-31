import { BEAT, DUR, EASE, ROLE, STAGGER, gsap, hasFinePointer } from '../motion'

/** Travel speed in layout px per second. Slow enough to read as drift. */
const SPEED = 22
/** Rate the row falls to while a card is hovered — slowed, never stopped. */
const HOVER_RATE = 0.15
/** How far the gutter arrow advances the row, in px. */
const STEP = 330
/** Max tilt in degrees at a card corner. Deliberately small. */
const TILT = 3.2
/** Cover travel inside the card, in px, and the scale that hides its edges. */
const MEDIA_SHIFT = 14
const MEDIA_SCALE = 1.05

export interface RowLoopControls {
  /** Advances the row one step along its own direction of travel. */
  nudge: () => void
}

export interface RowLoopOptions {
  /** -1 travels left, +1 travels right. */
  direction: -1 | 1
  /** One full card set in px, including the gap that follows its last card. */
  setWidth: number
  /** Filled in by the loop so the gutter arrow can drive it. */
  controls: { current: RowLoopControls }
}

interface CardFx {
  rotX: (value: number) => void
  rotY: (value: number) => void
  mediaX: (value: number) => void
  mediaY: (value: number) => void
  media: HTMLElement | null
  title: HTMLElement | null
  rule: HTMLElement | null
}

/**
 * One continuously moving Selected Work row.
 *
 * The track holds three copies of the row's five cards and the whole thing is
 * translated on a single `x`, wrapped into the range one set wide. Because copy
 * two starts exactly one set after copy one, the wrap lands on a pixel that
 * already looks identical — the loop has no seam and no reset to see.
 *
 * Everything writes to one position accumulator, so the things that can move a
 * row never fight each other: the ticker adds the drift, a drag adds its delta,
 * and the arrow and keyboard focus tween it through `glide`. The drift is
 * suspended while a glide or a drag owns the position, which is what makes
 * handing control back and forth smooth instead of jumpy.
 *
 * Vertical page scroll is never touched: there is no wheel handler here at all,
 * and the panel keeps `touch-action: pan-y`, so a vertical swipe still scrolls
 * the page while a horizontal one drags the row.
 */
export function createRowLoop(
  { q }: { scope: HTMLElement; q: (selector: string) => HTMLElement[] },
  { direction, setWidth, controls }: RowLoopOptions,
): () => void {
  const [panel] = q('[data-motion="work-panel"]')
  const [track] = q('[data-motion="work-track"]')
  if (!panel || !track || setWidth <= 0) return () => {}

  /* ── position ───────────────────────────────────────────────────── */
  const state = { pos: 0, rate: 1 }
  /**
   * Which way the copies are wrapped is the one thing the direction of the
   * document decides here.
   *
   * The track is `w-max` inside an `overflow-hidden` panel, so its overflow
   * hangs off the panel's *end*: to the right under LTR, where the window sits
   * on the first copy and the position has to be wrapped down through
   * `-setWidth`; to the left under RTL, where the window sits on the last copy
   * instead and the same wrap walks the row straight off the end of the copies
   * and snaps back. Wrapping up through `+setWidth` puts the window back in the
   * middle of them. Everything else — the speed, the two opposed directions,
   * the drag, the hover rate, the glide — is the same object either way.
   */
  const rtl = document.documentElement.dir === 'rtl'
  const wrap = rtl ? gsap.utils.wrap(0, setWidth) : gsap.utils.wrap(-setWidth, 0)
  const setX = gsap.quickSetter(track, 'x', 'px')
  let posTween: gsap.core.Tween | null = null
  let dragging = false

  gsap.set(track, { x: 0, force3D: true })

  const tick = (_time: number, deltaMs: number) => {
    const held = dragging || posTween?.isActive() === true
    if (!held) state.pos += direction * SPEED * state.rate * (deltaMs / 1000)
    setX(wrap(state.pos))
  }

  gsap.ticker.add(tick)

  /** Hands the position to a tween; the drift picks it back up on completion. */
  const glide = (delta: number, duration: number = DUR.hero) => {
    posTween?.kill()
    posTween = gsap.to(state, { pos: state.pos + delta, duration, ease: EASE.expo })
  }

  /** Eases the drift rate. Kept off `pos` so it never disturbs a glide. */
  const setRate = (value: number, duration: number = 0.55) => {
    gsap.killTweensOf(state, 'rate')
    gsap.to(state, { rate: value, duration, ease: EASE.expo })
  }

  /**
   * The homepage scales the whole canvas with CSS `zoom` on short viewports.
   * Pointer deltas arrive in screen px while the track moves in layout px, so
   * anything measured off a rect has to be divided back down.
   */
  const canvasScale = () => panel.getBoundingClientRect().width / panel.offsetWidth || 1

  controls.current = { nudge: () => glide(direction * STEP) }

  /* ── drag ───────────────────────────────────────────────────────── */
  let dragId: number | null = null
  let lastX = 0
  let travelled = 0

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragId = event.pointerId
    dragging = true
    travelled = 0
    lastX = event.clientX
    posTween?.kill()
    panel.setPointerCapture(event.pointerId)
  }

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== dragId) return
    dragging = false
    dragId = null
    if (panel.hasPointerCapture(event.pointerId)) panel.releasePointerCapture(event.pointerId)
  }

  // A drag that ends on a card would otherwise open that project.
  const onClickCapture = (event: MouseEvent) => {
    if (travelled <= 6) return
    event.preventDefault()
    event.stopPropagation()
  }

  /* ── hover: tilt, cover parallax, title ─────────────────────────── */
  const fxCache = new WeakMap<HTMLElement, CardFx>()
  const fine = hasFinePointer()
  let active: HTMLElement | null = null

  const fxFor = (card: HTMLElement): CardFx => {
    const cached = fxCache.get(card)
    if (cached) return cached

    const media = card.querySelector<HTMLElement>('[data-motion="work-card-media"]')
    const settle = { duration: DUR.slow, ease: EASE.expo }

    gsap.set(card, { transformPerspective: 900, transformOrigin: '50% 50%' })

    const fx: CardFx = {
      media,
      title: card.querySelector<HTMLElement>('[data-motion="work-card-title"]'),
      rule: card.querySelector<HTMLElement>('[data-motion="work-card-rule"]'),
      rotX: gsap.quickTo(card, 'rotationX', settle),
      rotY: gsap.quickTo(card, 'rotationY', settle),
      mediaX: media ? gsap.quickTo(media, 'x', settle) : () => {},
      mediaY: media ? gsap.quickTo(media, 'y', settle) : () => {},
    }

    fxCache.set(card, fx)
    return fx
  }

  const enter = (card: HTMLElement) => {
    const fx = fxFor(card)
    gsap.to(fx.media, { scale: MEDIA_SCALE, duration: DUR.slow, ease: EASE.expo })
    gsap.to(fx.title, { y: -4, duration: DUR.base, ease: EASE.expo })
    gsap.to(fx.rule, { scaleX: 1, duration: DUR.base, ease: EASE.expo })
    setRate(HOVER_RATE)
  }

  const leave = (card: HTMLElement) => {
    const fx = fxFor(card)
    fx.rotX(0)
    fx.rotY(0)
    fx.mediaX(0)
    fx.mediaY(0)
    gsap.to(fx.media, { scale: 1, duration: DUR.slow, ease: EASE.expo })
    gsap.to(fx.title, { y: 0, duration: DUR.base, ease: EASE.expo })
    gsap.to(fx.rule, { scaleX: 0, duration: DUR.base, ease: EASE.expo })
    setRate(1)
  }

  const onPointerOver = (event: PointerEvent) => {
    const card =
      (event.target as Element | null)?.closest?.<HTMLElement>('[data-motion="work-card"]') ?? null
    if (card === active) return
    if (active) leave(active)
    active = card
    if (card) enter(card)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (dragging && event.pointerId === dragId) {
      const dx = event.clientX - lastX
      lastX = event.clientX
      travelled += Math.abs(dx)
      state.pos += dx / canvasScale()
      return
    }

    if (!active) return
    const box = active.getBoundingClientRect()
    const nx = (event.clientX - box.left) / box.width - 0.5
    const ny = (event.clientY - box.top) / box.height - 0.5
    const fx = fxFor(active)

    fx.rotY(nx * TILT * 2)
    fx.rotX(-ny * TILT * 2)
    // The cover moves against the pointer, which is what reads as depth.
    fx.mediaX(-nx * MEDIA_SHIFT)
    fx.mediaY(-ny * MEDIA_SHIFT * 0.7)
  }

  const onPointerLeave = () => {
    if (!active) return
    leave(active)
    active = null
  }

  /* ── keyboard ───────────────────────────────────────────────────
     Focusing a card holds the row still and brings that card inside the
     panel — a target that drifts out from under the focus ring is not a
     usable target. Only the first copy is focusable, so this runs once per
     project rather than three times. */
  const onFocusIn = (event: FocusEvent) => {
    const card = (event.target as Element | null)?.closest?.<HTMLElement>(
      '[data-motion="work-card"]',
    )
    if (!card) return

    setRate(0, DUR.swap)

    const panelBox = panel.getBoundingClientRect()
    const box = card.getBoundingClientRect()
    const pad = 12
    let delta = 0

    if (box.left < panelBox.left + pad) delta = panelBox.left + pad - box.left
    else if (box.right > panelBox.right - pad) delta = panelBox.right - pad - box.right

    if (delta) glide(delta / canvasScale(), DUR.slow)
  }

  const onFocusOut = (event: FocusEvent) => {
    if (panel.contains(event.relatedTarget as Node | null)) return
    setRate(1)
  }

  panel.addEventListener('pointerdown', onPointerDown)
  panel.addEventListener('pointermove', onPointerMove, { passive: true })
  panel.addEventListener('pointerup', onPointerUp)
  panel.addEventListener('pointercancel', onPointerUp)
  panel.addEventListener('click', onClickCapture, true)
  panel.addEventListener('focusin', onFocusIn)
  panel.addEventListener('focusout', onFocusOut)

  if (fine) {
    panel.addEventListener('pointerover', onPointerOver, { passive: true })
    panel.addEventListener('pointerleave', onPointerLeave)
  }

  return () => {
    gsap.ticker.remove(tick)
    posTween?.kill()
    gsap.killTweensOf(state)

    panel.removeEventListener('pointerdown', onPointerDown)
    panel.removeEventListener('pointermove', onPointerMove)
    panel.removeEventListener('pointerup', onPointerUp)
    panel.removeEventListener('pointercancel', onPointerUp)
    panel.removeEventListener('click', onClickCapture, true)
    panel.removeEventListener('focusin', onFocusIn)
    panel.removeEventListener('focusout', onFocusOut)
    panel.removeEventListener('pointerover', onPointerOver)
    panel.removeEventListener('pointerleave', onPointerLeave)

    controls.current = { nudge: () => {} }
  }
}

/**
 * Selected Work's arrival — the page's one remaining hard cut, closed.
 *
 * Every other block on the page had an entrance and this one did not: the rows
 * were simply already drifting when the hero finished, which read as a second
 * page starting rather than the fold continuing. This gives them a landing that
 * overlaps the hero's tail, so the two are heard as one phrase.
 *
 * Two constraints shape it:
 *
 *   1. **No scale, anywhere in this subtree.** The loop derives its drag scale
 *      from the panel's rendered width against its layout width, so a scaled
 *      ancestor would feed straight into the drag maths. Opacity and `y` only.
 *   2. **The loop is never touched.** The track keeps drifting under an
 *      `autoAlpha: 0` panel and fades in already in motion, which is better
 *      than starting it on cue — the rows look like they were always running.
 *
 * The delay is conditional. Selected Work breaks the bottom of the first
 * screen, so on a normal load its trigger fires immediately and the block waits
 * out the hero. Arriving at it from further down the page there is nothing to
 * wait for, so it lands at once.
 */

/** Where the block lands against the hero timeline, in seconds. */
const HANDOFF = BEAT.close + 0.2

export function selectedWorkIntro({
  scope,
  q,
}: {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}) {
  const label = q('[data-motion="work-label"]')
  const gutters = q('[data-motion="work-gutter"]')
  const rows = q('[data-motion="work-row"]')

  const masks = label
    .map((line) => line.parentElement)
    .filter((el): el is HTMLElement => el !== null)

  gsap.set(masks, { clipPath: 'inset(-20% 0% -20% 0%)' })
  gsap.set(label, { yPercent: 124 })
  gsap.set(gutters, { autoAlpha: 0, y: 14 })
  gsap.set(rows, { autoAlpha: 0, y: 22 })

  // Already in the fold at setup? Then the hero is still playing and this waits
  // for it. Otherwise the visitor scrolled here and it should just arrive.
  const inFold = scope.getBoundingClientRect().top < window.innerHeight

  const tl = gsap.timeline({
    delay: inFold ? HANDOFF : 0,
    defaults: { ease: ROLE.support },
    scrollTrigger: { trigger: scope, start: 'top 92%', once: true },
  })

  tl.to(label, { yPercent: 0, duration: DUR.hero, ease: ROLE.subject }, BEAT.open)
    .to(rows, { autoAlpha: 1, y: 0, duration: DUR.epic, stagger: 0.12 }, BEAT.subject)
    .to(gutters, { autoAlpha: 1, y: 0, duration: DUR.slow, stagger: STAGGER.loose }, BEAT.structure)

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
