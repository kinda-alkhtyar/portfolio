import crateSrc from '../assets/projects/second-life/mockup-shipping-crate.png'
import serumSrc from '../assets/projects/rumman/serum-mockup.png'
import { projectCovers } from '../data/projectCovers'

/**
 * The twelve works the opening puts on stage, as a field of editorial planes.
 *
 * Read by both `IntroStage` (which renders them) and `homeIntroMotion` (which
 * plays them), so a plane's position, its depth and its beat can never drift
 * apart. Real portfolio artwork only: the ten covers straight from
 * `projectCovers.ts` — the same files the Selected Work strip and `/work`
 * already load, so the browser has one copy of each — plus two existing
 * project assets chosen for what the field needed rather than for variety's
 * sake. SECOND LIFE's shipping crate is the darkest photograph in the
 * portfolio and anchors the far layer without lifting the plum; RUMMAN's
 * serum mockup is the only close-up of a hand and reads at the size a plane
 * passing the camera has to survive.
 *
 * ## The composition
 *
 * Authored against the 1440 x 1088 canvas the rest of the homepage is
 * measured on, expressed in viewport percentages so it holds its proportions
 * on the short-viewport breakpoints, and laid out as a coverage map rather
 * than guessed: roughly four fifths of the frame carries artwork, a sixth of
 * it two or three planes deep, and several planes are cut by a viewport edge.
 * The remaining plum is breathing room, not a hole — full coverage would read
 * as a collage rather than a field with air in it. The two subjects hold the
 * centre; everything else is arranged so that neither of them is occluded by
 * a nearer plane.
 *
 * It is deliberately **not** a grid, a stack, a fan or a carousel. No two
 * planes share a size, an aspect, an entry edge, a depth, a drift direction
 * or a beat. Nothing repeats and nothing loops.
 *
 * ## The depth model
 *
 * Unlike the rest of the site, these planes **do not rest at z 0** — this one
 * is a field seen through a camera, and near/mid/far is the subject. Three
 * layers: far (-880..-620), mid (-430..-200), near (-110..+60).
 *
 * The near layer is not a rung like the other two. It carries the opening's
 * two **subjects** — AQARATI's desktop portal and DR. MOUHAMMAD ABOU SHAHIN's
 * clinic app, the only interfaces in the field — sized, lit and paced so they
 * read as screens rather than as covers. The other ten are supporting depth:
 * they establish the field the camera is travelling through and then get out
 * of the way. DAMASCUS and WAHJ were moved back into the mid layer to make
 * that room; they used to sit in front of both.
 *
 * A resting z on a shared perspective moves a plane on screen, because the
 * vanishing point is off-centre (it sits on the hero bloom). So `left`/`top`
 * below are the position the plane is meant to **appear** at, and
 * `homeIntroMotion` solves for the transform that puts it there:
 *
 *     x = (D - O)(1/s - 1) - W/2      where s = P / (P - z)
 *
 * — the perspective compensation plus the centring offset, computed at setup
 * from the measured vanishing point and the plane's own rendered box, so the
 * authored composition is exact at any viewport rather than only at 1440.
 *
 * Depth then pays for itself three times over, all of it physically correct
 * rather than faked:
 *
 *   scale     a far plane is authored large and projects small
 *   parallax  the camera's own x/y translation is multiplied by each plane's
 *             `s`, so far planes move less than near ones for free; `drift`
 *             adds authored motion on top of that, scaled up for the near
 *             layer, which lands the screen travel at roughly 65px far,
 *             110px mid, 195px near across the field
 *   dolly     the camera's z push grows the near layer ~21% and the far layer
 *             ~13% over the same move, which is the whole reason it reads as
 *             travelling *through* the field rather than zooming it
 *
 * Because the camera is `preserve-3d`, the browser depth-sorts the planes
 * itself, so a plane coming forward passes in front of the field without any
 * z-index bookkeeping. The array is still ordered back to front, which is
 * both the paint order and a readable statement of the depth ladder.
 *
 * ## The tone ladder
 *
 * Graded on the *result*, not on the multiplier, because the twelve artworks
 * are nowhere near equally bright: the white sheets (STILL HUMAN, SECOND
 * LIFE, DR ABOU SHAHIN) take far more wash than their rung alone would ask
 * for, and the already-dark ones (the crate, DAMASCUS) take less.
 *
 * The two subjects are the exception to the ladder rather than its top rung:
 * they take almost no wash at all (0.14 / 0.16, against 0.3-0.6 for the
 * field), because a UI screen that has been graded into the plum is a texture
 * and not a screen. They are the only two planes the eye is meant to *read*.
 */
