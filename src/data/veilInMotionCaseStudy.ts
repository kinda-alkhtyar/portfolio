import video from '../assets/projects/veil-in-motion/veil-in-motion-ai-commercial.mp4'
import type { CaseStudyMeta } from './secondLifeCaseStudy'
import type { Locale } from '../i18n/localization'

export function getVeilInMotionCaseStudy(locale: Locale) {
  const ar = locale === 'ar'
  const meta: CaseStudyMeta = {
    slug: 'veil-in-motion',
    title: ar ? 'حكاية شال' : 'VEIL IN MOTION',
    subtitle: ar ? 'إعلان أزياء بالذكاء الاصطناعي' : 'AI Fashion Commercial',
    category: ar ? 'فيديو وحركة بالذكاء الاصطناعي' : 'AI VIDEO / MOTION',
    year: 2026,
    intro: ar
      ? 'إعلان أزياء تم إنشاؤه بالكامل بالذكاء الاصطناعي لعلامة شالات، يجمع بين الصورة السينمائية، الحركة، الصوت، والسرد في تجربة إعلانية متكاملة.'
      : 'An AI-generated fashion commercial for a shawl brand, combining cinematic visuals, motion, voice, and storytelling into one complete promotional piece.',
    facts: [
      { label: ar ? 'القطاع' : 'Sector', value: ar ? 'الأزياء / الشالات' : 'Fashion / Shawls' },
      { label: ar ? 'الإنتاج' : 'Production', value: ar ? 'فيديو بالذكاء الاصطناعي' : 'AI-generated video' },
      { label: ar ? 'الصورة' : 'Visuals', value: ar ? 'تصوير سينمائي وحركة' : 'Cinematic visuals & motion' },
      { label: ar ? 'الصوت' : 'Audio', value: ar ? 'صوت وسرد' : 'Voice & storytelling' },
    ],
  }
  return { meta, video }
}
