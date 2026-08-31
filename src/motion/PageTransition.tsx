import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { prefersReducedMotion } from './config'
import { gsap } from './gsap'
import { getLenis } from './useSmoothScroll'

type RouterLocation = ReturnType<typeof useLocation>

/**
 * Reusable route transition: a dark-purple panel wipes up over the outgoing
 * page, the new route is swapped in behind it, then the panel wipes away
 * upward to reveal it (~0.8s end to end).
 *
 * The route being rendered is deferred until the panel is covering, so the
 * incoming page mounts unseen and its own entrance animation plays as the
 * panel clears — it reads as one continuous move rather than a loading screen.
 *
 * Usage: `<PageTransition>{(location) => <Routes location={location}>…</Routes>}</PageTransition>`
 */
export default function PageTransition({
  children,
}: {
  children: (location: RouterLocation) => ReactNode
}) {
  const location = useLocation()
  const [displayed, setDisplayed] = useState(location)
  const overlayRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (location.key === displayed.key) return

    const overlay = overlayRef.current
    if (!overlay || prefersReducedMotion()) {
      setDisplayed(location)
      return
    }

    const toTop = () => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }

    const tl = gsap.timeline()
    tl.set(overlay, { autoAlpha: 1, pointerEvents: 'auto', transformOrigin: '50% 100%' })
      .fromTo(overlay, { scaleY: 0 }, { scaleY: 1, duration: 0.34, ease: 'power3.in' })
      .add(() => {
        toTop()
        setDisplayed(location)
      })
      .set(overlay, { transformOrigin: '50% 0%' })
      .to(overlay, { scaleY: 0, duration: 0.46, ease: 'power3.out' }, '+=0.04')
      .set(overlay, { autoAlpha: 0, pointerEvents: 'none' })

    return () => {
      tl.kill()
    }
    // `displayed` is read only to detect the first run of a given navigation.
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children(displayed)}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-50 origin-bottom bg-purple-dark"
        style={{ transform: 'scaleY(0)' }}
      />
    </>
  )
}
