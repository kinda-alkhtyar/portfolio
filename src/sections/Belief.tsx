import tulip from '../assets/images/home/tulip.png'
import PlusMark from '../components/PlusMark'
import { useMotionScope } from '../motion'
import { beliefMotion } from './beliefMotion'
import { useLocale } from '../i18n/localization'

/** The eyebrow, one masked line each instead of one block split by `<br />`. */
const EYEBROW = ['A BELIEF', 'THAT DRIVES', 'EVERYTHING']

/**
 * DESIGN IS COMMUNICATION.
 *
 * Three columns of one band: the stacked beige eyebrow and its rule hang on
 * the left gutter, the display line and its serif note sit on the optical
 * centre, and a hard crop of the tulip fills the right third and bleeds off
 * the canvas edge behind a thin frame. Offsets are the reference measurements
 * scaled onto the 1440 canvas, taken from the frame's top-left corner.
 *
 * Motion hooks only, no layout change: the two multi-line blocks render their
 * lines as `block` spans rather than `<br />` (identical line boxes, but each
 * line can now be masked), and the image sits inside a full-bleed `inset-0`
 * plane so the crop window itself never has to move. The clips are set from JS,
 * so reduced motion and a JS failure both leave the band exactly as authored.
 */
export default function Belief() {
  const locale = useLocale()
  const eyebrow = locale === 'ar' ? ['قناعة', 'تقود', 'كل ما أقدّمه'] : EYEBROW
  const sectionRef = useMotionScope<HTMLElement>(beliefMotion)

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${locale === 'ar' ? 'ar-belief' : ''}`}
    >
      <div className="home-section relative pt-[196px]">
        <div data-motion="belief-band" className="relative h-[500px]">
          {/* thin frame the tulip crop sits inside */}
          <div
            aria-hidden="true"
            data-motion="belief-frame"
            className="absolute right-[6px] top-0 h-[460px] w-[503px] border border-white/12"
          />

          {/* tulip: a bloom-scale crop, clipped to the band and run off the right edge */}
          {/* `belief-crop` names the window for the phone layout, which takes
              the band out of absolute placement and stacks it; nothing on
              desktop reads the class. */}
          <div className="belief-crop absolute right-[calc(-1_*_var(--content-pl))] top-[14px] h-[474px] w-[640px] overflow-hidden">
            <div data-motion="belief-plane" className="absolute inset-0">
              <img
                src={tulip}
                alt=""
                aria-hidden="true"
                data-motion="belief-tulip"
                className="absolute -left-[463px] -top-[348px] w-[1810px] max-w-none"
              />
            </div>
          </div>

          {/* left column */}
          <p className="absolute left-0 top-[121px] font-nav text-[15px] font-medium leading-[1.95] tracking-[0.25em] text-beige">
            {eyebrow.map((line) => (
              <span key={line} className="block">
                <span data-motion="belief-label" className="block">
                  {line}
                </span>
              </span>
            ))}
          </p>

          <span
            aria-hidden="true"
            data-motion="belief-rule"
            className="absolute left-0 top-[233px] h-px w-[190px] bg-white/20"
          />

          <PlusMark
            data-motion="belief-mark"
            className="absolute left-[210px] top-[74px] text-[22px] leading-none"
          />
          <PlusMark
            data-motion="belief-mark"
            className="absolute left-[205px] top-[224px] text-[22px] leading-none"
          />

          {/* statement */}
          <h2 className="absolute left-[280px] top-[81px] font-display text-[107px] leading-[0.9] tracking-[0.005em] text-white">
            <span className="block">
              <span data-motion="belief-line" className="block">
                {locale === 'ar' ? 'التصميم هو' : 'DESIGN IS'}
              </span>
            </span>
            <span className="block">
              <span data-motion="belief-line" className="block">
                {locale === 'ar' ? 'تواصل' : 'COMMUNICATION'}
                <span
                  aria-hidden="true"
                  data-motion="belief-dot"
                  className="ml-[10px] inline-block size-[20px] rounded-full bg-beige align-baseline"
                />
              </span>
            </span>
          </h2>

          <p
            data-motion="belief-note"
            className="absolute left-[280px] top-[338px] w-[320px] font-serif text-[19px] leading-[1.65] text-white/70"
          >
            {locale === 'ar' ? 'به تتشكل الأفكار، وتجد العلامات معناها، ويتواصل الناس. لذلك تصنع كل تفصيلة فرقًا.' : <>It&rsquo;s how ideas take shape, how brands find meaning, and how people connect. That&rsquo;s why every detail matters.</>}
          </p>

          <p
            data-motion="belief-signature"
            className="absolute left-[643px] top-[344px] font-script text-[62px] leading-none tracking-[0.015em] text-beige"
          >
            Yumna
          </p>
        </div>
      </div>
    </section>
  )
}
