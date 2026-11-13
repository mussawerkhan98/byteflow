import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { previewPath, validPreview } from '../../lib/preview'

/**
 * Preview mode for the IT AMC and service pages, from the admin's "Preview
 * hidden sections" link: ?path=/digital-marketing&expires=…&signature=…
 * switches it on (until the browser closes) and opens the page;
 * ?exit=1&path=… switches it off again.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const path = previewPath(params.get('path')) ?? '/'
  const draft = await draftMode()
  if (params.get('exit')) {
    draft.disable()
    redirect(path)
  }
  const ok = validPreview({
    secret: process.env.REVALIDATE_SECRET ?? '',
    path: params.get('path'),
    expires: params.get('expires'),
    signature: params.get('signature'),
  })
  if (!ok) return new Response('This preview link has expired or is not valid. Open a new one from the admin.', { status: 401 })
  draft.enable()
  redirect(path)
}
