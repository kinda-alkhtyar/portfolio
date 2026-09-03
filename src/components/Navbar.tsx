import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import logo from '../assets/images/home/ya-logo-transparent.png'
import { Z } from '../motion'
import { localePath, useLocale, useLocalizedPath, useT } from '../i18n/localization'

/** `href: null` = page not built yet; rendered as an inert link. */
const links = [
  { label: 'HOME', href: '/' },
  { label: 'WORK', href: '/work' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
]

/** Tulip-petal silhouette: rounded shoulders, a softly tapered base. */
const PETAL = '52% 52% 44% 44% / 40% 40% 62% 62%'

/** The one LET'S TALK destination, shared by the desktop bar and the sheet. */
const TALK_HREF =
  'https://wa.me/905513403448?text=Hi%20Yumna%2C%20I%20came%20across%20your%20portfolio%20and%20I%E2%80%99d%20like%20to%20discuss%20a%20project%20with%20you.'

const linkClass =
  'relative block font-nav text-[22px] font-semibold leading-none tracking-[0.06em] transition-colors duration-300'

/**
 * `flow` (the default) is the original bar: it sits in the page's own flow and
 * takes its width from whatever column it is dropped into. Home and /work use
 * it and are untouched.
 *
 * `fixed` pins the same bar to the viewport for pages that want it held at the
 * top while the page scrolls under it. Only where it is anchored changes — the
 * `<header>` below is one shared element with no per-variant styling, so the
 * CTA's box and its distance from the right edge are Home's on every page.
 */
export type NavbarVariant = 'flow' | 'fixed'

export default function Navbar({
  variant = 'flow',
  top = '28px',
  mobile = false,
}: {
  variant?: NavbarVariant
  top?: string
  /**
   * Opt in to the compact phone bar (hamburger sheet + petal switcher) below
   * `lg`, in place of the desktop bar. Off by default and off everywhere but
   * Home, because /work, /about, /contact and the case studies have not had
   * their mobile pass yet and this is the bar those passes will turn on.
   * Nothing about the desktop bar depends on it either way.
   */
  mobile?: boolean
}) {
  const { pathname } = useLocation()
  const locale = useLocale()
  const path = useLocalizedPath()
  const t = useT()
  const englishPath = localePath(pathname, 'en')

  /* Mobile only. The desktop bar below is untouched — under `lg` it is simply
     hidden and the compact bar at the bottom of this file takes its place, so
     no phone-width rule can ever reach the 1440-canvas composition. */
  const [menuOpen, setMenuOpen] = useState(false)

  // A route change closes the sheet; so does Escape.
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  /* The brand mark. It is deliberately not a flex sibling of the nav group: in
     the `fixed` variant it is anchored to the viewport's own inline-start edge
     (far left in English, mirrored to the far right in Arabic), so it never
     takes part in the nav's spacing and never rides the bar's 1440 track. */
  const brand = (
    <Link to={path('/')} className="flex h-[50px] shrink-0 items-center">
      <img src={logo} alt="Yumna Al-Muallem" className="h-[58px] w-auto translate-y-[3px]" />
    </Link>
  )

  /* The main links as one independent group. In the `fixed` bar they are not
     a flex sibling of the CTA or the switcher: they are centred on the
     viewport below, so neither the logo, the language petal nor LET'S TALK
     can pull them off centre, in LTR or RTL. */
  const navList = (
    <ul data-nav-links className="hidden items-center gap-[56px] md:flex">
      {links.map(({ label, href }) => {
        const localizedHref = path(href)
        const isActive = href === englishPath
        const content = (
          <>
            {t(label)}
            {isActive && (
              <span className="absolute -bottom-[11px] left-1/2 size-[6px] -translate-x-1/2 rounded-full bg-beige" />
            )}
          </>
        )
        const tone = isActive ? 'text-[#FFFBF2]' : 'text-[#DCD0EC] hover:text-[#FFFBF2]'

        return (
          <li key={label}>
            {href ? (
              <Link to={localizedHref} className={`${linkClass} ${tone}`}>
                {content}
              </Link>
            ) : (
              <a href="#" className={`${linkClass} ${tone}`}>
                {content}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )

  /* Vertical language petal. The stack is vertical on purpose: it reads the
     same in LTR and RTL, so the Arabic layout needs no mirroring here. In the
     `fixed` bar it is anchored to the viewport's own inline-end edge below,
     independent of the nav group and the CTA, so nothing can cover it and it
     never runs off the edge. Routing is untouched — both entries are still
     the plain `localePath` links they always were. */
  const langSwitch = (
    <div
      className="group relative flex h-[56px] w-[38px] shrink-0 items-center justify-center border border-[rgba(212,175,55,0.55)] bg-gradient-to-b from-[#301A42] via-[#1F1130] to-[#160C22] shadow-[inset_0_1px_0_rgba(230,216,168,0.18),0_2px_14px_-8px_rgba(0,0,0,0.9)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:scale-[1.06] hover:border-[rgba(212,175,55,0.9)] hover:shadow-[inset_0_1px_0_rgba(230,216,168,0.28),0_0_22px_-6px_rgba(192,143,224,0.9)] focus-within:scale-[1.06] focus-within:border-[rgba(212,175,55,0.9)]"
      style={{ borderRadius: PETAL }}
      role="group"
      aria-label="Language"
    >
      <div className="relative flex flex-col items-center">
        {/* Active marker: one petal that slides between the two rows. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -ml-[15px] h-[25px] w-[30px] border border-[rgba(212,175,55,0.65)] bg-[rgba(190,140,235,0.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ borderRadius: PETAL, transform: `translateY(${locale === 'ar' ? 25 : 0}px)` }}
        />
        {(['en', 'ar'] as const).map((code) => {
          const isActive = locale === code
          return (
            <Link
              key={code}
              to={localePath(pathname, code)}
              lang={code}
              hrefLang={code}
              aria-current={isActive ? 'true' : undefined}
              className={`relative flex h-[25px] w-[30px] items-center justify-center font-nav text-[12px] font-semibold leading-none tracking-[0.08em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-beige ${
                isActive ? 'text-beige' : 'text-[#C9B8DE] hover:text-white'
              }`}
              style={{ borderRadius: PETAL }}
            >
              {code.toUpperCase()}
            </Link>
          )
        })}
      </div>
    </div>
  )

  const bar = (
    <header
      data-cursor-exclude
      className="flex h-[50px] items-center justify-end pl-[var(--nav-pl)] pr-[23px]"
    >
      {variant === 'flow' && <div className="me-auto ms-[30px]">{brand}</div>}

      <nav className="flex items-center gap-[47px]">
        {variant === 'flow' && navList}

        <a
          href={TALK_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex h-[50px] items-center gap-[21px] rounded-full border border-white/35 px-[22px] font-nav text-[20px] font-semibold leading-none tracking-[0.01em] text-white transition-colors hover:border-purple-light hover:text-purple-light ${
            variant === 'fixed' ? 'translate-x-[40px] -translate-y-[15px]' : ''
          }`}
        >
          {t("LET'S TALK")}
          <span className="text-[19px] text-beige transition-transform duration-300 group-hover:rotate-90">
            &#10022;
          </span>
        </a>
        {variant === 'flow' && langSwitch}
      </nav>
    </header>
  )

  /* ── the compact bar, phone and small tablet only ──────────────────
     A separate element rather than a set of overrides on the bar above: the
     desktop bar anchors its logo, its centred link group and its switcher to
     the viewport with inline styles, which a media query cannot reach, and
     every one of those anchors is part of the 1440 composition. Below `lg`
     that whole bar is `display: none` and this one — same plum blur, same
     gold hairline, same petal switcher, same LET'S TALK — is the bar.

     It is a `<header>` so `heroMotion`'s `q('header')` picks it up and it
     takes the same entrance the desktop bar does. Logical insets throughout,
     so Arabic mirrors it with no rule of its own. */
  const mobileBar = (
    <header
      data-cursor-exclude
      className="fixed inset-x-0 top-0 lg:hidden"
      style={{ zIndex: Z.nav }}
      data-mobile-nav={menuOpen ? 'open' : 'closed'}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-b border-[rgba(212,175,55,0.30)] bg-[rgba(22,12,32,0.92)] backdrop-blur-[12px]"
      />

      <div className="relative flex h-[58px] items-center gap-[10px] px-[18px]">
        <Link to={path('/')} className="flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Yumna Al-Muallem" className="h-[40px] w-auto" />
        </Link>

        <span className="grow" />

        {/* The switcher stays in the bar rather than in the sheet: changing
            language is the one control a visitor may need before anything
            else on the page. Same petal, one size down. */}
        <div
          className="group relative flex h-[44px] w-[30px] shrink-0 items-center justify-center border border-[rgba(212,175,55,0.55)] bg-gradient-to-b from-[#301A42] via-[#1F1130] to-[#160C22] shadow-[inset_0_1px_0_rgba(230,216,168,0.18),0_2px_14px_-8px_rgba(0,0,0,0.9)]"
          style={{ borderRadius: PETAL }}
          role="group"
          aria-label="Language"
        >
          <div className="relative flex flex-col items-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 -ml-[12px] h-[20px] w-[24px] border border-[rgba(212,175,55,0.65)] bg-[rgba(190,140,235,0.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ borderRadius: PETAL, transform: `translateY(${locale === 'ar' ? 20 : 0}px)` }}
            />
            {(['en', 'ar'] as const).map((code) => (
              <Link
                key={code}
                to={localePath(pathname, code)}
                lang={code}
                hrefLang={code}
                aria-current={locale === code ? 'true' : undefined}
                className={`relative flex h-[20px] w-[24px] items-center justify-center font-nav text-[11px] font-semibold leading-none tracking-[0.06em] ${
                  locale === code ? 'text-beige' : 'text-[#C9B8DE]'
                }`}
                style={{ borderRadius: PETAL }}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((wasOpen) => !wasOpen)}
          className="relative flex size-[44px] shrink-0 items-center justify-center rounded-full border border-white/30 text-white"
        >
          {/* Three bars folding into a cross — the same 18px measure either
              way, so the button never changes size or nudges the bar. */}
          <span aria-hidden="true" className="relative block h-[12px] w-[18px]">
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? 'top-[6px] rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] block h-px w-full bg-current transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? 'top-[6px] -rotate-45' : 'top-[12px]'
              }`}
            />
          </span>
        </button>
      </div>

      {/* The sheet. It is always in the DOM so the links stay reachable to
          assistive tech, and collapses to zero height when closed. */}
      <div
        id="mobile-menu"
        className={`relative overflow-hidden border-b border-[rgba(212,175,55,0.22)] bg-[rgba(18,10,28,0.97)] backdrop-blur-[14px] transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? 'max-h-[420px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-[22px] pb-[8px] pt-[14px]">
          {links.map(({ label, href }) => {
            const isActive = href === englishPath
            return (
              <li key={label}>
                <Link
                  to={path(href)}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-[12px] border-b border-white/8 py-[14px] font-nav text-[19px] font-semibold leading-[1.35] tracking-[0.08em] ${
                    isActive ? 'text-[#FFFBF2]' : 'text-[#DCD0EC]'
                  }`}
                >
                  {isActive && (
                    <span aria-hidden="true" className="size-[6px] shrink-0 rounded-full bg-beige" />
                  )}
                  {t(label)}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* LET'S TALK keeps its own weight instead of competing with the
            links in the bar: it is the sheet's closing action, full measure. */}
        <div className="px-[22px] pb-[20px] pt-[10px]">
          <a
            href={TALK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex h-[52px] w-full items-center justify-center gap-[16px] rounded-full border border-white/40 font-nav text-[17px] font-semibold leading-none tracking-[0.06em] text-white"
          >
            {t("LET'S TALK")}
            <span className="text-[16px] text-beige">&#10022;</span>
          </a>
        </div>
      </div>
    </header>
  )

  if (variant === 'flow') return bar

  return (
    <>
      {/* Holds open exactly the 50px the bar used to occupy, so lifting it out
          of the flow costs no layout shift on the pages that stack under it. */}
      <div aria-hidden="true" className="h-[50px]" />

      {mobile && mobileBar}

      {/* `pt` reproduces the 28px the page's own top padding used to give the
          bar, so at rest it lands on the same pixel as the flow version. Sits
          on the `nav` rung: above every page layer, below the route wipe. */}
      <div
        data-cursor-exclude
        className={`fixed inset-x-0 top-0 ${mobile ? 'max-lg:hidden' : ''}`}
        style={{ zIndex: Z.nav, paddingTop: top }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-b border-[rgba(212,175,55,0.30)] bg-[rgba(22,12,32,0.88)] backdrop-blur-[12px]"
        />
        {/* Left padding is the inset the 1440 track used to give the bar; the
            logo no longer depends on it (it is anchored above), but the nav
            group's inline-start edge in Arabic still does.

            Right padding pulls the bar's right edge — and with it the nav
            group and the CTA, which keep their own 47px gap and every one of
            their own styles — 115px in off the viewport edge, which is where
            the CTA reads correctly and stays clear of the edge on this
            variant. The `<header>`'s own `pr-[23px]` still applies inside it,
            so the CTA ends 138px from the viewport edge. Fixed variant only:
            Home and /work render the bar directly and are untouched. */}
        {/* Logo: pinned to the viewport's inline-start edge with a 30px safe
            inset — far left in English, mirrored to the far right in Arabic —
            independent of the bar's own track, padding and nav spacing. `top`
            matches the shell's padding so it shares the bar's 50px band. */}
        {/* `zIndex: 2` for the same reason the switcher below carries it: the
            bar row is painted on rung 1, and its `<header>` box spans the full
            width of the bar even though only LET'S TALK sits in it on this
            variant. Without a rung of their own, the anchored logo and the
            centred link group paint — and hit-test — *under* that empty box. */}
        <div
          className="absolute -translate-y-[15px]"
          style={{ top, insetInlineStart: 30, zIndex: 2 }}
        >
          {brand}
        </div>

        {/* True viewport centring: half the viewport, pulled back by half the
            group's own width. Physical `left` and a plain transform, so the
            optical centre is identical in English and Arabic. */}
        <div
          className="absolute left-1/2 flex h-[50px] -translate-x-1/2 -translate-y-[18px] items-center"
          style={{ top, zIndex: 2 }}
        >
          {navList}
        </div>

        {/* Switcher: pinned to the viewport's inline-end edge on the same 30px
            safe inset the logo takes on the other side, raised with the rest
            of the bar's content. Above the blur veil, clear of the edge. */}
        <div
          className="absolute flex h-[50px] -translate-y-[15px] items-center"
          style={{ top, insetInlineEnd: 30, zIndex: 2 }}
        >
          {langSwitch}
        </div>

        <div
          className="relative pl-[max(0px,calc((100%_-_1440px)_/_2))] pr-[115px]"
          style={{ zIndex: 1 }}
        >
          {bar}
        </div>
      </div>
    </>
  )
}
