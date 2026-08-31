import type { ReactNode } from 'react'

import HeroTulip from '../components/HeroTulip'
import Navbar from '../components/Navbar'
import PlusMark from '../components/PlusMark'
import { useMotionScope } from '../motion'
import { aboutMotion } from './aboutMotion'
import { useLocale } from '../i18n/localization'

/**
 * /about — authored against the 1440 x 1088 `about-reference.png` canvas, in
 * literal reference pixels, the same way the Home fold and /work are.
 *
 * The page is one screen: a left-anchored statement, the decorative tulip
 * group holding the right half with the pull quote inside its ring, and a
 * three-card band across the bottom. Nothing scrolls, so the whole scene is
 * carried by the entrance in `aboutMotion`.
 */

/* ── the composition, in reference pixels ──────────────────────────── */

/** Top of the hero band: the navbar occupies 28 → 78. */
const HERO_H = 482

/** Card geometry: 84 → 1312 across, three 396px cards with 20px gutters. */
const CARD_W = 396

/* ── icons ─────────────────────────────────────────────────────────── */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[30px] text-purple-light" aria-hidden="true">
      <path {...stroke} d="M12 3.4l2.6 5.5 5.9.8-4.3 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.3-4.2 5.9-.8z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[28px] text-beige" aria-hidden="true">
      <rect {...stroke} x="2.8" y="7.2" width="18.4" height="12.4" rx="2.4" />
      <path {...stroke} d="M9 7.2V5.6a1.8 1.8 0 011.8-1.8h2.4A1.8 1.8 0 0115 5.6v1.6M2.8 12.4h18.4" />
    </svg>
  )
}

/** The house tulip, reduced to a mark. */
function TulipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[28px] text-beige" aria-hidden="true">
      <path {...stroke} d="M6 6.4c0 4.2 2.7 7.2 6 7.2s6-3 6-7.2c-1.9 0-3.3.9-4.2 2.2C12.9 7 12 6.2 12 6.2s-.9.8-1.8 2.4C9.3 7.3 7.9 6.4 6 6.4z" />
      <path {...stroke} d="M12 13.6V21M12 17.4c-1.9 0-3.4-1.3-3.9-3.1M12 17.4c1.9 0 3.4-1.3 3.9-3.1" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[26px] text-white/70" aria-hidden="true">
      <rect {...stroke} x="3.2" y="5" width="17.6" height="15.4" rx="2.4" />
      <path {...stroke} d="M3.2 9.6h17.6M7.8 3.4v3M16.2 3.4v3" />
      <circle cx="8.4" cy="14" r="1.1" fill="currentColor" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[26px] text-white/70" aria-hidden="true">
      <path {...stroke} d="M12 3.2l8.6 4.4L12 12 3.4 7.6z" />
      <path {...stroke} d="M3.4 12.2L12 16.6l8.6-4.4M3.4 16.6L12 21l8.6-4.4" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[26px] text-white/70" aria-hidden="true">
      <circle {...stroke} cx="9.4" cy="8" r="3.4" />
      <path {...stroke} d="M2.8 19.6c0-3.6 2.9-6 6.6-6s6.6 2.4 6.6 6" />
      <path {...stroke} d="M16.4 5.2a3.2 3.2 0 010 6M18 13.9c2.2.6 3.6 2.4 3.6 4.9" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[26px] text-purple-light" aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.8" />
      <path {...stroke} d="M3.2 12h17.6M12 3.2c2.4 2.4 3.6 5.4 3.6 8.8s-1.2 6.4-3.6 8.8c-2.4-2.4-3.6-5.4-3.6-8.8S9.6 5.6 12 3.2z" />
    </svg>
  )
}

