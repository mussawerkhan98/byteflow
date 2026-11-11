import Link from 'next/link'
import type { ServiceTab } from '../../lib/service-tabs'
import { ServiceIcon } from '../ServiceIcon'
import { ArrowRight } from '../home/ui'

/** How many of a service's highlights its row lists. */
const ROW_HIGHLIGHTS = 3

/**
 * One service as a row of the catalogue: its number, icon, name and tagline
 * (or its summary, without one), its first highlights, and an arrow. The whole row is the link
 * (the name's link is stretched over it); it is also where the banner's
 * index jumps to, by the service's slug.
 */
export default function ServiceRow({ tab, number }: { tab: ServiceTab; number: number }) {
  const highlights = tab.bullets.slice(0, ROW_HIGHLIGHTS)
  return (
    <li
      id={tab.slug}
      className="group/row relative grid scroll-mt-28 gap-x-6 gap-y-4 p-5 transition-colors hover:bg-[#f7fafd] sm:p-6 lg:grid-cols-[2.25rem_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-center lg:px-7"
    >
      <span aria-hidden="true" className="hidden font-display text-[14px] font-semibold tabular-nums text-[var(--hp-muted)] transition-colors group-hover/row:text-[var(--hp-accent)] lg:block">
        {String(number).padStart(2, '0')}
      </span>
      <div className="flex gap-4 pr-12 lg:pr-0">
        <span aria-hidden="true" className="hp-svc-icon">
          <ServiceIcon link={tab.href} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h4 className="font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--hp-ink)] sm:text-[1.25rem]">
            <Link href={tab.href} className="outline-none transition-colors after:absolute after:inset-0 after:rounded-[inherit] group-hover/row:text-[var(--hp-accent)] focus-visible:after:ring-2 focus-visible:after:ring-[var(--hp-accent)]">
              {tab.title}
            </Link>
          </h4>
          {(tab.subtitle || tab.text) && <p className="mt-1 text-[14.5px] leading-snug text-[var(--hp-body)]">{tab.subtitle || tab.text}</p>}
        </div>
      </div>
      {highlights.length > 0 && (
        <ul className="flex flex-wrap gap-2 pl-[3.75rem] lg:pl-0">
          {highlights.map((highlight) => (
            <li key={highlight} className="rounded-full border border-[var(--hp-line)] bg-[var(--hp-card)] px-3 py-1 text-[13px] font-medium text-[var(--hp-body)]">
              {highlight}
            </li>
          ))}
        </ul>
      )}
      <span
        aria-hidden="true"
        className="hp-round-arrow absolute right-5 top-5 !h-10 !w-10 group-hover/row:border-[var(--hp-accent)] group-hover/row:bg-[var(--hp-accent)] group-hover/row:text-white sm:right-6 sm:top-6 lg:static"
      >
        <ArrowRight />
      </span>
    </li>
  )
}
