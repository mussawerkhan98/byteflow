import { looksAutomated, resolveClick } from '../../../lib/marketing-public'

export const dynamic = 'force-dynamic'

/**
 * A tracked link from a promotion email.
 *
 * Counts the click, then redirects to the destination stored on that
 * campaign. The destination never comes from the request, so this cannot be
 * used as an open redirect; an unknown token just goes to the homepage.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params
  const home = new URL('/', request.url).toString()

  const automated = looksAutomated(request.headers.get('user-agent'))
  const destination = await resolveClick(token, !automated)

  return new Response(null, {
    status: 302,
    headers: {
      location: destination ?? home,
      'cache-control': 'no-store, max-age=0',
      'referrer-policy': 'no-referrer',
    },
  })
}
