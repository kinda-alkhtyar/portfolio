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
 * The still going out as the clip comes in. Long enough to read as a light
 * change rather than a cut, short enough to land inside the 0.62s the opening
 * gives the fold under its plate.
 */
const OPEN_MS = 320

/**
 * The clip going out as the still comes back, at the end of the opening. Short
 * on purpose: the two register to within 0.2% of the frame, so there is
 * nothing to dissolve — this only has to not be a cut.
 */
const HANDOFF_MS = 100

/**
 * Seek tolerance when deciding whether the frame on screen is a settled one.
 * A browser lands a seek on the nearest keyframe, not on the exact second.
 */
const FRAME_EPS = 0.08

/**
 * How close to the end of the file counts as the final open frame. One frame
 * at 25fps is 0.04s; this is a few of them, so the handoff happens *on* the
 * bloom's last motion rather than after the element has finished playing.
 */
const END_EPS = 0.12

/**
 * The clip is a rectangle; the hero bloom is not. Three layers dissolve the
 * one into the other, with no edit to the file: a backdrop, a shape and an
 * edge — and the backdrop is under the still as well as under the clip, so
 * there is exactly one ground in this box and it never changes.
 *
 * **Why a backdrop at all.** The clip is a studio photograph, so its ground is
 * a plum backdrop rather than a flat black — but it is not *this* plum.
 * Measured against the fold's own colour behind this box (rgb(23,13,37) at its
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
 * there is nothing left to see an edge of.
 *
 * `GLOW` is painted over the veil and under the clip: a single wide, deeply
 * feathered plum bloom centred on the flower's own mass. It does two things at
 * once — it lifts the floor the `lighten` blend resolves the clip's darkest
 * pixels onto, so no part of the photograph can bottom out into black, and it
 * gives the subject the soft ambient pool a bloom of this size would cast. It
 * has no edge of its own: it is transparent well inside the box on every side.
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

const GLOW =
  'radial-gradient(64% 46% at 51% 36%, rgba(64,31,96,0.50) 0%, rgba(45,21,70,0.26) 42%, rgba(28,14,44,0.10) 66%, rgba(28,14,44,0) 82%)'

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
 * The home fold's tulip: `tulip.png` for all of its life except the seconds it
 * is opening, which are the clip's.
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
 * **One ground, three states, two crossfades, and that is the whole thing.**
 * The backdrop — the fold's own colour plus the bloom's glow, masked to the
 * flower — is painted from the first frame and never moves again, so nothing
 * about the surface behind the bloom ever changes tone. Over it:
 *
 *   1. `tulip.png`, on screen from the first paint, covering the wait;
 *   2. the clip, faded in over `OPEN_MS` once it is presenting a settled
 *      frame — the opening motion, and only that;
 *   3. `tulip.png` again, faded back over `HANDOFF_MS` the moment the clip
 *      reaches its final open frame, and permanent from there.
 *
 * The clip is paused and hidden at the end of that last fade and is never
 * played, sought, resumed or looped again — the resting hero is the still it
 * has always been, so there is no held video frame to arrive late or drop. The
 * subject registers between clip and still to within 0.2% of the frame in both
 * axes, so what crosses either way is the light, not the picture.
 *
 * If the clip cannot be played at all — a file that errors, an autoplay the
 * browser refuses, reduced motion — nothing happens at all: the still is
 * already the thing on screen, and it simply stays.
 *
 * **When the cinematic opening is running, this clip shadows it.** The opening
 * plays the same file on its own plate and dissolves that plate away; running
 * the hero's copy on the plate's own `currentTime` means the dissolve crosses
 * two identical frames instead of two different ones, so the opening resolves
 * *into* the live hero with nothing to see swap. Both join the file at
 * `HOLD_FROM`. When there is no opening — a return visit, a deep link, a
 * restored scroll position — it simply starts there.
 */
