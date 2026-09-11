/* oxlint-disable react/only-export-components */
import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export type Locale = 'en' | 'ar'

const arabic: Record<string, string> = {
  'VEIL IN MOTION': 'حكاية شال',
  'AI Fashion Commercial': 'إعلان أزياء بالذكاء الاصطناعي',
  'TAANIQI WITH IMAN': 'تأنقي مع إيمان',
  'Fashion E-commerce / Web Design & Development': 'متجر أزياء / تصميم وتطوير ويب',
  'LIVE PROJECT': 'عرض المشروع المباشر',
  HOME: 'الرئيسية', WORK: 'الأعمال', ABOUT: 'عنّي', CONTACT: 'تواصل', "LET'S TALK": 'لنتحدث',
  'LET’S TALK': 'لنتحدث', 'ABOUT ME': 'عنّي', 'VIEW PROJECTS': 'عرض المشاريع',
  'SELECTED WORK': 'أعمال مختارة', 'SELECTED PROJECTS': 'مشاريع مختارة', 'MY WORK': 'أعمالي',
  'WHAT I DO': 'ماذا أقدّم', 'GRAPHIC DESIGN': 'التصميم الجرافيكي', BRANDING: 'الهوية البصرية',
  'UI/UX DESIGN': 'تصميم UI/UX', 'AI VIDEO / MOTION': 'فيديو وحركة بالذكاء الاصطناعي',
  'ALL PROJECTS': 'كل المشاريع', 'ALL': 'الكل', 'SORT BY': 'ترتيب حسب', LATEST: 'الأحدث',
  'SHOWCASING MINDFUL DESIGN': 'تصميم مدروس بعناية', 'SCROLL': 'مرّر',
  'SCROLL TO EXPLORE': 'مرّر للاستكشاف', 'A BELIEF': 'قناعة', 'THAT DRIVES': 'تقود',
  EVERYTHING: 'كل ما أقدّمه', 'DESIGN IS': 'التصميم هو', COMMUNICATION: 'تواصل',
  'VISUAL COMMUNICATION': 'التواصل البصري', DESIGNER: 'مصمّمة',
  'LET’S CREATE': 'لنبتكر', 'LETâ€™S CREATE': 'لنبتكر', 'SOMETHING GREAT': 'شيئًا رائعًا',
  SOMETHING: 'شيئًا', 'MEMORABLE.': 'لا يُنسى.', 'CONTACT ME': 'تواصل معي',
  EMAIL: 'البريد الإلكتروني', PHONE: 'الهاتف', WHATSAPP: 'واتساب', LANGUAGES: 'اللغات',
  AVAILABILITY: 'التوفر', 'CHAT ON WHATSAPP': 'تحدث عبر واتساب', 'SEND A MESSAGE': 'أرسل رسالة',
  'SEND MESSAGE': 'إرسال الرسالة', 'Your Name': 'الاسم', 'Your Email': 'البريد الإلكتروني',
  Subject: 'الموضوع', 'Your Message': 'رسالتك', 'Your name': 'الاسم', 'Your email': 'البريد الإلكتروني',
  'Your message': 'رسالتك', 'BACK TO WORK': 'العودة إلى الأعمال', PROJECT: 'مشروع',
  'PLACEHOLDER — CONTENT COMING SOON.': 'المحتوى قريبًا.', 'BACK HOME': 'العودة للرئيسية',
  'CASE STUDY': 'دراسة حالة', IDENTITY: 'الهوية', CONCEPT: 'الفكرة', PLATFORM: 'المنصة',
  APPLICATIONS: 'التطبيقات', CLOSING: 'الخاتمة', POSTER: 'الملصق', PACKAGING: 'التغليف',
  PRODUCT: 'المنتج', INTERACTION: 'التفاعل', TRUST: 'الثقة', INFORMATION: 'المعلومات',
  CONVERSION: 'التحويل', LOCALISATION: 'التوطين', SEARCH: 'البحث', DISCOVERY: 'الاستكشاف',
  ACCOUNTS: 'الحسابات', HOME_PAGE: 'الرئيسية', TYPE: 'النوع', SECTOR: 'القطاع', YEAR: 'السنة',
  DELIVERABLES: 'المخرجات', ROLE: 'الدور', SCOPE: 'النطاق', CLIENT: 'العميل',
  'MATERIAL ARCHIVE — FULL PAGE': 'أرشيف المواد — الصفحة كاملة',
  'GOVERNORATE MAP — FULL PAGE': 'خريطة المحافظات — الصفحة كاملة', 'HOMEPAGE — FULL PAGE': 'الصفحة الرئيسية — كاملة',
  'CUP SYSTEM — THREE COLOURWAYS': 'نظام الأكواب — ثلاث مجموعات لونية', 'LABEL SYSTEM — IN HAND': 'نظام الملصق — أثناء الاستخدام',
  '01 — MOTION STUDY': '01 — دراسة حركة',
  EXPERTISE: 'الخبرات', EXPERIENCE: 'الخبرة', TOOLS: 'الأدوات', '3 YEARS': '3 سنوات',
  'WHAT I USE': 'الأدوات التي أستخدمها', 'Graphic Design': 'التصميم الجرافيكي',
  'Advertising Design': 'تصميم الإعلانات', 'UI/UX Design': 'تصميم UI/UX',
  'Video Advertising': 'إعلانات الفيديو', Arabic: 'العربية', Turkish: 'التركية', English: 'الإنجليزية',
  'Years\nExperience': 'سنوات\nخبرة', 'Projects\nCompleted': 'مشروعًا\nمنجزًا', 'Happy\nClients': 'عميلًا\nسعيدًا',
  'STAY CURIOUS': 'ابقَ فضوليًا', 'KEEP CREATING': 'واصل الإبداع',
  'ALL RIGHTS RESERVED': 'جميع الحقوق محفوظة', 'BASED IN TURKEY.': 'مقيمة في تركيا،',
  'AVAILABLE WORLDWIDE.': 'ومتاحة للعمل عالميًا.',
  'A selection of branding, digital and\nUI/UX projects that reflect my approach\nto design and problem solving.': 'مجموعة من مشاريع الهوية والتصميم الرقمي وUI/UX\nتعكس منهجي في التصميم وحل المشكلات.',
}

