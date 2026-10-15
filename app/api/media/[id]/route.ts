import { mediaAsset } from '../../../lib/media'

/**
 * An uploaded image, served as a file so it can be cached.
 *
 * A media row is never rewritten — a replacement upload creates a new row and
 * the content points at that instead — so the bytes behind an id cannot
 * change, and the response is safe to mark immutable. That is the whole point
 * of the route: the image leaves the HTML, and after the first request it
 * comes from the CDN rather than the origin.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const asset = await mediaAsset(Number(id))
  if (!asset) return new Response('Not found', { status: 404 })

  return new Response(asset.bytes as BodyInit, {
    headers: {
      'content-type': asset.mime,
      'cache-control': 'public, max-age=31536000, immutable',
      'content-length': String(asset.bytes.byteLength),
      // An uploaded SVG is served as a file here, so it must never be treated
      // as a document this origin vouches for.
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'x-content-type-options': 'nosniff',
    },
  })
}
