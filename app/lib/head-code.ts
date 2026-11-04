/**
 * Splits the admin panel's "head" tracking code into the parts that must sit
 * in <head> and the rest.
 *
 * The layout can't set <head>'s innerHTML (React and Next add their own tags
 * there, and replacing them crashed the page), so the admin code is rendered
 * at the top of <body> instead. Scripts and JSON-LD work there, but <meta>
 * and <link> tags -- site verification, preconnects -- only count in <head>.
 * Those are pulled out here and rendered as real elements in <head>.
 *
 * Tags inside <script>, <noscript> or comments are left alone, so a tracking
 * snippet that mentions "<meta" in its code is not taken apart.
 */

export type HeadTag = { tag: 'meta' | 'link'; attrs: Record<string, string> }

// HTML attribute names whose React prop is spelled differently.
const REACT_NAMES: Record<string, string> = {
  'http-equiv': 'httpEquiv',
  charset: 'charSet',
  hreflang: 'hrefLang',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',
  fetchpriority: 'fetchPriority',
  imagesizes: 'imageSizes',
  imagesrcset: 'imageSrcSet',
}

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const pattern = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
  for (const match of source.matchAll(pattern)) {
    const name = match[1].toLowerCase()
    attrs[REACT_NAMES[name] ?? name] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return attrs
}

export function splitHeadCode(code: string): { tags: HeadTag[]; rest: string } {
  const tags: HeadTag[] = []
  // Odd-numbered parts are script, noscript and comment blocks: kept as they are.
  const parts = String(code ?? '').split(/(<script[\s\S]*?<\/script>|<noscript[\s\S]*?<\/noscript>|<!--[\s\S]*?-->)/i)
  const rest = parts
    .map((part, index) => {
      if (index % 2 === 1) return part
      return part.replace(/<(meta|link)\b([^>]*?)\/?>/gi, (_, tag: string, attributes: string) => {
        const attrs = parseAttributes(attributes)
        // Next already sets the charset; a second one is invalid.
        if (tag.toLowerCase() === 'meta' && 'charSet' in attrs) return ''
        tags.push({ tag: tag.toLowerCase() as HeadTag['tag'], attrs })
        return ''
      })
    })
    .join('')
    .trim()
  return { tags, rest }
}
