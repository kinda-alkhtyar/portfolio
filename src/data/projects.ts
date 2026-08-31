import { projectCovers } from './projectCovers'

export type ProjectCategory =
  | 'Brand Identity'
  | 'Graphic Design'
  | 'UI/UX Design'
  | 'Advertising'
  | 'Visual Campaign'
  | 'Packaging'
  | 'Editorial'
  | 'Web Design'

export interface Project {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  year: number
  cover: string
  /** `object-position` for the card crop, tuned against the homepage reference. */
  coverPosition: string
  /** Extra zoom on the card crop, when the source art needs tightening. */
  coverZoom?: number
  /** `object-fit` for the card cover. Defaults to `cover`. */
  coverFit?: 'cover' | 'contain'
  description: string
}

/**
 * The homepage Selected Work strip: ten cards across two rows, in reference
 * order. Covers come from `projectCovers.ts`, so each card now carries its own
 * project artwork instead of one of the three homepage stand-ins.
 */
export const projects: Project[] = [
  // ── row 01 ──────────────────────────────────────────────────────────
  {
    id: '01',
    slug: 'second-life',
    title: 'SECOND LIFE',
    category: 'Brand Identity',
    year: 2026,
    cover: projectCovers['second-life'],
    coverPosition: 'center 50%',
    description: 'Brand identity and digital material library for reclaimed architecture.',
  },
  {
    id: '02',
    slug: 'damascus',
    title: 'DAMASCUS',
    category: 'Graphic Design',
    year: 2026,
    cover: projectCovers.damascus,
    coverPosition: 'center 34%',
    description: 'Illustrated city poster inspired by stained glass and jasmine.',
  },
  {
    id: '03',
    slug: 'still-human',
    title: 'STILL HUMAN',
    category: 'Graphic Design',
    year: 2026,
    cover: projectCovers['still-human'],
    coverPosition: 'center 46%',
    description: 'A conceptual poster about human connection and empathy.',
  },
  {
    id: '04',
    slug: 'rumman',
    title: 'RUMMAN SKINCARE',
    category: 'Brand Identity',
    year: 2026,
    cover: projectCovers.rumman,
    coverPosition: 'center 50%',
    description: 'Brand identity and packaging direction for a pomegranate skincare line.',
  },
  {
    id: '05',
    slug: 'aqarati',
    title: 'AQARATI SYRIA',
    category: 'UI/UX Design',
    year: 2026,
    cover: projectCovers.aqarati,
    // 1280x631 hero shot: under `cover` the card crops horizontally only, so a
    // centred crop keeps the lit villa and the headline and drops both margins.
    coverPosition: 'center 50%',
    description: 'A multilingual real estate platform designed for the Syrian market.',
  },

  // ── row 02 ──────────────────────────────────────────────────────────
  {
    id: '06',
    slug: 'swirle',
    title: 'SWIRLÉ',
    category: 'Brand Identity',
    year: 2026,
    cover: projectCovers.swirle,
    coverPosition: 'center 58%',
    description: 'A playful ice cream identity across packaging, retail and collateral.',
  },
  {
    id: '07',
    slug: 'fleure',
    title: 'FLEURÉ',
    category: 'Brand Identity',
    year: 2026,
    cover: projectCovers.fleure,
    coverPosition: 'center 50%',
    description: 'Luxury floral boutique identity across packaging and branded touchpoints.',
  },
  {
    id: '08',
    slug: 'strawberry-milk',
    title: 'STRAWBERRY & MILK',
    category: 'UI/UX Design',
    year: 2026,
    cover: projectCovers['strawberry-milk'],
    coverPosition: 'center 50%',
    description: 'A product website built around bold food photography and playful interaction.',
  },
  {
    id: '09',
    slug: 'dr-mouhammad-abou-shahin',
    title: 'DR. MOUHAMMAD ABOU SHAHIN',
    category: 'UI/UX Design',
    year: 2026,
    cover: projectCovers['dr-mouhammad-abou-shahin'],
    coverPosition: 'center 4%',
    description: 'A refined dental clinic website focused on trust, clarity and patient access.',
  },
  {
    id: '10',
    slug: 'wahj',
    title: 'WAHJ',
    category: 'Brand Identity',
    year: 2026,
    cover: projectCovers.wahj,
    coverPosition: 'center 42%',
    description: 'A beauty and care identity expressed across packaging, retail and branded environments.',
  },
]

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug)
