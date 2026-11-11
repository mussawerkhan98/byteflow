import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  ORG_ID,
  SITE_URL,
  aboutPageSchema,
  absoluteUrl,
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
  founderSchema,
  graph,
  organizationSchema,
  plainText,
  publishesOrganization,
  serviceSchema,
} from '../app/lib/structured-data'

test('every absolute URL is on the canonical www host', () => {
  assert.equal(SITE_URL, 'https://www.byteflow.ae')
  assert.equal(absoluteUrl('/contact-us'), 'https://www.byteflow.ae/contact-us')
  assert.equal(absoluteUrl('contact-us'), 'https://www.byteflow.ae/contact-us')
  assert.equal(absoluteUrl(''), 'https://www.byteflow.ae')
  // An already-absolute CMS image URL is left alone.
  assert.equal(absoluteUrl('https://cdn.example.com/a.png'), 'https://cdn.example.com/a.png')
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

test('the organization id matches the one the admin script publishes', () => {
  // The organization itself comes from the "Address" script in Tracking
  // codes. If this string stops matching its @id, every provider and
  // publisher reference below points at an entity that does not exist.
  assert.equal(ORG_ID, 'https://www.byteflow.ae/#organization')
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

test('a post with an organization names it, with its logo, as author and publisher', () => {
  const post = blogPostingSchema({
    title: 'New office IT setup',
    path: '/new-office-it-setup-dubai',
    image: 'data:image/webp;base64,AAAA',
    published: '2026-10-04T09:30:29.000Z',
    modified: '2026-10-05T11:00:00.000Z',
    wordCount: 1935,
    section: 'IT Support',
    organization: { name: 'Byteflow Information Technology', logo: '/images/logo.png', url: SITE_URL },
  }) as Record<string, unknown>
  const org = post.publisher as Record<string, unknown>
  assert.equal(org['@id'], ORG_ID)
  assert.equal(org.name, 'Byteflow Information Technology')
  assert.deepEqual(org.logo, { '@type': 'ImageObject', url: 'https://www.byteflow.ae/images/logo.png' })
  assert.deepEqual(post.author, org)
  assert.equal(post.wordCount, 1935)
  assert.equal(post.articleSection, 'IT Support')
  assert.equal(post.dateModified, '2026-10-05T11:00:00.000Z')
  // An inline image cannot be fetched by Google, so it is left out.
  assert.ok(!('image' in post))
})

test('the stand-in organization is the node everything else points at', () => {
  assert.equal(organizationSchema['@id'], ORG_ID)
  assert.equal(organizationSchema['@type'], 'ProfessionalService')
})

test('the stand-in is only needed when no admin script publishes the organization', () => {
  const address = `<script type="application/ld+json">{"@id":"${ORG_ID}"}</script>`
  assert.ok(publishesOrganization(address))
  // The same script with its slashes escaped, as some JSON tools write it.
  assert.ok(publishesOrganization(address.replace(/\//g, '\\/')))
  assert.ok(!publishesOrganization('<script>gtag("config", "G-1")</script>'))
  assert.ok(!publishesOrganization(''))
})

test('the About page is about the one organization, not a second description of it', () => {
  const page = aboutPageSchema({ name: 'About Byteflow', description: '<p>Dubai IT company.</p>', path: '/about-us', image: '/images/home/about.png' }) as Record<string, unknown>
  assert.equal(page['@type'], 'AboutPage')
  assert.equal(page.url, 'https://www.byteflow.ae/about-us')
  assert.equal(page.description, 'Dubai IT company.')
  assert.equal(page.primaryImageOfPage, 'https://www.byteflow.ae/images/home/about.png')
  assert.deepEqual(page.about, { '@id': ORG_ID })
  assert.deepEqual(page.mainEntity, { '@id': ORG_ID })
  assert.equal(aboutPageSchema({ name: '  ', path: '/about-us' }), null)
})

test('the founder is only published with a name, and only a personal LinkedIn counts as theirs', () => {
  assert.equal(founderSchema({ name: '', jobTitle: 'Founder & CEO' }), null)
  const person = founderSchema({
    name: 'Jane Doe',
    jobTitle: 'Founder & CEO',
    image: 'data:image/png;base64,AAAA',
    linkedinUrl: 'https://ae.linkedin.com/company/byteflow-techcascade',
  }) as Record<string, unknown>
  assert.equal(person['@type'], 'Person')
  assert.deepEqual(person.worksFor, { '@id': ORG_ID })
  // A company page is not the person's profile, and a pasted data: URL is not an image address.
  assert.equal(person.sameAs, undefined)
  assert.equal(person.image, undefined)
  const linked = founderSchema({ name: 'Jane Doe', linkedinUrl: 'https://www.linkedin.com/in/jane-doe' }) as Record<string, unknown>
  assert.deepEqual(linked.sameAs, ['https://www.linkedin.com/in/jane-doe'])
})
