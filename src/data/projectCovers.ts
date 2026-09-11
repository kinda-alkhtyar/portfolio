import aqaratiCover from '../assets/projects/aqarati/home-ar.png'
import veilInMotionVideo from '../assets/projects/veil-in-motion/veil-in-motion-ai-commercial.mp4'
import taaniqiCover from '../assets/projects/taaniqi/taaniqi-homepage.png'
import damascusCover from '../assets/projects/damascus/damascus-poster-cover.jpeg'
import drAbouShahinCover from '../assets/projects/dr-mouhammad-abou-shahin/cover.png'
import fleureCover from '../assets/projects/fleure/cover.png'
import rummanCover from '../assets/projects/rumman/cover.png'
import secondLifeCover from '../assets/projects/second-life/visual-identity.png'
import stillHumanCover from '../assets/projects/still-human/cover.png'
import strawberryMilkCover from '../assets/projects/strawberry-milk/home-desktop.png'
import swirleCover from '../assets/projects/swirle/cups.png'
import wahjCover from '../assets/projects/wahj/cover.png'
import effervescenceVideo from '../assets/videos/commercial-motion-soda.mp4'

export type ProjectSlug =
  | 'veil-in-motion'
  | 'taaniqi'
  | 'effervescence'
  | 'aqarati'
  | 'second-life'
  | 'swirle'
  | 'fleure'
  | 'rumman'
  | 'still-human'
  | 'damascus'
  | 'strawberry-milk'
  | 'dr-mouhammad-abou-shahin'
  | 'wahj'

/**
 * The one place a portfolio project is tied to its cover image. Both the
 * homepage Selected Work strip (`projects.ts`) and `/work`
 * (`workProjects.ts`) read from here, so a cover swap is a one-line edit.
 */
export const projectCovers: Record<ProjectSlug, string> = {
  'veil-in-motion': veilInMotionVideo,
  taaniqi: taaniqiCover,
  effervescence: effervescenceVideo,
  aqarati: aqaratiCover,
  'second-life': secondLifeCover,
  swirle: swirleCover,
  fleure: fleureCover,
  rumman: rummanCover,
  'still-human': stillHumanCover,
  damascus: damascusCover,
  'strawberry-milk': strawberryMilkCover,
  'dr-mouhammad-abou-shahin': drAbouShahinCover,
  wahj: wahjCover,
}

/** Slugs still showing a placeholder rather than their own artwork. */
export const projectsAwaitingCover: ProjectSlug[] = []
