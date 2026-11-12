import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { firstSentence, serviceDefaults, serviceSectionKeys, serviceSections } from '../app/lib/service-page'
import { services } from '../app/lib/services-data'

const bySlug = (slug: string) => services.find((service) => service.slug === slug)!

test('a highlight is the first sentence of its feature', () => {
  assert.equal(firstSentence('One thing. Then another.'), 'One thing.')
  assert.equal(firstSentence('No full stop here'), 'No full stop here')
})

test('each service page starts from its own content, keeping its search title', () => {
  const page = bySlug('cyber-security')
  const blocks = serviceDefaults(page)
  assert.equal(blocks.seo.fields.title, 'Cyber Security Services Dubai | Firewall & EDR | Byteflow')
  assert.deepEqual(
    blocks.features.lists.features.map((item) => item.title),
    page.features.map((feature) => feature.title),
  )
  assert.equal(blocks.faq.lists.faqs.length, page.faqs.length)
  assert.deepEqual(
    blocks.related.lists.services.map((item) => item.title),
    page.relatedSlugs,
  )
})

test('no made-up figures: only the site-wide ones', () => {
  for (const page of services) {
    const titles = serviceDefaults(page).figures.lists.stats.map((stat) => stat.title)
    assert.deepEqual(titles, ['{clients}', '{rating}★', '{years}+'], page.slug)
  }
})

test('sections with no real content yet start switched off; coverage only where engineers go on site', () => {
  const shown = (slug: string) => serviceSections(serviceDefaults(bySlug(slug)).layout.lists.sections)
  for (const key of ['plans', 'compare', 'sla', 'scope', 'costs'] as const) assert.ok(!shown('cyber-security').includes(key), key)
  assert.ok(shown('cyber-security').includes('coverage'))
  assert.ok(!shown('graphics-designing').includes('coverage'))
  // Every section is offered, in the starting order, on the Sections tab.
  assert.deepEqual(
    serviceDefaults(bySlug('cyber-security')).layout.lists.sections.map((item) => item.title),
    [...serviceSectionKeys],
  )
})

test('the FAQs come before the client reviews, and the contact form closes the page', () => {
  const order = serviceSections(serviceDefaults(bySlug('website-development')).layout.lists.sections)
  assert.ok(order.indexOf('faq') < order.indexOf('reviews'))
  assert.equal(order.at(-1), 'contact')
})
