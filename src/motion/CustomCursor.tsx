import { useEffect, useRef } from 'react'

import {
  CURSOR,
  EASE,
  Z,
  hasFinePointer,
  onReducedMotionChange,
  prefersReducedMotion,
} from './config'
import { gsap } from './gsap'

/**
 * Cursor states an element can request. Add more here rather than inventing
 * strings at call sites.
 *
 * - `default` — the resting dot + ring
 * - `link`    — over a navigational link: ring opens a little, dot survives
 * - `button`  — over an action pill: ring opens wide, dot is absorbed
 * - `bloom`   — over the hero's tulip: the widest ring, with the dot back
 * - `hover`   — generic interactive fallback: ring opens, dot shrinks
 * - `view`    — over a project card: ring fills and can carry a label
 * - `hidden`  — over media or inputs that should own the pointer
 *
 * `link` / `button` / `bloom` are the hero's vocabulary. They are graded so
 * the ring alone tells you what kind of thing is under the pointer: a link
 * opens it slightly and keeps the dot (you are still pointing at text), a
 * button absorbs the dot into the ring (the whole pill is the target), and the
 * bloom opens widest but returns a small dot, because there is nothing to
 * click there and the cursor should say "look" rather than "press".
 */
export type CursorState =
  | 'default'
  | 'link'
  | 'button'
  | 'bloom'
  | 'hover'
  | 'view'
  | 'hidden'

/**
 * Ring scale and opacity per state. The dot is the inverse of the ring.
 *
 * `pulse` is an optional multiplier a state can breathe between — only `bloom`
 * declares one, so the cursor keeps drifting in depth over the hero's tulip
 * the way the tulip itself does, and stops the moment it is over anything
 * that can actually be pressed.
 */
const STATES: Record<CursorState, { ring: number; dot: number; alpha: number; pulse?: number }> = {
  default: { ring: 1, dot: 1, alpha: 1 },
  link: { ring: 1.5, dot: 0.45, alpha: 1 },
  button: { ring: 2.1, dot: 0, alpha: 1 },
  bloom: { ring: 2.8, dot: 0.3, alpha: 1, pulse: 1.07 },
  hover: { ring: 1.7, dot: 0, alpha: 1 },
  view: { ring: 3.4, dot: 0, alpha: 1 },
  hidden: { ring: 0.4, dot: 0, alpha: 0 },
}

