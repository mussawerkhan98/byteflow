import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { servicesForPost } from '../app/lib/post-services'

const slugs = (title: string, category = '') =>
  servicesForPost(title, category).map((s) => s.slug)

test('the attendance guides point at AMC first, because that is who reads them', () => {
  // This is the page carrying most of the site's impressions.
  assert.deepEqual(slugs('ZKTeco Attendance System Setup Guide', 'IT Support'), [
    'it-amc-services-dubai',
    'system-integration',
    'cyber-security',
  ])
  assert.deepEqual(slugs('UA300 Installation in Dubai')[0], 'it-amc-services-dubai')
  assert.deepEqual(slugs('UA760 Biometric Attendance System')[0], 'it-amc-services-dubai')
})

test('an article leads with the service it is actually about', () => {
  assert.equal(slugs('Stop Cyberattacks In Their Tracks')[0], 'cyber-security')
  assert.equal(slugs('Why Migrate to Microsoft 365')[0], 'cloud-services-dubai')
  assert.equal(slugs('Cost savings with Azure infrastructure')[0], 'cloud-services-dubai')
  assert.equal(slugs('Software Development Company in Dubai')[0], 'website-development')
})

test('the first matching rule wins, so the specific topic beats the general one', () => {
  // This title contains both "biometric" and "security". The attendance rule
  // is listed first, so it decides.
  assert.equal(slugs('Biometric security for Dubai offices')[0], 'it-amc-services-dubai')
})

test('AMC is offered on every post, including ones no rule matches', () => {
  for (const title of [
    'ZKTeco Attendance System Setup Guide',
    'Stop Cyberattacks In Their Tracks',
    'Why Migrate to Microsoft 365',
    'Five questions to ask an IT company in Dubai',
    '',
  ]) {
    assert.ok(
      slugs(title).includes('it-amc-services-dubai'),
      `AMC missing from "${title}"`,
    )
  }
})

test('every post gets exactly three links, never a wall of them', () => {
  for (const title of ['ZKTeco setup', 'ransomware', 'azure', 'nothing in particular', '']) {
    assert.equal(servicesForPost(title).length, 3, `wrong count for "${title}"`)
  }
})

test('a service with no page is dropped rather than linked to a 404', () => {
  const links = servicesForPost('ZKTeco Attendance System', '', ['it-amc-services-dubai'])
  assert.deepEqual(links.map((l) => l.slug), ['it-amc-services-dubai'])
})

test('missing or odd input does not throw', () => {
  assert.equal(servicesForPost(null).length, 3)
  assert.equal(servicesForPost(undefined, undefined).length, 3)
  assert.equal(servicesForPost(123, {}).length, 3)
})

test('the anchor text says what the reader is clicking towards', () => {
  const amc = servicesForPost('ZKTeco setup').find((s) => s.slug === 'it-amc-services-dubai')
  // "IT AMC" alone is what every other link on the site already says; the
  // phrase people search for is the one worth linking with.
  assert.equal(amc?.label, 'IT AMC support in Dubai')
})
