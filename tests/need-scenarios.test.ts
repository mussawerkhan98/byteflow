import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { homeDefaults, mergeHomeBlock } from '../app/lib/home-content'
import { needScenarios } from '../app/lib/need-scenarios'

const services = [
  { slug: 'system-integration', title: 'System Integration' },
  { slug: 'cyber-security', title: 'Cyber Security' },
  { slug: 'website-development', title: 'Website / Apps / Bots' },
]

test('the three default scenarios link to their services under the services’ own names', () => {
  const scenarios = needScenarios(mergeHomeBlock('home_needs', null), services)
  assert.deepEqual(
    scenarios.map((s) => [s.number, s.label, s.link?.href, s.link?.label]),
    [
      ['01', 'A new office', '/system-integration', 'System Integration'],
      ['02', 'A safer business', '/cyber-security', 'Cyber Security'],
      ['03', 'More customers', '/website-development', 'Website / Apps / Bots'],
    ],
  )
})

test('hidden scenarios are left out and the rest renumbered in their saved order', () => {
  const [office, safer, more] = homeDefaults.home_needs.lists.scenarios
  const block = mergeHomeBlock('home_needs', { scenarios: [more, { ...office, show: 'no' }, safer] })
  const scenarios = needScenarios(block, services)
  assert.deepEqual(scenarios.map((s) => [s.number, s.label]), [['01', 'More customers'], ['02', 'A safer business']])
})

test('a scenario whose service is unpublished keeps its text but loses the link', () => {
  const scenarios = needScenarios(mergeHomeBlock('home_needs', null), services.slice(1))
  assert.equal(scenarios[0].title, 'Moving or opening an office.')
  assert.equal(scenarios[0].link, null)
})

test('no more than three columns', () => {
  const extra = homeDefaults.home_needs.lists.scenarios
  assert.equal(needScenarios(mergeHomeBlock('home_needs', { scenarios: [...extra, ...extra] }), services).length, 3)
})

test('an uploaded picture replaces the drawing; none keeps it', () => {
  const [office, safer] = homeDefaults.home_needs.lists.scenarios
  const block = mergeHomeBlock('home_needs', { scenarios: [{ ...office, image: '/api/media/7/office.webp', image_alt: 'Engineers cabling a new office' }, safer] })
  const [withPicture, without] = needScenarios(block, services)
  assert.deepEqual(withPicture.image, { src: '/api/media/7/office.webp', alt: 'Engineers cabling a new office' })
  assert.equal(without.image, null)
})
