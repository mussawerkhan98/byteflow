import Link from 'next/link'
import { getHomeProjects } from '../../lib/db'
import { getHomeBlock } from '../../lib/home-blocks'
import { homePhotos, nthPhoto } from '../../lib/home-photos'
import { projectCard, type ProjectCard } from '../../lib/project-cards'
import { ArrowRight, Button, Check, Eyebrow, Photo, SectionTitle, delay } from './ui'

/** The whole card is the project link: the title's link is stretched over it. */
const stretched = "after:absolute after:inset-0 after:content-['']"

function Meta({ project, light = false }: { project: ProjectCard; light?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${light ? 'text-white/70' : 'text-[var(--hp-muted)]'}`}>
      <span className="font-display tabular-nums">{project.number}</span>
      {project.category && <span className={light ? 'text-[#7fe3ec]' : 'text-[var(--hp-accent)]'}>{project.category}</span>}
      {project.industry && <span className={`hp-pill normal-case tracking-normal ${light ? '!border-white/20 !bg-white/10 !text-white' : ''}`}>{project.industry}</span>}
    </p>
  )
}

/** The lead case study: a large photograph with its results along the foot, the story beside it. */
function Lead({ project }: { project: ProjectCard }) {
  return (
    <article className="group relative grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-reveal="image" className="lg:col-span-7">
        <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:aspect-[16/12]">
          <Photo slot={nthPhoto(homePhotos.work, 0)} sizes="(min-width: 1024px) 56vw, 100vw" zoom />
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

      <div data-reveal style={delay(120)} className="flex flex-col justify-center lg:col-span-5">
        <Meta project={project} />
        <h3 className="hp-h3-lg mt-5">
          <Link href={project.href} className={stretched}>
            {project.title}
          </Link>
        </h3>
        {project.requirement && <p className="mt-4 text-[16.5px] leading-relaxed text-[var(--hp-body)]">{project.requirement}</p>}
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
          View case study
          <ArrowRight className="hp-arrow h-4 w-4" />
        </span>
      </div>
    </article>
  )
}

function Small({ project, index }: { project: ProjectCard; index: number }) {
  const [headline] = project.metrics
  return (
    <div data-reveal style={delay(index * 120)} className="h-full">
      <article className="hp-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]">
        <figure data-reveal="image" className="relative m-2 aspect-[16/11] overflow-hidden rounded-[1.35rem]">
          <Photo slot={nthPhoto(homePhotos.work, index + 1)} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 90vw" zoom />
          {headline && (
            <p className="hp-glass absolute bottom-3 left-3 rounded-xl px-3.5 py-2.5">
              <span className="block font-display text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{headline.value}</span>
              <span className="mt-1 block text-[12px] text-[var(--hp-body)]">{headline.label}</span>
            </p>
          )}
        </figure>
        <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
          <Meta project={project} />
          <h3 className="mt-3 line-clamp-2 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">
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

/**
 * Selected work: up to four real projects from /projects, picked on the
 * admin's Projects screen. The first is the lead case study; the others sit
 * beneath it. The photographs are representative scenes (home-photos.ts),
 * never presented as pictures of the client's own site. Hidden with no
 * published projects.
 */
export default async function HomeWork() {
  const [projects, block] = await Promise.all([getHomeProjects(), getHomeBlock('home_work')])
  if (!projects.length) return null
  const copy = block.fields
  const [lead, ...rest] = projects.map((project, index) => projectCard(project, index))

  return (
    <section aria-labelledby="work-title" className="hp-section hp-tinted">
      <div className="page-container">
        <header data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="work-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          <div className="lg:max-w-sm lg:pb-1.5">
            {copy.intro && <p className="hp-lead">{copy.intro}</p>}
            <Button href={copy.link || '/projects'} variant="ghost" className="mt-6">
              {copy.link_label}
            </Button>
          </div>
        </header>

        <div className="mt-14 lg:mt-20">
          <Lead project={lead} />
        </div>

        {rest.length > 0 && (
          <ul className={`mt-14 grid gap-6 lg:mt-20 ${rest.length === 1 ? '' : rest.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {rest.map((project, i) => (
              <li key={project.slug}>
                <Small project={project} index={i} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
