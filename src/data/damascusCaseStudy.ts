import poster from '../assets/projects/damascus/damascus-poster-cover.jpeg'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * One poster, one section. There is exactly one asset, and nothing here should
 * imply otherwise.
 * ------------------------------------------------------------------------- */

export type DamascusSectionId = 'poster'

export interface DamascusSection {
  id: DamascusSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface DamascusCaseStudy {
  meta: CaseStudyMeta
  sections: DamascusSection[]
  /**
   * INTERNAL ONLY. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * DAMASCUS
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Illustrated city poster' },
  { label: 'Subject', value: 'Damascus, the city of jasmine' },
  { label: 'Technique', value: 'Stained glass illustration' },
  { label: 'Deliverables', value: 'One poster' },
]

export const damascusCaseStudy: DamascusCaseStudy = {
  meta: {
    slug: 'damascus',
    title: 'DAMASCUS',
    subtitle: 'City of Jasmine',
    category: 'Graphic Design',
    year: 2026,
    intro:
      'Illustrated city poster inspired by stained glass and jasmine. One sheet, built entirely from leaded glass, lit from behind.',
    facts,
  },

  sections: [
    {
      id: 'poster',
      index: '01',
      eyebrow: 'Poster',
      title: 'A city rendered in glass.',
      body: [
        'Every surface in the poster is stained glass. The dome, the façade, the sky behind it and the ornament framing all of it are drawn as leaded panes with their caming lines left visible, and the whole sheet is lit from behind so the golds carry the light and the blues hold the shadow.',
        'Jasmine is the other half of the idea. White blossoms spill diagonally across the centre and repeat in each corner of the border, which is what keeps an architectural drawing from reading as a monument: the flowers are the part of the city that grows over the stone.',
        'The cartouche at the foot names the city twice — once plainly, once as the city of jasmine.',
      ],
      images: [
        {
          order: 1,
          file: 'damascus-poster-cover.jpeg',
          src: poster,
          width: 993,
          height: 1418,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Illustrated poster of Damascus rendered as stained glass: a blue-tiled dome above an ornamented arched facade, white jasmine blossoms across the centre and in each corner of a gold scrollwork border, titled Damascus, city of jasmine.',
          caption: 'Damascus, city of jasmine.',
          internalFlags: [
            'DISPLAY WIDTH: keep this image at roughly 620-700px wide maximum. At 993x1418 it is the lowest-resolution hero in the portfolio and softens noticeably above that. Full-bleed is not available for this project.',
            'MUST NOT BE CROPPED: the border ornament and the corner jasmine are part of the composition, not padding. Show the sheet whole.',
            'DUPLICATE USE: this file is also the project cover in projectCovers.ts, so it appears on the /work card and again here.',
            'FORMAT: the only JPEG used by any project. Compression artefacts are visible in the fine caming lines and around the jasmine petals, which is where the craft of the piece lives. A PNG or higher-quality re-export would help.',
          ],
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'SINGLE ASSET: damascus-poster-cover.jpeg is the entire project. There is no series, no alternate sheet, no process work and no mockup. Do not write copy that implies otherwise.',
    'DESCRIPTION: the existing public description in projects.ts and workProjects.ts is accurate and was NOT changed. Both motifs it names, stained glass and jasmine, are genuinely present.',
    'LANGUAGE: the title is English, the subtitle is Turkish (YASEMIN SEHRI, city of jasmine), and there is no Arabic anywhere on the poster, which is an odd pairing for Damascus. Confirm this is intentional before any copy leans on the subtitle.',
    'COPY: written from the poster itself — the glass technique, the dome and facade, the jasmine placement, the border, and the two lines in the cartouche. No brief, client, exhibition or timeline has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the artwork, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025).',
    'TYPES: reuses CaseStudyImage / CaseStudyFact / CaseStudyMeta from secondLifeCaseStudy.ts and declares its own single-section vocabulary.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}
