import Link from 'next/link'
import { getHomeBlock } from '../lib/home-blocks'
import { techTabs } from '../lib/tech-stack'
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
 * Technologies: a navy band with the heading on the left and the vendors we
 * work with on the right, one tab per area (Microsoft, Security …). Edited as
 * "Technologies" on the admin's Home page sections screen; hidden when no tab
 * has a logo to show.
 */
export default async function TechStack() {
  const block = await getHomeBlock('home_tech')
  const tabs = techTabs(block)
  if (!tabs.length) return null
  const copy = block.fields

  return (
    <section aria-labelledby="tech-title" className="home-tech relative isolate overflow-hidden bg-[#0f1b27] py-20 text-white sm:py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-[-14rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.12),transparent)]" />

      <div className="page-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 xl:col-span-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf6f8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f1b27]">
            <StackIcon className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </p>
          <h2 id="tech-title" className="mt-7 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
            {copy.heading} <span className="text-[#2CCDDE]">{copy.heading_soft}</span>
          </h2>
          {copy.intro && <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#a9b6c4]">{copy.intro}</p>}
          {copy.link_label && (
            <Link href={copy.link || '/contact-us'} className="group mt-8 inline-flex items-center gap-2.5 text-[15px] font-semibold text-white">
              {copy.link_label}
              <ArrowUpRightIcon className="h-4 w-4 text-[#2CCDDE] transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7 xl:col-span-7 xl:col-start-6">
          <TechTabs tabs={tabs} />
          {copy.note && <p className="mt-6 text-[12.5px] leading-relaxed text-[#8da0b3]">{copy.note}</p>}
        </div>
      </div>
    </section>
  )
}