const LocaleContext = createContext<Locale>('en')

export function localePath(path: string, locale: Locale) {
  const clean = path === '/ar' ? '/' : path.replace(/^\/ar(?=\/|$)/, '') || '/'
  return locale === 'ar' ? (clean === '/' ? '/ar' : `/ar${clean}`) : clean
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const locale: Locale = /^\/ar(?:\/|$)/.test(pathname) ? 'ar' : 'en'

  useLayoutEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.body.dataset.locale = locale
    document.title = locale === 'ar' ? 'يمنى المعلّم — مصممة تواصل بصري' : 'Yumna Al-Muallem — Visual Communication Designer'
    return () => { delete document.body.dataset.locale }
  }, [locale])

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() { return useContext(LocaleContext) }
export function useT() {
  const locale = useLocale()
  return (text: string) => locale === 'ar' ? (arabic[text] ?? arabic[text.toUpperCase()] ?? text) : text
}
export function LocalizedText({ children }: { children: string }) {
  const t = useT()
  return <>{t(children)}</>
}

export function useLocalizedPath() {
  const locale = useLocale()
  return (path: string) => localePath(path, locale)
}

const projectDescriptions: Record<string, string> = {
  'VEIL IN MOTION': 'إعلان أزياء تم إنشاؤه بالكامل بالذكاء الاصطناعي لعلامة شالات، يجمع بين الصورة السينمائية، الحركة، الصوت، والسرد في تجربة إعلانية متكاملة.',
  'TAANIQI WITH IMAN': 'متجر أزياء عربي فاخر بهوية راقية\nوتشكيلات مختارة بعناية.',
  EFFERVESCENCE: 'دراسة سينمائية لحركة مشروب تستكشف\nالفقاعات والطاقة والملمس.', FLEURÉ: 'هوية فاخرة لمتجر زهور عبر\nالتغليف ونقاط التواصل.',
  'STILL HUMAN': 'ملصق مفاهيمي عن التواصل\nالإنساني والتعاطف.', 'STRAWBERRY & MILK': 'موقع منتج بصور جريئة\nوتفاعل مرح.',
  'DR. MOUHAMMAD ABOU SHAHIN': 'موقع راقٍ لعيادة أسنان يركّز\nعلى الثقة والوضوح وسهولة الوصول.',
  WAHJ: 'هوية للجمال والعناية تمتد عبر\nالتغليف والبيع والتطبيقات.', 'SECOND LIFE': 'هوية ومكتبة رقمية للمواد\nالمعمارية المستعادة.',
  'AQARATI SYRIA': 'منصة عقارية متعددة اللغات\nمصممة للسوق السوري.', SWIRLÉ: 'هوية مرحة لمتجر مثلجات عبر\nالتغليف والمتجر والمطبوعات.',
  DAMASCUS: 'ملصق مدينة مستوحى من\nالزجاج الملوّن والياسمين.', 'RUMMAN SKINCARE': 'هوية وتغليف لعلامة عناية\nبالبشرة مستوحاة من الرمان.',
}
export function projectDescription(title: string, original: string, locale: Locale) {
  return locale === 'ar' ? (projectDescriptions[title] ?? original) : original
}
