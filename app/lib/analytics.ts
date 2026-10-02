/**
 * Sending lead signals to Google Analytics.
 *
 * Every enquiry this site produces arrives one of three ways: the contact
 * form, the WhatsApp button or a tap on the phone number. None of them was
 * being recorded, so GA4 showed 0 key events and there was no way to tell
 * which pages bring work in.
 *
 * The decision of what counts as a lead link is kept here as a pure
 * function so it can be tested without a browser.
 */

export type LeadEvent = 'whatsapp_click' | 'phone_click'

/**
 * Which lead event, if any, a link should report.
 *
 * WhatsApp is reached through several hosts (wa.me short links, the
 * api.whatsapp.com form the admin panel sometimes stores, and the
 * whatsapp:// scheme on mobile), so the test is on the host rather than on
 * one spelling. Anything else, including a mailto:, is not a lead on its
 * own and returns null.
 */
export function leadEventForLink(href: unknown): LeadEvent | null {
  const value = String(href ?? '').trim()
  if (!value) return null
  if (/^tel:/i.test(value)) return 'phone_click'
  if (/^whatsapp:/i.test(value)) return 'whatsapp_click'
  let host = ''
  try {
    host = new URL(value, 'https://www.byteflow.ae').hostname.toLowerCase()
  } catch {
    return null
  }
  // Exact hosts, not a substring match: "wa.me.example.com" is not WhatsApp.
  if (host === 'wa.me' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com') {
    return 'whatsapp_click'
  }
  if (host === 'whatsapp.com' || host.endsWith('.whatsapp.com')) return 'whatsapp_click'
  return null
}

type GtagParams = Record<string, string | number | boolean | undefined>

/**
 * Fires an event if GA is on the page. Analytics must never be able to
 * break a form submission, so every failure is swallowed.
 */
export function trackEvent(name: string, params: GtagParams = {}): void {
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return
    gtag('event', name, {
      page_path: window.location.pathname,
      ...params,
    })
  } catch {
    // An analytics outage is not the visitor's problem.
  }
}

/** The one place the enquiry event name is written down. */
export const LEAD_EVENT = 'generate_lead'