export interface IntroPlane {
  /** Stable React key, and the name this plane goes by in the comments. */
  key: string
  src: string
  /** Tailwind box: width (a viewport percentage) and aspect ratio. */
  box: string
  /**
   * Where the plane's **centre** is meant to land, as a viewport percentage.
   * Written to CSS `left`/`top`; the half-box and the perspective
   * compensation are both folded into the transform at setup.
   */
  left: string
  top: string
  /** Resting depth, and how much further back it arrives from. */
  z: number
  arrive: number
  /** Resting opacity and the alpha of the plum wash over the artwork. */
  rest: number
  wash: number
  /** Closed `clip-path` inset — the edge this plane uncovers from. */
  closed: string
  /** When the uncover starts, how long it takes, and the depth settle. */
  at: number
  wipe: number
  settle: number
  /** The artwork's over-scale behind the wipe. */
  over: number
  /**
   * The plane's own drift across the field, in **local** units — they are
   * multiplied by the plane's `s` on the way to the screen, which is what
   * makes the parallax depth-correct. One linear tween spanning the whole
   * field, so a plane is already travelling when it is uncovered.
   */
  drift: { x0: number; y0: number; x1: number; y1: number }
  /**
   * The two planes that pass the camera. `z` creeps forward on an
   * accelerating curve; because both sit well off the vanishing point, the
   * growth throws them out of frame rather than blowing them up in place.
   * Both are gone before the collapse, so the field flows through rather than
   * only accumulating — and the ten that remain are the ten that get sucked
   * into the flower.
   */
  pass?: { to: number; at: number; run: number; fade: number }
}

