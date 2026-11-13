/**
 * Preview mode (a link from the admin's "Preview hidden sections"): only the
 * person who opened that link sees this. Hidden sections and packages show,
 * each marked, and a bar along the foot says so and ends the preview.
 */
import type { ReactNode } from 'react'

/** The small "Hidden" tag on a section or package that visitors don't see. */
export function HiddenTag({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-500 bg-amber-50 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-amber-800 ${className}`}>
      Hidden · preview only
    </span>
  )
}

/** A hidden section in a preview: its tag above it, and a dashed outline round it. */
export function HiddenSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-6 border-y-2 border-dashed border-amber-400/70 pt-10">
      <HiddenTag className="absolute left-1/2 top-3 -translate-x-1/2" />
      {children}
    </div>
  )
}

export default function PreviewBar({ path }: { path: string }) {
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-[70] border-t border-amber-300 bg-amber-50 px-4 py-3 text-[14px] text-amber-900 shadow-[0_-8px_24px_rgba(16,42,76,0.12)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p>
          <strong className="font-semibold">Preview.</strong> Hidden sections and packages are shown, marked “Hidden”. Visitors don’t see them.
        </p>
        {/* A plain link: a prefetch would end the preview before it is clicked. */}
        <a href={`/api/preview?exit=1&path=${encodeURIComponent(path)}`} className="rounded-full border border-amber-400 px-4 py-1.5 font-semibold hover:bg-amber-100">
          Exit preview
        </a>
      </div>
    </div>
  )
}
