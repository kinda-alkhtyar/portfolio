import cover from '../assets/projects/still-human/cover.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * One poster, one section. The shape is deliberately minimal: there is exactly
 * one asset, and nothing here should imply otherwise.
 * ------------------------------------------------------------------------- */

export type StillHumanSectionId = 'poster'

export interface StillHumanSection {
  id: StillHumanSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface StillHumanCaseStudy {
  meta: CaseStudyMeta
  sections: StillHumanSection[]
  /**
   * INTERNAL ONLY. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * STILL HUMAN
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Conceptual poster' },
  { label: 'Medium', value: 'Pencil and crosshatch illustration' },
  { label: 'Format', value: 'Portrait, print resolution' },
  { label: 'Deliverables', value: 'One poster' },
]

export const stillHumanCaseStudy: StillHumanCaseStudy = {
  meta: {
    slug: 'still-human',
    title: 'STILL HUMAN',
    subtitle: 'Conceptual Poster',
    category: 'Graphic Design',
    year: 2026,
    intro:
      'A conceptual poster about human connection and empathy. One sheet, one idea: what remains human is how we protect each other.',
    facts,
  },

  sections: [
    {
      id: 'poster',
      index: '01',
      eyebrow: 'Poster',
      title: 'One red umbrella.',
      body: [
        'A crowd of figures stands in the rain, each alone under a black umbrella, each drawn from behind so no face is available to read. They are evenly spaced across the sheet, which is what makes them a pattern rather than a crowd.',
        'One pair breaks it. A single red umbrella, held by one person over another — the only colour in the drawing, carried down into the reflection at their feet. The whole argument sits in that one decision: the difference between the pattern and the exception is not shelter, it is the choice to share it.',
        'The rain is drawn as unbroken vertical strokes over every figure equally, so nobody is spared the weather. Only the response to it differs.',
      ],
      images: [
        {
          order: 1,
          file: 'cover.png',
          src: cover,
          width: 1985,
          height: 2835,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Illustrated poster: figures alone under black umbrellas in the rain, with one pair at the centre sharing a single red umbrella, above the title "Still Human" and the line "What remains human is how we protect each other."',
          caption: 'Still Human. Pencil on warm off-white.',
          internalFlags: [
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again here.',
            'MUST NOT BE CROPPED: the meaning depends on the density of surrounding lone figures. Any crop that tightens on the red umbrella destroys the point. Show it whole.',
            'ORIENTATION: the only portrait hero in the portfolio (1985x2835). It cannot go full-bleed across the desktop content column without excessive height, so it needs the tall treatment or a centred plate at roughly 620-700px wide.',
          ],
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'SINGLE ASSET: cover.png is the entire project. There is no series, no alternate sheet, no process work and no mockup. Do not write copy that implies otherwise.',
    'CORRECTED 2026-08-30: the public description previously said "poster series". It is one poster. projects.ts and workProjects.ts now both read "A conceptual poster about human connection and empathy."',
    'COPY: written from the poster itself — the composition, the single red element, the title and the printed line "What remains human is how we protect each other." No brief, client, exhibition or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025).',
    'TYPES: reuses CaseStudyImage / CaseStudyFact / CaseStudyMeta from secondLifeCaseStudy.ts and declares its own single-section vocabulary.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}
