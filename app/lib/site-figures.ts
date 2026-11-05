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

/**
 * A figure split around its number, for counting up to it: "200+" is
 * { before: '', number: 200, decimals: 0, after: '+' }. Null when there is
 * no number to count.
 */
export function splitFigure(value: string) {
  const match = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/.exec(value.trim())
  if (!match) return null
  return { before: match[1], number: Number(match[2]), decimals: match[2].split('.')[1]?.length ?? 0, after: match[3] }
}

// ── The trust strip under the home page banner ──────────────────────────────

export const STAT_FIGURES = ['clients', 'rating', 'years', 'founded', 'custom'] as const
export type StatFigure = (typeof STAT_FIGURES)[number]

export type Stat = {
  key: string
  figure: StatFigure
  /** The number, as shown: "574", "4.9★", "9+", "2 hrs". */
  value: string
  /** The line under it. */
  text: string
  /** Only the rating links out, to the Google Business profile. */
  href: string | null
}

/** Most the strip holds. */
export const MAX_STATS = 4

/** How each site-wide figure reads in the strip. */
const shown: Record<Exclude<StatFigure, 'custom'>, (figures: SiteFigures) => string> = {
  clients: (f) => f.clients,
  rating: (f) => `${f.rating}★`,
  years: (f) => `${f.years}+`,
  founded: (f) => f.founded,
}

/**
 * The stats as saved in the admin (home_trust block), in their saved order.
 * A figure other than "custom" always shows the site-wide number, so it
 * can't drift from the rest of the site. "Only without logos" stats stand in
 * for the logo row while no client logo is up.
 */
export function statsFrom(items: Record<string, string>[], figures: SiteFigures, { hasLogos }: { hasLogos: boolean }): Stat[] {
  return items
    .filter((item) => item.show !== 'no' && !(item.show === 'no_logos' && hasLogos))
    .map((item, index) => {
      const figure = (STAT_FIGURES as readonly string[]).includes(item.figure) ? (item.figure as StatFigure) : 'custom'
      return {
        key: `${figure}-${index}`,
        figure,
        value: figure === 'custom' ? fillFigures(clean(item.value), figures) : shown[figure](figures),
        text: fillFigures(clean(item.title), figures),
        href: figure === 'rating' && figures.googleUrl ? figures.googleUrl : null,
      }
    })
    .filter((stat) => stat.text && stat.value)
    .slice(0, MAX_STATS)
}

export type ClientLogo = { key: string; name: string; image: string; href: string | null }

/** A row of logos looks thin past this. */
export const MAX_LOGOS = 8

const SITE_PATH = /^\/(?!\/)\S*$/
const WEB_URL = /^https:\/\/\S+$/i

/**
 * The client logos as saved in the admin, in order. One needs a name (its alt
 * text) and an image on this site or over https; hidden ones are left out.
 */
export function logosFrom(items: Record<string, string>[]): ClientLogo[] {
  return items
    .filter((item) => item.show !== 'no')
    .map((item, index) => {
      const image = clean(item.image)
      const link = clean(item.link)
      return {
        key: `logo-${index}`,
        name: clean(item.title),
        image: SITE_PATH.test(image) || WEB_URL.test(image) ? image : '',
        href: SITE_PATH.test(link) || WEB_URL.test(link) ? link : null,
      }
    })
    .filter((logo) => logo.name && logo.image)
    .slice(0, MAX_LOGOS)
}
