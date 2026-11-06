/**
 * The home page reviews: one spotlight review and the moving row of the
 * others, from the published testimonials (admin → Customer reviews).
 *
 * Only real reviews: nothing is shown that isn't in the admin, and a review
 * is called a Google review only when its source says so.
 *
 * No database access or React here, so the rules can be tested directly.
 */

export type WallReview = {
  id: number
  name: string
  role: string
  text: string
  rating: number
  image: string
  /** "Google" when the source is Google; otherwise the source as typed, or ''. */
  source: string
  google: boolean
}

type ReviewInput = {
  id: number
  customer_name: string
  customer_role: string
  review_text: string
  rating: number
  image_url?: string
  source?: string
  featured?: boolean
}

/** A row is repeated until it holds this many cards, so it fills a wide screen as it moves. */
export const MIN_ROW = 6

/** "Glam Glow Aesthetic Clinic" → "GG"; "soft light" → "SL"; "Alim" → "A". */
export function reviewerInitials(name: string): string {
  const words = name.split(/\s+/).filter((word) => /^\p{L}/u.test(word))
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '·'
}

const clampRating = (rating: number) => (Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5)

export function toWallReview(item: ReviewInput): WallReview {
  const source = String(item.source ?? '').trim()
  const google = /google/i.test(source)
  return {
    id: item.id,
    name: item.customer_name.trim(),
    role: item.customer_role.trim(),
    text: item.review_text.trim(),
    rating: clampRating(item.rating),
    image: String(item.image_url ?? '').trim(),
    source: google ? 'Google' : source,
    google,
  }
}

/** Enough copies of a row for the loop: the row, then the row again, as often as needed. */
export function fillRow<T>(row: T[], min = MIN_ROW): T[] {
  if (!row.length) return []
  const out = [...row]
  while (out.length < min) out.push(...row)
  return out
}

/**
 * The spotlight is the review marked Featured in the admin (the first one,
 * in the admin's order), or else the longest. The rest, in the admin's
 * order, make the moving row.
 */
export function reviewWall(items: ReviewInput[]) {
  const reviews = items.filter((item) => item.customer_name?.trim() && item.review_text?.trim())
  if (!reviews.length) return { spotlight: null, wall: [] as WallReview[] }
  const spotlightItem = reviews.find((item) => item.featured) ?? [...reviews].sort((a, b) => b.review_text.trim().length - a.review_text.trim().length)[0]
  const wall = reviews.filter((item) => item !== spotlightItem).map(toWallReview)
  return { spotlight: toWallReview(spotlightItem), wall }
}
