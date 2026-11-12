import type { HomeBlock } from '../../lib/home-content'
import { ArrowRight, Check } from '../home/ui'

const glow = (
  <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.2),transparent_68%)]" />
)

/** The plans in brief: the first plan's price as "from", each plan with its price, and a link to the plans. */
export function PlansCard({ plans }: { plans: HomeBlock }) {
  const list = plans.lists.plans
  if (!list.length) return null
  const f = plans.fields
  return (
    <div className="hp-band relative overflow-hidden rounded-[1.5rem] p-6 sm:p-8">
      {glow}
      <p className="hp-eyebrow">{f.card_label}</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{list[0].price}</span>
        {f.unit && <span className="text-[14px] text-[var(--hp-muted)]">{f.unit}</span>}
      </p>
      <ul className="mt-6 divide-y divide-[var(--hp-line)] border-y border-[var(--hp-line)]">
        {list.map((plan) => (
          <li key={plan.title} className="flex items-center justify-between gap-4 py-3.5">
            <span className="flex items-center gap-3 text-[15px] font-semibold text-[var(--hp-ink)]">
              <span className="hp-tick">
                <Check />
              </span>
              {plan.title}
            </span>
            <span className="font-display text-[15px] font-semibold tabular-nums text-[var(--hp-accent)]">{plan.price}</span>
          </li>
        ))}
      </ul>
      {f.note && <p className="mt-4 text-[13px] leading-relaxed text-[var(--hp-muted)]">{f.note}</p>}
      <a href="#plans" className="hp-textlink mt-5">
        {f.compare_label}
        <ArrowRight className="hp-arrow h-4 w-4" />
      </a>
    </div>
  )
}

/** What's included in brief: the first items, ticked, and a link down to all of them. */
export function IncludedCard({ features, label }: { features: HomeBlock; label: string }) {
  const list = features.lists.features ?? []
  if (!list.length) return null
  return (
    <div className="hp-band relative overflow-hidden rounded-[1.5rem] p-6 sm:p-8">
      {glow}
      <p className="hp-eyebrow">{features.fields.eyebrow}</p>
      <ul className="mt-5 divide-y divide-[var(--hp-line)] border-y border-[var(--hp-line)]">
        {list.slice(0, 6).map((item) => (
          <li key={item.title} className="flex items-center gap-3 py-3 text-[15px] font-semibold text-[var(--hp-ink)]">
            <span className="hp-tick">
              <Check />
            </span>
            {item.title}
          </li>
        ))}
      </ul>
      <a href="#features" className="hp-textlink mt-5">
        {label}
        <ArrowRight className="hp-arrow h-4 w-4" />
      </a>
    </div>
  )
}
