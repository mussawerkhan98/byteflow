import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { bulletLines, groupedTabs, orderedTabs, pageServices, serviceTab } from '../app/lib/service-tabs'

const blank = {
  excerpt: '',
  description: '',
  image_url: null,
  image_alt: '',
  cta_label: '',
  cta_link: '',
  eyebrow: '',
  tagline: '',
  highlights: '',
  image_caption: '',
}
const amc = { ...blank, slug: 'it-amc-services-dubai', title: 'IT AMC / IT Support' }
const cyber = { ...blank, slug: 'cyber-security', title: 'Cyber Security' }
const landing = { ...blank, slug: 'landing-page-designing', title: 'Landing Page Design' }

test('blank fields fall back to the service page: tagline, four features, headline figure', () => {
  const tab = serviceTab(amc)
  assert.equal(tab.subtitle, 'Predictable IT costs. Zero surprises.')
  assert.equal(tab.bullets.length, 4)
  assert.equal(tab.caption, '24/7 monitoring · 2-hr on-site response')
  assert.equal(tab.eyebrow, 'Keep your business running')
  assert.deepEqual(tab.button, { label: 'Discuss this service', href: '/contact-us' })
  assert.equal(tab.href, '/it-amc-services-dubai')
  assert.equal(tab.image, null)
})

test('the admin’s wording wins, and bullets stop at five', () => {
  const tab = serviceTab({
    ...amc,
    eyebrow: 'Saved eyebrow',
    tagline: 'Saved subtitle',
    highlights: '- One\n• Two\n\nThree\nFour\nFive\nSix',
    image_url: '/api/media/9',
    image_alt: 'Engineer at a server rack',
    image_caption: 'Monitored 24/7',
    cta_label: 'Talk to us',
    cta_link: '/contact-us?service=amc',
  })
  assert.equal(tab.eyebrow, 'Saved eyebrow')
  assert.equal(tab.subtitle, 'Saved subtitle')
  assert.deepEqual(tab.bullets, ['One', 'Two', 'Three', 'Four', 'Five'])
  assert.equal(tab.imageAlt, 'Engineer at a server rack')
  assert.deepEqual(tab.button, { label: 'Talk to us', href: '/contact-us?service=amc' })
})

test('an unsafe button link falls back to the contact page', () => {
  assert.equal(serviceTab({ ...amc, cta_link: 'javascript:alert(1)' }).button.href, '/contact-us')
})

test('an image without alt text still gets a descriptive one', () => {
  assert.equal(serviceTab({ ...cyber, image_url: '/api/media/2' }).imageAlt, 'Cyber Security by Byteflow in Dubai')
})

test('tabs follow the header menu’s order and leave out what it hides', () => {
  const tabs = orderedTabs([amc, cyber, landing], ['/cyber-security', '/#services', '/landing-page-designing', '/cyber-security'])
  assert.deepEqual(tabs.map((t) => t.slug), ['cyber-security', 'landing-page-designing'])
})

test('a menu listing none of the services shows them all, in their own order', () => {
  assert.deepEqual(orderedTabs([amc, cyber], []).map((t) => t.slug), ['it-amc-services-dubai', 'cyber-security'])
})

test('bullet lines drop list markers and blank lines', () => {
  assert.deepEqual(bulletLines('* a\r\n\r\n- b'), ['a', 'b'])
})

test('services sit under the menu groups, and none is lost', () => {
  const tabs = [amc, cyber, landing].map(serviceTab)
  const groups = groupedTabs(tabs, [
    { title: 'Cloud & Security', items: [{ href: '/cyber-security' }, { href: '/missing' }] },
    { title: 'Empty', items: [{ href: '/nothing-here' }] },
    { title: 'Again', items: [{ href: '/cyber-security/' }, { href: '/it-amc-services-dubai?ref=menu' }] },
  ])
  assert.deepEqual(
    groups.map((group) => [group.title, group.tabs.map((tab) => tab.slug)]),
    [
      ['Cloud & Security', ['cyber-security']],
      ['Again', ['it-amc-services-dubai']],
      // Not in the menu: still listed, in a last group with no title.
      ['', ['landing-page-designing']],
    ],
  )
})

test('every built-in service page can stand in for the database', () => {
  assert.ok(pageServices.length >= 9)
  assert.ok(pageServices.every((service) => service.slug && service.title))
})
