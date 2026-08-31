import video from '../assets/videos/commercial-motion-soda.mp4'
import type { CaseStudyMeta } from './secondLifeCaseStudy'

export interface EffervescenceCaseStudy {
  meta: CaseStudyMeta
  video: string
}

export const effervescenceCaseStudy: EffervescenceCaseStudy = {
  meta: {
    slug: 'effervescence',
    title: 'EFFERVESCENCE',
    subtitle: 'Commercial Motion Study',
    category: 'AI Video / Motion',
    year: 2026,
    intro:
      'A cinematic beverage motion study exploring carbonation, energy, texture and product-driven visual storytelling.',
    facts: [
      { label: 'Role', value: 'Concept' },
      { label: 'Direction', value: 'Art Direction' },
      { label: 'Production', value: 'AI Video' },
      { label: 'Discipline', value: 'Motion' },
    ],
  },
  video,
}
