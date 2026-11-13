'use client'

import { useState, type ReactNode } from 'react'
import type { PhotoSlot } from '../../lib/home-photos'
import type { ProjectCard } from '../../lib/project-cards'
import { ProjectLead, ProjectTile } from './ProjectCards'

export type BrowsedProject = { card: ProjectCard; photo: PhotoSlot; featured: boolean }

/**
 * The Projects page's work: a chip per service along the top (with how many
 * projects each has), then the lead case study, the featured project of
 * the ones shown or else the first, and the rest as cards beneath it.
 * Every project is in the page as first served, so search engines read them
 * all; the chips only narrow what is shown.
 */
export default function ProjectsBrowser({
  heading,
  projects,
  filters,
  labels,
}: {
  /** The section's heading, above the chips. */
  heading: ReactNode
  projects: BrowsedProject[]
  filters: { category: string; count: number }[]
  labels: { filter: string; all: string; empty: string; link: string }
}) {
  const [active, setActive] = useState('')
  const shown = active ? projects.filter((project) => project.card.category === active) : projects
  const lead = shown.find((project) => project.featured) ?? shown[0]
  const rest = shown.filter((project) => project !== lead)
  const chips = [{ category: '', label: labels.all, count: projects.length }, ...filters.map((filter) => ({ ...filter, label: filter.category }))]

  return (
    <>
      <div className="flex flex-col gap-8">
        {heading}
        {filters.length > 1 && (
          <div role="group" aria-label={labels.filter} className="hp-scroller -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {chips.map((chip) => {
              const on = chip.category === active
              return (
                <button
                  key={chip.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(chip.category)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                    on
                      ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] text-[var(--hp-ink)] shadow-[var(--hp-shadow)]'
                      : 'border-[var(--hp-line)] bg-transparent text-[var(--hp-body)] hover:border-[var(--hp-line-strong)] hover:bg-[var(--hp-card)] hover:text-[var(--hp-ink)]'
                  }`}
                >
                  {chip.label}
                  <span className={`text-[12px] tabular-nums ${on ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`}>{chip.count}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Keyed by the chip, so a new selection fades in afresh. */}
      <div key={active} aria-live="polite" className="menu-preview-in mt-10 lg:mt-14">
        {lead ? (
          <>
            <ProjectLead project={lead.card} photo={lead.photo} linkLabel={labels.link} />
            {rest.length > 0 && (
              <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                {rest.map((project, i) => (
                  <li key={project.card.slug}>
                    <ProjectTile project={project.card} photo={project.photo} index={i} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="hp-band rounded-[1.5rem] p-10 text-center text-[16px] text-[var(--hp-body)]">{labels.empty}</p>
        )}
      </div>
    </>
  )
}
