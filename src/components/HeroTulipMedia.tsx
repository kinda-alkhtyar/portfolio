import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import HeroTulip from './HeroTulip'
import tulipVideoSrc from '../assets/images/intro/tulip-opening.mp4'
import { useReducedMotion } from '../motion'
import { HERO_CEILING, armHeroGate, introWillRun } from '../sections/introGate'

/**
 * Where the clip is joined when nothing else sets its clock.
 *
 * The file opens on a near-white ground that falls to the fold's own tone over
 * its first two seconds — sampled border luma 247 / 225 / 158 / 48 / 11 at
 * 0 / 0.55 / 1.0 / 1.5 / 2.0s, against the backdrop's ~17. The opening hides
 * that descent behind a fitted veil, because it is lighting the flower out of
 * the plum. The hero has nothing to hide it with, so it joins the clip where
 * the ground has already arrived.
 */
const HOLD_FROM = 2

/** After the opening's own promotion at 0.8s, so the covers keep their lead. */
const PROMOTE_AFTER = 1200

/**
 * How long the clip will wait on the opening's plate before starting anyway.
 * The plate needs ~1.45s to reach `HOLD_FROM` from the fold's release; this is
 * the failsafe for a plate that stalls, is skipped, or never plays at all.
 */
const SYNC_LIMIT = 2600

/**
 * Long enough to read as a light change rather than a cut, short enough to
 * land inside the 0.62s the opening gives the fold under its plate.
 */
const FADE_MS = 420

/**
 * The clip is a rectangle; the hero bloom is not. Three layers dissolve the
 * one into the other, with no edit to the file: a veil, a shape and an edge.
 *
 * **Why a veil at all.** The clip is a studio photograph, so its ground is a
 * plum backdrop rather than a flat black — but it is not *this* plum. Measured
 * against the fold's own colour behind this box (rgb(23,13,37) at its
 * top-left, rgb(26,14,42) at its centre, rgb(12,7,19) at its bottom-right) the
 * ground sits ~10 luma **under** the page. A mask alone can only fade that
 * deficit out; wherever the mask is opaque the deficit is fully present, which
 * is what read as black around the flower and as a plate at the edges. So the
 * ground is not faded — it is *replaced*.
 *
 * `VEIL` is the fold's own backdrop, re-projected into this box: the same
 * `radial-gradient(70% 60% at 66% 34%, #26123A, #150C22 45%, #0C0713)` the
 * fold paints, re-expressed in the box's coordinates (the box is 610 x 813 at
 * right 62 / top 147 on the 1440 x 1088 canvas, which puts the gradient's
 * centre at 30% / 27% of the box and its radii at 165% / 80% of it). It is
 * painted *under* the clip, and the clip is composited onto it with
 * `mix-blend-mode: lighten` — per channel, the brighter of the two survives.
 *
 * That is the whole trick, and it is exact: every pixel darker than the page
 * becomes the page, every pixel brighter than it stays the photograph. The
 * result is the fold's own backdrop plus the flower's light on top of it, so
 * there is nothing left to see an edge of. Blending works here because the
 * veil and the clip are siblings inside this masked group — `heroMotion`'s
 * transform isolates the box from the page, so a blend mode reaching for the
 * *page* would have found nothing, but one reaching for a sibling is fine.
 *
 * `SHAPE` then follows the flower — head, stem, both leaves, the base — as a
 * union of five long-feathered ellipses, fitted to the envelope the subject
 * sweeps across the whole clip (sampled at 2.0 / 2.6 / 3.2 / 3.8 / 4.4 / 5.0s,
 * every pixel the flower is brighter than the page at any of them). It is
 * generous rather than tight: with the veil underneath, the mask's only job is
 * to keep the veil near the flower, so nothing is ever clipped. Layers union
 * by default (`mask-composite: add`), so no compositing keyword is needed.
 *
 * `EDGE` is the last cut: the clip's lit studio floor — the bottom band, and
 * the right column while the ground is still settling — is *brighter* than the
 * page, so `lighten` keeps it and only a mask can take it away. It fades the
 * bottom 13% and the right 10%, plus a hairline at the top and left so no side
 * of the box can present a straight edge. The leaf bases fade with it, into
 * the page, which is what the bottom of a photograph should do anyway.
 */
const VEIL = 'radial-gradient(165% 80% at 30% 27%, #26123A 0%, #150C22 45%, #0C0713 100%)'

const SHAPE = [
  'radial-gradient(67% 48% at 51% 33%, #000 0%, #000 68%, transparent 100%)',
  'radial-gradient(26% 30% at 48% 56%, #000 0%, #000 68%, transparent 100%)',
  'radial-gradient(30% 32% at 90% 47%, #000 0%, #000 68%, transparent 100%)',
  'radial-gradient(33% 23% at 88% 68%, #000 0%, #000 68%, transparent 100%)',
  'radial-gradient(31% 14% at 64% 80%, #000 0%, #000 68%, transparent 100%)',
].join(', ')

