import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/images/home/ya-logo-transparent.png'
import { useLocalizedPath, useT } from '../i18n/localization'

/** `href: null` = page not built yet; rendered inert, as in `Navbar.tsx`. */
const links: { label: string; href: string | null }[] = [
  { label: 'HOME', href: '/' },
  { label: 'WORK', href: '/work' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
]

const linkClass =
  'font-nav text-[16px] font-medium leading-none tracking-[0.1em] text-white/70 transition-colors hover:text-purple-light'

/**
 * One footer line: wordmark and copyright left, the nav optically centred on
 * the content column, and the location note right-aligned on the gutter.
 *
 * Motion hooks only, no layout change. The hooks are inert on their own — the
 * footer runs no motion scope of its own, so the same component on a case
 * study page renders exactly as before. `Home` opts in by passing the ref from
 * `useMotionScope(siteFooterMotion)`, the same way the hero owns the shared
 * `Navbar`.
 *
 * The nav items are tagged on the `<li>` rather than the `<a>`: a flex item is
 * blockified, so it can take a transform, while the inline anchor inside it
 * cannot — and the `<li>` shrink-wraps the link, so hovering the two is the
 * same gesture.
 */
export default function SiteFooter({ className, ...rest }: ComponentProps<'footer'>) {
  const path = useLocalizedPath()
  const t = useT()
  return (
    <footer className={`relative ${className ?? ''}`} {...rest}>
      <div data-motion="footer-band" className="home-section relative pb-[30px] pt-[24px]">
        <span
          aria-hidden="true"
          data-motion="footer-rule"
          className="absolute inset-x-[var(--content-pl)] top-0 h-px bg-white/12"
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-[60px]">
            <Link to={path('/')} data-motion="footer-logo" className="block shrink-0">
              <img src={logo} alt="Yumna Al-Muallem" className="h-[54px] w-auto" />
            </Link>

            <p
              data-motion="footer-note"
              className="font-nav text-[16px] font-normal leading-[1.35] tracking-[0.07em] text-white/45"
            >
              &copy; 2024 YUMNA AL-MUALLEM
              <br />
              {t('ALL RIGHTS RESERVED')}
            </p>
          </div>

          <ul className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[72px]">
            {links.map(({ label, href }) => (
              <li key={label} data-motion="footer-link">
                {href ? (
                  <Link to={path(href)} className={linkClass}>
                    {t(label)}
                  </Link>
                ) : (
                  <a href="#" className={linkClass}>
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <p
            data-motion="footer-meta"
            className="text-right font-nav text-[14px] font-normal leading-[1.5] tracking-[0.06em] text-white/40"
          >
            {t('BASED IN TURKEY.')}
            <br />
            {t('AVAILABLE WORLDWIDE.')}
          </p>
        </div>
      </div>
    </footer>
  )
}
