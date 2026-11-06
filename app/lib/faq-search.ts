/**
 * Searching the FAQ section: which questions match what was typed, and the
 * pieces of a text to show highlighted.
 *
 * Every word typed must appear in the question or its answer, in any order
 * and any case. No React here, so the rules can be tested directly.
 */

const words = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean)

export function matchesFaq(faq: { question: string; answer: string }, query: string): boolean {
  const text = `${faq.question} ${faq.answer}`.toLowerCase()
  return words(query).every((word) => text.includes(word))
}

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The text cut into pieces, each marked whether it matched a word typed. */
export function highlight(text: string, query: string): { text: string; match: boolean }[] {
  const typed = words(query)
  if (!typed.length) return [{ text, match: false }]
  const pattern = new RegExp(`(${typed.map(escape).join('|')})`, 'gi')
  return text
    .split(pattern)
    .filter(Boolean)
    .map((piece) => ({ text: piece, match: typed.includes(piece.toLowerCase()) }))
}
