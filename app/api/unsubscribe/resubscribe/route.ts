import { clientIp, rateLimited, resubscribe } from '../../../lib/marketing-public'

export const dynamic = 'force-dynamic'

/**
 * Opting back in, from the button on the unsubscribe page. Needs the same
 * key the unsubscribe link carried, so nobody can resubscribe someone else.
 */
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return Response.json({ error: 'Please try again in a moment.' }, { status: 429 })
  }
  try {
    const body = (await request.json()) as { p?: unknown; k?: unknown }
    const ok = await resubscribe(Number(body.p ?? 0), String(body.k ?? ''))
    if (!ok) {
      return Response.json({ error: 'That link is no longer valid.' }, { status: 400 })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'That did not work.' }, { status: 400 })
  }
}
