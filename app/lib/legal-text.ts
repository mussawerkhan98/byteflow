/**
 * The text of a legal page section, as typed in the admin: paragraphs are
 * separated by a blank line, and a line starting "- " is a bullet point.
 * Lines inside a paragraph keep their breaks (an address, say).
 */
export type LegalBlock = { kind: 'paragraph'; lines: string[] } | { kind: 'list'; items: string[] }

export function legalBlocks(text: string): LegalBlock[] {
  const blocks: LegalBlock[] = []
  for (const chunk of String(text ?? '').replace(/\r\n?/g, '\n').split(/\n\s*\n/)) {
    // A blank line ends whatever came before: nothing carries across chunks.
    let current: LegalBlock | null = null
    for (const raw of chunk.split('\n')) {
      const line = raw.trim()
      if (!line) continue
      const bullet = /^[-•*]\s+(.*)$/.exec(line)
      if (bullet) {
        if (current?.kind === 'list') current.items.push(bullet[1])
        else blocks.push((current = { kind: 'list', items: [bullet[1]] }))
      } else if (current?.kind === 'paragraph') {
        current.lines.push(line)
      } else {
        blocks.push((current = { kind: 'paragraph', lines: [line] }))
      }
    }
  }
  return blocks
}

/** "contact-us" style anchor for each section heading, unique on the page. */
export function legalAnchors(titles: string[]): string[] {
  const seen = new Map<string, number>()
  return titles.map((title) => {
    const base = title.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count ? `${base}-${count + 1}` : base
  })
}
