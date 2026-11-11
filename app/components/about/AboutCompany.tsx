import type { HomeBlock } from '../../lib/home-content'
import { Check, Eyebrow, SectionTitle, delay } from '../home/ui'

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}

/**
 * Company information: the heading and what stands behind the work as a
 * ticked list on the left, and the registered details on a registration
 * card on the right, two to a row. These are what a reader (or a search
 * engine judging experience, expertise, authoritativeness and trust) needs
 * to confirm this is a real, locatable business. Edited as "Company
 * information" on the admin's About page sections; the details have to
 * match the Organization markup in the admin's "Address" script.
 */
export default function AboutCompany({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const { details, assurances } = content.lists

  return (
    <section id="company-information" aria-labelledby="company-title" className="hp-section hp-tinted scroll-mt-28">
      <div className="page-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <header data-reveal>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="company-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
            {copy.intro && <p className="hp-lead mt-5">{copy.intro}</p>}
          </header>

          <ul className="mt-10 grid gap-7">
            {assurances.map((item, i) => (
              <li key={item.title} data-reveal style={delay(100 + i * 100)} className="flex gap-4">
                <span aria-hidden="true" className="hp-tick mt-0.5 !h-8 !w-8">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">{item.title}</h3>
                  {item.description && <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal style={delay(120)} className="ab-cert self-start overflow-hidden rounded-[1.75rem] lg:col-span-7">
          <div className="ab-cert-head flex items-center gap-4 px-6 py-5 sm:px-9 sm:py-6">
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[var(--hp-accent)] shadow-[var(--hp-shadow-sm)]">
              <BuildingIcon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--hp-ink)]">{copy.details_heading}</h3>
          </div>
          <dl className="grid gap-px bg-[var(--hp-line)] sm:grid-cols-2">
            {details.map((row) => (
              <div key={row.title} className="bg-[var(--hp-card)] px-6 py-5 sm:last:odd:col-span-2 sm:px-9 sm:py-6">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">{row.title}</dt>
                <dd className="mt-1.5 text-[15.5px] font-medium leading-relaxed text-[var(--hp-ink)]">
                  {row.link ? (
                    <a href={row.link} className="underline decoration-[var(--hp-line-strong)] underline-offset-4 transition-colors hover:text-[var(--hp-accent)] hover:decoration-current">
                      {row.description}
                    </a>
                  ) : (
                    row.description
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
