import aboutDe from '../assets/projects/aqarati/about-de.png'
import citiesMapEn from '../assets/projects/aqarati/cities-map-en.png'
import homeAr from '../assets/projects/aqarati/home-ar.png'
import homeEn from '../assets/projects/aqarati/home-en.png'
import homeTr from '../assets/projects/aqarati/home-tr.png'
import loginTr from '../assets/projects/aqarati/login-tr.png'
import propertiesAr from '../assets/projects/aqarati/properties-ar.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * `CaseStudyImage`, `CaseStudyFact` and `CaseStudyMeta` are reused as-is from
 * `secondLifeCaseStudy.ts`; only the section vocabulary differs, because this
 * project is a product rather than an identity. See `internalNotes` on hoisting
 * the shared types into a neutral module once a second case study page exists.
 * ------------------------------------------------------------------------- */

export type AqaratiSectionId =
  | 'hero'
  | 'multilingual'
  | 'listings'
  | 'discovery'
  | 'accounts'
  | 'about'

export interface AqaratiSection {
  id: AqaratiSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface AqaratiCaseStudy {
  meta: CaseStudyMeta
  sections: AqaratiSection[]
  /**
   * INTERNAL ONLY. Open questions and defects that are not tied to a single
   * image. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * AQARATI SYRIA
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Product design / web platform' },
  { label: 'Sector', value: 'Real estate' },
  { label: 'Languages', value: 'Arabic, English, Turkish, German' },
  { label: 'Deliverables', value: 'UI system, RTL layout, search and map discovery, account flows' },
]

export const aqaratiCaseStudy: AqaratiCaseStudy = {
  meta: {
    slug: 'aqarati',
    title: 'AQARATI SYRIA',
    subtitle: 'Property Platform',
    category: 'UI/UX Design',
    year: 2026,
    intro:
      'A multilingual real estate platform designed for the Syrian market. Aqarati brings listings, locations and pricing into one interface that reads correctly in four languages and in both writing directions.',
    facts,
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Your next home starts here.',
      body: [
        'Property search in Syria is fragmented across listing groups and word of mouth, where the same home appears at three prices and no location is exact. Aqarati is built on the opposite premise: clear locations, transparent pricing, and listings that can be trusted.',
        'Arabic is the primary language, not a translation layer. The interface was drawn right-to-left first, so the navigation, hero, search controls and card metrics all read in their natural direction before any other locale was fitted to them.',
      ],
      images: [
        {
          order: 1,
          file: 'home-ar.png',
          src: homeAr,
          width: 1280,
          height: 631,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Aqarati homepage in Arabic, laid out right-to-left, with the headline "Your next home starts here" over an aerial view of a lit villa.',
          caption: 'Homepage, Arabic. The full layout mirrors, not just the text.',
          internalFlags: [
            'CROP: capture ends mid-hero. Not a full-page screenshot; usable as a hero band only.',
            'INCONSISTENT ART: this locale uses a different hero photograph from the EN, TR and DE captures, which weakens the "one platform, four languages" reading.',
          ],
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'multilingual',
      index: '02',
      eyebrow: 'Localisation',
      title: 'One layout, four languages, two directions.',
      body: [
        'The platform ships in Arabic, English, Turkish and German. Syria is a market with a large diaspora and a returning buyer base, so the audience is rarely reading in the same language as the seller.',
        'Switching locale flips the entire grid, not the copy alone: the logo, the primary navigation, the trust row, the call to action and the search controls all change side. Line lengths were set to absorb German compounds without reflowing the hero, which is the case that breaks most localised layouts.',
      ],
      images: [
        {
          order: 2,
          file: 'home-en.png',
          src: homeEn,
          width: 1280,
          height: 599,
          aspect: 'landscape',
          display: 'paired',
          alt: 'The same homepage in English, laid out left-to-right, with the headline "Your next home starts here".',
          caption: 'English.',
          internalFlags: [
            'CROP: capture ends mid-hero, same as the other home shots.',
            'INCONSISTENT ART: different hero photograph again.',
          ],
        },
        {
          order: 3,
          file: 'home-tr.png',
          src: homeTr,
          width: 1280,
          height: 645,
          aspect: 'landscape',
          display: 'paired',
          alt: 'The same homepage in Turkish, with the headline "Yeni eviniz burada basliyor".',
          caption: 'Turkish.',
          internalFlags: [
            'CROP: capture ends mid-hero, same as the other home shots.',
            'INCONSISTENT ART: different hero photograph again.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'listings',
      index: '03',
      eyebrow: 'Search',
      title: 'Buy, rent, or stay.',
      body: [
        'One control bar carries the whole search: intent first (buy, rent, short stay), then governorate, property type and price. Everything else is a result.',
        'Cards are deliberately sparse. A photograph, the intent tag, the neighbourhood and city, the price in the currency it was listed in, then area, bedrooms and bathrooms as icons. Nothing is ranked or promoted above the listing itself.',
      ],
      images: [
        {
          order: 4,
          file: 'properties-ar.png',
          src: propertiesAr,
          width: 1280,
          height: 613,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'Arabic listings view with a search bar for governorate, property type and price, buy / rent / stays tabs, and a row of property cards showing price, area, bedrooms and bathrooms.',
          caption: 'Featured listings, filtered by governorate, type and price.',
          internalFlags: [
            'CROP: the top of the screenshot is clipped mid-search-bar and the navbar is missing, so the screen floats without context. Recapture with the header intact.',
            'DATA: prices mix $ and E currencies across four cards in the same row. Confirm this is intentional before it is shown large.',
          ],
        },
      ],
    },

    /* -- 04 ---------------------------------------------------------------- */
    {
      id: 'discovery',
      index: '04',
      eyebrow: 'Discovery',
      title: 'Search the country, not a dropdown.',
      body: [
        'Buyers who have been away describe where they want to live by region, not by filter value. The map turns the governorates into the primary index: each carries its live listing count, and selecting one pushes straight into results with the type and price filters already attached.',
        'It doubles as an honest coverage map. Where a governorate has nothing yet, it says so.',
      ],
      images: [
        {
          order: 5,
          file: 'cities-map-en.png',
          src: citiesMapEn,
          width: 1280,
          height: 924,
          aspect: 'landscape',
          display: 'full-bleed',
          alt: 'A three-dimensional relief map of Syria with a listing-count pin on each governorate, beside property type and price filters and a "Show properties" button.',
          caption: 'Governorate map with live listing counts.',
          internalFlags: [
            'EMPTY STATE: almost every pin reads 0. The signature feature is being shown with no inventory behind it. Recapture against seeded data, or the copy has to own the empty state explicitly.',
            'COMPOSITION: large dead area between the map and the footer. Crop tighter, or use the footer band deliberately.',
          ],
        },
      ],
    },

    /* -- 05 ---------------------------------------------------------------- */
    {
      id: 'accounts',
      index: '05',
      eyebrow: 'Accounts',
      title: 'Two doors, one platform.',
      body: [
        'The platform serves buyers and agencies from the same entry point: individuals list a property, offices register and manage a portfolio. Both start at the same sign-in, so the split happens after authentication rather than in the navigation.',
        'The screen keeps the marketing image on one half and the form on the other, which holds the brand while the task stays uncluttered.',
      ],
      images: [
        {
          order: 6,
          file: 'login-tr.png',
          src: loginTr,
          width: 1280,
          height: 551,
          aspect: 'landscape',
          display: 'inset',
          alt: 'Split-screen sign-in page in Turkish, with a villa photograph on the left and email and password fields on the right.',
          caption: 'Sign-in, Turkish.',
        },
      ],
    },

    /* -- 06 ---------------------------------------------------------------- */
    {
      id: 'about',
      index: '06',
      eyebrow: 'Trust',
      title: 'More than a property platform.',
      body: [
        'In a market where the main risk is not price but certainty, trust is the product. The about page states four commitments plainly, in the reader own language: responsibility for every listing, full clarity with no surprises, support from first enquiry to signature, and coverage across every Syrian governorate.',
      ],
      images: [
        {
          order: 7,
          file: 'about-de.png',
          src: aboutDe,
          width: 1280,
          height: 634,
          aspect: 'landscape',
          display: 'inset',
          alt: 'German about page: the heading "We are more than a property platform" above four trust pillars, beside a photograph of a handshake in a branded office.',
          caption: 'About, German.',
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'SELECTION: seven files, in the order confirmed by the owner. Deliberately excluded: contact-ar.jpg (thin, mostly empty space, and the only JPG in the folder), home-mobile-ar.png and home-mobile-listings-ar.png (both carry a real phone status bar with battery, Wi-Fi and social notification icons plus the Android nav bar; the first also has near-unreadable gold-on-render headline text).',
    'ALSO EXCLUDED: home-de.png is in the folder but not in the confirmed list. It is the only light-theme capture in the set, so as it stands the case study shows no light mode at all. Decide whether light mode is a feature worth its own pair.',
    'COVERAGE GAP: no property detail page, neighbourhoods page, services page, list-a-property flow or register-an-office flow was captured, although the navigation promises all five. That is where most of the UX work in a listings platform lives. Worth capturing before this ships.',
    'ART DIRECTION: all three home captures use a different hero photograph per locale. Recapturing them on one shared photo would make the localisation section far more convincing.',
    'CROPS: every home capture and the listings capture stop mid-page. None is a full-page screenshot.',
    'COPY: all body copy is written from what is legible inside the screenshots (nav labels, headlines, the four trust pillars, the buy/rent/stays tabs, filter names, card metrics, the four-language footer switcher). No client, brief, timeline or metric has been invented. Needs the owner to confirm tone and the market claims before it ships.',
    'META: the `facts` entries are inferred from the screenshots, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2025). The footer in cities-map-en.png reads 2026.',
    'SEQUENCE: image `order` values 1-7 match the confirmed sequence. Keep them stable if sections are ever reordered.',
    'TYPES: this file reuses CaseStudyImage / CaseStudyFact / CaseStudyMeta from secondLifeCaseStudy.ts and declares its own section vocabulary. When a second case study page is built, hoist the shared types into a neutral module (e.g. src/data/caseStudy.ts) and have both projects import from it.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}

/** Convenience lookup for a future case study page. */
export function getAqaratiSection(id: AqaratiSectionId): AqaratiSection | undefined {
  return aqaratiCaseStudy.sections.find((section) => section.id === id)
}
