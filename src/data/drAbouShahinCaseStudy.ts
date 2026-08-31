import about from '../assets/projects/dr-mouhammad-abou-shahin/about.png'
import contact from '../assets/projects/dr-mouhammad-abou-shahin/contact.png'
import home from '../assets/projects/dr-mouhammad-abou-shahin/home.png'
import patientInfo from '../assets/projects/dr-mouhammad-abou-shahin/patient-info.png'
import services from '../assets/projects/dr-mouhammad-abou-shahin/services.png'
import type { CaseStudyFact, CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'

/* ------------------------------------------------------------------------- *
 * Types
 *
 * Content structure only. No layout, no components, no motion.
 *
 * `CaseStudyImage`, `CaseStudyFact` and `CaseStudyMeta` are reused as-is from
 * `secondLifeCaseStudy.ts`; the section vocabulary is this project's own,
 * because the case study follows the site's own page structure.
 * ------------------------------------------------------------------------- */

export type DrAbouShahinSectionId =
  | 'hero'
  | 'services'
  | 'about'
  | 'patient-info'
  | 'contact'

export interface DrAbouShahinSection {
  id: DrAbouShahinSectionId
  /** Display index, matching the numbered-section idiom used across the site. */
  index: string
  eyebrow: string
  title: string
  /** One entry per paragraph. */
  body: string[]
  images: CaseStudyImage[]
}

export interface DrAbouShahinCaseStudy {
  meta: CaseStudyMeta
  sections: DrAbouShahinSection[]
  /**
   * INTERNAL ONLY. Open questions and defects that are not tied to a single
   * image. Never rendered, never passed into props that reach the DOM.
   */
  internalNotes: string[]
}

/* ------------------------------------------------------------------------- *
 * DR. MOUHAMMAD ABOU SHAHIN
 * ------------------------------------------------------------------------- */

const facts: CaseStudyFact[] = [
  { label: 'Type', value: 'Website design' },
  { label: 'Sector', value: 'Dental clinic' },
  { label: 'Location', value: 'Vienna, Austria' },
  { label: 'Deliverables', value: 'Five-page site, interaction design, appointment flow' },
]

export const drAbouShahinCaseStudy: DrAbouShahinCaseStudy = {
  meta: {
    slug: 'dr-mouhammad-abou-shahin',
    title: 'DR. MOUHAMMAD ABOU SHAHIN',
    subtitle: 'Dental Clinic — Vienna',
    category: 'UI/UX Design',
    year: 2026,
    intro:
      'A refined dental clinic website focused on trust, clarity and patient access. Five pages built around one idea: a patient should be able to answer every practical question before they ever pick up the phone.',
    facts,
  },

  sections: [
    /* -- 01 ---------------------------------------------------------------- */
    {
      id: 'hero',
      index: '01',
      eyebrow: 'Case study',
      title: 'Precision, designed around comfort.',
      body: [
        'Most dental websites are built to reassure and end up doing the opposite: stock smiles, clinical blue, and a phone number as the only way through. This one was built on warm ivory and gold, with a monogram that hides a tooth inside an M, so the first impression is a considered practice rather than a procedure.',
        'The hero states the promise and then proves it. A draggable comparison between a fractured tooth and a restored one sits directly under the headline, which lets the work speak before any claim about it does.',
        'Immediately below the fold, three facts a prospective patient actually needs — where the clinic is, that appointments are required, and which insurers are accepted — before a single paragraph of philosophy.',
      ],
      images: [
        {
          order: 1,
          file: 'home.png',
          src: home,
          width: 864,
          height: 1821,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Homepage: the headline "Precision dentistry, designed around comfort" beside a draggable before-and-after comparison of a fractured and a restored tooth, above an information strip and the clinic interior.',
          caption: 'Homepage, full page.',
        },
      ],
    },

    /* -- 02 ---------------------------------------------------------------- */
    {
      id: 'services',
      index: '02',
      eyebrow: 'Interaction',
      title: 'Dental care, clearly explained.',
      body: [
        'Three services, three rows, one pattern: a number, a plain-language description, an image, and an explicit cue telling you what the row will do if you touch it. Nothing is hidden behind a hover the visitor has to discover by accident.',
        'The orthodontics row carries the argument. A drag-to-align before and after runs the full width of the panel, so the outcome of treatment is something the visitor performs rather than reads.',
        'Both the English and the German term are set for orthodontics — Kieferorthopädie beside it, at the same size — because in Vienna the patient searching for one is often not searching for the other.',
      ],
      images: [
        {
          order: 2,
          file: 'services.png',
          src: services,
          width: 941,
          height: 1672,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Services page: three numbered service rows for general dental care, orthodontics and dental hygiene, each with an image and an interaction cue, including a drag-to-align before-and-after slider.',
          caption: 'Services, with hover and drag interactions.',
          internalFlags: [
            'ARTWORK ERROR: the footer on this page gives the street as "Klotzbergurger Straße 71/2". Every other page reads "Klosterneuburger Straße 71/2". The Services spelling is wrong and is not a real Vienna street. Do not display this footer at a legible size until it is corrected.',
          ],
        },
      ],
    },

    /* -- 03 ---------------------------------------------------------------- */
    {
      id: 'about',
      index: '03',
      eyebrow: 'Trust',
      title: 'Care begins with trust.',
      body: [
        'A single-practitioner clinic sells the practitioner, so the About page leads with him: a portrait at hero scale, his name, his discipline, and the promise stated in his own terms before any credential appears.',
        'Qualifications are set as a short, unpadded list rather than a paragraph — dental medicine, then the orthodontics diploma in both languages. Three numbered principles follow: clear communication, individual attention, comfortable care.',
        'The page closes on the room itself. Showing the clinic interior on the About page rather than in a gallery means the space is presented as evidence of the philosophy rather than as decoration.',
      ],
      images: [
        {
          order: 3,
          file: 'about.png',
          src: about,
          width: 941,
          height: 1672,
          aspect: 'portrait',
          display: 'tall',
          alt: 'About page: a portrait of the dentist beside the headline "Care begins with trust", followed by qualifications, three numbered principles, and a photograph of the clinic interior.',
          caption: 'About, the practitioner and the practice.',
        },
      ],
    },

    /* -- 04 ---------------------------------------------------------------- */
    {
      id: 'patient-info',
      index: '04',
      eyebrow: 'Information',
      title: 'Everything you need before your visit.',
      body: [
        'This is the page that does the real work. Five numbered blocks answer the questions a clinic answers on the phone all day: do I need an appointment, is my insurance accepted, when are you open, where exactly are you, and then the same four questions again in an accordion for anyone who scrolled past.',
        'The four Austrian insurers are set as display type rather than as a sentence, because for a large share of visitors that single line decides whether the rest of the site matters.',
        'Opening hours are a plain table with a row per day, including the closed ones. Split morning and afternoon shifts are shown as they actually are, not summarised into a range that would be wrong four days a week.',
      ],
      images: [
        {
          order: 4,
          file: 'patient-info.png',
          src: patientInfo,
          width: 941,
          height: 1672,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Patient Info page: numbered blocks for appointments, health insurance providers, a seven-row opening hours table, a location map preview, and a common questions accordion.',
          caption: 'Patient Info, the practical page.',
        },
      ],
    },

    /* -- 05 ---------------------------------------------------------------- */
    {
      id: 'contact',
      index: '05',
      eyebrow: 'Conversion',
      title: 'Let’s plan your visit.',
      body: [
        'The appointment form asks for a preferred date, a preferred time and a reason for the visit, which turns a generic enquiry into something the clinic can act on without a second exchange.',
        'It also tells the truth about itself. A line under the button states that submitting the form is a request and not a confirmation until the clinic replies — a small piece of honesty that prevents the single worst outcome, a patient arriving for an appointment that was never booked.',
        'Address, hours and the map repeat here rather than linking back. On the page where someone has decided to come in, nothing should require another click.',
      ],
      images: [
        {
          order: 5,
          file: 'contact.png',
          src: contact,
          width: 863,
          height: 1823,
          aspect: 'portrait',
          display: 'tall',
          alt: 'Contact page: the headline "Let us plan your visit", a contact column with address and opening hours, an appointment request form with preferred date and time, and a styled location map.',
          caption: 'Contact and appointment request.',
          internalFlags: [
            'PLACEHOLDER DATA: the phone number renders as "+XX XXX XXXXXXX" — an unfilled placeholder, shown at large size in the contact column. The Services page footer carries a real-format number (+43 1 890 27 27). One of the two is wrong and this one must be fixed before publishing.',
          ],
        },
      ],
    },
  ],

  /* INTERNAL ONLY - never rendered. */
  internalNotes: [
    'EXCLUDED: cover.png is byte-identical to home.png and is reserved for the homepage Selected Work strip and the /work card via projectCovers.ts. It is deliberately not used in this case study, so the same screenshot does not appear twice.',
    'PLACEHOLDER PHONE: contact.png displays "+XX XXX XXXXXXX" prominently. Blocker for publishing the contact section at full size.',
    'MISSPELLED STREET: the services.png footer reads "Klotzbergurger Straße" where every other page reads "Klosterneuburger Straße". An error inside the artwork, not a capture problem.',
    'DATE MISMATCH: every screenshot footer reads "© 2024". The portfolio records this project as 2026. Either the screenshots need recapturing or the discrepancy has to be accepted as an artefact of when the site was built.',
    'CAPTURE WIDTHS: home.png and contact.png are 864 and 863 wide; services.png, about.png and patient-info.png are 941. The set was not captured at one viewport, so the five will not align perfectly if stacked at a shared display width. Size each by its own aspect rather than forcing a common width.',
    'TALL TREATMENT: all five are full-page captures between roughly 1:1.8 and 1:2.1. None can go full-bleed across the desktop content column. Each needs the tall or contained treatment — the same handling as materials-desktop.png on Second Life.',
    'STRONGEST PROJECT: five distinct pages with real interaction design (two before/after sliders, hover reveals, an accordion) and a genuine bilingual detail. Nothing a dental clinic site needs is missing.',
    'COPY: written from what is legible in the screenshots — the headlines, the service names, the qualifications, the four insurers, the opening hours, the form fields and the submission disclaimer. No client, brief, timeline or outcome has been invented. Needs the owner to confirm tone before it ships.',
    'META: the `facts` entries are inferred from the screenshots, not confirmed. NEEDS USER CONFIRMATION.',
    'YEAR: 2026, set by the owner across every project (previously 2024 for this project).',
    'SEQUENCE: image `order` values 1-5 match the confirmed sequence. Keep them stable if sections are ever reordered.',
    'FILENAMES: the five screenshots were renamed on 2026-08-30 from "Dr Mouhammad Abou Shahin Website — <Page>.png" to short kebab-case. cover.png was kept. projectCovers.ts was not changed.',
    'SCOPE: content only. No page, route, layout or motion has been built.',
  ],
}

/** Convenience lookup for a future case study page. */
export function getDrAbouShahinSection(
  id: DrAbouShahinSectionId,
): DrAbouShahinSection | undefined {
  return drAbouShahinCaseStudy.sections.find((section) => section.id === id)
}
