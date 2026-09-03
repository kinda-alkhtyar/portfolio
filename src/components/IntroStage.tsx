import { useState, type Ref } from 'react'

import { useReducedMotion } from '../motion'
import { INTRO_PLANES } from '../sections/introPlanes'
import { introWillRun } from '../sections/introGate'

/**
 * The opening's plane stage: a full-viewport layer that begins as an exact
 * copy of the homepage's own ground and puts five portfolio works on it.
 *
 * It is mounted as a **sibling of `<main class="home-canvas">`, not inside
 * it**, because the canvas carries `zoom: var(--page-zoom)` on the short
 * desktop breakpoints and a zoomed ancestor rescales `position: fixed`
 * descendants and the viewport units inside them. Out here the stage is in
 * true viewport pixels.
 *
 * The ground below is the fold's backdrop gradient and edge vignette,
 * character for character. That is not decoration: the fold's backdrop is
 * `inset-x-0 top-0 h-[var(--screen)]` inside a canvas that is exactly the
 * viewport once `zoom` has been applied, so an identical gradient painted on
 * a fixed 100vw x 100svh box resolves to the same pixels. The opening
 * therefore starts *in* the dark plum world rather than over it, and clearing
 * the ground later is invisible because what is underneath is the same image.
 *
 * The stage renders invisible and is turned on by `homeIntroMotion` inside a
 * layout effect — before the first paint, so nothing is ever seen twice, and
 * never at all if the motion fails to run, which leaves the homepage exactly
 * as it is today.
 */
export default function IntroStage({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const reduced = useReducedMotion()
  // Asked once. `introWillRun` is memoised for the page load, so re-rendering
  // can never pull the stage out from under a running opening.
  const [runs] = useState(introWillRun)

  // The reduced-motion fallback, and every return visit: no stage, no video,
  // no gate — the fold is simply entered.
  if (reduced || !runs) return null

  return (
    <div
      ref={ref}
      data-intro="stage"
      // JS owns the reveal. If it never runs the opening is skipped rather
      // than left covering the page.
      style={{ opacity: 0, visibility: 'hidden' }}
      // Decorative from the first paint: the stage sits a rung above the nav
      // (z 40 vs 30) and spans the viewport, so while the opening runs it
      // would otherwise be the hit-test target over the bar — the links would
      // not even show a pointer until the timeline handed the layer back.
      // Only SKIP takes events back.
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {/* ── the ground: the fold's own backdrop ──────────────────── */}
      <div data-intro="ground" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_66%_34%,#26123A_0%,#150C22_45%,#0C0713_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_45%,rgba(6,3,11,0.75)_100%)]" />
      </div>

      {/* ── the camera ───────────────────────────────────────────────
          One shared perspective for all five plates, with its vanishing
          point written by `homeIntroMotion` onto the live hero bloom — so
          the works recede toward the exact point the flower opens from.

          Two elements, not one: the lens owns the perspective and the camera
          owns the move. A `translateZ` on the element that *owns* the
          perspective is not projected by it, so the camera has to be a child
          of the lens to be able to dolly at all. */}
      <div data-intro="lens" aria-hidden="true" className="absolute inset-0">
        <div data-intro="camera" className="absolute inset-0">
          {/* Three levels per plane, so every transform channel has exactly
              one owner and the field's four movements never fight:

                plane   x / y (perspective compensation, then the drift, then
                        the collapse's pull), z (arrival, the two camera
                        passes, then the collapse), scale + autoAlpha
                frame   clipPath — the uncover, and nothing else ever writes it
                art     scale — the settle behind the wipe

              `left` / `top` are where the plane is meant to *appear*;
              `homeIntroMotion` solves for the transform that puts it there at
              its own depth. */}
          {INTRO_PLANES.map((plane) => (
            <figure
              key={plane.key}
              data-intro="plane"
              className={`absolute ${plane.box}`}
              style={{ left: plane.left, top: plane.top }}
            >
              <div data-intro="frame" className="relative size-full overflow-hidden">
                <img
                  data-intro="art"
                  src={plane.src}
                  alt=""
                  draggable={false}
                  decoding="async"
                  className="size-full object-cover"
                />
                {/* The plum wash. Graded on the result rather than on depth
                    alone — the white sheets take far more of it than their
                    rung asks for — which is what turns twelve mixed covers
                    into one dark field with distance in it. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(12,7,19,${plane.wash * 0.6}) 0%, rgba(12,7,19,${plane.wash}) 100%)`,
                  }}
                />
                {/* The hairline the whole site frames images with. */}
                <div className="absolute inset-0 border border-white/10" />
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* An opening this long has to be refusable. Same type as the rest of
          the site's small caps; nothing else was added to the page. */}
      <button
        type="button"
        data-intro="skip"
        data-cursor="link"
        className="pointer-events-auto absolute bottom-[46px] right-[52px] font-nav text-[11px] font-medium leading-none tracking-[0.42em] text-white/40 transition-colors duration-300 hover:text-white/75 focus-visible:text-white/75"
      >
        SKIP
      </button>
    </div>
  )
}
