import Link from 'next/link'
import { getServices } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { needScenarios } from '../lib/need-scenarios'
import { ArrowUpRightIcon } from './InlineIcons'

const arrowClass = 'h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px'
const linkClass =
  'group inline-flex items-center gap-1.5 font-semibold text-[var(--text-primary)] underline decoration-[var(--warm-line)] underline-offset-[6px] transition-colors duration-200 hover:decoration-current'

/**
 * "Where does your IT need help?": three common starting points, each linked
 * to its service, on a warm off-white band. Edited as the home_needs block on
 * the admin's Home page sections screen. Hidden when every scenario is hidden.
 */
export default async function NeedsSection() {
  const [block, services] = await Promise.all([getHomeBlock('home_needs'), getServices()])
  const scenarios = needScenarios(block, services)
  if (!scenarios.length) return null
  const copy = block.fields
  const steps = lines(copy.steps)

  return (
    <section aria-labelledby="needs-title" className="warm-section py-20 sm:py-24 lg:py-28">
      <div className="page-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--warm-accent)]">{copy.eyebrow}</p>
            <h2
              id="needs-title"
              className="mt-4 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]"
            >
              {copy.heading}
            </h2>
          </div>
          {copy.link_label && (
            <Link href={copy.link || '/contact-us'} className={`${linkClass} shrink-0 self-start text-[15px] lg:self-auto lg:pb-2`}>
              {copy.link_label}
              <ArrowUpRightIcon className={arrowClass} />
            </Link>
          )}
        </div>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-20 lg:gap-12">
          {scenarios.map((scenario) => (
            <li key={scenario.number} className="flex flex-col border-t border-[var(--warm-line)] pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-body)]">
                <span className="text-[var(--warm-accent)]">{scenario.number}</span>
                <span aria-hidden="true"> / </span>
                <span className="sr-only">: </span>
                {scenario.label}
              </p>
              <h3 className="mt-5 text-balance font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.75rem]">
                {scenario.title}
              </h3>
              {scenario.description && (
                <p className="mt-4 max-w-[26rem] text-[15.5px] leading-relaxed text-[var(--text-body)]">{scenario.description}</p>
              )}
              {scenario.link && (
                <Link href={scenario.link.href} className={`${linkClass} mt-auto self-start pt-6 text-[14.5px]`}>
                  {scenario.link.label}
                  <ArrowUpRightIcon className={arrowClass} />
                </Link>
              )}
            </li>
          ))}
        </ol>

        {(steps.length > 0 || copy.steps_link_label) && (
          <div className="mt-16 flex flex-col gap-5 border-t border-[var(--warm-line)] pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
            <ol
              aria-label="How a project runs"
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-body)]"
            >
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-[var(--warm-accent)]">
                      →
                    </span>
                  )}
                  {step}
                </li>
              ))}
            </ol>
            {copy.steps_link_label && (
              <Link href={copy.steps_link || '/#how-we-work'} className={`${linkClass} shrink-0 self-start text-[14.5px] sm:self-auto`}>
                {copy.steps_link_label}
                <ArrowUpRightIcon className={arrowClass} />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
