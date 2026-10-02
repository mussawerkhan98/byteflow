'use client'

import { useEffect } from 'react'
import { leadEventForLink, trackEvent } from '../lib/analytics'

/**
 * Records WhatsApp and phone taps anywhere on the site.
 *
 * One delegated listener rather than a handler on each link: the WhatsApp
 * and phone numbers appear in the sticky buttons, the page CTA, the contact
 * block and the FAQ, and CMS-driven CTAs can add more at any time. A
 * listener on the document catches every one of them, including links that
 * did not exist when this was written.
 *
 * It listens in the capture phase so the event is recorded before anything
 * else can stop it, and it never calls preventDefault, so the tap behaves
 * exactly as it did before.
 */
export default function LeadTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (!link) return
      const name = leadEventForLink(link.getAttribute('href'))
      if (!name) return
      trackEvent(name, { link_url: link.getAttribute('href') ?? '' })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
