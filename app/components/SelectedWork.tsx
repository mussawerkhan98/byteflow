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

const termClass = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-nav)]'

function Card({ project }: { project: ProjectCard }) {
  const { image } = project
  return (
    // The whole card is the "View project" link (stretched over it below).
    <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-surface)] p-2.5 transition-[border-color,box-shadow] duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-card)] sm:p-3">
      {/* The visual: the card picture, or the navy panel with a ghost number. */}
      <div className="relative isolate flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-[1.25rem] bg-[#0f1b27] p-5 text-white sm:p-7">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={675}
            loading="lazy"
            sizes="(min-width: 1024px) 45vw, 100vw"
            unoptimized={!image.src.startsWith('/')}
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {image ? (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,27,39,0.55)_0%,rgba(15,27,39,0)_40%,rgba(15,27,39,0.6)_100%)]" />
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_75%)]" />
              <div className="absolute -right-28 -top-28 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.28),transparent)]" />
            </>
          )}
        </div>

        <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7fe3ec]">
          <span>{project.number}</span>
          {project.category && (
            <>
              <span aria-hidden="true" className="h-px w-5 bg-current opacity-60" />
              {project.category}
            </>
          )}
        </p>

        <div className="flex items-end justify-between gap-5">
          {!image && (
            <p
              aria-hidden="true"
              className="-mb-3 bg-[linear-gradient(180deg,rgba(127,227,236,0.34),rgba(127,227,236,0.04))] bg-clip-text font-display text-[6.5rem] font-semibold leading-none tracking-[-0.06em] text-transparent sm:-mb-4 sm:text-[9rem]"
            >
              {project.number}
            </p>
          )}
          <span
            aria-hidden="true"
            className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-12 sm:w-12"
          >
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
          <span className="service-tab-icon rounded-full bg-[rgba(44,205,222,0.12)] px-2.5 py-0.5 font-semibold">Client project</span>
          {project.industry && <span className="text-[var(--text-nav)]">{project.industry}</span>}
        </p>
        <h3 className="mt-3 text-balance font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.5rem]">
          {project.title}
        </h3>

        <dl className="mt-6 space-y-5">
          {project.requirement && (
            <div>
              <dt className={termClass}>Business requirement</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-[var(--text-body)]">{project.requirement}</dd>
            </div>
          )}
          {project.scope.length > 0 && (
            <div>
              <dt className={termClass}>Byteflow scope</dt>
              <dd className="mt-2.5">
                <ul className="space-y-2">
                  {project.scope.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-[var(--text-primary)]">
                      <span className="service-tab-icon mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(44,205,222,0.14)]">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services used">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[12.5px] text-[var(--text-body)]">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-7">
          <Link
            href={project.href}
            className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--text-primary)] underline-offset-4 after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] group-hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#2CCDDE] focus-visible:after:outline-solid"
          >
            View project<span className="sr-only">: {project.title}</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/**
 * Selected Work: up to four real projects from /projects, picked and ordered
 * on the admin's Projects screen ("Feature on homepage"). Hidden when none are
 * featured.
 */
export default async function SelectedWork() {
  const [projects, block] = await Promise.all([getHomeProjects(), getHomeBlock('home_work')])
  if (!projects.length) return null
  const copy = block.fields
  const cards = projects.map((project, index) => projectCard(project, index))

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

        <ul className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-2 lg:gap-6">
          {cards.map((project) => (
            <li key={project.slug}>
              <Card project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
