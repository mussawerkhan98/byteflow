import { campaignImage } from '../../../lib/marketing-public'

export const dynamic = 'force-dynamic'

/**
 * The offer image for a promotion, served publicly so webmail can load it.
 *
 * Cross-Origin-Resource-Policy has to be cross-origin here: Gmail and others
 * proxy images through their own domains, and the default same-origin policy
 * would have them refuse to display it.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const image = await campaignImage(Number(id))
  if (!image) return new Response('Not found', { status: 404 })

  return new Response(new Uint8Array(image.data), {
    headers: {
      'content-type': image.mime,
      'cross-origin-resource-policy': 'cross-origin',
      'cache-control': 'public, max-age=86400',
      'x-content-type-options': 'nosniff',
    },
  })
}
