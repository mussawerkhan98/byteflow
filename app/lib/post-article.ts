/**
 * Turns a post's stored HTML into what the article page renders.
 *
 * The content is written in the admin editor (or pasted in from elsewhere),
 * so it arrives with whatever structure the author gave it. This does the
 * presentation work that the content itself should not have to carry:
 *
 * - The page title is the only H1. Any H1 inside the content becomes an H2.
 * - Every H2 and H3 gets a stable id, so the table of contents and shared
 *   links can point at a section.
 * - Tables are wrapped in a scroll container so a wide table scrolls inside
 *   the article on a phone instead of pushing the whole page sideways.
 * - The "Frequently asked questions" section is lifted out into a list of
 *   question/answer pairs, so it can be shown as its own block at the end of
 *   the page and described to search engines as an FAQ.
 *
 * The words themselves are never changed. Pure string work with no imports,
 * so it runs the same in a server component and in the tests. It expects
 * HTML that has already been through sanitize-html.
 */

export type TocItem = { id: string; text: string; level: 2 | 3 }

export type ArticleFaq = { id: string; question: string; answerHtml: string }

export type PreparedArticle = {
  /** The article body, with the FAQ section taken out when one was found. */
  html: string
  /** H2 sections of the body, in order, plus the FAQ section last. */
  toc: TocItem[]
  /** Every H2 and H3 in the body, for anything that wants the full outline. */
  headings: TocItem[]
  faq: { id: string; heading: string; introHtml: string; items: ArticleFaq[] } | null
  wordCount: number
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
}

/** The readable text of a fragment of HTML. */
export function textOf(html: string): string {
  return String(html ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/?(p|div|br|li|h[1-6]|tr|td|th|blockquote|ul|ol|table)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, (m) => {
      const known = ENTITIES[m.toLowerCase()]
      if (known) return known
      const numeric = /^&#(x?)([0-9a-f]+);$/i.exec(m)
      if (numeric) {
        const code = parseInt(numeric[2], numeric[1] ? 16 : 10)
        if (Number.isFinite(code) && code > 0 && code < 0x110000) return String.fromCodePoint(code)
      }
      return ' '
    })
    .replace(/\s+/g, ' ')
    .trim()
}

