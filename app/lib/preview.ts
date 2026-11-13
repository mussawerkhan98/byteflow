/**
 * Preview links from the admin ("Preview hidden sections"): the admin signs
 * the page's path and an expiry time with the REVALIDATE_SECRET both apps
 * share, and /api/preview checks the signature before switching preview mode
 * on. byteflow-admin (app/lib/preview-link.ts) signs them the same way.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

/** A link is good for this long after the admin makes it. */
export const PREVIEW_LINK_SECONDS = 60 * 60

export function previewSignature(secret: string, path: string, expires: number): string {
  return createHmac('sha256', secret).update(`preview:${path}:${expires}`).digest('hex')
}

/** A path on this site only ("/digital-marketing"), never another site's address. */
export const previewPath = (value: string | null) => (value && /^\/(?![/\\])[\w\-/]*$/.test(value) ? value : null)

export function validPreview({ secret, path, expires, signature, now = Date.now() }: { secret: string; path: string | null; expires: string | null; signature: string | null; now?: number }): boolean {
  if (secret.length < 16 || !previewPath(path) || !signature) return false
  const until = Number(expires)
  const seconds = Math.floor(now / 1000)
  if (!Number.isInteger(until) || until < seconds || until > seconds + PREVIEW_LINK_SECONDS) return false
  const expected = previewSignature(secret, path!, until)
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}
