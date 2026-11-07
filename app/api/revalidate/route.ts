import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { HEADER_CACHE_TAG } from '../../lib/header-data'
import { SITE_CONTENT_TAG } from '../../lib/db'

/**
 * Called by the admin panel after it saves something the site caches, so the
 * change shows on the next page view instead of after the cache runs out.
 *
 * POST with `Authorization: Bearer <REVALIDATE_SECRET>` and a JSON body
 * `{ "tag": "header-menu" }` (or "site-content" for everything else the
 * pages show). Only the tags listed here can be cleared.
 */
const TAGS = new Set([HEADER_CACHE_TAG, SITE_CONTENT_TAG])

function authorized(request: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? ''
  const sent = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (secret.length < 16 || sent.length !== secret.length) return false
  return timingSafeEqual(Buffer.from(sent), Buffer.from(secret))
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { tag?: unknown } | null
  const tag = typeof body?.tag === 'string' ? body.tag : ''
  if (!TAGS.has(tag)) return Response.json({ error: 'Unknown tag' }, { status: 400 })
  // Expire now rather than serve the old copy once more while it refreshes.
  revalidateTag(tag, { expire: 0 })
  return Response.json({ revalidated: tag })
}