export default function HeroTulipMedia({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const reduced = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const stillRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reduced) return

    const box = boxRef.current
    const still = stillRef.current
    const video = videoRef.current
    if (!box || !still || !video) return

    // React's `muted` attribute is not reliably reflected onto the property,
    // and muted is what makes the autoplay permissible at all.
    video.muted = true

    let started = false
    let live = false
    let handed = false
    let onScreen = true
    let io: IntersectionObserver | null = null
    let disarm: (() => void) | null = null
    let ceiling: ReturnType<typeof setTimeout> | null = null
    let promotion: ReturnType<typeof setTimeout> | null = null
    let sync = 0
    let syncUntil = 0
    let frameWatch = 0
    let frameRaf = 0

    // `requestVideoFrameCallback` is not in every lib target; read it off the
    // element rather than assuming the DOM typings carry it.
    const frames = video as unknown as {
      requestVideoFrameCallback?: (cb: () => void) => number
      cancelVideoFrameCallback?: (handle: number) => void
    }

    const stopWatch = () => {
      const cancel = frames.cancelVideoFrameCallback
      if (frameWatch && cancel) cancel.call(video, frameWatch)
      if (frameRaf) cancelAnimationFrame(frameRaf)
      frameWatch = 0
      frameRaf = 0
    }

    /** The clip comes up; the backdrop under it does not move. */
    const reveal = () => {
      if (live || handed) return
      live = true
      video.style.opacity = '1'
      still.style.opacity = '0'
    }

    /**
     * The final open frame, and the end of the clip's life. The still is
     * already mounted and decoded — it has been on screen for the whole wait —
     * so this is a 100ms change of opacity with nothing to load, and the
     * picture that lands is the one the fold keeps.
     */
    const handoff = () => {
      if (handed) return
      handed = true
      stopWatch()

      still.style.transition = `opacity ${HANDOFF_MS}ms linear`
      still.style.opacity = '1'
      video.style.transition = `opacity ${HANDOFF_MS}ms linear`
      video.style.opacity = '0'

      // Nothing may touch the clip again: no resume, no rewind, no error path.
      io?.disconnect()
      io = null
      video.removeEventListener('error', onError)

      const retire = () => {
        video.pause()
        video.style.visibility = 'hidden'
      }
      // A clip that was never revealed has no fade to wait on — and so no
      // `transitionend` to hear — so it retires on the spot.
      if (!live) retire()
      else video.addEventListener('transitionend', retire, { once: true })
    }

    /**
     * One watcher, two decisions, both taken on a frame that is actually on
     * screen: `requestVideoFrameCallback` reports the frame that *was
     * presented*, so the clip is never revealed on a frame the compositor has
     * not drawn (that is the black plate) and the handoff lands on the bloom's
     * last motion rather than after playback has stopped. Where the callback
     * is missing, an rAF poll on `readyState` says the same thing a frame
     * later.
     */
    const tick = () => {
      frameWatch = 0
      frameRaf = 0
      if (handed) return

      const at = video.currentTime
      const end = video.duration

      if (!live) {
        // A settled ground, not merely a decoded frame: the file opens
        // near-white, so an early frame would arrive as a tone jump.
        if (video.readyState >= 2 && at >= HOLD_FROM - FRAME_EPS) reveal()
      } else if (end && at >= end - END_EPS) {
        handoff()
        return
      }

      watch()
    }

    const watch = () => {
      if (handed || frameWatch || frameRaf) return
      const rvfc = frames.requestVideoFrameCallback
      if (rvfc) frameWatch = rvfc.call(video, tick)
      else frameRaf = requestAnimationFrame(tick)
    }

    /**
     * There is no fallback state to enter. The still is what is on screen
     * until the clip earns its seconds, so a file that errors or an autoplay
     * that is refused simply means those seconds never happen.
     */
    const onError = () => {
      stopWatch()
    }

    const onEnded = () => {
      handoff()
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
      if (started || handed) return

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

      try {
        // `running` is re-read: a frame may have passed since the check above.
        const at = plateTime()
        video.currentTime = at !== null && at >= HOLD_FROM ? at : HOLD_FROM
      } catch {
        // Non-fatal: playback starts wherever the buffer allows.
      }

      // Armed after the seek, so the first frame it can accept is already a
      // settled one.
      watch()

      if (!onScreen) return
      const playing = video.play()
      // A refusal leaves no hole: the still is what is on screen.
      if (playing) playing.catch(() => stopWatch())
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
    // clip that was released while the fold was out of view — and it is gone
    // the moment the still takes over, so it can never rewind a finished clip.
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry || handed) return
        onScreen = entry.isIntersecting
        if (!onScreen) {
          video.pause()
          return
        }
        if (!started || video.ended) return
        const playing = video.play()
        if (playing) playing.catch(() => {})
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
      io?.disconnect()
      disarm?.()
      if (sync) cancelAnimationFrame(sync)
      if (ceiling) clearTimeout(ceiling)
      if (promotion) clearTimeout(promotion)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      stopWatch()
      video.pause()
    }
  }, [reduced])

  // Reduced motion is the absence of the clip, not a quieter one: the fold is
  // the still it has always been.
  if (reduced) return <HeroTulip className={className} {...rest} />

  return (
    <div ref={boxRef} className={`${className ?? ''} h-[813.333px]`} {...rest}>
      {/* The ground, and the only one: the fold's own colour plus the bloom's
          glow, cut to the flower by the same two masks the clip wears — the
          edge cut outside, the shape inside, nested rather than intersected in
          one layer list so no engine has to agree with any other about
          `mask-composite`. It is painted from the first frame at full
          strength, under the still as well as under the clip, and it never
          changes. There is nothing here that can arrive, brighten or read as
          a rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: EDGE,
          WebkitMaskImage: EDGE,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <div
          className="size-full"
          // `isolation` keeps the clip's blend reaching the backdrop and
          // stopping there, rather than at the page behind this box.
          style={{ maskImage: SHAPE, WebkitMaskImage: SHAPE, isolation: 'isolate' }}
        >
          {/* Glow over veil, both under the clip. See `VEIL` and `GLOW`. */}
          {/* `--tulip-veil` lets a mirrored layout re-project the same backdrop
              for the box's new x without a second component. */}
          <div
            className="absolute inset-0"
            style={{ background: `${GLOW}, var(--tulip-veil, ${VEIL})` }}
          />

          <video
            ref={videoRef}
            src={tulipVideoSrc}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            className="absolute inset-0 size-full object-cover"
            // Per channel, the brighter of clip and backdrop. The flower is
            // brighter than the page and survives untouched; its ground is
            // darker and becomes the page exactly. No plate of its own before
            // it has a frame — the element's default is black — and painted
            // from the start at 0.001 rather than 0, so it is layerised,
            // decoded and blended before the fade rather than at it.
            style={{
              mixBlendMode: 'lighten',
              backgroundColor: 'transparent',
              opacity: 0.001,
              transition: `opacity ${OPEN_MS}ms linear`,
              willChange: 'opacity',
            }}
          />
        </div>
      </div>

      {/* The hero's actual picture. On screen from the first paint, out only
          for the seconds the clip is opening the bloom, and back permanently
          the moment it reaches its final frame. */}
      <div
        ref={stillRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 1, transition: `opacity ${OPEN_MS}ms linear`, willChange: 'opacity' }}
      >
        <HeroTulip className="size-full" />
      </div>
    </div>
  )
}