/** "Stage 1: Before the fit-out" -> "stage-1-before-the-fit-out". */
export function slugify(text: string): string {
  const slug = textOf(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
  return slug || 'section'
}

/** Ids already on the page outside the article, which a heading must not reuse. */
const RESERVED_IDS = new Set(['site-menu', 'main', 'top', 'article-title'])

/** A slug per heading, suffixed -2, -3... when the same text repeats. */
function uniqueIds() {
  const used = new Set<string>()
  return (text: string) => {
    const base = slugify(text)
    let id = base
    for (let n = 2; RESERVED_IDS.has(id) || used.has(id); n += 1) id = `${base}-${n}`
    used.add(id)
    return id
  }
}

/** Content H1s become H2s; the post title is the page's only H1. */
export function demoteH1(html: string): string {
  return String(html ?? '')
    .replace(/<h1(\s[^>]*)?>/gi, (_m, attrs = '') => `<h2${attrs}>`)
    .replace(/<\/h1\s*>/gi, '</h2>')
}

/**
 * Every table gets one scroll wrapper. Wrappers the editor already added are
 * removed first so a table never ends up inside two.
 */
function wrapTables(html: string): string {
  const bare = html.replace(
    /<div class="table-scroll">\s*(<table\b[\s\S]*?<\/table>)\s*<\/div>/gi,
    '$1',
  )
  return bare.replace(
    /<table\b[\s\S]*?<\/table>/gi,
    (table) =>
      `<div class="table-scroll" role="region" aria-label="Scrollable table" tabindex="0">${table}</div>`,
  )
}

const FAQ_HEADING = /\b(faqs?|frequently\s+asked(\s+questions?)?|common\s+questions)\b/i

const isQuestion = (text: string) => /\?\s*$/.test(text)

/** An answer that is bare text gets a paragraph, so it is styled like the rest. */
const asBlock = (html: string) =>
  /^<(p|ul|ol|table|div|blockquote|h[2-4]|pre)\b/i.test(html) ? html : `<p>${html}</p>`

/**
 * Splits an FAQ section into its questions.
 *
 * Three shapes are in use across the posts: each question as an H3 with the
 * answer below it; the same inside the wrapper divs the old site's FAQ plugin
 * left behind; and each question as a bold line opening a paragraph
 * (`<p><strong>Question?</strong><br>Answer</p>`). Anything before the first
 * question is kept as the section's introduction. `rest` is whatever follows
 * the last answer and is not part of the FAQ, which goes back to the body.
 */
function parseFaqItems(
  region: string,
  nextId: (text: string) => string,
): { introHtml: string; items: ArticleFaq[]; rest: string } {
  const byHeading = parseHeadingQuestions(region, nextId)
  const byBold = parseBoldQuestions(region, nextId)
  // Whichever shape the section is actually written in finds more questions.
  // A lone H3 question after bold-question paragraphs is a call to action.
  return byBold.items.length > byHeading.items.length ? byBold : byHeading
}

/** Shape 1: H3 questions. The FAQ ends at the first H3 that is not a question. */
function parseHeadingQuestions(region: string, nextId: (text: string) => string) {
  const items: ArticleFaq[] = []
  const h3 = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi
  const marks: { start: number; end: number; question: string }[] = []
  for (let m = h3.exec(region); m; m = h3.exec(region)) {
    marks.push({ start: m.index, end: m.index + m[0].length, question: textOf(m[1]) })
  }
  if (!marks.length || !isQuestion(marks[0].question)) return { introHtml: '', items, rest: region }
  const stop = marks.findIndex((mark) => !isQuestion(mark.question))
  const questions = stop > 0 ? marks.slice(0, stop) : marks
  const regionEnd = stop > 0 ? marks[stop].start : region.length
  questions.forEach((mark, i) => {
    const answerHtml = region.slice(mark.end, questions[i + 1]?.start ?? regionEnd).trim()
    if (mark.question && textOf(answerHtml)) {
      items.push({ id: nextId(mark.question), question: mark.question, answerHtml: asBlock(answerHtml) })
    }
  })
  if (!items.length) return { introHtml: '', items, rest: region }
  return { introHtml: region.slice(0, marks[0].start).trim(), items, rest: region.slice(regionEnd) }
}

/**
 * Shape 2: a bold question opening a paragraph, the answer after it either in
 * the same paragraph (after a <br>) or in the blocks that follow. The FAQ ends
 * at the first heading after an answer; that heading and everything after it
 * go back to the body.
 */
function parseBoldQuestions(region: string, nextId: (text: string) => string) {
  const items: ArticleFaq[] = []
  const block = /<(p|ul|ol|blockquote|table|pre|h[3-6])\b[\s\S]*?<\/\1>/gi
  const boldQuestion =
    /^<p\b[^>]*>\s*<(strong|b)>([\s\S]*?)<\/\1>\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>$/i
  let intro = ''
  let current: { question: string; parts: string[] } | null = null
  let last = 0
  let rest = ''
  const flush = () => {
    if (!current) return
    const answerHtml = current.parts.join('').trim()
    if (textOf(answerHtml)) {
      items.push({ id: nextId(current.question), question: current.question, answerHtml })
    }
    current = null
  }
  for (let m = block.exec(region); m; m = block.exec(region)) {
    // Words outside any block would be dropped, so this shape does not apply.
    if (textOf(region.slice(last, m.index))) return { introHtml: '', items: [], rest: region }
    last = m.index + m[0].length
    const html = m[0]
    if (/^<h/i.test(html)) {
      if (current || items.length) {
        flush()
        rest = region.slice(m.index)
        break
      }
      intro += html
      continue
    }
    const q = boldQuestion.exec(html)
    const question = q ? textOf(q[2]) : ''
    if (q && isQuestion(question)) {
      flush()
      const after = q[3].trim()
      current = { question, parts: after ? [`<p>${after}</p>`] : [] }
    } else if (current) {
      current.parts.push(html)
    } else {
      intro += html
    }
  }
  if (!rest) {
    if (textOf(region.slice(last))) return { introHtml: '', items: [], rest: region }
    flush()
  }
  if (!items.length) return { introHtml: '', items, rest: region }
  return { introHtml: intro.trim(), items, rest }
}

/** Everything the article page needs from a post's sanitized HTML. */
export function prepareArticle(sanitizedHtml: string): PreparedArticle {
  const nextId = uniqueIds()
  const headings: TocItem[] = []

  // Ids on every H2/H3. Any id the content carried is replaced: ids are only
  // trusted when they come from here.
  let html = demoteH1(sanitizedHtml).replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (_m, tag: string, attrs = '', inner: string) => {
      const clean = attrs.replace(/\s+id\s*=\s*("[^"]*"|'[^']*'|\S+)/i, '')
      const text = textOf(inner)
      if (!text) return `<${tag}${clean}>${inner}</${tag}>`
      const id = nextId(text)
      headings.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 })
      return `<${tag}${clean} id="${id}">${inner}</${tag}>`
    },
  )

  const wordCount = textOf(html).split(' ').filter(Boolean).length

  // The FAQ section: from its heading (H2, H3 or H4) up to the next H2.
  let faq: PreparedArticle['faq'] = null
  const headingTag = /<(h[234])\b([^>]*)>([\s\S]*?)<\/\1>/gi
  for (let m = headingTag.exec(html); m; m = headingTag.exec(html)) {
    const heading = textOf(m[3])
    if (!FAQ_HEADING.test(heading) || isQuestion(heading)) continue
    const start = m.index
    const regionStart = m.index + m[0].length
    const after = html.slice(regionStart)
    const nextH2 = after.search(/<h2\b/i)
    const raw = nextH2 >= 0 ? after.slice(0, nextH2) : after
    // Wrapper divs (the old FAQ plugin's, the table scroller's) carry no
    // words, and answers are cut from between them, so they come off first.
    const region = raw.replace(/<\/?div\b[^>]*>/gi, '')
    const parsed = parseFaqItems(region, nextId)
    if (!parsed.items.length) continue

    const ownId = /\sid="([^"]+)"/.exec(m[2])?.[1]
    faq = {
      id: ownId ?? nextId(heading),
      heading,
      introHtml: wrapTables(parsed.introHtml),
      items: parsed.items.map((item) => ({ ...item, answerHtml: wrapTables(item.answerHtml) })),
    }
    html =
      html.slice(0, start) + parsed.rest + (nextH2 >= 0 ? after.slice(nextH2) : '')
    // Question headings now live in the FAQ block, not the body outline.
    const kept = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((id) => id[1]))
    for (let i = headings.length - 1; i >= 0; i -= 1) {
      if (!kept.has(headings[i].id)) headings.splice(i, 1)
    }
    break
  }

  html = wrapTables(html)

  const toc: TocItem[] = headings.filter((h) => h.level === 2)
  if (faq) toc.push({ id: faq.id, text: faq.heading, level: 2 })

  return { html: html.trim(), toc, headings, faq, wordCount }
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/**
 * A date as the admin stores it -- "Oct 4, 2026", "2026-10-04" or
 * "2026-10-04 09:30:29" -- as a Date at UTC, or null when it is not one.
 * Parsed by hand so the server's time zone can never shift the day.
 */
