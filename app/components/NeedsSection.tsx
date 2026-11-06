import Link from 'next/link'
import { getServices } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { needScenarios } from '../lib/need-scenarios'
import { ArrowUpRightIcon } from './InlineIcons'
import { ServiceIcon } from './ServiceIcon'

const arrowClass = 'h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px'

/**
 * "Where does your IT need help?": three common starting points, each a card
 * linked to its service, then the steps of a project. A bright band in both
 * themes (needs-band in globals.css), so the page doesn't run dark from top
 * to bottom. Edited as the home_needs block on the admin's Home page sections
 * screen. Hidden when every scenario is hidden.
 */
export default async function NeedsSection() {
  const [block, services] = await Promise.all([getHomeBlock('home_needs'), getServices()])
  const scenarios = needScenarios(block, services)
  if (!scenarios.length) return null
  const copy = block.fields
  const steps = lines(copy.steps)

  return (
    <section aria-labelledby="needs-title" className="needs-band relative isolate overflow-hidden py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-48 -top-48 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.22),transparent)]" />
        <div className="absolute -bottom-56 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,18,32,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(11,18,32,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="page-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--needs-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current" />
              {copy.eyebrow}
            </p>
            <h2
              id="needs-title"
              className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]"
            >
              {copy.heading}
            </h2>
          </div>
          {copy.link_label && (
            <Link
              href={copy.link || '/contact-us'}
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-[#0f1b27] py-2 pl-5 pr-2 text-[14.5px] font-semibold text-white shadow-[0_16px_32px_-16px_rgba(15,27,39,0.55)] transition-transform duration-200 hover:-translate-y-0.5 lg:self-auto lg:mb-2"
            >
              {copy.link_label}
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A] transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          )}
        </div>

        <ol className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-3 lg:gap-6">
          {scenarios.map((scenario) => (
            <li key={scenario.number}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border-default)] bg-white p-7 shadow-[0_1px_2px_rgba(15,27,39,0.04),0_24px_48px_-32px_rgba(15,27,39,0.25)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[rgba(14,116,144,0.3)] hover:shadow-[0_40px_70px_-36px_rgba(15,27,39,0.4)] motion-reduce:transition-none sm:p-8">
                {/* A cyan line runs along the top on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#2CCDDE,#46A3E1)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--needs-tint)] text-[var(--needs-accent)] transition-colors duration-300 group-hover:bg-[#2CCDDE] group-hover:text-[#04121A]">
                    <ServiceIcon link={scenario.link?.href ?? ''} className="h-6 w-6" />
                  </span>
                  <span aria-hidden="true" className="font-display text-[3.25rem] font-semibold leading-none tracking-[-0.05em] text-[#e3ebef] transition-colors duration-300 group-hover:text-[#c4eef3]">
                    {scenario.number}
                  </span>
                </div>

                <p className="mt-7 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[var(--needs-accent)]">
                  {scenario.label}
                </p>
                <h3 className="mt-3 text-balance font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.625rem]">
                  {scenario.title}
                </h3>
                {scenario.description && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--text-body)]">{scenario.description}</p>}

                {scenario.link && (
                  <div className="mt-auto pt-8">
                    <Link
                      href={scenario.link.href}
                      className="flex items-center justify-between gap-4 border-t border-[var(--border-default)] pt-5 text-[14.5px] font-semibold text-[var(--text-primary)] after:absolute after:inset-0 after:content-['']"
                    >
                      {scenario.link.label}
                      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] transition-colors duration-300 group-hover:border-[#0f1b27] group-hover:bg-[#0f1b27] group-hover:text-white">
                        <ArrowUpRightIcon className={arrowClass} />
                      </span>
                    </Link>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>

        {(steps.length > 0 || copy.steps_link_label) && (
          <div className="mt-6 flex flex-col gap-5 rounded-[1.75rem] border border-[var(--border-default)] bg-white/70 p-5 backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:py-4 lg:pl-8 lg:pr-4">
            <ol aria-label="How a project runs" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 sm:gap-4">
                  {index > 0 && <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--border-strong)] sm:block lg:w-12" />}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--needs-tint)] font-display text-[13px] font-semibold text-[var(--needs-accent)]">
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">{step}</span>
                </li>
              ))}
            </ol>
            {copy.steps_link_label && (
              <Link
                href={copy.steps_link || '/#how-we-work'}
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[#0f1b27] hover:bg-[#0f1b27] hover:text-white lg:self-auto"
              >
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
