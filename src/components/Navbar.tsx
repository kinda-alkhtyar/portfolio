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

const linkClass =
  'relative block font-nav text-[22px] font-semibold leading-none tracking-[0.02em] transition-colors'

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
}: {
  variant?: NavbarVariant
  top?: string
}) {
  const { pathname } = useLocation()
  const locale = useLocale()
  const path = useLocalizedPath()
  const t = useT()
  const englishPath = localePath(pathname, 'en')

  const bar = (
    <header className="flex h-[50px] items-center justify-between pl-[var(--nav-pl)] pr-[23px]">
      <Link to={path('/')} className="ml-[50px] block shrink-0 translate-y-[3px]">
        <img src={logo} alt="Yumna Al-Muallem" className="h-[54px] w-auto" />
      </Link>

      <nav className="flex items-center gap-[47px]">
        <ul className="hidden items-center gap-[56px] md:flex">
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
            const tone = isActive ? 'text-white' : 'text-white/75 hover:text-white'

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

        <Link
          to={path('/contact')}
          className="group flex h-[50px] items-center gap-[21px] rounded-full border border-white/35 px-[22px] font-nav text-[20px] font-semibold leading-none tracking-[0.01em] text-white transition-colors hover:border-purple-light hover:text-purple-light"
        >
          {t("LET'S TALK")}
          <span className="text-[19px] text-beige transition-transform duration-300 group-hover:rotate-90">
            &#10022;
          </span>
        </Link>
        {/* Vertical language petal. The stack is vertical on purpose: it reads
            the same in LTR and RTL, so the Arabic layout needs no mirroring
            here. Routing is untouched — both entries are still the plain
            `localePath` links they always were. */}
        <div
          className="group relative flex h-[46px] w-[30px] shrink-0 items-center justify-center border border-beige/30 bg-gradient-to-b from-purple-dark via-[#1B0F26] to-[#120A1A] shadow-[inset_0_1px_0_rgba(230,216,168,0.10)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:scale-[1.07] hover:border-beige/60 hover:shadow-[inset_0_1px_0_rgba(230,216,168,0.18),0_0_20px_-6px_rgba(192,143,224,0.85)] focus-within:scale-[1.07] focus-within:border-beige/60"
          style={{ borderRadius: PETAL }}
          role="group"
          aria-label="Language"
        >
          <div className="relative flex flex-col items-center">
            {/* Active marker: one petal that slides between the two rows. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 -ml-[11px] h-[20px] w-[22px] border border-beige/40 bg-beige/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ borderRadius: PETAL, transform: `translateY(${locale === 'ar' ? 20 : 0}px)` }}
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
                  className={`relative flex h-[20px] w-[22px] items-center justify-center font-nav text-[10px] font-semibold leading-none tracking-[0.10em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-beige ${
                    isActive ? 'text-beige' : 'text-white/45 hover:text-white'
                  }`}
                  style={{ borderRadius: PETAL }}
                >
                  {code.toUpperCase()}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )

  if (variant === 'flow') return bar

  return (
    <>
      {/* Holds open exactly the 50px the bar used to occupy, so lifting it out
          of the flow costs no layout shift on the pages that stack under it. */}
      <div aria-hidden="true" className="h-[50px]" />

      {/* `pt` reproduces the 28px the page's own top padding used to give the
          bar, so at rest it lands on the same pixel as the flow version. Sits
          on the `nav` rung: above every page layer, below the route wipe. */}
      <div className="fixed inset-x-0 top-0" style={{ zIndex: Z.nav, paddingTop: top }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-bg/60 backdrop-blur-[14px] [-webkit-mask-image:linear-gradient(to_bottom,#000_58%,transparent)] [mask-image:linear-gradient(to_bottom,#000_58%,transparent)]"
        />
        {/* Left padding reproduces the inset the 1440 track used to give the
            logo, so the logo does not move at any width.

            Right padding pulls the bar's right edge — and with it the nav
            group and the CTA, which keep their own 47px gap and every one of
            their own styles — 115px in off the viewport edge, which is where
            the CTA reads correctly and stays clear of the edge on this
            variant. The `<header>`'s own `pr-[23px]` still applies inside it,
            so the CTA ends 138px from the viewport edge. Fixed variant only:
            Home and /work render the bar directly and are untouched. */}
        <div className="relative pl-[max(0px,calc((100%_-_1440px)_/_2))] pr-[115px]">{bar}</div>
      </div>
    </>
  )
}
