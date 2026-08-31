import { Link, useParams } from 'react-router-dom'

import { aqaratiCaseStudy } from '../data/aqaratiCaseStudy'
import { damascusCaseStudy } from '../data/damascusCaseStudy'
import { drAbouShahinCaseStudy } from '../data/drAbouShahinCaseStudy'
import { fleureCaseStudy } from '../data/fleureCaseStudy'
import { rummanCaseStudy } from '../data/rummanCaseStudy'
import { secondLifeCaseStudy } from '../data/secondLifeCaseStudy'
import { stillHumanCaseStudy } from '../data/stillHumanCaseStudy'
import { strawberryMilkCaseStudy } from '../data/strawberryMilkCaseStudy'
import { swirleCaseStudy } from '../data/swirleCaseStudy'
import { wahjCaseStudy } from '../data/wahjCaseStudy'
import { effervescenceCaseStudy } from '../data/effervescenceCaseStudy'
import AqaratiCaseStudy from './AqaratiCaseStudy'
import CaseStudy from './CaseStudy'
import DamascusCaseStudy from './DamascusCaseStudy'
import DrAbouShahinCaseStudy from './DrAbouShahinCaseStudy'
import FleureCaseStudy from './FleureCaseStudy'
import RummanCaseStudy from './RummanCaseStudy'
import StillHumanCaseStudy from './StillHumanCaseStudy'
import StrawberryMilkCaseStudy from './StrawberryMilkCaseStudy'
import SwirleCaseStudy from './SwirleCaseStudy'
import WahjCaseStudy from './WahjCaseStudy'
import EffervescenceCaseStudy from './EffervescenceCaseStudy'
import { useLocale, useLocalizedPath, useT } from '../i18n/localization'
import { localizeCaseStudy } from '../i18n/caseStudiesArabic'

/**
 * `/work/:slug`. Slugs with a written case study render their own page; every
 * other slug still falls through to the placeholder below, as before.
 */
export default function Project() {
  const { slug } = useParams<{ slug: string }>()
  const locale = useLocale()
  const path = useLocalizedPath()
  const t = useT()
  const localized = <T,>(study: T): T => locale === 'ar' ? localizeCaseStudy(study as never) as T : study

  if (slug === 'effervescence')
    return <EffervescenceCaseStudy caseStudy={localized(effervescenceCaseStudy)} />
  if (slug === 'second-life') return <CaseStudy caseStudy={localized(secondLifeCaseStudy)} />
  if (slug === 'aqarati') return <AqaratiCaseStudy caseStudy={localized(aqaratiCaseStudy)} />
  if (slug === 'dr-mouhammad-abou-shahin')
    return <DrAbouShahinCaseStudy caseStudy={localized(drAbouShahinCaseStudy)} />
  if (slug === 'swirle') return <SwirleCaseStudy caseStudy={localized(swirleCaseStudy)} />
  if (slug === 'rumman') return <RummanCaseStudy caseStudy={localized(rummanCaseStudy)} />
  if (slug === 'wahj') return <WahjCaseStudy caseStudy={localized(wahjCaseStudy)} />
  if (slug === 'still-human') return <StillHumanCaseStudy caseStudy={localized(stillHumanCaseStudy)} />
  if (slug === 'damascus') return <DamascusCaseStudy caseStudy={localized(damascusCaseStudy)} />
  if (slug === 'fleure') return <FleureCaseStudy caseStudy={localized(fleureCaseStudy)} />
  if (slug === 'strawberry-milk')
    return <StrawberryMilkCaseStudy caseStudy={localized(strawberryMilkCaseStudy)} />

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs tracking-[0.3em]" style={{ color: 'var(--color-muted)' }}>
        {t('PROJECT')}
      </p>

      <h1 className="text-3xl tracking-[0.15em] sm:text-4xl">{slug}</h1>

      <p className="text-xs tracking-[0.2em]" style={{ color: 'var(--color-beige)' }}>
        {t('PLACEHOLDER — CONTENT COMING SOON.')}
      </p>

      <Link
        to={path('/')}
        className="text-xs tracking-[0.25em] underline underline-offset-8"
        style={{ color: 'var(--color-purple-light)' }}
      >
        {t('BACK HOME')}
      </Link>
    </main>
  )
}
