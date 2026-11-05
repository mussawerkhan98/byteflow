/**
 * Pictures inside a blog post's content, as the article page renders them.
 *
 * The src stays exactly as saved, so an image already indexed (Google Images,
 * links from elsewhere) keeps its address. A picture served from this site
 * also gets a srcset of smaller copies made on demand by Next's image
 * optimizer, so a phone loads a phone-sized file; one from another site is
 * left as it is. Every picture loads lazily and keeps its width and height,
 * so the text around it doesn't jump as it arrives.
 *
 * No dependencies, so the rules can be tested directly.
 */

/** Widths offered in the srcset; each is one of Next's default image sizes. */
export const POST_IMAGE_WIDTHS = [640, 828, 1080, 1200, 1920]

/** How wide a post picture is shown: the article column, at most ~760px. */
export const POST_IMAGE_SIZES = '(min-width: 1024px) 760px, 100vw'

const onThisSite = (src: string) => /^\/(?!\/)/.test(src)
const SIZE = /^\d{1,5}$/

export function postImageAttributes(attribs: Record<string, string>): Record<string, string> {
  const src = (attribs.src ?? '').trim()
  const out: Record<string, string> = { src, alt: attribs.alt ?? '', loading: 'lazy', decoding: 'async' }
  if (SIZE.test(attribs.width ?? '') && SIZE.test(attribs.height ?? '')) {
    out.width = attribs.width
    out.height = attribs.height
  }
  if (onThisSite(src)) {
    const width = Number(out.width) || Infinity
    // No copy wider than the file itself, but always at least one.
    const widths = POST_IMAGE_WIDTHS.filter((w, i) => w <= width || i === 0)
    out.srcset = widths.map((w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75 ${w}w`).join(', ')
    out.sizes = POST_IMAGE_SIZES
  }
  return out
}
