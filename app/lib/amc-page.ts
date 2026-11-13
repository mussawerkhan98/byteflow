/**
 * The IT AMC page's small rules (app/it-amc-services-dubai), apart from the
 * page so they can be tested directly. No database access or React here.
 */

type Item = Record<string, string>

/**
 * The sections the page can show under its banner, by key. The admin's
 * "Sections" tab (byteflow-admin, home-sections.ts) offers the same keys.
 */
export const amcSectionKeys = [
  'highlights',
  'intro',
  'services',
  'preventive',
  'plans',
  'costs',
  'breakfix',
  'industries',
  'why',
  'process',
  'sla',
  'coverage',
  'scope',
  'pageblocks',
  'related',
  'faq',
  'reviews',
  'contact',
] as const

export type AmcSectionKey = (typeof amcSectionKeys)[number]

const known = new Set<string>(amcSectionKeys)

/**
 * The sections switched on, in the admin's order, each once; unknown keys
 * are left out. A preview keeps the hidden ones too.
 */
export function amcSections(layout: Item[], preview = false): AmcSectionKey[] {
  const seen = new Set<string>()
  return layout
    .filter((item) => preview || item.show !== 'no')
    .map((item) => (item.title ?? '').trim())
    .filter((key): key is AmcSectionKey => {
      if (!known.has(key) || seen.has(key)) return false
      seen.add(key)
      return true
    })
}

/** The sections switched to "Hide" on the Sections tab, by key. */
export const hiddenSections = (layout: Item[]) => new Set(layout.filter((item) => item.show === 'no').map((item) => (item.title ?? '').trim()))

/** One cell of the plans table: a tick, a dash, or the words typed. */
export type PlanCell = { kind: 'yes' } | { kind: 'no' } | { kind: 'text'; text: string }

export function planCell(value: string | undefined): PlanCell {
  const text = (value ?? '').trim()
  if (/^(yes|y|✓|✔|included)$/i.test(text)) return { kind: 'yes' }
  if (!text || /^(no|n|-|—|–)$/i.test(text)) return { kind: 'no' }
  return { kind: 'text', text }
}

/**
 * Each category with its services, in the categories' order; services whose
 * category no longer exists go in a last, untitled group so none is lost.
 * Categories with no services are left out.
 */
export function servicesByCategory<C extends Item, S extends Item>(categories: C[], services: S[]): { category: C | null; services: S[] }[] {
  const plain = (value: string | undefined) => (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
  const groups = categories.map((category) => ({
    category: category as C | null,
    services: services.filter((service) => plain(service.tab) === plain(category.title)),
  }))
  const placed = new Set(groups.flatMap((group) => group.services))
  const rest = services.filter((service) => !placed.has(service))
  return [...groups, ...(rest.length ? [{ category: null, services: rest }] : [])].filter((group) => group.services.length)
}

/** The price as a number for structured data ("AED 30" → 30), or null. */
export function priceNumber(price: string | undefined): number | null {
  const match = (price ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : null
}
