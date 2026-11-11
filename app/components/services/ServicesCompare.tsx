import type { HomeBlock } from '../../lib/home-content'
import { Check, Eyebrow, SectionTitle } from '../home/ui'

function Cross() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  )
}

/**
 * One team against separate vendors ("Services page sections" → One team
 * vs vendors): a table of three columns from tablets up, the Byteflow column
 * raised as one card down its length; on phones each row is a card of its
 * own, the two answers labelled.
 */
export default function ServicesCompare({ content }: { content: HomeBlock }) {
  const { eyebrow, heading, heading_soft, us_label, them_label } = content.fields
  const rows = content.lists.rows
  if (!rows.length) return null
  const last = rows.length - 1

  return (
    <section aria-labelledby="services-compare-title" className="page-container pb-16 lg:pb-24">
      <div data-reveal className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionTitle id="services-compare-title" heading={heading} soft={heading_soft} softBlock className="mt-4" />
      </div>

      <div role="table" aria-labelledby="services-compare-title" data-reveal className="mt-10 grid gap-3 md:gap-0">
        <div role="row" className="hidden md:grid md:grid-cols-12">
          <span role="columnheader" className="md:col-span-4">
            <span className="sr-only">{eyebrow}</span>
          </span>
          <span role="columnheader" className="rounded-t-[1.25rem] border border-b-0 border-[rgba(14,116,144,0.22)] bg-[var(--hp-card)] px-6 pb-3 pt-6 font-display text-[17px] font-semibold text-[var(--hp-accent)] md:col-span-4">
            {us_label}
          </span>
          <span role="columnheader" className="px-6 pb-3 pt-6 font-display text-[17px] font-semibold text-[var(--hp-muted)] md:col-span-4">
            {them_label}
          </span>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.title}
            role="row"
            className="grid gap-3 rounded-2xl border border-[var(--hp-line)] bg-[var(--hp-card)] p-5 md:grid-cols-12 md:gap-0 md:rounded-none md:border-0 md:bg-transparent md:p-0"
          >
            <span role="rowheader" className="font-display text-[16px] font-semibold text-[var(--hp-ink)] md:col-span-4 md:border-t md:border-[var(--hp-line)] md:py-5 md:pr-6 md:text-[17px]">
              {row.title}
            </span>
            <span
              role="cell"
              className={`flex items-start gap-3 text-[15px] font-medium text-[var(--hp-ink)] md:col-span-4 md:border-x md:border-[rgba(14,116,144,0.22)] md:bg-[var(--hp-card)] md:px-6 md:py-5 ${
                i === last ? 'md:rounded-b-[1.25rem] md:border-b md:pb-6' : ''
              }`}
            >
              <span className="hp-tick mt-0.5">
                <Check />
              </span>
              <span>
                <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-accent)] md:hidden">{us_label}</span>
                {row.us}
              </span>
            </span>
            <span role="cell" className="flex items-start gap-3 text-[15px] text-[var(--hp-body)] md:col-span-4 md:border-t md:border-[var(--hp-line)] md:px-6 md:py-5">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(16,42,76,0.06)] text-[var(--hp-muted)]">
                <Cross />
              </span>
              <span>
                <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)] md:hidden">{them_label}</span>
                {row.them}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
