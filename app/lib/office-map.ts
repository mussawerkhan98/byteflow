/**
 * The office on Google Maps (Contact details & logo → map), shared by the
 * contact form's sections and the Contact page's office section.
 */

/** The office's own map, until one is set in the admin. */
export const DEFAULT_MAP_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230964.06209009685!2d55.13766789915716!3d25.24320683637232!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x3e5f43a9923d5979%3A0x36f7a80cba19b9eb!2sByteflow%20information%20Technology%20%26%20CO%20LLC!5e0!3m2!1sen!2sae!4v1779350571004!5m2!1sen!2sae'

/** Only a Google Maps embed address; anything else is dropped. */
export function safeMapUrl(value?: string) {
  try {
    if (!value) return ''
    const url = new URL(value)
    return url.protocol === 'https:' && /(^|\.)google\.(com|ae)$/.test(url.hostname) && url.pathname.startsWith('/maps/embed') ? url.toString() : ''
  } catch {
    return ''
  }
}

/** Directions: the link set in the admin, or a Google Maps search for the address. */
export function directionsUrl(link: string, address: string) {
  if (/^https:\/\//i.test(link.trim())) return link.trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Byteflow Information Technology Dubai')}`
}
