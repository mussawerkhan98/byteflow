import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  ORG_ID,
  SITE_URL,
  absoluteUrl,
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  organizationSchema,
  plainText,
  serviceSchema,
} from '../app/lib/structured-data'

const settings = {
  business_name: 'Byteflow Information Technology',
  logo_url: '/uploads/logo.png',
  header_phone: '+971 54 328 2042',
  primary_email: 'info@byteflow.ae',
  physical_address: 'Dubai, United Arab Emirates',
  business_hours: 'Monday–Saturday, 9:00 AM–6:00 PM',
  facebook_url: 'https://m.facebook.com/byteflow.ae/',
  instagram_url: 'https://www.instagram.com/byteflow.ae/',
  linkedin_url: '',
  tiktok_url: 'not a url',
}

test('every absolute URL is on the canonical www host', () => {
  assert.equal(SITE_URL, 'https://www.byteflow.ae')
  assert.equal(absoluteUrl('/contact-us'), 'https://www.byteflow.ae/contact-us')
  assert.equal(absoluteUrl('contact-us'), 'https://www.byteflow.ae/contact-us')
  assert.equal(absoluteUrl(''), 'https://www.byteflow.ae')
  // An already-absolute CMS image URL is left alone.
  assert.equal(absoluteUrl('https://cdn.example.com/a.png'), 'https://cdn.example.com/a.png')
})

test('the organization carries address, phone and real social links only', () => {
  const org = organizationSchema(settings) as Record<string, unknown>
  assert.deepEqual(org['@type'], ['Organization', 'ProfessionalService'])
  assert.equal(org['@id'], ORG_ID)
  assert.equal(org.telephone, '+971 54 328 2042')
  assert.equal(org.logo, 'https://www.byteflow.ae/uploads/logo.png')
  // Empty and malformed entries are dropped rather than published.
  assert.deepEqual(org.sameAs, [
    'https://m.facebook.com/byteflow.ae/',
    'https://www.instagram.com/byteflow.ae/',
  ])
  const address = org.address as Record<string, unknown>
  assert.equal(address.addressCountry, 'AE')
})

test('missing settings produce a usable organization, not a broken one', () => {
  const org = organizationSchema(null) as Record<string, unknown>
  assert.equal(org.name, 'Byteflow Information Technology')
  assert.ok(!('telephone' in org))
  assert.ok(!('address' in org))
  assert.ok(!('sameAs' in org))
})

test('HTML answers become plain text with entities decoded', () => {
  assert.equal(
    plainText('<p>Yes &amp; always.</p><p>Within <strong>2 hours</strong>.</p>'),
    'Yes & always. Within 2 hours.',
  )
})

test('FAQ markup drops incomplete and duplicate questions', () => {
  const schema = faqPageSchema([
    { q: 'Do you cover Dubai?', a: '<p>Yes.</p>' },
    { question: 'do you cover dubai?', answer: 'Duplicate, different case.' },
    { q: 'No answer here', a: '   ' },
    { q: '', a: 'No question here' },
    { question: 'What is an AMC?', answer: 'An annual maintenance contract.' },
  ]) as Record<string, unknown>
  const entities = schema.mainEntity as Record<string, unknown>[]
  assert.equal(entities.length, 2)
  assert.equal(entities[0].name, 'Do you cover Dubai?')
  assert.equal(
    (entities[0].acceptedAnswer as Record<string, unknown>).text,
    'Yes.',
  )
})

test('no FAQs means no FAQ markup at all', () => {
  assert.equal(faqPageSchema([]), null)
  assert.equal(faqPageSchema([{ q: 'Only a question', a: '' }]), null)
})

test('a service points back at the one organization', () => {
  const service = serviceSchema({
    name: 'IT AMC Services',
    description: '<p>Annual maintenance for <b>UAE</b> businesses.</p>',
    path: '/it-amc-services-dubai',
  }) as Record<string, unknown>
  assert.equal(service.name, 'IT AMC Services')
  assert.equal(service.description, 'Annual maintenance for UAE businesses.')
  assert.equal(service.url, 'https://www.byteflow.ae/it-amc-services-dubai')
  assert.deepEqual(service.provider, { '@id': ORG_ID })
})

test('a breadcrumb needs at least two steps to be worth publishing', () => {
  assert.equal(breadcrumbSchema([{ name: 'Home', path: '/' }]), null)
  const trail = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'What is IT AMC', path: '/what-is-it-amc-dubai' },
  ]) as Record<string, unknown>
  const items = trail.itemListElement as Record<string, unknown>[]
  assert.deepEqual(items.map((i) => i.position), [1, 2, 3])
  assert.equal(items[2].item, 'https://www.byteflow.ae/what-is-it-amc-dubai')
})

test('an article dates itself, and falls back to the business as author', () => {
  const post = blogPostingSchema({
    title: 'What is IT AMC in Dubai',
    description: 'A guide.',
    path: '/what-is-it-amc-dubai',
    published: '2026-01-15 10:30:00',
  }) as Record<string, unknown>
  assert.equal(post.headline, 'What is IT AMC in Dubai')
  assert.ok(String(post.datePublished).startsWith('2026-01-15'))
  // dateModified defaults to the publish date rather than being omitted.
  assert.equal(post.dateModified, post.datePublished)
  assert.deepEqual(post.author, { '@id': ORG_ID })
})

test('an unparseable date is left out rather than published as garbage', () => {
  const post = blogPostingSchema({
    title: 'Post',
    path: '/post',
    published: 'not a date',
  }) as Record<string, unknown>
  assert.ok(!('datePublished' in post))
})

test('the graph drops empty nodes and disappears when all are empty', () => {
  assert.equal(graph(null, undefined), null)
  const g = graph(null, serviceSchema({ name: 'X', path: '/x' })) as Record<string, unknown>
  assert.equal(g['@context'], 'https://schema.org')
  assert.equal((g['@graph'] as unknown[]).length, 1)
})

test('markup cannot be used to break out of the script tag', () => {
  // The component escapes `<`, but the text should also arrive clean.
  const schema = faqPageSchema([
    { q: 'Safe?</script><script>alert(1)</script>', a: 'Yes.' },
  ]) as Record<string, unknown>
  const name = String((schema.mainEntity as Record<string, unknown>[])[0].name)
  assert.ok(!name.includes('<script'))
  assert.ok(!name.includes('</script'))
})
