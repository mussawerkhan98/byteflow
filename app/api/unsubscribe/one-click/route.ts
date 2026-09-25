import { unsubscribe } from '../../../lib/marketing-public'

export const dynamic = 'force-dynamic'

/**
 * The unsubscribe button Gmail and Yahoo show next to the sender's name
 * (RFC 8058). The mail provider POSTs here on the recipient's behalf.
 *
 * It always answers 200: an error here is read by the provider as the sender
 * ignoring unsubscribe requests, which is far worse for deliverability than
 * quietly doing nothing on a malformed call.
 */
async function handle(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    await unsubscribe(
      Number(params.get('p') ?? 0),
      String(params.get('k') ?? ''),
    )
  } catch {
    // Deliberately swallowed — see above.
  }
  return new Response('OK', {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export const POST = handle
export const GET = handle
