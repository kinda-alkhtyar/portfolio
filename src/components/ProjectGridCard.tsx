import { Link } from 'react-router-dom'

import type { WorkProject } from '../data/workProjects'
import { projectDescription, useLocale, useLocalizedPath, useT } from '../i18n/localization'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" className="size-[15px] fill-none stroke-current" strokeWidth="1.2">
      <path d="M4 14 14 4M6 4h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProjectGridCard({ project, featured = false }: { project: WorkProject; featured?: boolean }) {
  const locale = useLocale()
  const path = useLocalizedPath()
  const t = useT()
  const portraitVideo = featured && project.slug === 'effervescence'
  const containedVideo = project.slug === 'veil-in-motion'
  return (
    /* `data-tier` is motion weight only: `workMotion` reads it to pick the
       card's reveal phrasing, its arrival depth and its tilt ceiling. Nothing
       visual on this card branches on it. */
    <article
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      data-motion="card"
      data-featured={featured || undefined}
      data-tier={project.tier ?? 'support'}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[11px] border border-white/15 bg-[#171020] ${featured ? 'row-span-2' : ''}`}
    >
      {/* The whole card is the link, laid over the content rather than
          wrapped around it: the grid item, the hover `group` and the
          `data-motion="card"` hook all stay on the article, so the reveal,
          tilt and cover parallax are untouched. Projects without a case
          study page carry no slug and stay non-clickable. */}
      {project.slug && (
        <Link
          to={path(`/work/${project.slug}`)}
          aria-label={locale === 'ar' && (project.slug === 'taaniqi' || containedVideo) ? `عرض دراسة حالة ${t(project.title)}` : `View the ${project.title} case study`}
          className="absolute inset-0 z-10 rounded-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-light"
        />
      )}

      <div className={`relative shrink-0 overflow-hidden border-b border-white/10 ${featured ? 'h-[368px]' : 'h-[140px]'}`}>
        {/* The reveal animates this wrapper; the pointer parallax animates the
            image inside it, so the two never write to the same element's
            transform. The image carries no hover transition of its own — its
            scale and drift are driven together from `workMotion`, which is
            what keeps the parallax inside the headroom that scale creates. */}
        <div data-motion="card-media" className="size-full">
          {project.media === 'video' ? (
            <video
              data-motion={portraitVideo || containedVideo ? undefined : 'card-image'}
              src={project.cover}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className={portraitVideo ? 'mx-auto h-full aspect-[9/16] max-w-full object-contain object-center' : containedVideo ? 'size-full object-contain object-center' : 'size-full object-cover will-change-transform'}
              style={portraitVideo ? undefined : { objectPosition: project.position }}
            />
          ) : (
            <img
              data-motion="card-image"
              src={project.cover}
              alt=""
              className="size-full object-cover will-change-transform"
              style={{ objectPosition: project.position }}
            />
          )}
        </div>
        <span className="absolute left-[15px] top-[15px] rounded-full border border-beige/60 bg-bg/45 px-[13px] py-[5px] font-nav text-[10px] tracking-[0.08em] text-beige backdrop-blur-sm">
          {t(project.categoryLabel ?? project.category)}
        </span>
      </div>

      <div className={`relative flex min-h-0 flex-1 flex-col px-[16px] pb-[12px] ${featured ? 'pt-[13px]' : 'pt-[10px]'}`}>
        <p className="font-nav text-[10px] tracking-[0.13em] text-purple-light">{project.year}</p>
        <h2 className={`font-display leading-none tracking-[0.01em] text-white ${featured ? 'mt-[7px] text-[19px]' : 'mt-[4px] text-[17px]'}`}>
          {t(project.title)}
        </h2>
        <p className={`whitespace-pre-line pr-[46px] text-[11px] leading-[1.45] text-muted ${featured ? 'mt-[8px]' : 'mt-[5px]'}`}>
          {projectDescription(project.title, project.description, locale)}
        </p>
        <span className="absolute bottom-[13px] right-[16px] flex size-[34px] items-center justify-center rounded-full border border-white/55 text-white transition-colors duration-300 group-hover:border-purple-light group-hover:text-purple-light">
          <span className="block transition-transform duration-[450ms] ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px]">
            <ArrowIcon />
          </span>
        </span>
      </div>
    </article>
  )
}
