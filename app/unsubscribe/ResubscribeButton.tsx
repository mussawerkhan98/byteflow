'use client'

import { useState } from 'react'

/**
 * A way back for someone who unsubscribed by accident, or changed their
 * mind on the confirmation page.
 */
export default function ResubscribeButton({
  personId,
  unsubKey,
}: {
  personId: number
  unsubKey: string
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'failed'>('idle')

  if (state === 'done') {
    return (
      <p className="text-sm font-semibold text-[#2CCDDE]">
        You&apos;re back on the list. Welcome back.
      </p>
    )
  }

  return (
    <div>
      <button
        disabled={state === 'busy'}
        onClick={async () => {
          setState('busy')
          try {
            const response = await fetch('/api/unsubscribe/resubscribe', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ p: personId, k: unsubKey }),
            })
            setState(response.ok ? 'done' : 'failed')
          } catch {
            setState('failed')
          }
        }}
        className="rounded-full px-6 py-3 text-sm font-bold text-[var(--text-primary)] transition disabled:opacity-50"
        style={{
          background: 'rgba(44,205,222,0.07)',
          border: '1px solid rgba(44,205,222,0.25)',
        }}
      >
        {state === 'busy' ? 'Just a moment…' : 'Subscribe again'}
      </button>
      {state === 'failed' && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          That didn&apos;t work. Reply to any of our emails and we&apos;ll sort it out.
        </p>
      )}
    </div>
  )
}
