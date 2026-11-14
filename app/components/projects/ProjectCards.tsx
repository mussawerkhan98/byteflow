import Link from 'next/link'
import type { PhotoSlot } from '../../lib/home-photos'
import type { ProjectCard } from '../../lib/project-cards'
import { ArrowRight, Check, Photo, delay } from '../home/ui'

/*
 * The project cards shared by the home page's Selected work and the
 * Projects page: the lead case study and the smaller cards beneath it.
 * Each takes its picture, so the home page can show representative scenes
 * and the Projects page each project's own.
 */

/** The whole card is the project link: the title's link is stretched over it. */
const stretched = "after:absolute after:inset-0 after:content-['']"

export function ProjectMeta({ project, year, numbered = true }: { project: ProjectCard; year?: string; numbered?: boolean }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">
      {numbered && <span className="font-display tabular-nums">{project.number}</span>}
      {project.category && <span className="text-[var(--hp-accent)]">{project.category}</span>}
      {project.industry && <span className="hp-pill normal-case tracking-normal">{project.industry}</span>}
      {year && <span className="font-display tabular-nums">{year}</span>}
    </p>
  )
}

/** The lead case study: a large photograph with its results along the foot, the story beside it. */
export function ProjectLead({ project, photo, linkLabel, priority = false }: { project: ProjectCard; photo: PhotoSlot; linkLabel: string; priority?: boolean }) {
  return (
    <article className="group relative grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-reveal="image" className="lg:col-span-7">
        <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:aspect-[16/10]">
          <Photo slot={photo} sizes="(min-width: 1024px) 56vw, 100vw" priority={priority} zoom />
        </figure>
        {project.metrics.length > 0 && (
          <dl className="hp-band hp-band-inline relative z-10 mx-3 -mt-14 grid grid-cols-3 overflow-hidden rounded-2xl sm:mx-6 sm:-mt-16">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="hp-band-cell flex flex-col p-4 sm:p-6">
                <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-[var(--hp-body)] sm:text-[13.5px]">{metric.label}</dt>
                <dd className="hp-stat order-1 !text-[1.75rem] sm:!text-[2.5rem]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Starts level with the top of the photograph. */}
      <div data-reveal style={delay(120)} className="flex flex-col lg:col-span-5 lg:pt-3">
        <ProjectMeta project={project} />
        <h3 className="hp-h3-lg mt-5">
          <Link href={project.href} className={stretched}>
            {project.title}
          </Link>
        </h3>
        {project.requirement && <p className="hp-lead mt-4">{project.requirement}</p>}
        {project.scope.length > 0 && (
          <ul className="mt-6 grid gap-2.5" aria-label="Byteflow scope">
            {project.scope.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-[var(--hp-ink)]">
                <span className="hp-tick mt-px">
                  <Check />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services used">
            {project.tags.map((tag) => (
              <li key={tag} className="hp-pill">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <span aria-hidden="true" className="hp-textlink mt-8">
          {linkLabel}
          <ArrowRight className="hp-arrow h-4 w-4" />
        </span>
      </div>
    </article>
  )
}

/** A smaller card: the photograph with the headline result on it, then the story. */
export function ProjectTile({ project, photo, index }: { project: ProjectCard; photo: PhotoSlot; index: number }) {
  const [headline] = project.metrics
  return (
    <div data-reveal style={delay((index % 3) * 120)} className="h-full">
      <article className="hp-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]">
        <figure data-reveal="image" className="relative m-2 aspect-[16/11] overflow-hidden rounded-[1.35rem]">
          <Photo slot={photo} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 90vw" zoom />
          {headline && (
            <p className="hp-glass absolute bottom-3 left-3 rounded-xl px-3.5 py-2.5">
              <span className="block font-display text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{headline.value}</span>
              <span className="mt-1 block text-[12px] text-[var(--hp-body)]">{headline.label}</span>
            </p>
          )}
        </figure>
        <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
          <ProjectMeta project={project} />
          <h3 className="mt-3 line-clamp-2 font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-[var(--hp-ink)]">
            <Link href={project.href} className={stretched}>
              {project.title}
            </Link>
          </h3>
          {project.requirement && <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-[var(--hp-body)]">{project.requirement}</p>}
          {project.tags.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Services used">
              {project.tags.map((tag) => (
                <li key={tag} className="hp-pill">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </div>
  )
}
