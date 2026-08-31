import cover from '../assets/projects/fleure/cover.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

export type FleureSectionId = 'identity'

export interface FleureSection {
  id: FleureSectionId
  index: string
  eyebrow: string
  title: string
  body: string[]
  images: CaseStudyImage[]
}

export interface FleureCaseStudy {
  meta: CaseStudyMeta
  sections: FleureSection[]
}

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Brand identity' },
  { label: 'Sector', value: 'Floral boutique' },
  { label: 'Applications', value: 'Packaging, ribbon, tags, vehicle, storefront' },
  { label: 'Assets', value: 'One identity montage' },
]

export const fleureCaseStudy: FleureCaseStudy = {
  meta: {
    slug: 'fleure',
    title: 'FLEURÉ',
    subtitle: 'Luxury Floral Boutique',
    category: 'Brand Identity',
    year: 2026,
    intro:
      'A floral boutique identity built around a refined serif wordmark, rose linework and a soft ivory, blush and sage palette.',
    facts,
  },
  sections: [
    {
      id: 'identity',
      index: '01',
      eyebrow: 'Identity system',
      title: 'One mark across every touchpoint.',
      body: [
        'The montage shows the identity applied consistently across bouquet wrapping, hat boxes, ribbon, shopping bags, tags, stationery, a delivery vehicle and the storefront.',
        'Gold linework and restrained typography keep the system legible while the muted palette lets the flowers remain the focus.',
      ],
      images: [
        {
          order: 1,
          file: 'cover.png',
          src: cover,
          width: 1254,
          height: 1254,
          aspect: 'square',
          display: 'inset',
          alt: 'Fleuré floral boutique identity montage showing the logo, bouquet wrapping, flower box, ribbon, delivery vehicle, storefront, shopping bag, tags and stationery.',
          caption: 'Fleuré identity and applications overview.',
        },
      ],
    },
  ],
}