const EDGE = [
  'linear-gradient(to bottom, transparent 0%, #000 2%, #000 87%, transparent 99.5%)',
  'linear-gradient(to right, transparent 0%, #000 3%, #000 90%, transparent 100%)',
].join(', ')

/**
 * The home fold's tulip, as live media rather than a still.
 *
 * This is the hero bloom itself, not a stage in front of it: the element that
 * carries `data-motion="tulip"` *is* this component's root, so `heroMotion`
 * finds it exactly where it always did and every transform channel it owns —
 * the entrance out of z -150, the scroll parallax, the pointer lean, the idle
 * breath, the exit push to z +118 — is written to the same box as before.
 * Nothing about the fold's choreography, layout, type or colour is touched.
 *
 * **The box is the still's box by construction.** The root wears the
 * positioning classes the `<img>` used to wear and pins the height the image's
 * intrinsic ratio used to resolve to: 1086 x 1448 is exactly 3:4, so 610px
 * wide is 813.333px tall to the pixel — at every `--page-zoom` breakpoint and
 * under `--tulip-shift` / `--hero-lift` as before. No layout shift, whether
 * the file arrives early, late or never.
 *
 * **The clip is the only media on screen.** `tulip.png` is mounted, but only
 * as the fallback: it holds the box until the clip is genuinely presenting
 * the frame it was asked for, and the two crossfade — the still out as the
 * clip in, over the same 420ms — so from then on nothing of it is layered
 * under the picture. It comes back, on the same fade, if the file errors or
 * autoplay is refused, and under reduced motion it is all there ever is. The
 * subject registers between the two to within 0.2% of the frame in both axes,
 * so what crosses either way is the light, not the picture, and the fold is
 * never a hole.
 *
 * **When the cinematic opening is running, this clip shadows it.** The opening
 * plays the same file on its own plate and dissolves that plate away; running
 * the hero's copy on the plate's own `currentTime` means the dissolve crosses
 * two identical frames instead of two different ones, so the opening resolves
 * *into* the live hero with nothing to see swap. Both join the file at
 * `HOLD_FROM` — the fold is now released while the plate is still lighting the
 * flower out of the plum, so this waits on the plate's clock rather than on
 * the fold's. When there is no opening — a return visit, a deep link, a
 * restored scroll position — it simply starts there.
 *
 * It plays once and holds its last frame: after the ground settles the clip is
 * a slow, subtle opening, and a loop would announce itself at the cut. From
 * that held frame on, the bloom is alive on `heroMotion` alone — the idle
 * drift, the breath, the pointer depth and the scroll exit all write to this
 * component's root, exactly as they wrote to the `<img>`. Offscreen, it pauses.
 */
