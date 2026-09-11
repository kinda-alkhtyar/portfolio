import homepage from '../assets/projects/taaniqi/taaniqi-homepage.png'
import brandStory from '../assets/projects/taaniqi/taaniqi-about-brand-story.png'
import adminLogin from '../assets/projects/taaniqi/taaniqi-admin-login.png'
import type { CaseStudyImage, CaseStudyMeta } from './secondLifeCaseStudy'
import type { Locale } from '../i18n/localization'

export function getTaaniqiCaseStudy(locale: Locale) {
  const ar = locale === 'ar'
  const meta: CaseStudyMeta = {
    slug: 'taaniqi',
    title: ar ? 'تأنقي مع إيمان' : 'TAANIQI WITH IMAN',
    subtitle: ar ? 'متجر أزياء عربي' : 'Arabic Fashion Storefront',
    category: ar ? 'متجر أزياء / تصميم وتطوير ويب' : 'Fashion E-commerce / Web Design & Development',
    year: 2026,
    liveUrl: 'https://taaniqi-iman.vercel.app/',
    intro: ar
      ? 'واجهة متجر أزياء عربية بطابع فاخر، تجمع بين الهوية الراقية، التشكيلات المختارة، وتجربة تصفح وتسوق واضحة وجذابة.'
      : 'A premium Arabic fashion storefront combining elegant brand identity, curated collections, and a clear shopping experience.',
    facts: [
      { label: ar ? 'القطاع' : 'Sector', value: ar ? 'الأزياء' : 'Fashion' },
      { label: ar ? 'النطاق' : 'Scope', value: ar ? 'تصميم وتطوير ويب' : 'Web Design & Development' },
      { label: ar ? 'اللغة' : 'Language', value: ar ? 'العربية / من اليمين إلى اليسار' : 'Arabic / RTL' },
      { label: ar ? 'الهوية' : 'Identity', value: ar ? 'عنابي، كريمي وذهبي' : 'Burgundy, cream & gold' },
    ],
  }
  const images: CaseStudyImage[] = [
    { order: 1, file: 'taaniqi-homepage.png', src: homepage, width: 390, height: 1825, aspect: 'portrait', display: 'tall', alt: ar ? 'الصفحة الرئيسية لمتجر تأنقي مع إيمان على الهاتف، بألوان عنابية وكريمية وذهبية.' : 'Taaniqi with Iman mobile storefront in burgundy, cream and gold.' },
    { order: 2, file: 'taaniqi-about-brand-story.png', src: brandStory, width: 1024, height: 1536, aspect: 'portrait', display: 'tall', alt: ar ? 'قصة علامة تأنقي مع إيمان ورؤيتها وقيمها.' : 'Taaniqi with Iman brand story, vision and values.' },
    { order: 3, file: 'taaniqi-admin-login.png', src: adminLogin, width: 1024, height: 1536, aspect: 'portrait', display: 'tall', alt: ar ? 'واجهة دخول الإدارة لتأنقي مع إيمان بتفاصيل عنابية وذهبية.' : 'Taaniqi with Iman admin login in burgundy and gold.' },
  ]
  const sections = [
    { index: '01', eyebrow: ar ? 'المتجر' : 'Storefront', title: ar ? 'تجربة المتجر' : 'The Storefront', body: [] as string[] },
    { index: '02', eyebrow: ar ? 'العلامة' : 'Brand', title: ar ? 'قصة العلامة وقيمها' : 'Brand Story & Values', body: [] as string[] },
    { index: '03', eyebrow: ar ? 'الإدارة' : 'Administration', title: ar ? 'تجربة دخول الإدارة' : 'Admin Experience', body: [] as string[] },
  ]
  return { meta, images, sections }
}
