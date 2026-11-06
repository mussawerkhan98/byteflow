import Link from 'next/link'
import { getHomeBlock } from '../lib/home-blocks'
import { techCounts, techTabs } from '../lib/tech-stack'
import { ArrowUpRightIcon } from './InlineIcons'
import TechTabs from './TechTabs'

function StackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <path d="M8 2 1.5 5.25 8 8.5l6.5-3.25L8 2Z" strokeLinejoin="round" />
      <path d="m1.5 8.25 6.5 3.25 6.5-3.25M1.5 11.25 8 14.5l6.5-3.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Technologies: a navy band with the heading, two figures counted from the
 * logos and the call to action on the left, and the vendors we work with on
 * the right, one tab per area (Microsoft, Security …). Edited as
 * "Technologies" on the admin's Home page sections screen; hidden when no tab
 * has a logo to show.
 */
export default async function TechStack() {
  const block = await getHomeBlock('home_tech')
  const tabs = techTabs(block)
  if (!tabs.length) return null
  const copy = block.fields
  const counts = techCounts(tabs)
  const figures = [
    { value: counts.platforms, label: copy.platforms_label },
    { value: counts.areas, label: copy.areas_label },
  ].filter((figure) => figure.label)

  return (
    <section aria-labelledby="tech-title" className="home-tech relative isolate overflow-hidden bg-[#0f1b27] py-20 text-white sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-48 bottom-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.14),transparent)]" />
        <div className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_right,black,transparent_65%)]" />
      </div>

      <div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7fe3ec]">
            <StackIcon className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </p>
          <h2 id="tech-title" className="mt-7 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
            {copy.heading}{' '}
            <span className="bg-[linear-gradient(100deg,#2CCDDE,#46A3E1)] bg-clip-text text-transparent">{copy.heading_soft}</span>
          </h2>
          {copy.intro && <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#a9b6c4]">{copy.intro}</p>}

          {figures.length > 0 && (
            <dl className="mt-9 grid max-w-md grid-cols-2 border-y border-white/10">
              {figures.map((figure) => (
                <div key={figure.label} className="flex flex-col py-5 pr-4 first:border-r first:border-white/10 [&:not(:first-child)]:pl-6">
                  <dt className="order-2 mt-1.5 text-[13px] leading-snug text-[#a9b6c4]">{figure.label}</dt>
                  {/* Counted from the logos shown, so the figure is always exact. */}
                  <dd className="order-1 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.04em] text-white">{figure.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {copy.link_label && (
            <Link
              href={copy.link || '/contact-us'}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#2CCDDE] py-2 pl-6 pr-2 text-[15px] font-semibold text-[#04121A] shadow-[0_18px_40px_-18px_rgba(44,205,222,0.7)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {copy.link_label}
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE] transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
                <ArrowUpRightIcon className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7">
          <TechTabs tabs={tabs} />
          {copy.note && (
            <p className="mt-5 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#8da0b3]">
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} className="mt-0.5 h-3.5 w-3.5 shrink-0">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 7.25v3.75M8 5h.01" strokeLinecap="round" />
              </svg>
              {copy.note}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
