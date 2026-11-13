import Link from 'next/link'
import { planCell } from '../../lib/amc-page'
import { lines, type HomeBlock } from '../../lib/home-content'
import {
  listLayout,
  planButton,
  planDeliverables,
  planGroups,
  planPrice,
  priceText,
  quoteHref,
  showTable,
  shownPlans,
  tableGroups,
  type PlanPrice,
  type ShownPlan,
} from '../../lib/plans'
import { ArrowRight, Button, Check, Eyebrow, SectionTitle, delay } from '../home/ui'
import { HiddenTag } from '../PreviewBar'

type Fields = Record<string, string>

/** The small "i" before a plan's third-party costs line. */
function InfoMark() {
  return (
    <span aria-hidden="true" className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[var(--hp-muted)] text-[10px] font-bold leading-none text-[var(--hp-muted)]">
      i
    </span>
  )
}

/** A plan's price in a list row: the amount with its unit (and any setup or management fee), or the custom-quote words as a tag. */
function RowPrice({ price }: { price: PlanPrice }) {
  if (price.kind === 'custom')
    return (
      <span className="inline-flex whitespace-nowrap rounded-full border border-[var(--hp-line-strong)] bg-[var(--hp-bg)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--hp-ink)]">
        {price.label}
      </span>
    )
  return (
    <span className="block sm:text-right">
      <span className="block whitespace-nowrap font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.01em] text-[var(--hp-ink)]">
        {price.prefix && <span className="mr-1.5 text-[12.5px] font-semibold tracking-normal text-[var(--hp-muted)]">{price.prefix}</span>}
        {price.amount}
      </span>
      {price.unit && <span className="block text-[12.5px] text-[var(--hp-muted)]">{price.unit}</span>}
      {price.parts.map((part) => (
        <span key={part.label} className="block text-[12.5px] text-[var(--hp-muted)]">
          {part.label} <span className="font-semibold text-[var(--hp-body)]">{part.amount}</span> {part.unit}
        </span>
      ))}
    </span>
  )
}

/**
 * Many quote-only packages (a name, a price and a note each) as a price
 * list: the heading, description, terms and one quote button stay beside it
 * on wide screens, and each package is a row with its number, name (an h3),
 * third-party costs, price and an arrow to its own quote, the whole row
 * clickable. Far shorter than a wall of near-empty cards.
 */
