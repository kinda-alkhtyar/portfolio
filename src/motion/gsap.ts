import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { DUR, EASE } from './config'

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText)

/**
 * The house eases. Named here once so `EASE.expo` resolves everywhere without
 * each call site re-typing a bezier. All four are long-tailed on the way out —
 * entering motion decelerates, exiting motion accelerates.
 */
CustomEase.create(EASE.expo, 'M0,0 C0.16,1 0.3,1 1,1')
CustomEase.create(EASE.silk, 'M0,0 C0.65,0 0.35,1 1,1')
CustomEase.create(EASE.drift, 'M0,0 C0.19,1 0.22,1 1,1')
CustomEase.create(EASE.snapIn, 'M0,0 C0.895,0.03 0.685,0.22 1,1')

gsap.defaults({ ease: EASE.base, duration: DUR.base })

/** Missing targets are expected while sections mount in and out of routes. */
gsap.config({ nullTargetWarn: false })

/**
 * Mobile browsers fire resize on every URL-bar show/hide. Recalculating the
 * whole trigger set there causes visible jumps, so only width changes count.
 */
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, CustomEase }
