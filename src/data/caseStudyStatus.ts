import type { ProjectSlug } from './projectCovers'

/**
 * INTERNAL ONLY — case study readiness.
 *
 * Nothing in this file is rendered. It records how far each project has been
 * taken toward a case study, so the state does not have to be re-derived by
 * re-auditing the asset folders.
 *
 * - `content-ready` — a content structure file exists in `src/data/`.
 * - `needs-more-assets` — audited, but the folder cannot support a case study
 *   as it stands. `blockers` says what is missing.
 * - `not-audited` — asset folder has not been inspected yet.
 */
export type CaseStudyStatus = 'content-ready' | 'needs-more-assets' | 'not-audited'

export interface CaseStudyStatusEntry {
  status: CaseStudyStatus
  /** Files judged usable in a case study, by filename. */
  usableAssets: string[]
  /** Why this project cannot proceed. Empty when it can. */
  blockers: string[]
  note?: string
}

export const caseStudyStatus: Partial<Record<ProjectSlug, CaseStudyStatusEntry>> = {
  'second-life': {
    status: 'content-ready',
    usableAssets: [
      'home-desktop.png',
      'logo-system.png',
      'visual-identity.png',
      'mockup-material-tag.png',
      'mockup-material-passport.png',
      'materials-desktop.png',
      'collections-desktop.png',
      'projects-desktop.png',
      'about-desktop.png',
      'mockup-marble-label.png',
      'mockup-sample-box.png',
      'mockup-shipping-crate.png',
    ],
    blockers: [],
    note: 'Content in secondLifeCaseStudy.ts. Page built at /work/second-life.',
  },

  aqarati: {
    status: 'content-ready',
    usableAssets: [
      'home-ar.png',
      'home-en.png',
      'home-tr.png',
      'properties-ar.png',
      'cities-map-en.png',
      'login-tr.png',
      'about-de.png',
    ],
    blockers: [],
    note: 'Content in aqaratiCaseStudy.ts. No page yet. contact-ar.jpg and both mobile captures were excluded by the owner; home-de.png is unused.',
  },

  swirle: {
    status: 'content-ready',
    usableAssets: ['cups.png', 'logo-colors.png', 'stationery.png', 'cover.png'],
    blockers: [],
    note: 'Content in swirleCaseStudy.ts. No page yet.',
  },

  rumman: {
    status: 'content-ready',
    usableAssets: ['cover.png', 'logo.png', 'serum-mockup.png'],
    blockers: [],
    note: 'Content in rummanCaseStudy.ts. No page yet. Three sections only (hero, identity, product) — no applications or retail assets exist, and only the serum has a detail shot.',
  },

  'still-human': {
    status: 'content-ready',
    usableAssets: ['cover.png'],
    blockers: [],
    note: 'Content in stillHumanCaseStudy.ts. No page yet. One asset by design — it is a single poster, not a series, and the public description was corrected to match. The sheet is print resolution (1985x2835) and stands alone; it must never be cropped.',
  },

  damascus: {
    status: 'content-ready',
    usableAssets: ['damascus-poster-cover.jpeg'],
    blockers: [],
    note: 'Content in damascusCaseStudy.ts. No page yet. One asset by design — a single poster, not a series. Lowest-resolution hero in the portfolio (993x1418): display width must stay around 620-700px max, uncropped. Only JPEG in use by any project.',
  },

  wahj: {
    status: 'content-ready',
    usableAssets: [
      'cover.png',
      'brand-identity-board.png',
      'skincare-packaging.png',
      'shopping-bags.png',
    ],
    blockers: [],
    note: 'Content in wahjCaseStudy.ts. No page yet. Three files were renamed on 2026-08-30 to match their actual contents. One thing to resolve before publishing: the business card inside brand-identity-board.png carries placeholder contact details at a legible size.',
  },

  'dr-mouhammad-abou-shahin': {
    status: 'content-ready',
    usableAssets: ['home.png', 'services.png', 'about.png', 'patient-info.png', 'contact.png'],
    blockers: [],
    note: 'Content in drAbouShahinCaseStudy.ts. No page yet. cover.png is excluded from the case study — it is byte-identical to home.png and reserved for the /work card. The five screenshots were renamed on 2026-08-30 to short kebab-case. Two artwork errors to fix before publishing: a placeholder phone number on contact.png and a misspelled street in the services.png footer.',
  },

  /* ── NEEDS MORE ASSETS ─────────────────────────────────────────────── */
  fleure: {
    status: 'needs-more-assets',
    usableAssets: ['cover.png'],
    blockers: [
      'cover.png is the only file in the folder. It is a 1254x1254 3x3 montage, so every application exists only as a ~418px tile inside it.',
      'No standalone logo board, packaging, ribbon, vehicle, storefront, bag, tag or stationery asset exists. Cropping tiles out would give soft, low-resolution plates next to the full-width pages already built for the other projects.',
      'projectCovers.ts already points at this same file, so the /work card and the case study would show an identical image.',
      'The business card in the montage carries placeholder contact details (+966 50 123 4567, hello@fleure.com). Do not show them at a legible size.',
    ],
    note: 'Do not build a Fleuré case study until the individual applications are exported at full resolution. Audited 2026-08-30; thinnest project in the portfolio (12 assets for Second Life, 4 for Swirlé, 1 here).',
  },
}

/** Projects that are not ready for a case study page, with their blockers. */
export function blockedCaseStudies() {
  return Object.entries(caseStudyStatus).filter(
    ([, entry]) => entry.status !== 'content-ready',
  )
}
