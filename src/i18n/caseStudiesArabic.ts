import type { CaseStudy, CaseStudySection } from '../data/secondLifeCaseStudy'

const categories: Record<string, string> = {
  'Brand Identity': 'الهوية البصرية', 'Graphic Design': 'التصميم الجرافيكي',
  'UI/UX Design': 'تصميم UI/UX', 'AI Video / Motion': 'فيديو وحركة بالذكاء الاصطناعي',
}

const meta: Record<string, { subtitle: string; intro: string }> = {
  effervescence: { subtitle: 'دراسة حركة تجارية', intro: 'دراسة سينمائية لحركة مشروب تستكشف الفقاعات والطاقة والملمس والسرد البصري المنطلق من المنتج.' },
  fleure: { subtitle: 'متجر زهور فاخر', intro: 'هوية لمتجر زهور تقوم على شعار رقيق وخطوط مستوحاة من الورد ولوحة ألوان هادئة من العاجي والوردي والميرمية.' },
  'still-human': { subtitle: 'ملصق مفاهيمي', intro: 'ملصق مفاهيمي عن التواصل الإنساني والتعاطف؛ فكرة واحدة تختصر أن إنسانيتنا تظهر في حمايتنا لبعضنا.' },
  'strawberry-milk': { subtitle: 'موقع منتج', intro: 'تصور مشرق لموقع مكتبي يجمع صور المنتج الكبيرة مع واجهة مباشرة وخفيفة.' },
  'dr-mouhammad-abou-shahin': { subtitle: 'عيادة أسنان — فيينا', intro: 'تجربة رقمية هادئة لعيادة أسنان، صُممت لبناء الثقة وتوضيح الخدمات وتسهيل وصول المرضى.' },
  wahj: { subtitle: 'الجمال والعناية', intro: 'هوية أنثوية دافئة لخدمات الجمال والعناية، تجمع الذهبي والوردي ضمن نظام واضح للتغليف ونقاط التواصل.' },
  'second-life': { subtitle: 'مكتبة مواد', intro: 'هوية بصرية ومكتبة رقمية لمواد العمارة المستعادة؛ توثّق المواد وتعيد توزيعها لتواصل حياتها في مشاريع جديدة.' },
  aqarati: { subtitle: 'منصة عقارية', intro: 'منصة عقارية متعددة اللغات للسوق السوري، تجمع العقارات والمواقع والأسعار في واجهة تعمل بأربع لغات واتجاهي كتابة.' },
  swirle: { subtitle: 'سعادة مصنوعة يدويًا', intro: 'هوية مرحة لمتجر مثلجات تمتد عبر التغليف والمتجر والمطبوعات، وتبني حضورها على حركة لولبية ولوحة من خمسة ألوان.' },
  damascus: { subtitle: 'مدينة الياسمين', intro: 'ملصق مصوّر لدمشق يستلهم الزجاج الملوّن والياسمين وذاكرة المدينة البصرية.' },
  rumman: { subtitle: 'عناية بالبشرة بالرمان', intro: 'توجه للهوية والتغليف لعلامة عناية بالبشرة مستوحاة من الرمان ولونه وتفاصيله الزخرفية.' },
}

const titles: Record<string, string> = {
  'Materials with a past.': 'مواد تحمل ماضيًا.', 'Built like an archive, not a catalogue.': 'مصمّمة كأرشيف، لا ككتالوج.',
  'Every material has a passport.': 'لكل مادة جواز.', 'Search by character, not by product.': 'ابحث بالخصائص، لا بالمنتج.',
  'The system leaves the screen.': 'النظام يتجاوز الشاشة.', 'Handle with history.': 'تعامَل معها بما يليق بتاريخها.',
  'Your next home starts here.': 'منزلك القادم يبدأ هنا.', 'One layout, four languages, two directions.': 'تخطيط واحد، أربع لغات، واتجاهان.',
  'Buy, rent, or stay.': 'شراء أو إيجار أو إقامة.', 'Search the country, not a dropdown.': 'ابحث في البلد، لا في قائمة.',
  'Two doors, one platform.': 'مدخلان، منصة واحدة.', 'More than a property platform.': 'أكثر من منصة عقارية.',
  'Precision, designed around comfort.': 'دقة تتمحور حول الراحة.', 'Dental care, clearly explained.': 'عناية أسنان بشرح واضح.',
  'Care begins with trust.': 'العناية تبدأ بالثقة.', 'Everything you need before your visit.': 'كل ما تحتاجه قبل زيارتك.',
  'Let’s plan your visit.': 'لنخطط لزيارتك.', 'Handcrafted happiness.': 'سعادة مصنوعة يدويًا.',
  'One gesture, five colours.': 'حركة واحدة، خمسة ألوان.', 'Everything a scoop touches.': 'هوية تمتد إلى كل تفصيل.',
  'The whole shop, in one palette.': 'المتجر كله ضمن لوحة واحدة.', 'Named for the fruit.': 'اسم مستوحى من الثمرة.',
  'Ornament, not illustration.': 'زخرفة، لا رسم توضيحي.', 'The label, at arm’s length.': 'ملصق واضح من النظرة الأولى.',
  'Gold on blush.': 'ذهبي فوق الوردي.', 'One line, drawn like a signature.': 'خط واحد مرسوم كتوقيع.',
  'Frosted glass, gold foil.': 'زجاج مصنفر ورقائق ذهبية.', 'What leaves with the client.': 'ما يغادر مع العميل.',
  'One red umbrella.': 'مظلة حمراء واحدة.', 'A city rendered in glass.': 'مدينة مرسومة بالزجاج.',
  'One mark across every touchpoint.': 'علامة واحدة عبر كل نقطة تواصل.', 'The product leads the page.': 'المنتج يقود الصفحة.',
  'A practical second screen.': 'شاشة ثانية عملية.',
}

