import Image from 'next/image'
import Link from 'next/link'
import { getHomeProjects } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { projectCard, type ProjectCard } from '../lib/project-cards'
import { ArrowUpRightIcon } from './InlineIcons'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The whole card is the project link: the title's link is stretched over it. */
const stretched = "after:absolute after:inset-0 after:rounded-[2rem] after:content-['']"

/**
 * The first project as the lead case study: a navy panel with the story on
 * the left and its results, large, on the right.
 */
function LeadCase({ project }: { project: ProjectCard }) {
  const { image } = project
  return (
    <article className="group relative isolate grid overflow-hidden rounded-[2rem] bg-[#0f1b27] text-white shadow-[0_50px_100px_-50px_rgba(15,27,39,0.7)] lg:grid-cols-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.22),transparent)]" />
        <div className="absolute -bottom-48 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.16),transparent)]" />
      </div>

      <div className="flex flex-col p-7 sm:p-10 lg:col-span-7 lg:p-14">
        <p className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7fe3ec]">
          <span className="font-display tabular-nums text-white/50">{project.number}</span>
          <span aria-hidden="true" className="h-px w-6 bg-white/25" />
          {project.category && <span>{project.category}</span>}
          {project.industry && <span className="rounded-full border border-white/15 px-2.5 py-0.5 normal-case tracking-normal text-white/70">{project.industry}</span>}
        </p>

        <h3 className="mt-6 max-w-2xl text-balance font-display text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
          <Link href={project.href} className={stretched}>
            {project.title}
          </Link>
        </h3>
        {project.requirement && <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/70">{project.requirement}</p>}

        {project.scope.length > 0 && (
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2" aria-label="Byteflow scope">
            {project.scope.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-white/90">
                <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A]">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-5 pt-10">
          {project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Services used">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-white/[0.07] px-3 py-1 text-[12.5px] text-white/80">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <span aria-hidden="true" className="inline-flex items-center gap-3 rounded-full bg-[#2CCDDE] py-2 pl-5 pr-2 text-[14.5px] font-semibold text-[#04121A]">
            View case study
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE] transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col border-t border-white/10 lg:col-span-5 lg:border-l lg:border-t-0">
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:flex-1">
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={750}
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, 100vw"
              unoptimized={!image.src.startsWith('/')}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
            />
          </div>
        )}
        {project.metrics.length > 0 ? (
          <dl className={`grid ${image ? 'grid-cols-3' : 'h-full grid-rows-3'}`}>
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`flex flex-col justify-center border-white/10 ${image ? 'border-l p-5 first:border-l-0 sm:p-7' : 'border-t px-7 py-5 first:border-t-0 sm:px-10 sm:py-7 lg:px-12'}`}
              >
                <dt className="order-2 mt-1.5 text-[13.5px] leading-snug text-white/60">{metric.label}</dt>
                <dd
                  className={`order-1 bg-[linear-gradient(100deg,#7fe3ec,#46A3E1)] bg-clip-text font-display font-semibold leading-none tracking-[-0.04em] text-transparent ${image ? 'text-[1.75rem] sm:text-[2.25rem]' : 'text-[2.75rem] sm:text-[3.5rem]'}`}
                >
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          !image && (
            <p aria-hidden="true" className="grid flex-1 place-items-center bg-[linear-gradient(180deg,rgba(127,227,236,0.3),rgba(127,227,236,0.03))] bg-clip-text p-10 font-display text-[9rem] font-semibold leading-none tracking-[-0.06em] text-transparent">
              {project.number}
            </p>
          )
        )}
      </div>
    </article>
  )
}

/** The other projects: a lighter card that leads with the headline result. */
function CaseCard({ project }: { project: ProjectCard }) {
  const { image } = project
  const [headline] = project.metrics
  return (
    <article className="group relative flex h-full flex-col rounded-[2rem] border border-[var(--border-default)] bg-[var(--bg-surface)] p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#2CCDDE]/60 hover:shadow-[0_30px_60px_-30px_rgba(15,27,39,0.35)] motion-reduce:transition-none sm:p-8">
      {image && (
        <div className="-mx-3 -mt-3 mb-7 aspect-[16/9] overflow-hidden rounded-[1.4rem] sm:-mx-4 sm:-mt-4">
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={450}
            loading="lazy"
            sizes="(min-width: 1024px) 30vw, 100vw"
            unoptimized={!image.src.startsWith('/')}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em]">
          <span className="font-display tabular-nums text-[var(--text-nav)]">{project.number}</span>
          <span aria-hidden="true" className="h-px w-5 bg-[var(--border-strong)]" />
          <span className="process-accent truncate">{project.category}</span>
        </p>
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-300 group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A]"
        >
          <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none" />
        </span>
      </div>

      {headline && (
        <p className="mt-7">
          <span className="process-accent block font-display text-[2.75rem] font-semibold leading-none tracking-[-0.04em] sm:text-[3.25rem]">{headline.value}</span>
          <span className="mt-2 block text-[13.5px] text-[var(--text-body)]">{headline.label}</span>
        </p>
      )}

      <h3 className="mt-6 text-balance font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.375rem]">
        <Link href={project.href} className={stretched}>
          {project.title}
        </Link>
      </h3>
      {project.industry && <p className="mt-2 text-[13.5px] text-[var(--text-nav)]">{project.industry}</p>}
      {project.requirement && <p className="mt-4 line-clamp-3 text-[14.5px] leading-relaxed text-[var(--text-body)]">{project.requirement}</p>}

      {project.tags.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="Services used">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[12px] text-[var(--text-body)]">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/**
 * Selected Work: up to four real projects from /projects, picked and ordered
 * on the admin's Projects screen ("Feature on homepage"); with none picked,
 * the first four published. The first is the lead case study, the rest sit
 * in a row beneath it. Hidden when there are no published projects.
 */
export default async function SelectedWork() {
  const [projects, block] = await Promise.all([getHomeProjects(), getHomeBlock('home_work')])
  if (!projects.length) return null
  const copy = block.fields
  const [lead, ...rest] = projects.map((project, index) => projectCard(project, index))

  return (
    <section aria-labelledby="work-title" className="border-t border-[var(--border-default)] py-20 sm:py-24 lg:py-32">
      <div className="page-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            <h2
              id="work-title"
              className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]"
            >
              {copy.heading}{' '}
              <span className="text-[var(--ink-soft)]">{copy.heading_soft}</span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:pb-1.5">
            {copy.intro && <p className="text-[16.5px] leading-relaxed text-[var(--text-body)]">{copy.intro}</p>}
            <Link
              href={copy.link || '/projects'}
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[#2CCDDE] hover:bg-[rgba(44,205,222,0.08)]"
            >
              {copy.link_label}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <LeadCase project={lead} />
          {rest.length > 0 && (
            <ul className={`mt-5 grid gap-5 lg:mt-6 lg:gap-6 ${rest.length === 1 ? '' : rest.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {rest.map((project) => (
                <li key={project.slug}>
                  <CaseCard project={project} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
