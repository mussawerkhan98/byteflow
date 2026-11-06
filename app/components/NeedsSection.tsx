import Link from 'next/link'
import { getServices } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { needScenarios } from '../lib/need-scenarios'
import { ArrowUpRightIcon } from './InlineIcons'
import { ServiceIcon } from './ServiceIcon'
import NeedsArt from './NeedsArt'

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
    <section aria-labelledby="needs-title" className="needs-band relative isolate overflow-hidden py-14 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-48 -top-48 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.22),transparent)]" />
        <div className="absolute -bottom-56 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,18,32,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(11,18,32,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="page-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl xl:max-w-none">
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--needs-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current" />
              {copy.eyebrow}
            </p>
            <h2
              id="needs-title"
              className="mt-4 text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.75rem] lg:text-[3rem]"
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

        {/* On phones the cards are a row you swipe through, not a tall stack. */}
        <ol className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] sm:mt-10 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:gap-5 [&::-webkit-scrollbar]:hidden">
          {scenarios.map((scenario) => (
            <li key={scenario.number} className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--border-default)] bg-white p-5 shadow-[0_1px_2px_rgba(15,27,39,0.04),0_24px_48px_-32px_rgba(15,27,39,0.25)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[rgba(14,116,144,0.3)] hover:shadow-[0_40px_70px_-36px_rgba(15,27,39,0.4)] motion-reduce:transition-none sm:p-6">
                {/* A cyan line runs along the top on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#2CCDDE,#46A3E1)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                />

                {/* The scene for this need, from the service it links to. */}
                <div className="relative -mx-2 -mt-2 aspect-[2/1] overflow-hidden lg:aspect-[5/2] rounded-[1.1rem] border border-[var(--border-default)] bg-[linear-gradient(160deg,#e9f7f9_0%,#f7fbfc_60%,#eef6f8_100%)] sm:-mx-3 sm:-mt-3">
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(14,116,144,0.12)_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
                    <NeedsArt service={scenario.link?.href ?? ''} />
                  </div>
                  <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-display text-[12px] font-semibold tabular-nums text-[#0f1b27] shadow-sm backdrop-blur">
                    {scenario.number}
                  </span>
                </div>

                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--needs-accent)]">
                  {scenario.label}
                </p>
                <h3 className="mt-2 text-balance font-display text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.375rem]">
                  {scenario.title}
                </h3>
                {scenario.description && <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--text-body)]">{scenario.description}</p>}

                {scenario.link && (
                  <div className="mt-auto pt-5">
                    <Link
                      href={scenario.link.href}
                      className="flex items-center justify-between gap-4 border-t border-[var(--border-default)] pt-4 text-[14px] font-semibold text-[var(--text-primary)] after:absolute after:inset-0 after:content-['']"
                    >
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--needs-tint)] text-[var(--needs-accent)]">
                          <ServiceIcon link={scenario.link.href} className="h-4 w-4" />
                        </span>
                        {scenario.link.label}
                      </span>
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
          <div className="mt-5 flex flex-col gap-4 rounded-[1.5rem] border border-[var(--border-default)] bg-white/70 p-4 backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:py-3 lg:pl-7 lg:pr-3">
            <ol aria-label="How a project runs" className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-2.5 sm:gap-3">
                  {index > 0 && <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--border-strong)] sm:block lg:w-12" />}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--needs-tint)] font-display text-[12px] font-semibold text-[var(--needs-accent)]">
                    {index + 1}
                  </span>
                  <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)] sm:text-[12.5px]">{step}</span>
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
