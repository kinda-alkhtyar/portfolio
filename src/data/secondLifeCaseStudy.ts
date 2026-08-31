import aboutDesktop from '../assets/projects/second-life/about-desktop.png'
import collectionsDesktop from '../assets/projects/second-life/collections-desktop.png'
import homeDesktop from '../assets/projects/second-life/home-desktop.png'
import logoSystem from '../assets/projects/second-life/logo-system.png'
import materialsDesktop from '../assets/projects/second-life/materials-desktop.png'
import mockupMarbleLabel from '../assets/projects/second-life/mockup-marble-label.png'
import mockupMaterialPassport from '../assets/projects/second-life/mockup-material-passport.png'
import mockupMaterialTag from '../assets/projects/second-life/mockup-material-tag.png'
import mockupSampleBox from '../assets/projects/second-life/mockup-sample-box.png'
import mockupShippingCrate from '../assets/projects/second-life/mockup-shipping-crate.png'
import projectsDesktop from '../assets/projects/second-life/projects-desktop.png'
import visualIdentity from '../assets/projects/second-life/visual-identity.png'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion. The future
 * case study page reads this file; nothing here decides how it looks.
 * ------------------------------------------------------------------------- */

export type CaseStudySectionId =
  | 'hero'
  | 'brand-identity'
  | 'material-passport'
  | 'digital-archive'
  | 'applications'
  | 'closing'

/** Native shape of the source file, so the layout can pick a treatment later. */
export type CaseStudyImageAspect = 'landscape' | 'square' | 'portrait'

/**
 * A suggested presentation weight, not a CSS class. The layout pass is free to
 * ignore these; they only record how each image was judged during the audit.
 */
export type CaseStudyImageDisplay = 'full-bleed' | 'inset' | 'paired' | 'tall'

export interface CaseStudyImage {
  /** Position in the agreed final sequence, 1-12. Stable; do not renumber. */
  order: number
  /** Source filename, kept for traceability back to the audit. */
  file: string
  src: string
  /** Native pixel size, measured from the PNG headers. */
  width: number
  height: number
  aspect: CaseStudyImageAspect
  display: CaseStudyImageDisplay
  /** Rendered to end users. */
  alt: string
  /** Rendered to end users, when the layout has room for a caption. */
  caption?: string
  /**
   * INTERNAL ONLY. Production defects found in the artwork itself. Never
   * render these, never pass them into props that reach the DOM. They exist so
   * the source files can be corrected in a later pass.
   */
  internalFlags?: string[]
}

