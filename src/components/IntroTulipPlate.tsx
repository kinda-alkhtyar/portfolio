import { useState } from 'react'

import introVideoSrc from '../assets/images/intro/tulip-opening.mp4'
import { useReducedMotion } from '../motion'
import { introWillRun } from '../sections/introGate'

/**
 * The tulip-opening clip, mounted as a sibling of `HeroTulip` **inside the
 * hero's own scene** rather than in the intro overlay.
 *
 * That placement is the whole handoff. The plate carries the same positioning
 * classes as `HeroTulip`, so it inherits `.home-track`'s centring, the
 * `--tulip-shift` / `--hero-lift` short-viewport offsets and the canvas
 * `zoom` — it is the hero tulip's box at every breakpoint, by construction,
 * with nothing measured and nothing to keep in sync. It also sits under the
 * fold's edge vignette exactly as the still does, so the two are lit the same
 * on the way through.
 *
 * The clip earns that: its first frame is the hero's `tulip.png`. Measured
 * against the still's alpha, the subject's bounding box matches to within
 * 0.2% of the frame in both axes and its centroid to within 0.2% — same lens,
 * same distance, same pose — and the stem and leaves hold that registration
 * for the whole 5s while the bloom opens. So the plate needs no corrective
 * scale or offset, and the dissolve at the end is a true match dissolve:
 * everything below the flower head is already coincident, and only the bloom
 * itself — open in the clip, closed in the still — resolves across it.
 *
 * The clip also starts on a near-white ground (border luma 232, falling to
 * the site's own ~17 by its second second). The veil below is the controlled
 * fade that hides it; see `homeIntroMotion` for the curve, which is fitted to
 * that measured fall-off rather than guessed.
 *
 * Sized in canvas pixels to the still's rendered box: 610 x 610 * 1448/1086.
 * Absolutely positioned inside a layer that is already laid out, so there is
 * no layout shift whether the file arrives early, late or never.
 */
export default function IntroTulipPlate() {
  const reduced = useReducedMotion()
  const [runs] = useState(introWillRun)

  if (reduced || !runs) return null

  // The plate is revealed by `homeIntroMotion`: invisible until then, and if
  // the motion never runs, invisible for good.
  //
  // The inner wrapper feathers the clip rather than butting it against the
  // backdrop. The clip's ground settles ~9 luma below the backdrop it sits on,
  // which is invisible as a gradient and reads as a rectangle as an edge. The
  // top feather is kept short (3.5%) because the bloom touches the frame
  // there; softening its last few pixels into the dark is atmosphere, not a
  // crop.
  return (
    <div
      data-motion="intro-plate"
      aria-hidden="true"
      style={{ opacity: 0, visibility: 'hidden' }}
      className="pointer-events-none absolute right-[calc(62px_+_var(--tulip-shift))] top-[calc(147px_-_var(--hero-lift))] h-[813.333px] w-[610px] overflow-hidden"
    >
      <div
        className="size-full"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, #000 3.5%, #000 90%, transparent 100%), linear-gradient(to right, transparent 0%, #000 8%, #000 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, #000 3.5%, #000 90%, transparent 100%), linear-gradient(to right, transparent 0%, #000 8%, #000 94%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <video
          data-intro="video"
          src={introVideoSrc}
          muted
          playsInline
          // Metadata only to begin with. The plane covers are wanted four
          // seconds before this file is, and an 8.7MB clip started in the same
          // tick would take the bandwidth they need; `homeIntroMotion`
          // promotes this to `auto` the moment they have landed.
          preload="metadata"
          disablePictureInPicture
          className="size-full object-cover"
        />
      </div>

      {/* The controlled fade. The fold's local plum, painted over the clip and
          eased off along the clip's own brightness curve. */}
      <div
        data-intro="veil"
        className="absolute inset-0 bg-[radial-gradient(72%_58%_at_44%_25%,#1E1030_0%,#150C22_55%,#0F0919_100%)]"
      />
    </div>
  )
}
