import contactDesktop from '../assets/projects/strawberry-milk/contact-desktop.png'
import homeDesktop from '../assets/projects/strawberry-milk/home-desktop.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

export type StrawberryMilkSectionId = 'hero' | 'contact'

export interface StrawberryMilkSection {
  id: StrawberryMilkSectionId
  index: string
  eyebrow: string
  title: string
  body: string[]
  images: CaseStudyImage[]
}

export interface StrawberryMilkCaseStudy {
  meta: CaseStudyMeta
  sections: StrawberryMilkSection[]
}

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Website interface' },
  { label: 'Format', value: 'Desktop screens' },
  { label: 'Pages shown', value: 'Home + contact' },
  { label: 'Assets', value: 'Two interface screens' },
]

export const strawberryMilkCaseStudy: StrawberryMilkCaseStudy = {
  meta: {
    slug: 'strawberry-milk',
    title: 'STRAWBERRY & MILK',
    subtitle: 'Product Website',
    category: 'UI/UX Design',
    year: 2026,
    intro:
      'A bright desktop website concept pairing oversized product imagery with a direct, lightweight interface.',
    facts,
  },
  sections: [
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Home',
      title: 'The product leads the page.',
      body: [
        'The home screen gives the strawberry-and-milk composition most of the canvas, supported by a short headline, compact navigation and two clear calls to action.',
      ],
      images: [
        {
          order: 1,
          file: 'home-desktop.png',
          src: homeDesktop,
          width: 1402,
          height: 1122,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Strawberry and Milk desktop home page with floating strawberries, a milk splash, navigation and a large product headline.',
          caption: 'Desktop home screen.',
        },
      ],
    },
    {
      id: 'contact',
      index: '02',
      eyebrow: 'Contact',
      title: 'A practical second screen.',
      body: [
        'The contact screen keeps the same red accent and airy structure, combining contact options, a message form and product imagery in one clear composition.',
      ],
      images: [
        {
          order: 2,
          file: 'contact-desktop.png',
          src: contactDesktop,
          width: 1402,
          height: 1122,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'FruitMilk desktop contact page with contact details, a message form, three fruit drinks and a feature strip.',
          caption: 'Desktop contact screen.',
        },
      ],
    },
  ],
}
