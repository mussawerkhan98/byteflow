/**
 * The packages and pricing section's rules (IT AMC page and the service
 * pages: "Packages & pricing" in the admin), apart from the section so they
 * can be tested directly. No database access or React here.
 */
import { priceNumber } from './amc-page'
import { lines } from './home-content'

type Item = Record<string, string>

/** The structured deliverables a plan can give a number for, by field. */
export const DELIVERABLES = ['d_keywords', 'd_pages', 'd_audits', 'd_content'] as const

/** The inclusion groups a plan can list, by field. */
export const INCLUSION_GROUPS = ['g_technical', 'g_onpage', 'g_local', 'g_content', 'g_links'] as const

/** One plan as the section shows it, with its place in the admin's list (the table's plan1…plan4). */
export type ShownPlan = { plan: Item; column: number; hidden: boolean }

/**
 * The plans to show, up to four, in the admin's order: those switched to
 * "Show" (or saved before the switch existed), and in a preview the hidden
 * ones too, marked. Each keeps its column so the table rows still match.
 */
export function shownPlans(plans: Item[], preview = false): ShownPlan[] {
  return plans
    .slice(0, 4)
    .map((plan, column) => ({ plan, column, hidden: plan.show === 'no' }))
    .filter((shown) => preview || !shown.hidden)
}

/**
 * A plan's price as shown: a custom quote (chosen, or no price typed) shows
 * the section's "Request Pricing" words with no unit after it; "Starting
 * from" puts the section's "From" before the price.
 */
export type PlanPrice = { kind: 'custom'; label: string } | { kind: 'price'; prefix: string; amount: string; unit: string }

export function planPrice(plan: Item, fields: Item): PlanPrice {
  const amount = (plan.price ?? '').trim()
  if (!amount || plan.price_type === 'custom') return { kind: 'custom', label: fields.custom_label || 'Request Pricing' }
  return { kind: 'price', prefix: plan.price_type === 'from' ? fields.from_label || 'From' : '', amount, unit: fields.unit ?? '' }
}

/** The price in one line ("From AED 1,500", "Request Pricing"), for the table and the banner card. */
export function priceText(price: PlanPrice): string {
  return price.kind === 'custom' ? price.label : [price.prefix, price.amount].filter(Boolean).join(' ')
}

/** A plan's button: its own words and link, or the section's. */
export function planButton(plan: Item, fields: Item): { label: string; href: string } {
  return {
    label: plan.button_label || fields.button_label,
    href: plan.button_link || fields.button_link || '/contact-us',
  }
}

/** A plan's deliverables with a number typed, each with the section's name for it. */
export function planDeliverables(plan: Item, fields: Item): { value: string; label: string }[] {
  return DELIVERABLES.map((key) => ({ value: (plan[key] ?? '').trim(), label: fields[`${key}_label`] ?? '' })).filter((item) => item.value && item.label)
}

/** A plan's inclusion groups with anything listed, each with the section's name for it. */
export function planGroups(plan: Item, fields: Item): { title: string; items: string[] }[] {
  return INCLUSION_GROUPS.map((key) => ({ title: fields[`${key}_label`] ?? '', items: lines(plan[key] ?? '') })).filter((group) => group.items.length)
}

/**
 * The table's rows under their group headings: a row's group starts a new
 * heading when it differs from the row before. Rows with no group sit under
 * no heading.
 */
export function tableGroups(rows: Item[]): { title: string; rows: Item[] }[] {
  const groups: { title: string; rows: Item[] }[] = []
  for (const row of rows) {
    const title = (row.group ?? '').trim()
    const last = groups[groups.length - 1]
    if (last && last.title === title) last.rows.push(row)
    else groups.push({ title, rows: [row] })
  }
  return groups
}

/** The shown plans with a price, as numbers for structured data; hidden plans and custom quotes are left out. */
export function pricedPlans(plans: Item[], fields: Item): { title: string; price: number }[] {
  return shownPlans(plans).flatMap(({ plan }) => {
    const price = planPrice(plan, fields)
    const value = price.kind === 'price' ? priceNumber(price.amount) : null
    return value === null ? [] : [{ title: plan.title, price: value }]
  })
}

/**
 * The figure on the banner card: the first shown plan with a price, as
 * "from" (its "Starting from" words are the card's own label), or the
 * custom-quote words when no plan has one.
 */
export function cardPrice(plans: ShownPlan[], fields: Item): PlanPrice | null {
  if (!plans.length) return null
  const priced = plans.map((shown) => planPrice(shown.plan, fields)).find((price) => price.kind === 'price')
  return priced && priced.kind === 'price' ? { ...priced, prefix: '' } : planPrice(plans[0].plan, fields)
}
