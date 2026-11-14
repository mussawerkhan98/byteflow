/*
 * Splitting a page block's text (Pages → a page's blocks) for its layout.
 */

/** "Essential — AED 30 per user…": a short label, a dash, then its description. */
const LABELLED = /^([^\n]{2,60}?)\s+[—–]\s+([\s\S]+)$/

/**
 * A page block's text, split for its layout: the paragraphs before the first
 * labelled one (the lead), the labelled ones (each a card), and whatever
 * follows them (the closing note). Only the dash between a label and its
 * description is dropped; every word is kept. With no labelled paragraphs
 * it is all lead.
 */
export type BlockParts = { lead: string[]; items: { label: string; text: string }[]; closing: string[] }

export function blockParts(text: string): BlockParts {
  const paragraphs = text
    .split(/\n\s*\n|\n(?=[^\n]{2,60}?\s+[—–]\s)/)
    .map((p) => p.trim())
    .filter(Boolean)
  const first = paragraphs.findIndex((p) => LABELLED.test(p))
  if (first < 0) return { lead: paragraphs, items: [], closing: [] }
  let last = first
  while (last + 1 < paragraphs.length && LABELLED.test(paragraphs[last + 1])) last++
  const items = paragraphs.slice(first, last + 1).map((p) => {
    const [, label, rest] = p.match(LABELLED) as RegExpMatchArray
    return { label: label.trim(), text: rest.trim() }
  })
  return { lead: paragraphs.slice(0, first), items, closing: paragraphs.slice(last + 1) }
}