export default function HeroTulipMedia({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const reduced = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const stillRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reduced) return

    const box = boxRef.current
    const still = stillRef.current
    const stack = stackRef.current
    const video = videoRef.current
    if (!box || !still || !stack || !video) return

    // React's `muted` attribute is not reliably reflected onto the property,
    // and muted is what makes the autoplay permissible at all.
    video.muted = true

    let started = false
    let finished = false
    let onScreen = true
    let live = false
    let disarm: (() => void) | null = null
    let ceiling: ReturnType<typeof setTimeout> | null = null
    let promotion: ReturnType<typeof setTimeout> | null = null
    let sync = 0
    let syncUntil = 0

    /**
     * The clip is only shown once it is presenting the frame we asked for —
     * and the moment it is, the still goes, so the bloom on screen is the
     * clip alone rather than the clip over a photograph of itself.
     */
    const reveal = () => {
      live = true
      stack.style.opacity = '1'
      still.style.opacity = '0'
    }

    /**
     * ...and the still comes back if the clip cannot be shown: a file that
     * fails to load or decode, or an autoplay the browser refuses. The fold
     * is then exactly the hero it has always been.
     */
    const fallback = () => {
      live = false
      stack.style.opacity = '0'
      still.style.opacity = '1'
    }

    const onError = () => {
      fallback()
    }

    const onEnded = () => {
      finished = true
    }

    /**
     * Warm the decoder on the part of the file that will actually be shown, so
     * the seek at the cue is a resume rather than a first-frame stall.
     */
    const onMeta = () => {
      if (started) return
      try {
        video.currentTime = HOLD_FROM
      } catch {
        // A seek this early can be refused; `begin` sets it again.
      }
    }

    /**
     * Where the opening's own plate has got to, if it is playing right now.
     * Read off the DOM rather than shared through a module: the plate is the
     * opening's business and this is only borrowing its clock.
     */
    const plateTime = (): number | null => {
      const plate = document.querySelector<HTMLVideoElement>('.home-canvas [data-intro="video"]')
      if (!plate || plate.paused || plate.ended) return null
      return plate.currentTime > 0 ? plate.currentTime : null
    }

    const begin = () => {
      if (started) return

      // The fold is released a beat *into* the clip now, so that the headline
      // moves while the flower opens — which means the plate is still lighting
      // its way out of the plum when this is first asked to start. Joining it
      // there would put this copy on the bright frames the plate's veil exists
      // to hide. So wait, on the plate's own clock, for the point its ground
      // has settled: the two then run frame-locked from `HOLD_FROM` to the end
      // and the plate's dissolve crosses two identical pictures.
      const running = plateTime()
      if (running !== null && running < HOLD_FROM) {
        if (!syncUntil) syncUntil = performance.now() + SYNC_LIMIT
        if (performance.now() < syncUntil) {
          sync = requestAnimationFrame(begin)
          return
        }
      }

      started = true
      sync = 0
      if (ceiling) {
        clearTimeout(ceiling)
        ceiling = null
      }

      video.addEventListener('seeked', reveal, { once: true })
      video.addEventListener('playing', reveal, { once: true })

      try {
        // `running` is re-read: a frame may have passed since the check above.
        const at = plateTime()
        video.currentTime = at !== null && at >= HOLD_FROM ? at : HOLD_FROM
      } catch {
        // Non-fatal: playback starts wherever the buffer allows.
      }

      if (!onScreen) return
      const playing = video.play()
      // A refusal must not leave a hole, and it cannot: the still is still
      // mounted and comes straight back on the same fade.
      if (playing) playing.catch(fallback)
    }

    /** Give the file its own bandwidth once the opening no longer needs it. */
    const promote = () => {
      if (video.preload !== 'auto') video.preload = 'auto'
    }

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)
    if (video.readyState >= 1) onMeta()

    // Offscreen is not worth a decode. The observer is also what resumes a
    // clip that was released while the fold was out of view.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry) return
        onScreen = entry.isIntersecting
        if (!onScreen) {
          video.pause()
          return
        }
        if (!started || finished) return
        const playing = video.play()
        // Only a clip that has never been on screen falls back: one that is
        // already live and merely refused a resume simply holds its frame.
        if (playing)
          playing.catch(() => {
            if (!live) fallback()
          })
      },
      { threshold: 0 },
    )
    io.observe(box)

    if (introWillRun()) {
      // The opening hands the fold over through the same gate the hero
      // entrance waits on, so the clip starts on the fold's own beat.
      disarm = armHeroGate(begin)
      // ...and shares its failsafe, so an opening that never hands over
      // cannot leave the bloom frozen on its still.
      ceiling = setTimeout(begin, HERO_CEILING * 1000)
      // The opening's covers are wanted four seconds before either copy of
      // this file is, and its plate promotes itself at 0.8s. Waiting until
      // after that keeps this out of their way.
      promotion = setTimeout(promote, PROMOTE_AFTER)
    } else {
      promote()
      begin()
    }

    return () => {
      io.disconnect()
      disarm?.()
      if (sync) cancelAnimationFrame(sync)
      if (ceiling) clearTimeout(ceiling)
      if (promotion) clearTimeout(promotion)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      video.removeEventListener('seeked', reveal)
      video.removeEventListener('playing', reveal)
      video.pause()
    }
  }, [reduced])

  // Reduced motion is the absence of the clip, not a quieter one: the fold is
  // the still it has always been.
  if (reduced) return <HeroTulip className={className} {...rest} />

  return (
    <div ref={boxRef} className={`${className ?? ''} h-[813.333px]`} {...rest}>
      {/* The fallback, not a base layer: it holds the box until the clip is
          presenting frames and is faded out the moment it is, so the live
          hero is the clip on its own. It returns only if the clip cannot be
          played at all. */}
      <div
        ref={stillRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 1, transition: `opacity ${FADE_MS}ms linear` }}
      >
        <HeroTulip className="size-full" />
      </div>

      {/* No plate. Outermost of the three: the edge cut, which is also what
          fades in — the two masks are nested rather than intersected in one
          layer list, so the shape is a plain union and no engine has to agree
          with any other about `mask-composite`. */}
      <div
        ref={stackRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          transition: `opacity ${FADE_MS}ms linear`,
          maskImage: EDGE,
          WebkitMaskImage: EDGE,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <div
          className="size-full"
          style={{ maskImage: SHAPE, WebkitMaskImage: SHAPE }}
        >
          {/* The fold's own backdrop, under the clip, so the clip's ground has
              something to be replaced *by*. See `VEIL`. */}
          {/* `--tulip-veil` lets a mirrored layout re-project the same backdrop
              for the box's new x without a second component. See `VEIL`. */}
          <div className="absolute inset-0" style={{ background: `var(--tulip-veil, ${VEIL})` }} />

          <video
            ref={videoRef}
            src={tulipVideoSrc}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            className="absolute inset-0 size-full object-cover"
            // Per channel, the brighter of clip and veil. The flower is
            // brighter than the page and survives untouched; its ground is
            // darker and becomes the page exactly.
            style={{ mixBlendMode: 'lighten' }}
          />
        </div>
      </div>
    </div>
  )
}