const eyebrows: Record<string, string> = {
  'Case study': 'دراسة حالة', Identity: 'الهوية', Concept: 'الفكرة', Platform: 'المنصة', Applications: 'التطبيقات',
  Closing: 'الخاتمة', Localisation: 'التوطين', Search: 'البحث', Discovery: 'الاستكشاف', Accounts: 'الحسابات',
  Trust: 'الثقة', Interaction: 'التفاعل', Information: 'المعلومات', Conversion: 'التحويل', Poster: 'الملصق',
  Packaging: 'التغليف', Product: 'المنتج', 'Identity system': 'نظام الهوية', Home: 'الرئيسية', Contact: 'التواصل',
}

const sectionCopy: Record<string, string[]> = {
  hero: ['يقدّم المشروع فكرته الأساسية من اللحظة الأولى، ويحوّل التحدي إلى تجربة بصرية واضحة ومتماسكة.', 'بُني الحل حول تسلسل بصري مدروس يوازن بين الشخصية والوضوح وسهولة الاستخدام.'],
  'brand-identity': ['تجمع الهوية بين علامة مميزة ونظام طباعي ولوني مرن يعمل بثبات عبر المقاسات والتطبيقات المختلفة.', 'تحافظ القواعد البصرية على وضوح المعلومات، فيما تمنح التفاصيل المشروع شخصية يمكن تمييزها فورًا.'],
  'material-passport': ['يقوم النظام على سجل ثابت يرافق كل مادة ويوثّق أصلها وحالتها وقياساتها وقيمتها البيئية بترتيب واضح.', 'تستخدم النسخة المطبوعة والواجهة الرقمية الشبكة نفسها، ليبقى الانتقال بين المادة الفعلية وسجلها سلسًا.'],
  'digital-archive': ['الأرشيف هو قلب المنتج؛ تتيح المرشحات الوصول إلى المواد حسب النوع والمنشأ والعمر والحالة والتوفر.', 'تجمع المجموعات المواد بحسب السياق والحقبة والسطح، بما يوافق طريقة بحث المعماريين.', 'توثّق المشاريع المنجزة كيف عادت المواد إلى الاستخدام وتحوّل المنصة إلى دليل حي على نجاح الفكرة.'],
  applications: ['يتكيّف النظام مع السطح والتطبيق، من الملصقات والبطاقات إلى العبوات والواجهات، مع بقاء الشبكة والهوية ثابتتين.', 'تعمل التفاصيل المطبوعة والرقمية كعائلة واحدة وتحافظ على الوضوح في كل حجم وسياق.'],
  closing: ['يختصر المشهد الختامي قيمة المشروع ويجمع عناصره في صورة واحدة واضحة، واثقة وقابلة للتذكر.'],
  localisation: ['تعمل المنصة بالعربية والإنجليزية والتركية والألمانية لتخدم جمهورًا يقرأ ويتعامل بلغات مختلفة.', 'عند تبديل اللغة يتغير اتجاه الشبكة والواجهة كاملة، مع الحفاظ على التسلسل والوضوح في RTL وLTR.'],
  search: ['يجمع شريط واحد نية البحث والموقع والنوع والسعر، ثم يترك للنتائج أن تقود التجربة.', 'تُبقي البطاقات المعلومات الأساسية في المقدمة من دون تشتيت أو تراتبية مصطنعة.'],
  discovery: ['تحوّل الخريطة المناطق إلى مدخل بصري مباشر للبحث وتعرض عدد النتائج المتاحة بوضوح.', 'كما تكشف التغطية الفعلية للمنصة بصدق عندما لا تتوفر نتائج في منطقة ما.'],
  accounts: ['تخدم المنصة الأفراد والمكاتب من نقطة دخول واحدة، ثم تخصّص المسار بعد تسجيل الدخول.', 'يحافظ تقسيم الشاشة على حضور العلامة بينما تبقى المهمة بسيطة وواضحة.'],
  trust: ['تضع التجربة الثقة والشفافية في المركز، وتشرح الالتزامات والخدمات بلغة مباشرة يسهل فهمها.', 'يدعم المحتوى والصور والهيكل قرار المستخدم من أول استفسار حتى الخطوة التالية.'],
  interaction: ['تشرح الواجهة الخدمات بلغة مبسطة وتستخدم الحركة بعناية لتوجيه الانتباه من دون إرباك.', 'يبقى المحتوى الطبي واضحًا ومطمئنًا مع مسارات وصول مباشرة إلى التفاصيل المهمة.'],
  information: ['تجمع الصفحة المعلومات العملية التي يحتاجها المريض قبل الزيارة ضمن أقسام قصيرة وسهلة المسح.', 'تقلل البنية الواضحة التردد وتساعد المستخدم على الاستعداد بثقة.'],
  conversion: ['تجعل صفحة التواصل حجز الموعد خطوة طبيعية، مع خيارات واضحة ونموذج موجز.', 'تحافظ الدعوة إلى الإجراء على نبرة هادئة ومتسقة مع تجربة العيادة.'],
  poster: ['تُبنى الفكرة حول عنصر بصري واحد يقطع النمط المحيط ويمنح الملصق معناه الإنساني.', 'يستخدم التكوين التكرار والتباين واللون المحدود لصناعة قراءة مباشرة وقوية.', 'توحّد الخطوط والحركة سطح الملصق، بينما يصنع الاستثناء مركزه العاطفي.'],
  packaging: ['ينتقل نظام الهوية إلى العبوات بمواد ولمسات مدروسة تحافظ على حضور العلامة عند الأحجام الصغيرة.', 'تُختصر العناصر عند الحاجة كي يبقى المنتج واضحًا وأنيقًا على الرف.'],
  product: ['يُظهر التطبيق المنتج من مسافة الاستخدام الفعلية، مع ترتيب واضح للمعلومات ولمسة زخرفية متوازنة.'],
  home: ['تمنح الشاشة الرئيسية المنتج المساحة الأكبر، وتدعمه بعنوان موجز وتنقل خفيف ودعوات واضحة إلى الإجراء.'],
  contact: ['تحافظ شاشة التواصل على الألوان والبنية الهوائية نفسها، وتجمع الخيارات والنموذج والصورة في تكوين واضح.'],
  'identity-system': ['تظهر الهوية متسقة عبر التغليف والحقائب والبطاقات والمطبوعات والواجهة، من دون أن تنافس المنتج نفسه.', 'يحافظ الخط الذهبي والطباعة الهادئة على الوضوح ويتركان للزهور مركز المشهد.'],
}

