import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  demoteH1,
  parseStoredDate,
  postDates,
  prepareArticle,
  slugify,
  textOf,
} from '../app/lib/post-article'

test('content H1s become H2s so the title stays the only H1', () => {
  assert.equal(demoteH1('<h1 class="x">A</h1><H1>B</H1>'), '<h2 class="x">A</h2><h2>B</h2>')
  const { html } = prepareArticle(demoteH1('<h1>Intro</h1><p>Text</p>'))
  assert.ok(!/<h1/i.test(html))
  assert.match(html, /<h2 id="intro">Intro<\/h2>/)
})

test('every H2 and H3 gets a unique id, and only H2s go in the contents', () => {
  const { html, toc, headings } = prepareArticle(
    '<h2>Why it matters</h2><p>a</p><h3>Costs &amp; fees</h3><p>b</p><h2>Why it matters</h2><p>c</p>',
  )
  assert.deepEqual(
    headings.map((h) => h.id),
    ['why-it-matters', 'costs-and-fees', 'why-it-matters-2'],
  )
  assert.deepEqual(toc.map((h) => h.id), ['why-it-matters', 'why-it-matters-2'])
  assert.match(html, /<h3 id="costs-and-fees">/)
})

test('an id carried in the content is replaced by the generated one', () => {
  const { html } = prepareArticle('<h2 id="bad id">Title</h2>')
  assert.equal(html, '<h2 id="title">Title</h2>')
})

test('tables are wrapped in exactly one scroll container', () => {
  const wrapped = prepareArticle('<div class="table-scroll"><table><tr><td>1</td></tr></table></div>').html
  const bare = prepareArticle('<table><tr><td>1</td></tr></table>').html
  for (const html of [wrapped, bare]) {
    assert.equal(html.match(/table-scroll/g)?.length, 1)
    assert.match(html, /^<div class="table-scroll" role="region"[^>]*tabindex="0"><table>/)
  }
})

test('an FAQ section with H3 questions is lifted out of the body', () => {
  const article = prepareArticle(
    '<h2>Intro</h2><p>Body text here.</p>' +
      '<h2>Frequently asked questions</h2><p>Quick answers.</p>' +
      '<h3>How long does it take?</h3><p>6 to 8 weeks.</p>' +
      '<h3>Do I need a server?</h3><p>Usually not.</p><ul><li>Cloud works</li></ul>' +
      '<h2>Conclusion</h2><p>Done.</p>',
  )
  assert.ok(article.faq)
  assert.equal(article.faq.heading, 'Frequently asked questions')
  assert.equal(article.faq.introHtml, '<p>Quick answers.</p>')
  assert.deepEqual(article.faq.items.map((i) => i.question), ['How long does it take?', 'Do I need a server?'])
  assert.equal(article.faq.items[1].answerHtml, '<p>Usually not.</p><ul><li>Cloud works</li></ul>')
  // The body keeps the sections either side of the FAQ.
  assert.ok(!article.html.includes('How long does it take'))
  assert.ok(article.html.includes('<h2 id="conclusion">Conclusion</h2>'))
  // The FAQ is the last entry in the contents, matching where it is shown.
  assert.deepEqual(article.toc.map((t) => t.id), ['intro', 'conclusion', 'frequently-asked-questions'])
})

test('an FAQ written as bold questions in paragraphs is parsed too', () => {
  const article = prepareArticle(
    '<p>Body.</p><h2>FAQs</h2>' +
      '<p dir="ltr"><strong>How much does it cost?</strong><br>\nIt depends on size.</p>' +
      '<p><strong>Is VAT included?</strong></p><p>No, VAT is added.</p>',
  )
  assert.ok(article.faq)
  assert.deepEqual(
    article.faq.items.map((i) => [i.question, textOf(i.answerHtml)]),
    [
      ['How much does it cost?', 'It depends on size.'],
      ['Is VAT included?', 'No, VAT is added.'],
    ],
  )
})

test('a heading mentioning FAQs with nothing parseable stays in the body', () => {
  const article = prepareArticle('<h2>FAQ</h2><p>Call us with any question.</p>')
  assert.equal(article.faq, null)
  assert.ok(article.html.includes('Call us with any question.'))
})

