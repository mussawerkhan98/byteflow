'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import InquiryForm from './InquiryForm'
import { isInquiryOpen, markInquiryClosed, markInquiryOpen } from '../lib/inquiry-state'

const OPEN_DELAY_MS = 10000

export default function LeadPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Runs once per real page load (mount) — not on every in-app navigation —
  // so refreshing the page re-shows the popup after the delay, while
  // clicking around the site doesn't re-trigger it.
  useEffect(() => {
    if (pathname === '/contact-us') return
    const timer = setTimeout(() => {
      // Don't stack on top of a drawer the visitor opened themselves.
      if (isInquiryOpen()) return
      setOpen(true)
    }, OPEN_DELAY_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!open) return
    markInquiryOpen()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      markInquiryClosed()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function close() {
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get in touch"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      />

      <div
        className="relative w-full max-w-md sm:max-w-lg rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--bg-surface)',
          backgroundImage: 'linear-gradient(160deg, rgba(44,205,222,0.1) 0%, rgba(70,163,225,0.03) 40%, transparent 100%)',
          border: '1px solid rgba(44,205,222,0.22)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        }}
      >
        <div className="h-[2px] w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }} />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          style={{ background: 'var(--overlay-hover)', color: 'var(--text-muted)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <InquiryForm onClose={close} />
        </div>
      </div>
    </div>
  )
}
