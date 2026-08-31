import type { ProjectSlug } from './projectCovers'
import { projectCovers } from './projectCovers'

export interface WorkProject {
  title: string
  /**
   * Route slug for `/work/:slug`. Set only where a case study page actually
   * exists, so a project without one stays non-clickable in the grid instead
   * of linking to the placeholder.
   */
  slug?: ProjectSlug
  category: 'BRANDING' | 'UI/UX DESIGN' | 'GRAPHIC DESIGN' | 'AI VIDEO / MOTION'
  media?: 'video'
  /**
   * Motion weight, not visual weight: `lead` marks the portfolio's strongest
   * product work, which `/work` gives the slowest, deepest reveals and the
   * most restrained tilt. Read only by `workMotion.ts` — no layout, type,
   * spacing or colour depends on it.
   */
  tier?: 'lead'
  year: number
  description: string
  cover: string
  position: string
}

/**
 * The `/work` grid. Same ten portfolio projects as the homepage strip, with
 * covers read from `projectCovers.ts` — the grid cards are taller than the
 * homepage cards, so each entry keeps its own `position`.
 */
export const workProjects: WorkProject[] = [
  {
    title: 'EFFERVESCENCE',
    slug: 'effervescence',
    category: 'AI VIDEO / MOTION',
    media: 'video',
    tier: 'lead',
    year: 2026,
    description: 'A cinematic beverage motion study exploring\ncarbonation, energy and texture.',
    cover: projectCovers.effervescence,
    position: 'center center',
  },
  {
    title: 'FLEURÉ',
    slug: 'fleure',
    category: 'BRANDING',
    year: 2026,
    description: 'Luxury floral boutique identity across\npackaging and branded touchpoints.',
    cover: projectCovers.fleure,
    position: 'center 30%',
  },
  {
    title: 'STILL HUMAN',
    slug: 'still-human',
    category: 'GRAPHIC DESIGN',
    year: 2026,
    description: 'A conceptual poster about human\nconnection and empathy.',
    cover: projectCovers['still-human'],
    position: 'center 42%',
  },
  {
    title: 'STRAWBERRY & MILK',
    slug: 'strawberry-milk',
    category: 'UI/UX DESIGN',
    year: 2026,
    description: 'A product website built around bold\nfood photography and playful interaction.',
    cover: projectCovers['strawberry-milk'],
    position: 'center 34%',
  },
  {
    title: 'DR. MOUHAMMAD ABOU SHAHIN',
    tier: 'lead',
    slug: 'dr-mouhammad-abou-shahin',
    category: 'UI/UX DESIGN',
    year: 2026,
    description: 'A refined dental clinic website focused\non trust, clarity and patient access.',
    cover: projectCovers['dr-mouhammad-abou-shahin'],
    position: 'center 22%',
  },
  {
    title: 'WAHJ',
    slug: 'wahj',
    category: 'BRANDING',
    year: 2026,
    description: 'A beauty and care identity expressed across\npackaging, retail and branded environments.',
    cover: projectCovers.wahj,
    position: 'center 51%',
  },
  {
    title: 'SECOND LIFE',
    tier: 'lead',
    slug: 'second-life',
    category: 'BRANDING',
    year: 2026,
    description: 'Brand identity and digital material\nlibrary for reclaimed architecture.',
    cover: projectCovers['second-life'],
    position: 'center 28%',
  },
  {
    title: 'AQARATI SYRIA',
    tier: 'lead',
    slug: 'aqarati',
    category: 'UI/UX DESIGN',
    year: 2026,
    description: 'A multilingual real estate platform\ndesigned for the Syrian market.',
    cover: projectCovers.aqarati,
    position: 'center 40%',
  },
  {
    title: 'SWIRLÉ',
    slug: 'swirle',
    category: 'BRANDING',
    year: 2026,
    description: 'A playful ice cream identity across\npackaging, retail and collateral.',
    cover: projectCovers.swirle,
    position: 'center 55%',
  },
  {
    title: 'DAMASCUS',
    slug: 'damascus',
    category: 'GRAPHIC DESIGN',
    year: 2026,
    description: 'Illustrated city poster inspired by\nstained glass and jasmine.',
    cover: projectCovers.damascus,
    position: 'center 32%',
  },
  {
    title: 'RUMMAN SKINCARE',
    slug: 'rumman',
    category: 'BRANDING',
    year: 2026,
    description: 'Brand identity and packaging direction\nfor a pomegranate skincare line.',
    cover: projectCovers.rumman,
    position: 'center 50%',
  },
]
