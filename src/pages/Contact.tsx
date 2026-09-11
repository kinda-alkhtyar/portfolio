import { useState, type FormEvent, type ReactNode } from 'react'

import HeroTulip from '../components/HeroTulip'
import Navbar from '../components/Navbar'
import PlusMark from '../components/PlusMark'
import { useMotionScope } from '../motion'
import { contactMotion } from './contactMotion'
import { useLocale } from '../i18n/localization'

/**
 * /contact — authored against the 1440 x 1088 `contact-reference.png` canvas,
 * in literal reference pixels, the same way /about and /work are.
 *
 * The page is one screen, split down the middle: a left-anchored statement
 * over a stack of contact rows, and the decorative tulip group holding the
 * top right with the message panel sitting under it. The reference has no
 * footer, so the page has none. Nothing scrolls — the whole scene is carried
 * by the entrance in `contactMotion`.
 */

/* ── the details, in one place ─────────────────────────────────────── */

const EMAIL = 'almuallemyumna@gmail.com'
/** Digits only, for the `tel:` and `wa.me` links. */
const PHONE_E164 = '+905513403447'
const PHONE_DISPLAY = '+90 551 340 34 47'
/** Prefilled text for the WhatsApp chat link. */
const WHATSAPP_MESSAGE = 'Hi Yumna, I came across your portfolio and I’d like to discuss a project with you.'
const WHATSAPP_HREF = `https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

/* ── icons ─────────────────────────────────────────────────────────── */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect {...stroke} x="2.8" y="5.2" width="18.4" height="13.6" rx="2.6" />
      <path {...stroke} d="M3.6 7.4l7.2 5.1a2 2 0 002.4 0l7.2-5.1" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M6.3 3.6h2.6l1.5 3.9-2 1.4a12.4 12.4 0 006.7 6.7l1.4-2 3.9 1.5v2.6a2.2 2.2 0 01-2.4 2.2C10.6 19.3 4.7 13.4 4.1 6A2.2 2.2 0 016.3 3.6z"
      />
    </svg>
  )
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="M3.6 20.4l1.3-4.2A8.2 8.2 0 1112 20.2a8.3 8.3 0 01-4-1l-4.4 1.2z" />
      <path
        {...stroke}
        d="M9.1 8.2c.5-.1.7 0 .9.4l.6 1.3c.1.3.1.5-.1.8l-.4.5a5.4 5.4 0 002.7 2.7l.5-.4c.3-.2.5-.2.8-.1l1.3.6c.4.2.5.4.4.9a2 2 0 01-2 1.4 7 7 0 01-5.9-6 2 2 0 011.2-2.1z"
      />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.6" />
      <path
        {...stroke}
        d="M3.4 12h17.2M12 3.4c2.3 2.4 3.5 5.3 3.5 8.6s-1.2 6.2-3.5 8.6c-2.3-2.4-3.5-5.3-3.5-8.6S9.7 5.8 12 3.4z"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.6" />
      <path {...stroke} d="M12 6.8V12l3.4 2.1" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle {...stroke} cx="12" cy="8.2" r="3.6" />
      <path {...stroke} d="M4.8 19.8c0-3.8 3.2-6.2 7.2-6.2s7.2 2.4 7.2 6.2" />
    </svg>
  )
}

function SubjectIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect {...stroke} x="3" y="5.4" width="18" height="13.2" rx="2.4" />
      <path {...stroke} d="M3 9.4h18M6.6 13.2h6M6.6 15.8h3.4" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="M16.2 3.8l4 4L8.4 19.6l-5 1 1-5z" />
      <path {...stroke} d="M13.6 6.4l4 4" />
    </svg>
  )
}

/** The Turkish flag, drawn small enough to read as a dialling badge. */
function TurkeyFlag() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[24px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-[#E30A17]"
    >
      <svg viewBox="0 0 36 24" className="h-full w-full">
        <circle cx="14.4" cy="12" r="6" fill="#fff" />
        <circle cx="16.6" cy="12" r="4.8" fill="#E30A17" />
        <path
          fill="#fff"
          d="M22.9 12l3.6-1.2-2.2 3 0-3.7 2.2 3z"
          transform="translate(-0.6 0)"
        />
      </svg>
    </span>
  )
}

/* ── pieces ────────────────────────────────────────────────────────── */

/** The circled glyph that opens every contact row. */
function RowBadge({ size, children }: { size: number; children: ReactNode }) {
  return (
    <span
      data-motion="row-part"
      className="flex shrink-0 items-center justify-center rounded-full border border-purple-light/25 bg-purple/15 text-purple-light"
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}

const LABEL = 'font-nav text-[12px] font-semibold uppercase tracking-[0.24em] text-beige'

/** One field of the message form. The label is present but visually hidden —
 *  the reference shows placeholders only, and a placeholder is not a label. */
function Field({
  id,
  label,
  icon,
  multiline = false,
  ...rest
}: {
  id: string
  label: string
  icon: ReactNode
  multiline?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const shell =
    'w-full rounded-[12px] border border-white/12 bg-white/[0.035] pl-[52px] pr-[18px] font-nav text-[15px] font-light tracking-[0.02em] text-white placeholder:text-white/45 transition-colors duration-300 hover:border-white/25 focus:border-purple-light/70 focus:outline-none focus:ring-0'

  return (
    <div data-motion="field" className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-[20px] text-white/55 ${multiline ? 'top-[19px]' : 'top-1/2 -translate-y-1/2'}`}
      >
        {icon}
      </span>
      {multiline ? (
        <textarea id={id} rows={5} className={`${shell} h-[148px] resize-none py-[16px] leading-[1.5]`} {...rest} />
      ) : (
        <input id={id} className={`${shell} h-[48px]`} {...rest} />
      )}
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────── */

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const locale = useLocale()
  const scopeRef = useMotionScope<HTMLElement>(contactMotion)
  const [form, setForm] = useState(EMPTY)

  /* No backend exists, so the form hands the composed message to the
     visitor's own mail client rather than pretending to send it. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = form.subject || `New message from ${form.name}`
    const body = `${form.message}\n\n— ${form.name}\n${form.email}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const set = (key: keyof typeof EMPTY) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  return (
    <main ref={scopeRef} className="contact-page relative min-h-[1088px] min-w-[1440px] overflow-hidden bg-bg pt-[28px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(58%_56%_at_70%_22%,#281539_0%,#160D22_48%,#0B0611_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(118%_100%_at_50%_50%,transparent_46%,rgba(2,1,6,.74)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-[1440px]">
        <Navbar variant="fixed" />

        {/* ── the decorative group ───────────────────────────────────
            One stage over the whole canvas so the tulip, its ring and the
            marks share a single camera, exactly as on /about and /work. */}
        <div
          data-motion="contact-scene"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[680px]"
        >
          <div
            data-motion="ring"
            className="absolute left-[757px] top-[86px] size-[572px] rounded-full border border-white/[0.09]"
          />
          {/* Sized on the source PNG's own 0.75 ratio — the reference lets the
              stem run on under the panel rather than cropping the bloom. */}
          <HeroTulip
            data-motion="tulip"
            className="absolute left-[812px] top-[52px] h-[510px] w-[382px] object-contain object-center"
          />
          <PlusMark data-motion="mark" className="contact-mark-a absolute left-[776px] top-[201px] text-[19px]" />
          <PlusMark data-motion="mark" className="contact-mark-b absolute left-[1239px] top-[117px] text-[20px]" />
          <PlusMark data-motion="mark" className="contact-mark-c absolute left-[1249px] top-[251px] text-[18px] text-white/20" />
          <PlusMark data-motion="mark" className="contact-mark-d absolute left-[1268px] top-[396px] text-[19px]" />

          {/* The two dotted fields the reference sets behind the bloom. */}
          <div
            data-motion="mark"
            className="contact-dots-a absolute left-[1298px] top-[147px] h-[92px] w-[46px] text-purple-light/50 opacity-45 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:11px_11px]"
          />
          <div
            data-motion="mark"
            className="contact-dots-b absolute left-[1192px] top-[367px] h-[52px] w-[46px] text-purple-light/50 opacity-40 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:11px_11px]"
          />
        </div>

        {/* ── left column: the statement ─────────────────────────────
            Positioned against the wrapper, like the two sections below it,
            so the whole page reads off one origin instead of the statement
            hanging off the end of the navbar's flow box. */}
        <section className="contact-statement absolute inset-x-0 top-0">
          <p className={`absolute left-[96px] top-[138px] overflow-hidden pb-[0.12em] ${LABEL} tracking-[0.42em]`}>
            <span data-motion="eyebrow-line" className="block">
              {locale === 'ar' ? 'تواصل معي' : 'CONTACT ME'}
            </span>
          </p>
          <span
            data-motion="rule"
            aria-hidden="true"
            className="absolute left-[96px] top-[175px] h-px w-[56px] origin-left bg-beige/80"
          />

          <h1 className="absolute left-[96px] top-[192px] font-display text-[80px] leading-[1.12] tracking-[-0.01em] text-white">
            {(locale === 'ar' ? ['لنبتكر', 'شيئًا رائعًا'] : ['LET’S CREATE', 'SOMETHING GREAT']).map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <span data-motion="title-line" className="block whitespace-nowrap">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="absolute left-[96px] top-[398px] font-serif text-[19px] leading-[1.62] text-white/72">
            {(locale === 'ar' ? ['يسعدني دائمًا مناقشة مشاريع جديدة،', 'وأفكار إبداعية وفرص لتحويل رؤيتكم إلى واقع.'] : [
              'I’m always open to discussing new projects,',
              'creative ideas or opportunities to be part of your visions.',
            ]).map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <span data-motion="lede-line" className="block">
                  {line}
                </span>
              </span>
            ))}
          </p>
        </section>

        {/* ── left column: the details ───────────────────────────────── */}
        <section
          aria-label="Contact details"
          className="contact-details absolute left-[96px] top-[481px] w-[567px]"
        >
          {/* EMAIL */}
          <div className="flex h-[108px] items-center gap-[28px]">
            <RowBadge size={64}>
              <MailIcon className="size-[26px]" />
            </RowBadge>
            <div>
              <p data-motion="row-part" className={LABEL}>
                {locale === 'ar' ? 'البريد الإلكتروني' : 'EMAIL'}
              </p>
              <a
                data-motion="row-part"
                href={`mailto:${EMAIL}`}
                className="mt-[9px] block font-nav text-[21px] font-light tracking-[0.01em] text-white transition-colors duration-300 hover:text-purple-light"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <span data-motion="row-rule" aria-hidden="true" className="block h-px w-full origin-left bg-white/12" />

          {/* PHONE */}
          <div className="flex h-[117px] items-center gap-[28px]">
            <RowBadge size={64}>
              <PhoneIcon className="size-[25px]" />
            </RowBadge>
            <div>
              <p data-motion="row-part" className={LABEL}>
                {locale === 'ar' ? 'الهاتف' : 'PHONE'}
              </p>
              <a
                data-motion="row-part"
                href={`tel:${PHONE_E164}`}
                className="mt-[9px] flex items-center gap-[14px] font-nav text-[22px] font-light tracking-[0.02em] text-white transition-colors duration-300 hover:text-purple-light"
              >
                <TurkeyFlag />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <span data-motion="row-rule" aria-hidden="true" className="block h-px w-full origin-left bg-white/12" />

          {/* WHATSAPP */}
          {/* The reference hangs this row from its top rather than centring
              it: the badge sits level with the label, not with the pill. */}
          <div className="flex h-[142px] items-start gap-[28px] pt-[20px]">
            <RowBadge size={64}>
              <WhatsappIcon className="size-[26px]" />
            </RowBadge>
            <div>
              <p data-motion="row-part" className={LABEL}>
                {locale === 'ar' ? 'واتساب' : 'WHATSAPP'}
              </p>
              <a
                data-motion="row-part"
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-[15px] flex h-[46px] w-[277px] items-center justify-center gap-[15px] rounded-full bg-gradient-to-r from-[#C88DEB] to-[#DDA8F4] font-nav text-[16px] font-semibold tracking-[0.06em] text-[#1B0F27] transition-transform duration-500 ease-out hover:-translate-y-[2px]"
              >
                <WhatsappIcon className="size-[21px]" />
                {locale === 'ar' ? 'تحدث عبر واتساب' : 'CHAT ON WHATSAPP'}
              </a>
            </div>
          </div>

          <span data-motion="row-rule" aria-hidden="true" className="block h-px w-full origin-left bg-white/12" />

          {/* LANGUAGES / AVAILABILITY */}
          {/* Both halves share one top edge and one badge size, so the two
              labels sit on the same line exactly as in the reference. The
              second half starts on the 458px column the reference sets. */}
          <div className="flex h-[112px] items-start pt-[32px]">
            <div className="flex w-[362px] items-start gap-[26px]">
              <RowBadge size={52}>
                <GlobeIcon className="size-[23px]" />
              </RowBadge>
              <div className="pt-[4px]">
                <p data-motion="row-part" className={`${LABEL} text-[11px]`}>
                  {locale === 'ar' ? 'اللغات' : 'LANGUAGES'}
                </p>
                <p
                  data-motion="row-part"
                  className="mt-[16px] flex items-center gap-[13px] font-serif text-[17px] leading-[1.45] text-white/85"
                >
                  {locale === 'ar' ? 'العربية' : 'Arabic'} <span className="text-[10px] text-purple-light">●</span> {locale === 'ar' ? 'التركية' : 'Turkish'}{' '}
                  <span className="text-[10px] text-purple-light">●</span> {locale === 'ar' ? 'الإنجليزية' : 'English'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[26px]">
              <RowBadge size={52}>
                <ClockIcon className="size-[23px]" />
              </RowBadge>
              <div className="pt-[4px]">
                <p data-motion="row-part" className={`${LABEL} text-[11px]`}>
                  {locale === 'ar' ? 'التوفر' : 'AVAILABILITY'}
                </p>
                <p data-motion="row-part" className="mt-[16px] font-serif text-[17px] leading-[1.45] text-white/85">
                  {locale === 'ar' ? <>متاحة للمشاريع المستقلة<br />والعمل بدوام كامل.</> : <>Available for freelance<br />and full-time projects.</>}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── right column: the message panel ────────────────────────── */}
        <section
          data-motion="panel"
          className="contact-panel absolute left-[730px] top-[489px] w-[628px] rounded-[20px] border border-white/10 bg-white/[0.025] px-[52px] pb-[38px] pt-[46px] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] backdrop-blur-[2px]"
        >
          <h2 data-motion="row-part" className={`${LABEL} text-[15px] leading-none tracking-[0.3em]`}>
            {locale === 'ar' ? 'أرسل رسالة' : 'SEND A MESSAGE'}
          </h2>
          <span data-motion="row-rule" aria-hidden="true" className="mt-[13px] block h-px w-[54px] origin-left bg-beige/80" />

          <form onSubmit={handleSubmit} className="mt-[28px]" noValidate={false}>
            <div className="grid grid-cols-2 gap-[16px]">
              <Field
                id="contact-name"
                label={locale === 'ar' ? 'الاسم' : 'Your name'}
                icon={<UserIcon className="size-[19px]" />}
                type="text"
                name="name"
                autoComplete="name"
                required
                placeholder={locale === 'ar' ? 'الاسم' : 'Your Name'}
                value={form.name}
                onChange={set('name')}
              />
              <Field
                id="contact-email"
                label={locale === 'ar' ? 'البريد الإلكتروني' : 'Your email'}
                icon={<MailIcon className="size-[19px]" />}
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Your Email'}
                value={form.email}
                onChange={set('email')}
              />
            </div>

            <div className="mt-[22px]">
              <Field
                id="contact-subject"
                label={locale === 'ar' ? 'الموضوع' : 'Subject'}
                icon={<SubjectIcon className="size-[19px]" />}
                type="text"
                name="subject"
                placeholder={locale === 'ar' ? 'الموضوع' : 'Subject'}
                value={form.subject}
                onChange={set('subject')}
              />
            </div>

            <div className="mt-[22px]">
              <Field
                id="contact-message"
                label={locale === 'ar' ? 'رسالتك' : 'Your message'}
                icon={<PencilIcon className="size-[19px]" />}
                multiline
                name="message"
                required
                placeholder={locale === 'ar' ? 'رسالتك' : 'Your Message'}
                value={form.message}
                onChange={set('message')}
              />
            </div>

            <button
              data-motion="send"
              type="submit"
              className="group mt-[24px] flex h-[52px] w-full items-center justify-center gap-[22px] rounded-full bg-gradient-to-r from-[#C88DEB] to-[#DDA8F4] font-nav text-[17px] font-semibold tracking-[0.08em] text-[#1B0F27] transition-transform duration-500 ease-out hover:-translate-y-[2px]"
            >
              {locale === 'ar' ? 'إرسال الرسالة' : 'SEND MESSAGE'}
              <span aria-hidden="true" className="text-[19px] transition-transform duration-500 ease-out group-hover:translate-x-[6px]">
                →
              </span>
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