export interface CaseStudySection {
  id: CaseStudySectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface CaseStudyFact {
  label: string
  value: string
}

export interface CaseStudyMeta {
  /** Must match the slug in `projects.ts` / `projectCovers.ts`. */
  slug: string
  title: string
  subtitle: string
  category: string
  year: number
  /** Short standfirst under the title. */
  intro: string
  /** Key-value strip: role, deliverables, scope. */
  facts: CaseStudyFact[]
}

export interface CaseStudy {
  meta: CaseStudyMeta
  sections: CaseStudySection[]
  /**
   * INTERNAL ONLY. Open questions and defects that are not tied to a single
   * image. Same rule as `internalFlags`: never rendered.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * SECOND LIFE
 * ------------------------------------------------------------------------- */

export const secondLifeCaseStudy: CaseStudy = {
  meta: {
    slug: 'second-life',
    title: 'SECOND LIFE',
    subtitle: 'Material Library',
    category: 'Brand Identity',
    year: 2026,
    intro:
      'A brand identity and digital material library for reclaimed architecture. SECOND LIFE recovers, documents and redistributes architectural materials so they can continue into new projects.',
    facts: [
      { label: 'Type', value: 'Brand identity + digital product' },
      { label: 'Sector', value: 'Architecture / material reuse' },
      { label: 'Year', value: '2026' },
      {
        label: 'Deliverables',
        value: 'Identity system, material label system, web platform, packaging',
      },
    ],
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Materials with a past.',
      body: [
        'Every renovation and demolition produces materials that still hold physical, aesthetic and architectural value, and most of them are discarded because their origin and condition were never recorded in a usable way.',
        'SECOND LIFE is a curated library of reclaimed architectural materials: an identity and a platform built around the idea that a material is worth keeping only if its history can be proven.',
      ],
      images: [
        {
          order: 1,
          file: 'home-desktop.png',
          src: homeDesktop,
          width: 1536,
          height: 1024,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'SECOND LIFE homepage with the headline "Materials with a past" beside a reclaimed oak beam and its archive record.',
          caption: 'Homepage. The hero pairs the statement with a real material record.',
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'brand-identity',
      index: '02',
      eyebrow: 'Identity',
      title: 'Built like an archive, not a catalogue.',
      body: [
        'The wordmark is a compressed industrial sans with a clipped E, drawn to sit as comfortably stencilled on a crate as it does set small in a navigation bar. The SL monogram interlocks the two letters into a single mark for stamps, labels and debossed applications.',
        'The system runs on five colours, three typefaces and one rule: data is always legible. Carbon black and archive ivory carry the identity, concrete grey and oxide brown come from the materials themselves, and safety orange is reserved for measured values, never for decoration.',
      ],
      images: [
        {
          order: 2,
          file: 'logo-system.png',
          src: logoSystem,
          width: 1402,
          height: 1122,
          aspect: 'landscape',
          display: 'inset',
          alt: 'Logo board showing the primary wordmark, stacked lockup, SL monogram, reversed versions and the mark debossed in concrete.',
          caption: 'Wordmark, stacked lockup and monogram, with reversed and applied versions.',
        },
        {
          order: 3,
          file: 'visual-identity.png',
          src: visualIdentity,
          width: 1536,
          height: 1024,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Identity system board: colour palette with hex and Pantone values, typography, material label system, graphic system, photography direction and tone of voice.',
          caption: 'The identity system in one sheet.',
          internalFlags: [
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again here. Decide whether to swap the cover or move this image lower in the page.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'material-passport',
      index: '03',
      eyebrow: 'Concept',
      title: 'Every material has a passport.',
      body: [
        'The centre of the system is the Material Passport: a fixed record that travels with the piece from the building it came out of to the project it goes into. Material ID, origin, year, previous use, dimensions, condition grade and carbon saved, always in the same order, always in the same mono typeface.',
        'It exists as a swing tag on the material itself and as a printed document in the crate. Both use the same grid as the website, so a beam on a warehouse floor and a record on a screen read as the same object.',
      ],
      images: [
        {
          order: 4,
          file: 'mockup-material-tag.png',
          src: mockupMaterialTag,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Kraft swing tag roped to a weathered oak beam, printed with the material ID, origin, year and carbon saved.',
          caption: 'MAT.0342, tagged at source.',
          internalFlags: [
            'DATA MISMATCH: this tag prints CARBON SAVED 10.4 KG CO2e for MAT.0342. home-desktop, about-desktop, visual-identity and the passport mockup all print 18.4 KG CO2e for the same material. Pick one figure and reissue the odd artwork.',
          ],
        },
        {
          order: 5,
          file: 'mockup-material-passport.png',
          src: mockupMaterialPassport,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'inset',
          alt: 'Printed Material Passport booklet clipped shut on concrete, next to a block of reclaimed oak.',
          caption: 'The printed passport that ships with the material.',
          internalFlags: [
            'ARTWORK TYPO: the cover reads "MATERIAL PASSPORY" instead of "MATERIAL PASSPORT". Baked into the image; the mockup needs regenerating before this goes public.',
          ],
        },
      ],
    },

    /* -- 04 ---------------------------------------------------------------- */
    {
      id: 'digital-archive',
      index: '04',
      eyebrow: 'Platform',
      title: 'Search by character, not by product.',
      body: [
        'The archive is the product. Materials are filtered by category, origin, age, condition grade and availability, and every card carries the same fields as the physical tag, so nothing has to be translated between the warehouse and the browser.',
        'Collections group the same inventory by context rather than by type: by era, by origin city, by surface, or by the single building a batch came out of. It is closer to how architects actually specify, and it is the reason the platform does not behave like a shop.',
        'Reuse projects close the loop. Each finished building lists the archive materials it consumed, which turns the catalogue into evidence that the model works.',
      ],
      images: [
        {
          order: 6,
          file: 'materials-desktop.png',
          src: materialsDesktop,
          width: 941,
          height: 1672,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Material archive page: filter bar, material-type tabs and a grid of material cards showing ID, origin, year, grade, quantity, carbon saved and availability.',
          caption: 'The archive, filtered down to wood.',
          internalFlags: [
            'ID MISMATCH: the aged steel panel is MAT.0949 here but MAT.0094 on home-desktop. Reconcile before publishing.',
            'Only portrait file in the set (941x1672). It will not sit in a full-bleed row with the others; it needs its own treatment in the layout pass.',
          ],
        },
        {
          order: 7,
          file: 'collections-desktop.png',
          src: collectionsDesktop,
          width: 1536,
          height: 1024,
          aspect: 'landscape',
          display: 'inset',
          alt: 'Collections page grouping reclaimed materials by era, origin, surface and source building.',
          caption: 'Collections, curated by context.',
          internalFlags: [
            'GARBLED TEXT: several labels are corrupted in the artwork ("50 MA10SIGLS", "09 - BY SULLECTOES", "10 - CUBATERO DISCOVERY", section 09 used twice, plus a scrambled vertical caption). Lowest-quality file in the set. Keep it inset rather than full-bleed until it is regenerated.',
          ],
        },
        {
          order: 8,
          file: 'projects-desktop.png',
          src: projectsDesktop,
          width: 1536,
          height: 1024,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Reuse projects page with a featured interior built from archive materials and a grid of completed projects.',
          caption: 'Where the materials ended up.',
        },
        {
          order: 9,
          file: 'about-desktop.png',
          src: aboutDesktop,
          width: 1536,
          height: 1024,
          aspect: 'landscape',
          display: 'inset',
          alt: 'About page explaining the recover, document, catalogue and reuse process alongside the passport system and impact figures.',
          caption: 'Recover, document, catalogue, reuse.',
          internalFlags: [
            'GARBLED TEXT: the vertical caption on the right edge is scrambled ("DEECING WITH WHAT ALEEPMENT EXISTS."). Crop it out or regenerate the artwork.',
          ],
        },
      ],
    },

    /* -- 05 ---------------------------------------------------------------- */
    {
      id: 'applications',
      index: '05',
      eyebrow: 'Applications',
      title: 'The system leaves the screen.',
      body: [
        'Labels adapt to the surface they land on rather than to a fixed artboard: adhesive on stone, roped tags on timber, stencils on crates. The grid stays the same, the substrate changes.',
        'Sample sets put four material families in one kraft box so a studio can hold the palette before specifying it, and shipping crates carry the archive reference at the scale of a warehouse aisle.',
      ],
      images: [
        {
          order: 10,
          file: 'mockup-marble-label.png',
          src: mockupMarbleLabel,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'paired',
          alt: 'Carrara marble slab leaning against concrete with an adhesive archive label recording its origin, year and previous use.',
          caption: 'MAT.0187, reclaimed from a hotel lobby.',
        },
        {
          order: 11,
          file: 'mockup-sample-box.png',
          src: mockupSampleBox,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'paired',
          alt: 'Open kraft sample box holding four material samples: reclaimed oak, marble, oxidised metal and patterned tile.',
          caption: 'Sample Set 01: wood, stone, metal, tile.',
        },
      ],
    },

    /* -- 06 ---------------------------------------------------------------- */
    {
      id: 'closing',
      index: '06',
      eyebrow: 'Closing',
      title: 'Handle with history.',
      body: [
        'Waste is a design decision. SECOND LIFE is built on the assumption that the most sustainable material is the one that already exists, and that the only thing standing between it and its next building is a record good enough to trust.',
      ],
      images: [
        {
          order: 12,
          file: 'mockup-shipping-crate.png',
          src: mockupShippingCrate,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'full-bleed',
          alt: 'Timber shipping crate in a warehouse, stencilled with the SECOND LIFE wordmark, the archive reference and the line "Handle with history".',
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'COPY: all body copy is written from what is legible inside the artwork (Copenhagen / DK, est. 2024, 428 materials, 37 source buildings, 18 cities, 07 categories, the palette and type names). Nothing about a real client, brief or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries (type, sector, deliverables) are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025). The artwork itself says EST. 2024 and dates its screens 2026.',
    'ASSETS: the twelve PNGs total roughly 27 MB (1.7-2.8 MB each). Compress or convert before a public case study page ships.',
    'SEQUENCE: image `order` values 1-12 match the agreed audit sequence. Keep them stable if sections are ever reordered.',
    'SCOPE: this file is content only. No page, route, layout or motion has been built, per PROJECT_STATE (project case study pages are on the do-not-build list).',
  ],
}

/** Convenience lookup for the future case study page. */
export function getSecondLifeSection(id: CaseStudySectionId): CaseStudySection | undefined {
  return secondLifeCaseStudy.sections.find((section) => section.id === id)
}