function FigmaGlyph() {
  return (
    <svg viewBox="0 0 24 36" className="h-[27px] w-[18px]" aria-hidden="true">
      <path fill="#0ACF83" d="M6 36a6 6 0 006-6v-6H6a6 6 0 000 12z" />
      <path fill="#A259FF" d="M0 18a6 6 0 016-6h6v12H6a6 6 0 01-6-6z" />
      <path fill="#F24E1E" d="M0 6a6 6 0 016-6h6v12H6A6 6 0 010 6z" />
      <path fill="#FF7262" d="M12 0h6a6 6 0 010 12h-6z" />
      <path fill="#1ABCFE" d="M24 18a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  )
}

/* ── card scaffolding ──────────────────────────────────────────────── */

interface CardProps {
  label: string
  title: string
  numeral: string
  icon: ReactNode
  body: string
  children?: ReactNode
}

function Card({ label, title, numeral, icon, body, children }: CardProps) {
  return (
    <article
      data-motion="card"
      style={{ width: CARD_W }}
      className="relative h-[475px] shrink-0 overflow-hidden rounded-[20px] border border-white/[0.07] bg-[linear-gradient(157deg,#1E1329_0%,#170E21_54%,#120B1A_100%)]"
    >
      {/* The soft top-left bloom every card carries in the reference. */}
      <div
        aria-hidden="true"
        className="card-bloom pointer-events-none absolute inset-0 bg-[radial-gradient(78%_58%_at_18%_6%,rgba(127,75,165,.16)_0%,transparent_70%)]"
      />

      <div
        data-motion="icon"
        className="absolute left-[28px] top-[36px] flex size-[68px] items-center justify-center rounded-full border border-purple/45 bg-[radial-gradient(120%_120%_at_30%_18%,#3B2151_0%,#231432_100%)]"
      >
        {icon}
      </div>

      <p
        data-motion="card-part"
        className="card-label absolute left-[119px] top-[38px] font-nav text-[13px] font-medium tracking-[0.24em] text-beige"
      >
        {label}
      </p>
      <h2
        data-motion="card-part"
        className="card-title absolute left-[119px] top-[60px] font-display text-[28px] leading-[1.1] tracking-[0.015em] text-white"
      >
        {title}
      </h2>
      <span
        data-motion="rule"
        aria-hidden="true"
        className="card-tick absolute left-[119px] top-[117px] h-[2px] w-[30px] origin-left bg-beige/70"
      />

      <p
        data-motion="card-part"
        className="card-body absolute left-[32px] top-[142px] w-[262px] text-[16px] leading-[1.62] text-white/72"
      >
        {body}
      </p>

      {children}

      <PlusMark data-motion="mark" className="absolute left-[41px] top-[420px] text-[24px]" />
      <span
        data-motion="numeral"
        aria-hidden="true"
        className="absolute right-[24px] top-[388px] select-none font-display text-[70px] leading-none tracking-[0.02em] text-white/[0.055]"
      >
        {numeral}
      </span>
    </article>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-[10px] text-[15px] leading-none text-white/85">
      <span aria-hidden="true" className="size-[5px] shrink-0 rounded-full bg-purple-light" />
      {children}
    </li>
  )
}

function Stat({ icon, value, caption }: { icon: ReactNode; value: string; caption: string }) {
  return (
    <div className="flex flex-col">
      {icon}
      <p className="mt-[12px] font-display text-[27px] leading-none tracking-[0.02em] text-white">
        {value}
      </p>
      <p className="mt-[10px] whitespace-pre-line text-[13px] leading-[1.32] text-white/55">{caption}</p>
    </div>
  )
}

function Tool({ tile, label }: { tile: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tool-tile flex size-[62px] items-center justify-center rounded-[14px] border border-white/10">
        {tile}
      </span>
      <span className="tool-label mt-[10px] text-[13px] leading-none text-white/60">{label}</span>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────── */

const RAIL = 'font-nav text-[12px] font-medium tracking-[0.42em] text-purple-light/75'

export default function About() {
  const locale = useLocale()
  const scopeRef = useMotionScope<HTMLElement>(aboutMotion)

  return (
    <main ref={scopeRef} className="about-page relative min-h-[1088px] min-w-[1440px] overflow-hidden bg-bg pt-[28px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(66%_58%_at_63%_16%,#261436_0%,#160D22_46%,#0B0611_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(118%_100%_at_50%_50%,transparent_46%,rgba(2,1,6,.74)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-[1440px]">
        <Navbar variant="fixed" />

        {/* ── hero band ────────────────────────────────────────────── */}
        <section style={{ height: HERO_H }} className="about-hero relative">
          <p className="absolute left-[86px] top-[70px] overflow-hidden pb-[0.12em] font-nav text-[15px] font-semibold tracking-[0.42em] text-beige">
            <span data-motion="eyebrow-line" className="block">
              {locale === 'ar' ? 'عنّي' : 'ABOUT ME'}
            </span>
          </p>
          <span
            data-motion="rule"
            aria-hidden="true"
            className="absolute left-[86px] top-[104px] h-px w-[160px] origin-left bg-gradient-to-r from-beige/75 to-transparent"
          />

          <h1 className="absolute left-[86px] top-[118px] font-display text-[80px] leading-[1.17] tracking-[0.005em] text-white">
            {(locale === 'ar' ? ['مصمّمة تواصل', 'بصري'] : ['VISUAL COMMUNICATION', 'DESIGNER']).map((line) => (
              <span key={line} className="block overflow-hidden">
                <span data-motion="title-line" className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="about-lede absolute left-[86px] top-[322px] font-serif text-[25px] leading-[1.4] text-white/88">
            {(locale === 'ar'
              ? [
                  <>أحوّل الأفكار إلى أنظمة بصرية <em className="not-italic text-purple-light">واضحة، جريئة، ومدروسة.</em></>,
                  <>أصمّم تجارب وهوّيات لا تكتفي بأن تبدو جميلة،</>,
                  <><em className="not-italic text-purple-light">بل تعمل بذكاء وتترك أثرًا.</em></>,
                ]
              : [
                  <>I create visuals that <em className="not-italic text-purple-light">communicate ideas,</em></>,
                  <><em className="not-italic text-purple-light">build connections</em> and leave a{' '}<em className="not-italic text-purple-light">lasting impact.</em></>,
                ]).map((line, index) => (
              <span key={index} className="block overflow-hidden pb-[0.06em]">
                <span data-motion="lede-line" className="block">
                  {line}
                </span>
              </span>
            ))}
          </p>

          <span
            data-motion="rule"
            aria-hidden="true"
            className="absolute left-[86px] top-[430px] h-px w-[32px] origin-left bg-purple-light/80"
          />

          {/* The decorative stage. One lens, set by `aboutMotion`; every offset
              inside is measured from the hero band's own edges. */}
          <div data-motion="about-scene" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              data-motion="ring"
              className="absolute left-[748px] top-[65px] size-[614px] rounded-full border border-white/[0.09]"
            />

            {/* Hairline guides: the reference's two dotted plumb lines. */}
            <span
              data-motion="guide"
              className="about-guide-a absolute left-[1155px] top-[42px] h-[435px] w-px origin-top bg-[repeating-linear-gradient(to_bottom,rgba(239,237,240,.22)_0_3px,transparent_3px_9px)]"
            />
            <span
              data-motion="guide"
              className="about-guide-b absolute left-[1024px] top-[352px] h-[130px] w-px origin-top bg-[repeating-linear-gradient(to_bottom,rgba(239,237,240,.16)_0_3px,transparent_3px_9px)]"
            />

            <HeroTulip
              data-motion="tulip"
              className="absolute left-[795px] top-[20px] h-[492px] w-[372px] object-contain object-center"
            />

            <PlusMark data-motion="mark" className="about-mark-a absolute left-[862px] top-[52px] text-[21px] text-purple-light/70" />
            <PlusMark data-motion="mark" className="about-mark-b absolute left-[1272px] top-[92px] text-[24px] text-white/20" />
            <PlusMark data-motion="mark" className="about-mark-c absolute left-[775px] top-[415px] text-[20px] text-purple-light/70" />
          </div>

          {/* The pull quote sits inside the ring, on the guide. */}
          <figure className="about-quote absolute left-[1183px] top-[180px] w-[150px]">
            <span
              data-motion="quote-part"
              aria-hidden="true"
              className="block font-serif text-[38px] leading-[0.6] text-purple-light/70"
            >
              &ldquo;
            </span>
            <blockquote data-motion="quote-part" className="mt-[26px] font-serif text-[17px] leading-[1.5] text-white/72">
              {locale === 'ar' ? <>أؤمن أن التصميم<br />القوي يبدأ بفكرة<br />واضحة، ثم يتحول<br />إلى تجربة يشعر بها<br />الناس ويتذكرونها.</> : <>Design is not just<br />how it looks,<br />it&rsquo;s how it works<br />and why it matters.</>}
            </blockquote>
            <figcaption
              data-motion="quote-part"
              className="-ml-[2px] mt-[24px] font-script text-[46px] leading-[1.1] tracking-[0.015em] text-beige/85"
            >
              Yumna
            </figcaption>
          </figure>
        </section>

        {/* ── card band ────────────────────────────────────────────── */}
        <section className="flex gap-[20px] px-[84px]">
          <Card
            label={locale === 'ar' ? 'الخبرات' : 'EXPERTISE'}
            title={locale === 'ar' ? 'ماذا أقدّم' : 'WHAT I DO'}
            numeral="01"
            icon={<StarIcon />}
            body={locale === 'ar' ? 'أبني هويات وتجارب بصرية تجمع بين الفكرة، الوضوح، والتأثير.' : 'I work across a range of visual disciplines to help brands and products communicate clearly and beautifully.'}
          >
            <ul
              data-motion="card-part"
              className="card-services absolute left-[32px] top-[262px] grid w-[336px] grid-cols-[152px_1fr] gap-y-[16px]"
            >
              {(locale === 'ar'
                ? ['الهوية البصرية', 'التصميم الجرافيكي', 'تصميم UI/UX', 'تصميم الإعلانات', 'إعلانات الفيديو']
                : ['Graphic Design', 'Advertising Design', 'UI/UX Design', 'Video Advertising']
              ).map((service) => (
                <Bullet key={service}>{service}</Bullet>
              ))}
            </ul>

            <span
              data-motion="rule"
              aria-hidden="true"
              className="card-split absolute left-[32px] top-[330px] h-px w-[330px] origin-left bg-white/10"
            />

            <div data-motion="card-part" className="card-languages absolute left-[32px] top-[352px] flex items-start gap-[18px]">
              <GlobeIcon />
              <div>
                <p className="font-nav text-[13px] font-medium tracking-[0.22em] text-beige">{locale === 'ar' ? 'اللغات' : 'LANGUAGES'}</p>
                <ul className="mt-[10px] flex items-center gap-[14px] text-[15px] leading-none text-white/85">
                  <li>{locale === 'ar' ? 'العربية' : 'Arabic'}</li>
                  <li aria-hidden="true" className="size-[5px] rounded-full bg-purple-light" />
                  <li>{locale === 'ar' ? 'التركية' : 'Turkish'}</li>
                  <li aria-hidden="true" className="size-[5px] rounded-full bg-purple-light" />
                  <li>{locale === 'ar' ? 'الإنجليزية' : 'English'}</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card
            label={locale === 'ar' ? 'الخبرة' : 'EXPERIENCE'}
            title={locale === 'ar' ? '3 سنوات' : '3 YEARS'}
            numeral="02"
            icon={<BriefcaseIcon />}
            body={locale === 'ar' ? 'ثلاث سنوات من التطور المستمر عبر مشاريع في الهوية، التصميم الرقمي، والتجارب البصرية.' : "With 3 years of experience in the design field, I've collaborated on a variety of projects for different brands and industries."}
          >
            <div
              data-motion="card-part"
              className="card-stats absolute left-[32px] top-[282px] grid w-[336px] grid-cols-3 gap-[12px]"
            >
              <Stat icon={<CalendarIcon />} value={locale === 'ar' ? '3' : '3+'} caption={locale === 'ar' ? 'سنوات خبرة' : 'Years\nExperience'} />
              <Stat icon={<LayersIcon />} value={locale === 'ar' ? '+50' : '50+'} caption={locale === 'ar' ? 'مشروع' : 'Projects\nCompleted'} />
              <Stat icon={<UsersIcon />} value={locale === 'ar' ? '+20' : '20+'} caption={locale === 'ar' ? 'تعاون' : 'Happy\nClients'} />
            </div>
          </Card>

          <Card
            label={locale === 'ar' ? 'الأدوات' : 'TOOLS'}
            title={locale === 'ar' ? 'أدواتي' : 'WHAT I USE'}
            numeral="03"
            icon={<TulipIcon />}
            body={locale === 'ar' ? 'أستخدم الأدوات كوسيلة لتنفيذ الفكرة بدقة — من الهوية وحتى التجربة الرقمية.' : 'I use industry-standard tools to bring ideas to life from concept to final design.'}
          >
            <div data-motion="card-part" className="card-tools absolute left-[32px] top-[258px] flex gap-[27px]">
              <Tool
                label="Photoshop"
                tile={
                  <span className="flex size-full items-center justify-center rounded-[13px] bg-[#001E36] text-[25px] font-bold leading-none tracking-[-0.02em] text-[#31A8FF]">
                    Ps
                  </span>
                }
              />
              <Tool
                label="Illustrator"
                tile={
                  <span className="flex size-full items-center justify-center rounded-[13px] bg-[#330000] text-[25px] font-bold leading-none tracking-[-0.02em] text-[#FF9A00]">
                    Ai
                  </span>
                }
              />
              <Tool
                label="Figma"
                tile={
                  <span className="flex size-full items-center justify-center rounded-[13px] bg-[#0F0F13]">
                    <FigmaGlyph />
                  </span>
                }
              />
              <Tool
                label="Canva"
                tile={
                  <span className="flex size-full items-center justify-center rounded-[13px] bg-[#0E1620] font-serif text-[32px] leading-none text-white">
                    C
                  </span>
                }
              />
            </div>
          </Card>
        </section>

        {/* ── side rails ───────────────────────────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <p
            data-motion="rail"
            className={`about-rail-text absolute left-[32px] top-[752px] [writing-mode:vertical-rl] rotate-180 ${RAIL}`}
          >
            {locale === 'ar' ? 'ابقَ فضوليًا' : 'STAY CURIOUS'}
          </p>
          <span data-motion="rail" className="absolute left-[38px] top-[917px] h-[90px] w-px bg-beige/45" />

          <p
            data-motion="rail"
            className={`about-rail-text absolute right-[32px] top-[752px] [writing-mode:vertical-rl] ${RAIL}`}
          >
            {locale === 'ar' ? 'واصل الإبداع' : 'KEEP CREATING'}
          </p>
          <span data-motion="rail" className="absolute right-[38px] top-[917px] h-[90px] w-px bg-beige/45" />
        </div>
      </div>
    </main>
  )
}
