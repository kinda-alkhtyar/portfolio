import brandIdentityBoard from '../assets/projects/wahj/brand-identity-board.png'
import cover from '../assets/projects/wahj/cover.png'
import shoppingBags from '../assets/projects/wahj/shopping-bags.png'
import skincarePackaging from '../assets/projects/wahj/skincare-packaging.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * `CaseStudyImage`, `CaseStudyFact` and `CaseStudyMeta` are reused as-is from
 * `secondLifeCaseStudy.ts`; only the section vocabulary differs, because this
 * project has a dedicated packaging section.
 * ------------------------------------------------------------------------- */

export type WahjSectionId = 'hero' | 'brand-identity' | 'packaging' | 'closing'

export interface WahjSection {
  id: WahjSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface WahjCaseStudy {
  meta: CaseStudyMeta
  sections: WahjSection[]
  /**
   * INTERNAL ONLY. Open questions and defects that are not tied to a single
   * image. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * WAHJ
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Brand identity + packaging' },
  { label: 'Sector', value: 'Beauty and permanent makeup' },
  { label: 'Palette', value: 'Blush, rose, clay, gold' },
  { label: 'Deliverables', value: 'Logo system, salon signage, packaging, retail and stationery' },
]

export const wahjCaseStudy: WahjCaseStudy = {
  meta: {
    slug: 'wahj',
    title: 'WAHJ',
    subtitle: 'Beauty & Care',
    category: 'Brand Identity',
    year: 2026,
    intro:
      'A beauty and care identity expressed across packaging, retail and branded environments. Wahj is built as one continuous gold line, applied to every surface a client touches between the door and the shelf.',
    facts,
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Gold on blush.',
      body: [
        'A beauty studio is judged in the first three seconds, from the doorway, before anyone has spoken. The identity was designed for that moment: the mark rendered in polished gold relief on a blush wall, lit from above so the line catches and the room does the rest.',
        'Everything in the space carries the same two values. Blush for every surface, gold for every edge — the mirror ring, the chair frame, the plinth top, the mark itself. There is no third colour, which is what lets a small room read as considered rather than decorated.',
      ],
      images: [
        {
          order: 1,
          file: 'cover.png',
          src: cover,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Wahj salon interior: the lockup in polished gold relief on a blush wall, beside a backlit oval mirror over a white vanity, a pink velvet chair with a gold frame, and roses on a fluted plinth.',
          caption: 'The studio wall.',
          internalFlags: [
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again as the hero here.',
          ],
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'brand-identity',
      index: '02',
      eyebrow: 'Identity',
      title: 'One line, drawn like a signature.',
      body: [
        'The mark is a single calligraphic flourish with two things worked into it: a microblading pen, drawn to scale, and a four-point sparkle. It reads as ornament first and as a tool second, which is the right order for a treatment nobody wants described too literally.',
        'The wordmark is a wide-set serif with a letterspaced BEAUTY & CARE beneath, and the whole lockup sits inside a thin keyline with clipped corners — the one structural device that repeats across the bag, the card and the carton.',
        'Four values carry it: two golds for foil and relief, and two blushes for ground and shadow. Every application is one of those four on one of the others.',
      ],
      images: [
        {
          order: 2,
          file: 'brand-identity-board.png',
          src: brandIdentityBoard,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Wahj identity board: shopping bags, a stack of embossed business cards, the gold calligraphic mark shown large, and four palette swatches.',
          caption: 'Mark, palette and stationery.',
          internalFlags: [
            'PLACEHOLDER DATA: the business card is legible and entirely fictional — 123 Blossom Avenue, Beverly Hills CA 90210, +1 (310) 555-1234 (a reserved-for-fiction prefix), info@wahjbeauty.com, www.wahjbeauty.com. Do not display this board at a size where the card reads. Replace with real details or blur before publishing.',
            'INTERNAL REPETITION: the top-left panel of this board is the same shopping bags shown full-frame in the closing section. Placing both large will read as repetition.',
            'SPEC: palette swatches are written without a # and in lowercase (ebb046, d99b34, ea9b89, ba664e), unlike the Swirlé board which uses #FF6F91. Inconsistent if both are ever shown together.',
            'THIN SECTION: no typography specification, no reversed or single-colour lockup, and no pattern sheet exist.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'packaging',
      index: '03',
      eyebrow: 'Packaging',
      title: 'Frosted glass, gold foil.',
      body: [
        'The retail range takes the lockup down to product scale: frosted glass droppers and jars with solid gold closures, and blush cartons foiled with the same mark. Frosted rather than clear, so the containers read as objects on a shelf rather than as a view of what is inside them.',
        'The keyline is dropped at this size and the mark carries the recognition alone, which is what keeps a 30ml bottle from looking like a shrunken poster.',
      ],
      images: [
        {
          order: 3,
          file: 'skincare-packaging.png',
          src: skincarePackaging,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Wahj product range: frosted glass dropper bottles and jars with gold lids beside blush cartons, all foiled with the gold mark and wordmark, among rose petals.',
          caption: 'Serums, jars and cartons.',
        },
      ],
    },

    /* -- 04 ---------------------------------------------------------------- */
    {
      id: 'closing',
      index: '04',
      eyebrow: 'Closing',
      title: 'What leaves with the client.',
      body: [
        'The bag is the last piece of the identity anyone handles and the only one that travels. It carries the full lockup embossed rather than printed, a gold keyline, and rope handles in the same finish as the mark — so the thing being carried down the street is the same object that was on the wall inside.',
      ],
      images: [
        {
          order: 4,
          file: 'shopping-bags.png',
          src: shoppingBags,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Two blush Wahj shopping bags in large and small sizes, with gold rope handles, a gold keyline border and the embossed gold lockup.',
          caption: 'Retail bags, two sizes.',
          internalFlags: [
            'INTERNAL REPETITION: these bags also appear as the top-left panel of brand-identity-board.png in section 02. If both stay, size one of them down.',
          ],
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'PLACEHOLDER CONTACT DETAILS: the business card inside brand-identity-board.png carries a fictional address, a reserved 555 phone number and an invented domain. This is the single blocker to publishing the identity section at full size.',
    'POSITIONING: the mark contains a microblading / permanent-makeup pen, so this is a PMU and beauty-treatment brand, not general skincare. Copy should reflect treatment rather than cosmetics generally, and the "Beauty & Care" subtitle is doing that work deliberately.',
    'REPETITION: the shopping bags appear twice — full-frame in shopping-bags.png and as a panel inside brand-identity-board.png. Flagged on both images.',
    'ASPECT: all four assets are 1440x1440. There is no variation in shape, so the layout has to carry the rhythm of the page, the same constraint as Swirlé.',
    'ONE COLOURWAY: blush and gold throughout. The identity has not been tested on a dark or neutral ground, and there is no reversed or single-colour version of the mark.',
    'FILENAMES: three files in this folder were renamed on 2026-08-30 because their names described the wrong images — salon-interior.png became brand-identity-board.png, brand-identity.png became shopping-bags.png, and kincare-packaging.png became skincare-packaging.png. cover.png was correct and was kept. projectCovers.ts was not changed; it points at cover.png.',
    'COPY: written from what is legible in the artwork — the mark and the pen worked into it, the wordmark and subtitle, the keyline device, the four palette values, and the product formats. No client, brief, location or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2024 for this project).',
    'SEQUENCE: image `order` values 1-4 match the confirmed sequence. Keep them stable if sections are ever reordered.',
    'TYPES: reuses CaseStudyImage / CaseStudyFact / CaseStudyMeta from secondLifeCaseStudy.ts and declares its own section vocabulary, because `packaging` is not in `CaseStudySectionId`.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}

/** Convenience lookup for a future case study page. */
export function getWahjSection(id: WahjSectionId): WahjSection | undefined {
  return wahjCaseStudy.sections.find((section) => section.id === id)
}
