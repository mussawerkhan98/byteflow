'use client'

import { useEffect, useRef, useState } from 'react'
import { faEnvelopeOpenText, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Icon } from './Icon'
import InquiryForm from './InquiryForm'
import { markInquiryClosed, markInquiryOpen } from '../lib/inquiry-state'

export default function InquiryDrawer() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    markInquiryOpen()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    // Move focus into the panel so keyboard and screen-reader users land in the
    // form rather than staying behind the overlay.
    panelRef.current?.querySelector<HTMLElement>('input, textarea, select, button')?.focus()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      markInquiryClosed()
    }
  }, [open])

  function close() {
    setOpen(false)
    // Return focus to the tab that opened the drawer.
    tabRef.current?.focus()
  }

  return (
    <>
      {/* Side tab */}
      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the inquiry form"
        aria-expanded={open}
        className={`inquiry-tab${open ? ' is-hidden' : ''}`}
      >
        <Icon icon={faEnvelopeOpenText} className="w-3.5 h-3.5" />
        <span>Inquiry</span>
      </button>

      {/* Overlay */}
      <div
        className={`inquiry-overlay${open ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        className={`inquiry-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Send an inquiry"
        // Keep the panel out of the tab order and off the accessibility tree
        // while it is slid off screen.
        inert={!open}
      >
        <div className="h-[2px] w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }} />

        <button
          type="button"
          onClick={close}
          aria-label="Close the inquiry form"
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          style={{ background: 'var(--overlay-hover)', color: 'var(--text-muted)' }}
        >
          <Icon icon={faXmark} className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <InquiryForm
            onClose={close}
            badge="Quick Inquiry"
            heading="Tell us what you need"
            description="Send it over and our team replies within 2 hours on business days."
            layout="stacked"
          />
        </div>
      </div>
    </>
  )
}