export function parseStoredDate(value: unknown): Date | null {
  const text = String(value ?? '').trim()
  if (!text) return null
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/.exec(text)
  if (iso) {
    const [, y, mo, d, h = '0', mi = '0', s = '0', zone] = iso
    if (zone && zone !== 'Z') {
      const parsed = new Date(text.replace(' ', 'T'))
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    const at = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s))
    return Number.isNaN(at.getTime()) ? null : at
  }
  const named = /^([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(text)
  if (named) {
    const month = MONTHS.indexOf(named[1].toLowerCase())
    if (month < 0) return null
    return new Date(Date.UTC(+named[3], month, +named[2]))
  }
  const dayFirst = /^(\d{1,2})\s+([a-z]{3})[a-z]*\.?,?\s+(\d{4})$/i.exec(text)
  if (dayFirst) {
    const month = MONTHS.indexOf(dayFirst[2].toLowerCase())
    if (month < 0) return null
    return new Date(Date.UTC(+dayFirst[3], month, +dayFirst[1]))
  }
  return null
}

const sameDay = (a: Date, b: Date) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10)

/**
 * When a post was published and last changed.
 *
 * The publication date typed in the admin wins over the row's creation time:
 * posts imported from the old site were all created on the day of the import,
 * so `created_at` alone would date years-old articles to that day. When both
 * fall on the same day, `created_at` is used for its time of day.
 */
export function postDates(input: {
  date?: string | null
  created_at?: string | null
  updated_at?: string | null
}): { published: Date | null; modified: Date | null } {
  const typed = parseStoredDate(input.date)
  const created = parseStoredDate(input.created_at)
  const published = typed && created && sameDay(typed, created) ? created : typed ?? created
  const updated = parseStoredDate(input.updated_at)
  const modified = updated && published && updated > published ? updated : published
  return { published, modified }
}
