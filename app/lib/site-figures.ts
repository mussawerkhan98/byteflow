/**
 * The handful of numbers the site quotes about the business — clients,
 * Google rating, review count, founding year — kept in one place so every
 * page says the same thing.
 *
 * They are set in the admin under Contact details & logo (site_settings).
 * Text written in the admin can quote them with placeholders, filled in
 * when the page is built:
 *
 *   {clients}  number of clients, as typed ("574", "500+")
 *   {rating}   Google rating ("4.9")
 *   {reviews}  number of Google reviews ("50+")
 *   {founded}  founding year ("2017")
 *   {years}    years in business, counted from the founding year
 *
 * No database access or React here, so the rules can be tested directly.
 */

export type SiteFigures = {
  clients: string
  rating: string
  reviews: string
  founded: string
  years: string
  /** The Google Business profile, or '' when none is set. */
  googleUrl: string
}

/** What the site shows before anything is saved in the admin. */
export const defaultFigures = {
  clients: '574',
  rating: '4.9',
  reviews: '50+',
  founded: '2017',
} as const

const clean = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '')

export function yearsSince(founded: string, now = new Date()) {
  const year = Number.parseInt(founded, 10)
  return String(Math.max(0, now.getFullYear() - (Number.isFinite(year) ? year : Number(defaultFigures.founded))))
}

const httpUrl = (value: string) => (/^https:\/\/\S+$/i.test(value) ? value : '')

/** The figures from a site_settings row (or none), over the defaults. */
export function figuresFrom(settings: Record<string, unknown> | null | undefined, now = new Date()): SiteFigures {
  const founded = clean(settings?.founded_year).match(/^\d{4}$/)?.[0] ?? defaultFigures.founded
  return {
    clients: clean(settings?.client_count) || defaultFigures.clients,
    rating: clean(settings?.google_rating) || defaultFigures.rating,
    reviews: clean(settings?.google_review_count) || defaultFigures.reviews,
    founded,
    years: yearsSince(founded, now),
    googleUrl: httpUrl(clean(settings?.google_business_url)) || httpUrl(clean(settings?.google_maps_url)),
  }
}

const PLACEHOLDER = /\{(clients|rating|reviews|founded|years)\}/g

/** Replaces the placeholders in a piece of admin text. */
export function fillFigures(text: string, figures: SiteFigures) {
  return text.includes('{') ? text.replace(PLACEHOLDER, (_, name: keyof SiteFigures) => figures[name]) : text
}

/** fillFigures over every string in a JSON value (a saved section, a row). */
export function fillDeep<T>(value: T, figures: SiteFigures): T {
  if (typeof value === 'string') return fillFigures(value, figures) as T
  if (Array.isArray(value)) return value.map((item) => fillDeep(item, figures)) as T
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillDeep(item, figures)])) as T
  return value
}

