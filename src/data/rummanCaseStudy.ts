import cover from '../assets/projects/rumman/cover.png'
import logo from '../assets/projects/rumman/logo.png'
import serumMockup from '../assets/projects/rumman/serum-mockup.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * `CaseStudyImage`, `CaseStudyFact` and `CaseStudyMeta` are reused as-is from
 * `secondLifeCaseStudy.ts`; only the section vocabulary differs, because this
 * project closes on a product shot rather than on applications.
 * ------------------------------------------------------------------------- */

export type RummanSectionId = 'hero' | 'brand-identity' | 'product-detail'

export interface RummanSection {
  id: RummanSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface RummanCaseStudy {
  meta: CaseStudyMeta
  sections: RummanSection[]
  /**
   * INTERNAL ONLY. Open questions and defects that are not tied to a single
   * image. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * RUMMAN SKINCARE
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Brand identity + packaging' },
  { label: 'Sector', value: 'Beauty and skincare' },
  { label: 'Range', value: 'Gentle Cleanser, Glow Serum, Facial Oil' },
  { label: 'Deliverables', value: 'Logo system, packaging, label system, gift box' },
]

export const rummanCaseStudy: RummanCaseStudy = {
  meta: {
    slug: 'rumman',
    title: 'RUMMAN SKINCARE',
    subtitle: 'Pomegranate Skincare',
    category: 'Brand Identity',
    year: 2026,
    intro:
      'Brand identity and packaging direction for a pomegranate skincare line. Rumman takes its name and its whole visual language from the fruit, drawn as ornament rather than illustration.',
    facts,
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Named for the fruit.',
      body: [
        'Rumman is the Arabic word for pomegranate, and the fruit does every job in this identity: it is the mark, the pattern, the palette and the reason the range is the colour it is. Deep seed red against the pale blush of the pith, with rose gold standing in for the shine on a fresh seed.',
        'The packaging was designed as a gift before it was designed as a product. A die-cut carry box opens into a presentation tray, so the three-step range arrives as a set rather than as three bottles that happen to match.',
      ],
      images: [
        {
          order: 1,
          file: 'cover.png',
          src: cover,
          width: 1280,
          height: 1280,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Two Rumman Skincare gift boxes in blush and deep red — one closed showing the full lockup, one open presenting the Gentle Cleanser, Glow Serum and Facial Oil.',
          caption: 'The gift box, closed and presenting the range.',
          internalFlags: [
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again as the hero here.',
            'SCALE: the three products are legible but small in this shot. Only the serum has a detail image; there is no equivalent for the cleanser or the facial oil.',
          ],
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'brand-identity',
      index: '02',
      eyebrow: 'Identity',
      title: 'Ornament, not illustration.',
      body: [
        'The mark is a halved pomegranate with its seeds drawn individually and two laurel sprigs beneath, held in a single weight of line so it prints as cleanly at label size as it does across a box panel.',
        'The wordmark is a high-contrast display serif carrying two swashes — a long descending tail on the R and a flourish off the N — which are what stop a symmetrical seven-letter word from reading as a stock lockup. A fleuron divider and a letterspaced SKINCARE settle it.',
        'Everything sits inside an ornate double rule with filigree corners, over a faint diamond lattice. The frame is the system: it repeats on the box, the tray and every label, so the range holds together without a second graphic device.',
      ],
      images: [
        {
          order: 2,
          file: 'logo.png',
          src: logo,
          width: 1774,
          height: 887,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Rumman Skincare logo board: a halved pomegranate mark with laurel sprigs above the swashed serif wordmark and letterspaced SKINCARE, inside an ornamental double-rule frame on a blush diamond lattice.',
          caption: 'Mark, wordmark and the ornamental frame.',
          internalFlags: [
            'ASPECT: the only non-square file in the folder (2:1). It will not pair in a row with the two square mockups and needs its own full-width band.',
            'THIN SECTION: this is the only identity asset. There is no colour specification, no typography sheet, no reversed or single-colour lockup, and no pattern sheet.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'product-detail',
      index: '03',
      eyebrow: 'Product',
      title: 'The label, at arm’s length.',
      body: [
        'A skincare label is read once, held close, in the few seconds before it is bought. The label was set to survive that: the frame first, then the mark, then the wordmark, then the product name and its two-word promise, then the volume. Five levels of hierarchy in a space the width of a thumb.',
        'Clear glass and a rose-gold collar let the product itself supply the colour, so the blush of the formula reads as part of the identity rather than as packaging printed to match it.',
      ],
      images: [
        {
          order: 3,
          file: 'serum-mockup.png',
          src: serumMockup,
          width: 1280,
          height: 1280,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'A hand holding the Rumman Glow Serum: clear glass dropper bottle with a rose-gold collar and a blush label reading Glow Serum, Hydrate and Brighten, 30 ml.',
          caption: 'Glow Serum, 30 ml.',
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'COVERAGE GAP: three assets, one of each type. Enough for hero, identity and product, but there is no applications or retail section — no secondary packaging, carton, stationery, storefront, social or campaign work exists.',
    'RANGE GAP: only the serum has a detail shot. The Gentle Cleanser and Facial Oil are shown once each, small, inside cover.png.',
    'ONE COLOURWAY: everything is blush, deep red and rose gold. The identity has not been tested on a dark or neutral surface, and there is no reversed or single-colour version of the mark.',
    'RESOLUTION: logo.png (1774x887) holds up at full width. Both mockups are 1280 square and will soften above roughly 1100px, so do not push them full-bleed on a wide canvas.',
    'COPY: all body copy is written from what is legible in the artwork (the mark, the swashed wordmark, the frame and lattice, the three product names with their taglines, and the 30 ml / 1.0 fl. oz. volume). The meaning of "rumman" is the Arabic word for pomegranate. No client, brief or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025).',
    'SEQUENCE: image `order` values 1-3 match the confirmed sequence. Keep them stable if sections are ever reordered.',
    'TYPES: reuses CaseStudyImage / CaseStudyFact / CaseStudyMeta from secondLifeCaseStudy.ts and declares its own section vocabulary, because `product-detail` is not in `CaseStudySectionId`. Hoist the shared types into a neutral module when a second case study page is built.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}

/** Convenience lookup for a future case study page. */
export function getRummanSection(id: RummanSectionId): RummanSection | undefined {
  return rummanCaseStudy.sections.find((section) => section.id === id)
}
