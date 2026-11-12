import { planCell } from '../../lib/amc-page'
import { lines, type HomeBlock } from '../../lib/home-content'
import { Button, Check, Eyebrow, SectionTitle, delay } from '../home/ui'

/**
 * The IT AMC plans side by side ("IT AMC page" → Plans): each plan's name,
 * price per user, what it adds and its button. A plan given a badge is the
 * raised one, its badge along its top. Then the comparison table, a row per
 * feature and a column per plan, and the terms and the VAT note.
 */
export default function AmcPlans({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const plans = content.lists.plans.slice(0, 4)
  const rows = content.lists.compare ?? []
  if (!plans.length) return null

  return (
    <section id="plans" aria-labelledby="amc-plans-title" className="page-container scroll-mt-28 pb-16 lg:pb-24">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <SectionTitle id="amc-plans-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-4" />
      </div>

      <ul className={`mt-10 grid gap-5 lg:mt-14 lg:items-stretch ${plans.length >= 3 ? 'md:grid-cols-3' : plans.length === 2 ? 'md:grid-cols-2' : ''}`}>
        {plans.map((plan, i) => {
          const raised = Boolean(plan.badge)
          const points = lines(plan.points ?? '')
          return (
            <li
              key={plan.title}
              data-reveal
              className={`relative flex flex-col rounded-[1.5rem] border p-7 sm:p-8 ${
                raised
                  ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] shadow-[0_1px_2px_rgba(16,42,76,0.04),0_40px_80px_-48px_rgba(14,116,144,0.45)] md:-my-3'
                  : 'border-[var(--hp-line)] bg-[var(--hp-card)] shadow-[var(--hp-shadow)]'
              }`}
              style={delay(i * 120)}
            >
              {raised && (
                <p className="absolute -top-3 left-7 rounded-full bg-[var(--hp-accent)] px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white">
                  {plan.badge}
                </p>
              )}
              <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em] text-[var(--hp-ink)]">{plan.title}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{plan.price}</span>
                <span className="text-[14px] text-[var(--hp-muted)]">{copy.unit}</span>
              </p>
              {plan.summary && <p className="mt-4 text-[15px] font-semibold text-[var(--hp-accent)]">{plan.summary}</p>}
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
              <div className="mt-auto pt-7">
                <Button href={copy.button_link || '/contact-us'} variant={raised ? 'primary' : 'ghost'} className="w-full">
                  {copy.button_label}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      {rows.length > 0 && (
        // A real table, scrolling sideways on phones rather than squeezing.
        <div data-reveal className="mt-14 lg:mt-20">
          <h3 className="text-center font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--hp-ink)]">{copy.table_heading}</h3>
          <div className="hp-scroller -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="hp-band w-full min-w-[36rem] overflow-hidden rounded-[1.25rem] text-left">
              <thead>
                <tr className="border-b border-[var(--hp-line)]">
                  <th scope="col" className="px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">
                    <span className="sr-only">{copy.table_heading}</span>
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.title} scope="col" className={`px-5 py-4 text-center ${plan.badge ? 'bg-[rgba(14,116,144,0.06)]' : ''}`}>
                      <span className="block font-display text-[16px] font-semibold text-[var(--hp-ink)]">{plan.title}</span>
                      <span className="block text-[13px] font-medium text-[var(--hp-accent)]">{plan.price}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hp-line)]">
                {rows.map((row) => (
                  <tr key={row.title}>
                    <th scope="row" className="px-5 py-3.5 text-[14.5px] font-medium text-[var(--hp-ink)]">
                      {row.title}
                    </th>
                    {plans.map((plan, p) => {
                      const cell = planCell(row[`plan${p + 1}`])
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
            </table>
          </div>
        </div>
      )}

      {(copy.terms || copy.note) && (
        <div data-reveal className="mx-auto mt-10 max-w-3xl text-center">
          {copy.terms && <p className="text-[15.5px] leading-relaxed text-[var(--hp-body)]">{copy.terms}</p>}
          {copy.note && <p className="mt-2 text-[13.5px] text-[var(--hp-muted)]">{copy.note}</p>}
        </div>
      )}
    </section>
  )
}
