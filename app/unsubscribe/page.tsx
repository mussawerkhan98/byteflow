import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { headers } from 'next/headers'
import {
  rateLimited,
  unsubscribe,
  type UnsubscribeResult,
} from '../lib/marketing-public'
import ResubscribeButton from './ResubscribeButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unsubscribe | Byteflow',
  // A preferences page has no business in search results.
  robots: { index: false, follow: false },
}

/**
 * Unsubscribing happens on opening the link — no confirmation step.
 *
 * Someone who clicks "unsubscribe" has already decided; making them press a
 * second button is the kind of friction that earns a spam complaint instead.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; k?: string }>
}) {
  await connection()
  const { p, k } = await searchParams
  const personId = Number(p ?? 0)
  const key = String(k ?? '')

  const requestHeaders = await headers()
  const ip =
    (requestHeaders.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'

  let result: UnsubscribeResult = 'invalid'
  if (rateLimited(ip)) {
    result = 'invalid'
  } else if (personId && key) {
    result = await unsubscribe(personId, key)
  }

  const done = result === 'unsubscribed' || result === 'already'

  return (
    <main
      className="flex min-h-[70vh] items-center justify-center px-4 py-24"
      style={{ background: 'var(--bg-page)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 text-center sm:p-12"
        style={{
          background:
            'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)',
          border: '1px solid rgba(44,205,222,0.15)',
        }}
      >
        {done ? (
          <>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              You&apos;re unsubscribed
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
              {result === 'already'
                ? 'You were already unsubscribed, so nothing has changed. You will not receive promotional emails from us.'
                : 'You will not receive promotional emails from us again. Replies to enquiries you start yourself are not affected.'}
            </p>
            <div className="mt-8">
              <ResubscribeButton personId={personId} unsubKey={key} />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              That link didn&apos;t work
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
              It may have expired, or been copied without its full address. If you
              would rather not hear from us, reply to any of our emails and we will
              take you off the list.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2CCDDE] hover:underline"
        >
          Back to byteflow.ae
        </Link>
      </div>
    </main>
  )
}
