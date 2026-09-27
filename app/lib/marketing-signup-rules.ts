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
 * Anyone who writes in is added to the list and receives offers: enquiring
 * about the services is taken as interest in hearing about them, and the
 * form says so.
 *
 * The one exception is someone who has unsubscribed. Filling in the form
 * again does not put them back on the list — an unsubscribe has to mean
 * something, or the link in every email is a lie. Only they, through the
 * resubscribe button, or an admin, can turn offers back on.
 */
export function nextOptOut(existingOptOut?: number | null): 0 | 1 {
  return Number(existingOptOut) === 1 ? 1 : 0
}