function PlansList({ copy, plans, service }: { copy: Fields; plans: ShownPlan[]; service: string }) {
  const link = copy.button_link || '/contact-us'
  const main = service && copy.quote_prefill === 'yes' ? quoteHref(link, service, '') : link
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div data-reveal className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start xl:col-span-4">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <SectionTitle id="amc-plans-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-4" />
        {copy.intro && <p className="hp-lead mt-5">{copy.intro}</p>}
        {(copy.terms || copy.note) && (
          <div className="mt-6 border-l-2 border-[var(--hp-accent)] pl-4">
            {copy.terms && <p className="text-[14.5px] leading-relaxed text-[var(--hp-body)]">{copy.terms}</p>}
            {copy.note && <p className="mt-1 text-[13px] text-[var(--hp-muted)]">{copy.note}</p>}
          </div>
        )}
        {copy.button_label && (
          <Button href={main} className="mt-8">
            {copy.button_label}
          </Button>
        )}
      </div>

      <ul data-reveal className="hp-band divide-y divide-[var(--hp-line)] self-start overflow-hidden rounded-[1.25rem] lg:col-span-7 xl:col-span-8">
        {plans.map(({ plan, hidden }, i) => {
          const button = planButton(plan, copy, service)
          return (
            <li
              key={plan.title}
              className={`group relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 gap-y-3 px-5 py-5 transition-colors duration-300 hover:bg-[var(--hp-bg)] sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:px-7 ${
                hidden ? 'bg-amber-50/70' : ''
              }`}
            >
              <span aria-hidden="true" className="pt-0.5 font-display text-[13px] font-semibold tabular-nums text-[var(--hp-accent)] sm:pt-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--hp-ink)]">{plan.title}</h3>
                  {plan.badge && (
                    <span className="rounded-full bg-[var(--hp-accent)] px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white">{plan.badge}</span>
                  )}
                  {hidden && <HiddenTag />}
                </div>
                {plan.summary && <p className="mt-1 text-[14px] leading-snug text-[var(--hp-body)]">{plan.summary}</p>}
                {plan.third_party && (
                  <p className="mt-1.5 flex items-start gap-2 text-[13px] leading-snug text-[var(--hp-muted)]">
                    <InfoMark />
                    {plan.third_party}
                  </p>
                )}
              </div>
              <div className="col-start-2 flex items-center justify-between gap-5 sm:col-start-auto sm:justify-end">
                <RowPrice price={planPrice(plan, copy)} />
                {/* The whole row opens this package's quote. */}
                <Link
                  href={button.href}
                  aria-label={`${button.label}: ${plan.title}`}
                  className="hp-svc-go after:absolute after:inset-0 group-hover:border-[var(--hp-navy)] group-hover:bg-[var(--hp-navy)] group-hover:text-[#2ccdde]"
                >
                  <ArrowRight />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** A plan's price: the amount (after "From" for a starting price) and the unit, or the custom-quote words alone. */
function Price({ price }: { price: PlanPrice }) {
  if (price.kind === 'custom')
    return <p className="mt-4 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--hp-ink)]">{price.label}</p>
  return (
    <>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {price.prefix && <span className="text-[14px] font-semibold text-[var(--hp-muted)]">{price.prefix}</span>}
        <span className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{price.amount}</span>
        {price.unit && <span className="text-[14px] text-[var(--hp-muted)]">{price.unit}</span>}
      </p>
      {/* A two-part price: the setup and/or management fee, under the price. */}
      {price.parts.length > 0 && (
        <dl className="mt-3 grid gap-1.5 text-[14px]">
          {price.parts.map((part) => (
            <div key={part.label} className="flex flex-wrap items-baseline gap-x-2">
              <dt className="text-[var(--hp-muted)]">{part.label}</dt>
              <dd className="font-semibold text-[var(--hp-ink)]">
                {part.amount} <span className="font-normal text-[var(--hp-muted)]">{part.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )
}

/** A short list under its own small heading in a plan card: what a group includes, what's left out, what costs extra. */
function PlanList({ title, items, mark = 'tick' }: { title: string; items: string[]; mark?: 'tick' | 'dash' | 'plus' }) {
  return (
    <div className="mt-5 border-t border-[var(--hp-line)] pt-4">
      {title && <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">{title}</h4>}
      <ul className="mt-3 grid gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[14.5px] leading-snug text-[var(--hp-ink)]">
            {mark === 'tick' ? (
              <span className="hp-tick mt-px">
                <Check />
              </span>
            ) : (
              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center text-[15px] font-semibold leading-none text-[var(--hp-muted)]">
                {mark === 'dash' ? '–' : '+'}
              </span>
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The plans side by side ("Packages & pricing" on the IT AMC page and each
 * service page): one h2 for the section and its description, then each
 * plan's name (an h3), price, deliverables, what it includes (by group when
 * grouped), what it leaves out and costs extra, and its own button. A plan
 * given a badge is the raised one, its badge along its top. Then the
 * comparison table, a row per feature (under group headings when given) and
 * a column per plan, and the terms and the VAT note. Hidden plans show only
 * in a preview, marked. Many quote-only packages show as a price list
 * instead (PlansList; listLayout says when).
 */
export default function AmcPlans({ content, preview = false, service = '' }: { content: HomeBlock; preview?: boolean; service?: string }) {
  const copy = content.fields
  const plans = shownPlans(content.lists.plans, preview)
  const rows = showTable(copy, plans.length) ? (content.lists.compare ?? []) : []
  if (!plans.length) return null
  const groups = tableGroups(rows)
  // Up to four side by side as before; more wrap in rows of three.
  const columns =
    plans.length > 4
      ? 'md:grid-cols-2 lg:grid-cols-3'
      : `${plans.length >= 3 ? 'md:grid-cols-3' : plans.length === 2 ? 'md:grid-cols-2' : ''} ${plans.length === 4 ? 'xl:grid-cols-4' : ''}`

  const list = listLayout(copy, plans)

  return (
    <section id="plans" aria-labelledby="amc-plans-title" className="page-container scroll-mt-28 pb-16 lg:pb-24">
      {list ? (
        <PlansList copy={copy} plans={plans} service={service} />
      ) : (
        <>
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="amc-plans-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-4" />
            {copy.intro && <p className="hp-lead mx-auto mt-5 max-w-xl">{copy.intro}</p>}
          </div>

          <ul className={`mt-10 grid gap-5 lg:mt-14 lg:items-stretch ${columns}`}>
            {plans.map(({ plan, hidden }, i) => {
              const raised = Boolean(plan.badge)
              const points = lines(plan.points ?? '')
              const deliverables = planDeliverables(plan, copy)
              const excluded = lines(plan.excluded ?? '')
              const extras = lines(plan.extras ?? '')
              const button = planButton(plan, copy, service)
              return (
                <li
                  key={plan.title}
                  data-reveal
                  className={`relative flex flex-col rounded-[1.5rem] border p-7 sm:p-8 ${
                    raised
                      ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] shadow-[0_1px_2px_rgba(16,42,76,0.04),0_40px_80px_-48px_rgba(14,116,144,0.45)] md:-my-3'
                      : 'border-[var(--hp-line)] bg-[var(--hp-card)] shadow-[var(--hp-shadow)]'
                  } ${hidden ? 'border-dashed opacity-75' : ''}`}
                  style={delay(i * 120)}
                >
                  {raised && (
                    <p className="absolute -top-3 left-7 rounded-full bg-[var(--hp-accent)] px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white">
                      {plan.badge}
                    </p>
                  )}
                  {hidden && <HiddenTag className="absolute -top-3 right-7" />}
                  <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em] text-[var(--hp-ink)]">{plan.title}</h3>
                  <Price price={planPrice(plan, copy)} />
                  {plan.summary && <p className="mt-4 text-[15px] font-semibold text-[var(--hp-accent)]">{plan.summary}</p>}
                  {deliverables.length > 0 && (
                    <dl className="mt-5 grid grid-cols-2 gap-2.5">
                      {deliverables.map((item) => (
                        <div key={item.label} className="flex flex-col rounded-xl border border-[var(--hp-line)] bg-[var(--hp-bg)] px-3.5 py-3">
                          <dt className="text-[12.5px] leading-snug text-[var(--hp-muted)]">{item.label}</dt>
                          <dd className="order-first font-display text-[1.25rem] font-semibold leading-tight text-[var(--hp-ink)]">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {points.length > 0 && (
                    <ul className="mt-4 grid gap-3 border-t border-[var(--hp-line)] pt-5">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--hp-ink)]">
                          <span className="hp-tick mt-px">
                            <Check />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  {planGroups(plan, copy).map((group) => (
                    <PlanList key={group.title} title={group.title} items={group.items} />
                  ))}
                  {excluded.length > 0 && <PlanList title={copy.excluded_label} items={excluded} mark="dash" />}
                  {extras.length > 0 && <PlanList title={copy.extras_label} items={extras} mark="plus" />}
                  {plan.third_party && (
                    <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-[var(--hp-bg)] px-3.5 py-3 text-[13.5px] leading-snug text-[var(--hp-body)]">
                      <InfoMark />
                      {plan.third_party}
                    </p>
                  )}
                  <div className="mt-auto pt-7">
                    {/* Long button words wrap inside the card rather than push the arrow out of it. */}
                    <Button href={button.href} variant={raised ? 'primary' : 'ghost'} className="hp-btn-wrap w-full">
                      {button.label}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {rows.length > 0 && (
        // A real table, scrolling sideways on phones rather than squeezing.
        <div data-reveal className="mt-14 lg:mt-20">
          <h3 className="text-center font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--hp-ink)]">{copy.table_heading}</h3>
          <div className="hp-scroller -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table
              className="hp-band w-full min-w-[36rem] overflow-hidden rounded-[1.25rem] text-left"
              // Each plan's column keeps room for its name and price, however many there are.
              style={plans.length > 4 ? { minWidth: `${12 + plans.length * 9}rem` } : undefined}
            >
              <thead>
                <tr className="border-b border-[var(--hp-line)]">
                  <th scope="col" className="px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">
                    <span className="sr-only">{copy.table_heading}</span>
                  </th>
                  {plans.map(({ plan }) => (
                    <th key={plan.title} scope="col" className={`px-5 py-4 text-center ${plan.badge ? 'bg-[rgba(14,116,144,0.06)]' : ''}`}>
                      <span className="block font-display text-[16px] font-semibold text-[var(--hp-ink)]">{plan.title}</span>
                      <span className="block text-[13px] font-medium text-[var(--hp-accent)]">{priceText(planPrice(plan, copy))}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((group, g) => (
                <tbody key={`${group.title}-${g}`} className="divide-y divide-[var(--hp-line)] border-b border-[var(--hp-line)] last:border-b-0">
                  {group.title && (
                    <tr className="bg-[var(--hp-soft)]">
                      <th scope="colgroup" colSpan={plans.length + 1} className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-accent)]">
                        {group.title}
                      </th>
                    </tr>
                  )}
                  {group.rows.map((row) => (
                    <tr key={row.title}>
                      <th scope="row" className="px-5 py-3.5 text-[14.5px] font-medium text-[var(--hp-ink)]">
                        {row.title}
                      </th>
                      {plans.map(({ plan, column }) => {
                        const cell = planCell(row[`plan${column + 1}`])
                        return (
                          <td key={plan.title} className={`px-5 py-3.5 text-center text-[14px] text-[var(--hp-body)] ${plan.badge ? 'bg-[rgba(14,116,144,0.06)]' : ''}`}>
                            {cell.kind === 'yes' ? (
                              <span className="hp-tick mx-auto" role="img" aria-label="Included">
                                <Check />
                              </span>
                            ) : cell.kind === 'no' ? (
                              <span className="text-[var(--hp-muted)]" role="img" aria-label="Not included">
                                —
                              </span>
                            ) : (
                              cell.text
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}

      {!list && (copy.terms || copy.note) && (
        <div data-reveal className="mx-auto mt-10 max-w-3xl text-center">
          {copy.terms && <p className="text-[15.5px] leading-relaxed text-[var(--hp-body)]">{copy.terms}</p>}
          {copy.note && <p className="mt-2 text-[13.5px] text-[var(--hp-muted)]">{copy.note}</p>}
        </div>
      )}
    </section>
  )
}
