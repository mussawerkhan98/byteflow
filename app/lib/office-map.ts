/**
 * The office on Google Maps (Contact details & logo → map), shared by the
 * contact form's sections, the Contact page's office section and the footer,
 * so every map, "Location" link and directions button on the site points at
 * the same place: the one the map is pinned to.
 */

/** The office's own map, until one is set in the admin. */
export const DEFAULT_MAP_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230964.06209009685!2d55.13766789915716!3d25.24320683637232!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x3e5f43a9923d5979%3A0x36f7a80cba19b9eb!2sByteflow%20information%20Technology%20%26%20CO%20LLC!5e0!3m2!1sen!2sae!4v1779350571004!5m2!1sen!2sae'

/** The office address, until one is set in the admin (as in the organization markup). */
export const DEFAULT_OFFICE_ADDRESS = 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates'

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

/** The map shown everywhere: the one set in the admin, else the office's own. */
export function officeMapUrl(value?: string) {
  return safeMapUrl(value) || DEFAULT_MAP_URL
}

const search = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Byteflow Information Technology Dubai')}`

/**
 * The Google Maps listing the map is pinned to, opened in Google Maps. An
 * embed names its place as "!1s0x…:0x…" (the second half is the listing's
 * CID) and "!2s<name>"; without either, a search for the address.
 */
export function officePlaceUrl(mapUrl: string | undefined, address: string) {
  const src = officeMapUrl(mapUrl)
  const cid = src.match(/!1s0x[0-9a-f]+(?::|%3A)0x([0-9a-f]+)/i)?.[1]
  if (cid) return `https://maps.google.com/?cid=${BigInt(`0x${cid}`).toString()}`
  const name = src.match(/!2s([^!&]+)/)?.[1]
  return search(name ? decodeURIComponent(name.replace(/\+/g, ' ')) : address)
}

/** Directions: the link set in the admin, else the place the map is pinned to. */
export function directionsUrl(link: string, address: string, mapUrl?: string) {
  if (/^https:\/\//i.test(link.trim())) return link.trim()
  return officePlaceUrl(mapUrl, address)
}