test('the words are never changed', () => {
  const source =
    '<h1>Title</h1><p>One &amp; two.</p><table><tr><td>Cell</td></tr></table><h2>Next</h2><p>Three.</p>'
  const { html } = prepareArticle(demoteH1(source))
  assert.equal(textOf(html), textOf(source))
})

test('word count reads the text, not the markup', () => {
  assert.equal(prepareArticle('<p>One <strong>two</strong> three.</p>').wordCount, 3)
})

test('slugs are plain ASCII and never empty', () => {
  assert.equal(slugify('Stage 1: Before the fit-out (8 to 10 weeks)'), 'stage-1-before-the-fit-out-8-to-10-weeks')
  assert.equal(slugify('???'), 'section')
})

test('stored dates parse at UTC in every format the admin writes', () => {
  assert.equal(parseStoredDate('Oct 4, 2026')?.toISOString(), '2026-10-04T00:00:00.000Z')
  assert.equal(parseStoredDate('October 4, 2026')?.toISOString(), '2026-10-04T00:00:00.000Z')
  assert.equal(parseStoredDate('2026-10-04 09:30:29')?.toISOString(), '2026-10-04T09:30:29.000Z')
  assert.equal(parseStoredDate('2026-10-04T09:30:29.000Z')?.toISOString(), '2026-10-04T09:30:29.000Z')
  assert.equal(parseStoredDate('soon'), null)
})

test('the typed publication date wins over an import-day created_at', () => {
  const { published, modified } = postDates({
    date: 'Jan 3, 2026',
    created_at: '2026-05-01 12:00:00',
  })
  assert.equal(published?.toISOString(), '2026-01-03T00:00:00.000Z')
  assert.equal(modified?.toISOString(), published?.toISOString())
})

test('created_at supplies the time when it is the same day, and updated_at the modified date', () => {
  const { published, modified } = postDates({
    date: 'Oct 4, 2026',
    created_at: '2026-10-04 09:30:29',
    updated_at: '2026-10-05 11:00:00',
  })
  assert.equal(published?.toISOString(), '2026-10-04T09:30:29.000Z')
  assert.equal(modified?.toISOString(), '2026-10-05T11:00:00.000Z')
})

test('a question-shaped call to action after bold FAQ questions is not taken as the FAQ', () => {
  const article = prepareArticle(
    '<h2>Frequently asked questions</h2>' +
      '<p><strong>What does it mean?</strong></p><p>It means this.</p>' +
      '<p><strong>Why does it matter?</strong></p><p>Because of that.</p>' +
      '<h3>Need help organizing your website?</h3><p>Talk to us.</p>',
  )
  assert.ok(article.faq)
  assert.deepEqual(article.faq.items.map((i) => i.question), ['What does it mean?', 'Why does it matter?'])
  // The call to action stays in the article body, words intact.
  assert.match(article.html, /<h3 id="need-help-organizing-your-website">Need help organizing your website\?<\/h3><p>Talk to us\.<\/p>/)
})

test('a wrapper div that spans the FAQ heading never leaves an unclosed tag behind', () => {
  const article = prepareArticle(
    '<p>Body.</p><div><p>Intro inside a wrapper.</p><h2>FAQs</h2>' +
      '<p><strong>Is it balanced?</strong></p><p>Yes.</p></div><p>After.</p>' +
      '<div class="table-scroll"><table><tr><td>1</td></tr></table></div>',
  )
  assert.ok(article.faq)
  const count = (re: RegExp) => (article.html.match(re) ?? []).length
  assert.equal(count(/<div\b/g), count(/<\/div>/g))
  // With no H2 after it, the FAQ runs to the end, so the table is part of the
  // last answer -- wrapped once, and balanced there too.
  const answer = article.faq.items[0].answerHtml
  assert.equal((answer.match(/table-scroll/g) ?? []).length, 1)
  assert.equal((answer.match(/<div\b/g) ?? []).length, (answer.match(/<\/div>/g) ?? []).length)
})