const labels: Record<string, string> = { Type: 'النوع', Sector: 'القطاع', Year: 'السنة', Deliverables: 'المخرجات', Role: 'الدور', Scope: 'النطاق', Client: 'العميل' }

function localizeSection(section: CaseStudySection): CaseStudySection {
  const copy = sectionCopy[section.id] ?? sectionCopy[section.eyebrow.toLowerCase()] ?? sectionCopy.hero
  return {
    ...section,
    eyebrow: eyebrows[section.eyebrow] ?? section.eyebrow,
    title: titles[section.title] ?? section.title,
    body: section.body.map((_, index) => copy[index] ?? copy[copy.length - 1]),
    images: section.images.map((image) => ({ ...image, caption: image.caption ? 'عرض من تطبيقات المشروع.' : undefined, alt: `عرض بصري من مشروع ${image.file}` })),
  }
}

export function localizeCaseStudy(caseStudy: CaseStudy): CaseStudy {
  const localizedMeta = meta[caseStudy.meta.slug]
  return {
    ...caseStudy,
    meta: {
      ...caseStudy.meta,
      subtitle: localizedMeta?.subtitle ?? caseStudy.meta.subtitle,
      category: categories[caseStudy.meta.category] ?? caseStudy.meta.category,
      intro: localizedMeta?.intro ?? caseStudy.meta.intro,
      facts: caseStudy.meta.facts.map((fact) => ({ ...fact, label: labels[fact.label] ?? fact.label, value: translateFact(fact.value) })),
    },
    sections: caseStudy.sections.map(localizeSection),
  }
}

function translateFact(value: string) {
  return value
    .replace(/Brand identity/gi, 'هوية بصرية').replace(/Graphic design/gi, 'تصميم جرافيكي')
    .replace(/UI\/UX design/gi, 'تصميم UI/UX').replace(/Web platform/gi, 'منصة ويب')
    .replace(/Packaging/gi, 'تغليف').replace(/Website/gi, 'موقع إلكتروني')
    .replace(/Digital product/gi, 'منتج رقمي').replace(/Architecture/gi, 'عمارة')
}