/**
 * The site cursor.
 *
 * A dot and a ring, both locked to the pointer with no follow delay — only
 * the ring's scale, colour and label react to what is under the pointer.
 * Mounted once at the app root; it renders nothing at
 * all on coarse pointers or under reduced motion, so touch devices and
 * motion-sensitive visitors pay no cost.
 *
 * It is **zone-scoped**: it fades in only while the pointer is inside an
 * element marked `data-cursor-zone`, and fades out everywhere else. A site-wide
 * custom cursor is a commitment on every page; a zone lets one composition
 * (currently the Home hero fold) carry it without imposing it on reading
 * sections, forms or the case-study pages.
 *
 * A subtree marked `data-cursor-exclude` opts out even inside a zone: the
 * cursor is cut immediately and the native arrow takes over. That is how the
 * navbar, which is fixed over the Home hero's zone, keeps a plain pointer.
 *
 * Inside a zone, elements refine the state declaratively:
 *
 * ```tsx
 * <Link data-cursor="view" data-cursor-label="VIEW">…</Link>
 * ```
 *
 * The native cursor is deliberately left visible — hiding it is a per-page
 * decision (`html.cursor-none`), not something the foundation imposes.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!root || !dot || !ring || !label) return

    /** Boots the cursor for the current motion preference; returns teardown. */
    const start = () => {
      if (prefersReducedMotion() || !hasFinePointer()) {
        gsap.set(root, { autoAlpha: 0 })
        return () => {}
      }

      const ctx = gsap.context(() => {
        // Centred on the pointer by the element's own half-size, so tracking
        // only ever writes raw client coordinates.
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

        // Direct setters, no tween: X/Y land on the same frame as the pointer
        // event, so the cursor cannot trail the real one. Scale, colour and
        // label still tween — they are written by separate tweens, so they
        // never hold up movement.
        const dotX = gsap.quickSetter(dot, 'x', 'px')
        const dotY = gsap.quickSetter(dot, 'y', 'px')
        const ringX = gsap.quickSetter(ring, 'x', 'px')
        const ringY = gsap.quickSetter(ring, 'y', 'px')

        let placed = false
        let inZone = false
        let pressed = false
        let state: CursorState = 'default'

        /** Jump to the pointer before the first fade, never sweep in from 0,0. */
        const place = (event: PointerEvent) => {
          if (placed) return
          placed = true
          gsap.set([dot, ring], { x: event.clientX, y: event.clientY })
        }

        // Asymmetric on purpose: arriving in a zone is announced, leaving it
        // is not — a slow fade-out reads as the cursor being reluctant to go.
        // `immediate` is how an excluded region (the navbar) opts out: it cuts
        // the cursor rather than fading it, so the bar is never under a
        // lingering ring.
        const setZone = (next: boolean, immediate = false) => {
          if (next === inZone) return
          inZone = next
          if (immediate) {
            gsap.killTweensOf(root)
            gsap.set(root, { autoAlpha: next ? 1 : 0 })
            return
          }
          gsap.to(root, {
            autoAlpha: next ? 1 : 0,
            duration: next ? CURSOR.zoneIn : CURSOR.zoneOut,
            ease: EASE.silk,
          })
        }

        let pulse: gsap.core.Tween | null = null

        /**
         * The ring's scale is its state times the press, so the two compose.
         * A state that declares a pulse then breathes around that resting
         * size once it has settled there — and a press cancels it, because a
         * target you are about to hit should not be moving.
         */
        const sizeRing = (duration: number) => {
          const { ring: scale, pulse: depth } = STATES[state]
          const base = scale * (pressed ? CURSOR.press : 1)

          pulse?.kill()
          pulse = null

          gsap.to(ring, {
            scale: base,
            duration,
            ease: EASE.silk,
            onComplete:
              depth && !pressed
                ? () => {
                    pulse = gsap.to(ring, {
                      scale: base * depth,
                      duration: CURSOR.pulse,
                      ease: EASE.silk,
                      yoyo: true,
                      repeat: -1,
                    })
                  }
                : undefined,
          })
        }

        const apply = (next: CursorState, text: string) => {
          if (next === state && label.textContent === text) return
          state = next

          const { dot: dotScale, alpha } = STATES[next]
          sizeRing(CURSOR.state)
          gsap.to(ring, { autoAlpha: alpha, duration: CURSOR.state, ease: EASE.silk })
          gsap.to(dot, { scale: dotScale, autoAlpha: alpha, duration: CURSOR.pressIn, ease: EASE.expo })

          label.textContent = text
          gsap.to(label, { autoAlpha: text ? 1 : 0, duration: CURSOR.pressIn })
        }

        /** Press: the ring tightens toward the dot, then releases. */
        const setPressed = (next: boolean) => {
          if (next === pressed) return
          pressed = next
          sizeRing(CURSOR.pressIn)
        }

        const onMove = (event: PointerEvent) => {
          place(event)
          dotX(event.clientX)
          dotY(event.clientY)
          ringX(event.clientX)
          ringY(event.clientY)
        }

        // `pointerover` fires only when the pointer crosses into a new element,
        // so the zone and state lookups cost nothing during a plain move.
        const onOver = (event: PointerEvent) => {
          place(event)

          const target = event.target as Element | null

          // An excluded region wins over any zone it sits inside: the navbar
          // is fixed over the hero's zone, and there the native arrow is what
          // keeps the links readable and instantly clickable.
          if (target?.closest?.('[data-cursor-exclude]')) {
            setZone(false, true)
            apply('default', '')
            return
          }

          setZone(Boolean(target?.closest?.('[data-cursor-zone]')))

          const interactive = target?.closest?.<HTMLElement>(
            '[data-cursor], a, button, [role="button"]',
          )
          if (!interactive) return apply('default', '')

          const requested = interactive.dataset.cursor as CursorState | undefined
          apply(requested ?? 'hover', interactive.dataset.cursorLabel ?? '')
        }

        const onDown = () => setPressed(true)
        const onUp = () => setPressed(false)

        const onLeaveWindow = () => {
          setPressed(false)
          setZone(false)
          apply('default', '')
        }

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerover', onOver, { passive: true })
        window.addEventListener('pointerdown', onDown, { passive: true })
        window.addEventListener('pointerup', onUp, { passive: true })
        window.addEventListener('pointercancel', onUp, { passive: true })
        document.addEventListener('pointerleave', onLeaveWindow)
        window.addEventListener('blur', onLeaveWindow)

        return () => {
          // Created inside an onComplete, so the context never recorded it.
          pulse?.kill()
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerover', onOver)
          window.removeEventListener('pointerdown', onDown)
          window.removeEventListener('pointerup', onUp)
          window.removeEventListener('pointercancel', onUp)
          document.removeEventListener('pointerleave', onLeaveWindow)
          window.removeEventListener('blur', onLeaveWindow)
        }
      }, root)

      return () => ctx.revert()
    }

    let stop = start()
    const unsubscribe = onReducedMotionChange(() => {
      stop()
      stop = start()
    })

    return () => {
      unsubscribe()
      stop()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 invisible hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ zIndex: Z.cursor }}
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 grid size-[38px] place-items-center rounded-full border border-purple-light/60 bg-purple-light/5 will-change-transform"
      >
        <span
          ref={labelRef}
          className="invisible font-nav text-[7px] font-medium tracking-[0.18em] text-white"
        />
      </div>

      <span
        ref={dotRef}
        className="absolute left-0 top-0 size-[6px] rounded-full bg-purple-light will-change-transform"
      />
    </div>
  )
}