export const INTRO_PLANES: IntroPlane[] = [
  /* ── far ─────────────────────────────────────────────────────────── */
  {
    key: 'crate',
    src: crateSrc,
    box: 'w-[38%] aspect-[16/9]',
    left: '13%',
    top: '21%',
    z: -880,
    arrive: -320,
    rest: 0.5,
    wash: 0.5,
    closed: 'inset(100% 0% 0% 0%)',
    at: 0.22,
    wipe: 1.05,
    settle: 1.15,
    over: 1.07,
    drift: { x0: -52, y0: -34, x1: 44, y1: 22 },
  },
  {
    key: 'still-human',
    src: projectCovers['still-human'],
    box: 'w-[30%] aspect-[7/10]',
    left: '82%',
    top: '18%',
    z: -760,
    arrive: -280,
    rest: 0.52,
    wash: 0.62,
    closed: 'inset(0% 0% 100% 0%)',
    at: 0.72,
    wipe: 1,
    settle: 1.05,
    over: 1.06,
    drift: { x0: 46, y0: 30, x1: -40, y1: -18 },
  },
  {
    key: 'strawberry-milk',
    src: projectCovers['strawberry-milk'],
    box: 'w-[30%] aspect-[5/4]',
    left: '6%',
    top: '62%',
    z: -620,
    arrive: -260,
    rest: 0.6,
    wash: 0.56,
    closed: 'inset(100% 0% 0% 0%)',
    at: 1.1,
    wipe: 0.88,
    settle: 1,
    over: 1.07,
    drift: { x0: 34, y0: -44, x1: -46, y1: 30 },
  },

  /* ── mid ─────────────────────────────────────────────────────────── */
  {
    key: 'second-life',
    src: projectCovers['second-life'],
    box: 'w-[32%] aspect-[3/2]',
    left: '33%',
    top: '34%',
    z: -430,
    arrive: -340,
    rest: 0.74,
    wash: 0.5,
    closed: 'inset(0% 100% 0% 0%)',
    at: 0.5,
    wipe: 0.95,
    settle: 1.1,
    over: 1.08,
    drift: { x0: -66, y0: 34, x1: 58, y1: -30 },
  },
  {
    key: 'swirle',
    src: projectCovers.swirle,
    box: 'w-[20%] aspect-square',
    left: '90%',
    top: '46%',
    z: -300,
    arrive: -240,
    rest: 0.8,
    wash: 0.34,
    closed: 'inset(0% 0% 100% 0%)',
    at: 1.9,
    wipe: 0.58,
    settle: 0.66,
    over: 1.08,
    drift: { x0: 70, y0: -28, x1: -52, y1: 34 },
    pass: { to: 540, at: 2.6, run: 0.78, fade: 0.38 },
  },
  {
    key: 'damascus',
    src: projectCovers.damascus,
    box: 'w-[21.5%] aspect-[7/10]',
    left: '40%',
    top: '55%',
    z: -300,
    arrive: -300,
    rest: 0.82,
    wash: 0.3,
    // It still opens from its own centre — the one plane in the field that
    // does — but it now sits behind AQARATI rather than in front of it.
    closed: 'inset(0% 50% 0% 50%)',
    at: 1.56,
    wipe: 0.62,
    settle: 1.05,
    over: 1.1,
    drift: { x0: -102, y0: 54, x1: 94, y1: -48 },
  },
  {
    key: 'wahj',
    src: projectCovers.wahj,
    box: 'w-[22%] aspect-square',
    left: '66%',
    top: '26%',
    z: -260,
    arrive: -300,
    rest: 0.8,
    wash: 0.36,
    closed: 'inset(0% 0% 100% 0%)',
    at: 1.24,
    wipe: 0.68,
    settle: 0.95,
    over: 1.09,
    drift: { x0: 88, y0: -62, x1: -98, y1: 44 },
  },
  {
    key: 'fleure',
    src: projectCovers.fleure,
    box: 'w-[22%] aspect-square',
    left: '20%',
    top: '86%',
    z: -200,
    arrive: -260,
    rest: 0.84,
    wash: 0.38,
    closed: 'inset(0% 0% 0% 100%)',
    at: 1.78,
    wipe: 0.74,
    settle: 0.92,
    over: 1.07,
    drift: { x0: 50, y0: 40, x1: -68, y1: -26 },
  },

  /* ── near: the two subjects ──────────────────────────────────────
     AQARATI's Arabic property portal and DR. MOUHAMMAD ABOU SHAHIN's clinic
     app are the only two artworks in the field that are *interfaces*, and the
     opening is a UI/UX portfolio's opening — so they are not peers of the ten
     around them. They are authored as the pair a case study would show them
     as: the desktop screen laid out low and left, the phone standing in front
     of it and slightly right, both nearly life-size in projection, both
     lit almost clean of the plum wash so the layouts actually read.

     Everything about them is slower than the field's rhythm: they arrive from
     ~500 further back, take twice the wipe, settle for a second and a half,
     and drift about a third as far, so the camera passes them rather than
     them passing the camera. Both hold their frame while the rest of the
     field keeps flickering past. */
  {
    key: 'aqarati',
    src: projectCovers.aqarati,
    // 1280 x 631: the browser chrome and the hero band survive `object-cover`
    // at 2/1 almost uncropped, which is the whole point of showing it big.
    box: 'w-[46%] aspect-[2/1]',
    left: '34%',
    top: '62%',
    z: -110,
    arrive: -520,
    rest: 1,
    wash: 0.14,
    closed: 'inset(0% 100% 0% 0%)',
    at: 0.98,
    wipe: 1.3,
    settle: 1.55,
    over: 1.12,
    drift: { x0: -30, y0: 24, x1: 26, y1: -16 },
  },
  {
    key: 'dr-abou-shahin',
    src: projectCovers['dr-mouhammad-abou-shahin'],
    // 864 x 1821 — a phone screen, and 8/17 is its own ratio to within 1%.
    box: 'w-[22%] aspect-[8/17]',
    left: '60%',
    top: '46%',
    z: -55,
    arrive: -470,
    rest: 1,
    wash: 0.16,
    closed: 'inset(100% 0% 0% 0%)',
    at: 1.66,
    wipe: 1.18,
    settle: 1.45,
    over: 1.11,
    drift: { x0: -26, y0: -30, x1: 30, y1: 20 },
  },
  {
    key: 'serum',
    src: serumSrc,
    box: 'w-[16%] aspect-[7/10]',
    left: '33.5%',
    top: '17.5%',
    z: -60,
    arrive: -340,
    rest: 0.92,
    wash: 0.26,
    closed: 'inset(0% 0% 0% 100%)',
    at: 0.86,
    wipe: 0.72,
    settle: 1.05,
    over: 1.09,
    drift: { x0: 100, y0: 46, x1: -88, y1: -52 },
    pass: { to: 620, at: 1.95, run: 1.1, fade: 0.4 },
  },
  {
    key: 'rumman',
    src: projectCovers.rumman,
    box: 'w-[24%] aspect-square',
    left: '83%',
    top: '68%',
    z: 60,
    arrive: -420,
    rest: 0.96,
    wash: 0.22,
    closed: 'inset(50% 0% 50% 0%)',
    at: 2.18,
    wipe: 0.52,
    settle: 1.05,
    over: 1.1,
    drift: { x0: -94, y0: -54, x1: 108, y1: 50 },
  },
]

/** Open `clip-path` inset. One value, so every uncover lands identically. */
export const PLANE_OPEN = 'inset(0% 0% 0% 0%)'

/** The field is complete at ~3.23 and holds until the collapse takes it. */
export const FIELD_END = 3.4
