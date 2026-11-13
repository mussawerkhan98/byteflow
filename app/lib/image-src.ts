/**
 * Whether next/image should show a picture as it is rather than send it
 * through the image optimizer (/_next/image), which would refuse it with a
 * 400 and leave a broken picture:
 * - another site's address: only the hosts in next.config.ts may be fetched;
 * - an SVG: nothing to resize;
 * - an older upload whose address has no file name (/api/media/12): it may be
 *   an SVG, and the optimizer can't tell from the address.
 * Uploads with a name (/api/media/12/photo.webp) and the site's own files
 * are resized as usual, so phones get phone-sized copies.
 *
 * No dependencies, so the rule can be tested directly.
 */
export function unoptimizedSrc(src: string): boolean {
  const value = src.trim()
  return !/^\/(?!\/)/.test(value) || /\.svg(?:[?#]|$)/i.test(value) || /^\/api\/media\/\d+\/?(?:[?#]|$)/.test(value)
}
