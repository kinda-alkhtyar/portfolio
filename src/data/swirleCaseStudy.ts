import coverBoard from '../assets/projects/swirle/cover.png'
import cups from '../assets/projects/swirle/cups.png'
import logoColors from '../assets/projects/swirle/logo-colors.png'
import stationery from '../assets/projects/swirle/stationery.png'
import type { CaseStudy } from './secondLifeCaseStudy'

/**
 * SWIRLÉ — content structure only. No layout, no components, no motion.
 *
 * The four sections map onto the existing `CaseStudySectionId` union, so this
 * object is structurally identical to `secondLifeCaseStudy` and needs no new
 * types.
 *
 * `internalFlags` / `internalNotes` are production notes for us. Never render
 * them, never pass them into props that reach the DOM.
 */
export const swirleCaseStudy: CaseStudy = {
  meta: {
    slug: 'swirle',
    title: 'SWIRLÉ',
    subtitle: 'Handcrafted Happiness',
    category: 'Brand Identity',
    year: 2026,
    intro:
      'A playful ice cream identity across packaging, retail and collateral. SWIRLÉ is built on one drawn gesture — the swirl — and a five-colour palette that lets every cup, cone and card look related without looking identical.',
    facts: [
      { label: 'Type', value: 'Brand identity + packaging' },
      { label: 'Sector', value: 'Food and beverage / retail' },
      { label: 'Palette', value: 'Coral, teal, sunshine, lilac, cream' },
      {
        label: 'Deliverables',
        value: 'Logo system, colour palette, packaging, collateral, retail and uniform',
      },
    ],
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Handcrafted happiness.',
      body: [
        'Ice cream is bought in a few seconds, usually by someone standing at a counter looking down into a freezer. The identity had to work at that distance and at that speed: one recognisable shape, one unmistakable colour family, and packaging that reads as a set even when the flavours never repeat.',
        'The answer is a single wave that runs across every surface. Each cup takes a different colourway from the same palette, so a row of them reads as one brand and three products at the same time.',
      ],
      images: [
        {
          order: 1,
          file: 'cups.png',
          src: cups,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Three SWIRLÉ ice cream cups in teal, coral and lilac colourways, holding mint chocolate chip, strawberry and cookie dough scoops, on cream with scattered sprinkles.',
          caption: 'One pattern, three colourways.',
          internalFlags: [
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again as the hero here. Consider swapping one of them.',
          ],
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'brand-identity',
      index: '02',
      eyebrow: 'Identity',
      title: 'One gesture, five colours.',
      body: [
        'The mark is a soft-serve swirl drawn as a single continuous ribbon, banded in the full palette so the product and the logo are the same object. A small gold sparkle sits above it — the only element that is not part of the swirl, and the one that makes it read as a treat rather than a shape.',
        'The wordmark is rounded and hand-drawn, with every letter taking its own colour from the palette. That is what stops the identity needing a fixed lockup: the letters can be recoloured to sit on any of the five backgrounds without a rulebook.',
        'The palette is fixed at five values — coral, teal, sunshine, lilac and cream — and cream always carries the type, so the loud colours never have to hold small text.',
      ],
      images: [
        {
          order: 2,
          file: 'logo-colors.png',
          src: logoColors,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'inset',
          alt: 'SWIRLÉ logo board: the multicoloured swirl mark with a gold sparkle, the hand-drawn wordmark with each letter in a different palette colour, the tagline "Handcrafted Happiness", and five colour swatches with their hex values.',
          caption: 'Mark, wordmark and the five-colour palette.',
          internalFlags: [
            'THIN SECTION: this is the only identity asset in the folder. There is no wordmark construction, no typography specification and no pattern sheet, so the identity section rests entirely on one board. Worth producing before this reads as a full brand case study.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'applications',
      index: '03',
      eyebrow: 'Applications',
      title: 'Everything a scoop touches.',
      body: [
        'The system was drawn for the things that leave the shop: cups in two sizes, a lidded pint, the tote, napkins, stickers and a spoon. Each piece takes the same wave and sprinkle pattern at a different scale, so the small items stay legible while the bag carries the full composition.',
        'The printed pieces do the commercial work quietly. A single menu card holds the scoop pricing and four rotating specials, and the loyalty card gives away the fifth scoop — both in the same friendly voice as the mark, neither shouting.',
      ],
      images: [
        {
          order: 3,
          file: 'stationery.png',
          src: stationery,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Flat-lay of SWIRLÉ collateral: tote bag, two cup sizes, pink spoon, lidded pint, loyalty card, sticker sheet, price menu with scoop pricing and specials, napkin stack and a teal coaster.',
          caption: 'Packaging and collateral.',
        },
      ],
    },

    /* -- 04 ---------------------------------------------------------------- */
    {
      id: 'closing',
      index: '04',
      eyebrow: 'Closing',
      title: 'The whole shop, in one palette.',
      body: [
        'Pulled together, the system covers the counter and the street: cones, takeaway boxes, the display freezer, the storefront sign and window, and the staff uniform — aprons, polos, caps and visors cut from the same five colours.',
        'Nothing in the set needs a second brand rule to stay consistent. The wave, the sprinkles and the palette do all of it.',
      ],
      images: [
        {
          order: 4,
          file: 'cover.png',
          src: coverBoard,
          width: 1440,
          height: 1440,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Overview board of the SWIRLÉ identity: logo and palette, branded cups, waffle cones, takeaway boxes, a display freezer, the storefront and interior, staff uniforms, and the collateral flat-lay.',
          caption: 'The system across packaging, retail and uniform.',
          internalFlags: [
            'DUPLICATION: this board contains the logo, cups and stationery images already shown above. It works as a closing summary; it must not be moved earlier in the page or it spoils every image before it.',
            'MISNAMED: despite the filename, cover.png is the composite board and is NOT the /work card cover. projectCovers.ts points at cups.png. Do not assume the filename indicates its role.',
          ],
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'COVERAGE GAP: waffle cones, takeaway boxes, the display freezer, the storefront and the staff uniforms exist only as small tiles inside cover.png. Those are the strongest applications in the project and there are no standalone files for them, so they can never be shown larger than a thumbnail. Worth exporting individually.',
    'ASPECT: all four files are 1440x1440. There is no variation in shape at all, so the layout has to carry the entire rhythm of the page.',
    'COPY: all body copy is written from what is legible in the artwork (the five hex values, the "Handcrafted Happiness" tagline, the scoop pricing and four specials on the menu card, the loyalty card, and the applications visible in the montage). No client, brief or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025).',
    'SEQUENCE: image `order` values 1-4 match the confirmed sequence. Keep them stable if sections are ever reordered.',
    'TYPES: this object satisfies the existing `CaseStudy` type unchanged, since all four section ids already exist in `CaseStudySectionId`. It could be rendered by the existing CaseStudy page as-is; no page work has been done.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}

/** Convenience lookup for a future case study page. */
export function getSwirleSection(id: CaseStudy['sections'][number]['id']) {
  return swirleCaseStudy.sections.find((section) => section.id === id)
}
