/**
 * The decisions behind adding a contact-form enquirer to the marketing list,
 * kept free of `server-only` and of any database import so they can be tested
 * on their own.
 */

export const SIGNUP_GROUP = 'Website enquiry'

export const normaliseSignupEmail = (value: unknown) =>
  String(value ?? '').trim().toLowerCase()

export const isSignupEmail = (value: string) =>
  /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value)

/** Case-insensitive, order-preserving union of two comma-separated lists. */
export function mergeGroups(existing: string, extra: string): string {
  const seen = new Set<string>()
  const keep: string[] = []
  for (const group of `${existing}, ${extra}`.split(',')) {
    const value = group.trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    keep.push(value)
  }
  return keep.join(', ')
}

/**
 * Whether the contact ends up receiving offers.
 *
 * Ticking the box always opts in. Leaving it unticked is not a request to be
 * removed, so someone who opted in earlier — or who was switched on by an
 * admin — stays on the list when they write in again. Only an unsubscribe or
 * the admin panel turns it back off.
 */
export function nextOptOut(consent: boolean, existingOptOut?: number | null): 0 | 1 {
  if (consent) return 0
  if (existingOptOut === undefined || existingOptOut === null) return 1
  return Number(existingOptOut) === 1 ? 1 : 0
}
