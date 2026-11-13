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

/** The most plans a section shows: the service pages allow 12, the IT AMC page 4 (the admin keeps to those). */
export const MAX_PLANS = 12

/** One plan as the section shows it, with its place in the admin's list (the table's plan1…plan12). */
export type ShownPlan = { plan: Item; column: number; hidden: boolean }

/**
 * The plans to show, up to twelve, in the admin's order: those switched to
 * "Show" (or saved before the switch existed), and in a preview the hidden
 * ones too, marked. Each keeps its column so the table rows still match.
 */
export function shownPlans(plans: Item[], preview = false): ShownPlan[] {
  return plans
    .slice(0, MAX_PLANS)
    .map((plan, column) => ({ plan, column, hidden: plan.show === 'no' }))
    .filter((shown) => preview || !shown.hidden)
}

/** The billing units a plan can pick, each worded by the section's unit_<key> field. */
export const BILLING_UNITS = ['one_time', 'month', 'user_month', 'device_month', 'site_month', 'project'] as const

/**
 * The words after a plan's price: its own billing unit (one of the section's
 * worded units, or its own text), else the section's "Words after each price".
 */
export function planUnit(plan: Item, fields: Item): string {
  const type = plan.unit_type ?? ''
  if (type === 'custom') return (plan.unit_custom ?? '').trim() || (fields.unit ?? '')
  if ((BILLING_UNITS as readonly string[]).includes(type)) return fields[`unit_${type}`] || fields.unit || ''
  return fields.unit ?? ''
}

/** One part of a two-part price: the setup fee (one-time) or the management fee (monthly). */
export type PricePart = { label: string; amount: string; unit: string }

/**
 * A plan's price as shown: a custom quote (chosen, or nothing priced) shows
 * the section's "Request Pricing" words with no unit after it; "Starting
 * from" puts the section's "From" before the price. A plan with a setup fee
 * and/or a management fee lists them under its price; with no price of its
 * own, the management fee (or else the setup fee) is the price, and the
 * other fee is listed under it.
 */
export type PlanPrice = { kind: 'custom'; label: string } | { kind: 'price'; prefix: string; amount: string; unit: string; parts: PricePart[] }

export function planPrice(plan: Item, fields: Item): PlanPrice {
  const custom: PlanPrice = { kind: 'custom', label: fields.custom_label || 'Request Pricing' }
  if (plan.price_type === 'custom') return custom
  const prefix = plan.price_type === 'from' ? fields.from_label || 'From' : ''
  const setup = (plan.setup_fee ?? '').trim()
  const management = (plan.management_fee ?? '').trim()
  const parts: PricePart[] = [
    ...(setup ? [{ label: fields.setup_label || 'Setup fee', amount: setup, unit: fields.unit_one_time || 'one-time' }] : []),
    ...(management ? [{ label: fields.management_label || 'Management fee', amount: management, unit: fields.unit_month || 'per month' }] : []),
  ]
  const amount = (plan.price ?? '').trim()
  if (amount) return { kind: 'price', prefix, amount, unit: planUnit(plan, fields), parts }
  const main = parts[parts.length - 1]
  if (!main) return custom
  return { kind: 'price', prefix, amount: main.amount, unit: main.unit, parts: parts.slice(0, -1) }
}

/**
 * Whether the comparison table shows: "Show" or "Hide" as chosen, and
 * otherwise (Automatic, or a page saved before the choice) only with up to
 * four plans, where it still fits.
 */
export function showTable(fields: Item, plans: number): boolean {
  if (fields.show_table === 'yes') return true
  if (fields.show_table === 'no') return false
  return plans <= 4
}

/**
 * Whether the packages show as a price list (a row each) rather than cards:
 * as chosen, or automatically when there are more than four and none has
 * anything a card is for (points, deliverables, inclusion groups, what's
 * left out or extra), so a page of quote-only services isn't a wall of
 * near-empty cards. Up to four stay as cards side by side.
 */
export function listLayout(fields: Item, plans: ShownPlan[]): boolean {
  if (fields.layout === 'list') return true
  if (fields.layout === 'cards') return false
  if (fields.layout !== 'auto') return false
  const detailed = (plan: Item) =>
    [plan.points, plan.excluded, plan.extras, ...DELIVERABLES.map((key) => plan[key]), ...INCLUSION_GROUPS.map((key) => plan[key])].some((value) => (value ?? '').trim())
  return plans.length > 4 && !plans.some(({ plan }) => detailed(plan))
}

/**
 * A quote button's link with the service and package for the enquiry form
 * (?service=cloud-services-dubai&package=Business), when the page asks for
 * it and the link is a page on this site; anything else is left as it is.
 */
export function quoteHref(href: string, service: string, plan: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const [path, hash = ''] = href.split('#')
  const [base, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  params.set('service', service)
  if (plan) params.set('package', plan)
  return `${base}?${params}${hash ? `#${hash}` : ''}`
}

/** The price in one line ("From AED 1,500", "Request Pricing"), for the table and the banner card. */
export function priceText(price: PlanPrice): string {
  return price.kind === 'custom' ? price.label : [price.prefix, price.amount].filter(Boolean).join(' ')
}

/**
 * A plan's button: its own words and link, or the section's. On a page set
 * to fill in the enquiry form (`service` given), the link carries the
 * service and the plan's name.
 */
export function planButton(plan: Item, fields: Item, service = ''): { label: string; href: string } {
  const href = plan.button_link || fields.button_link || '/contact-us'
  return {
    label: plan.button_label || fields.button_label,
    href: service && fields.quote_prefill === 'yes' ? quoteHref(href, service, plan.title) : href,
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
  return priced && priced.kind === 'price' ? { ...priced, prefix: '', parts: [] } : planPrice(plans[0].plan, fields)
}
