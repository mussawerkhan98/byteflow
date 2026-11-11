import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { finderSituations, groupAnchors, introFor, namedServices, serviceSlugOf, shown, withServiceCount } from '../app/lib/services-page'

const service = (slug: string) => ({ slug, href: `/${slug}`, title: slug, subtitle: '' })

test('a finder situation lists its published services, in order and once each', () => {
  const services = [service('cyber-security'), service('data-backup-recovery'), service('it-amc-services-dubai')]
  const [situation] = finderSituations(
    [{ title: 'Ransomware', description: 'd', service1: 'data-backup-recovery', service2: 'not-published', service3: 'data-backup-recovery' }],
    services,
  )
  assert.deepEqual(
    situation.services.map((s) => s.slug),
    ['data-backup-recovery'],
  )
})

test('a finder situation that points nowhere is left out', () => {
  assert.deepEqual(finderSituations([{ title: 'Branding', description: '', service1: 'graphics-designing', service2: '', service3: '' }], [service('cyber-security')]), [])
  assert.deepEqual(finderSituations([{ title: '', description: '', service1: 'cyber-security', service2: '', service3: '' }], [service('cyber-security')]), [])
})

test('a group intro is found by the group name, whatever the case and spacing', () => {
  const intros = [
    { title: 'Cloud & Security', description: 'Cloud' },
    { title: 'IT Support & Infrastructure', description: 'Support' },
  ]
  assert.equal(introFor(intros, 'cloud  &  security')?.description, 'Cloud')
  assert.equal(introFor(intros, 'Digital & Creative'), undefined)
  // The untitled group of services the menu doesn't list has no intro.
  assert.equal(introFor([{ title: '', description: 'x' }], ''), undefined)
})

test('each group gets its own address on the page', () => {
  assert.deepEqual(groupAnchors(['IT Support & Infrastructure', 'Cloud & Security', '']), [
    'it-support-infrastructure',
    'cloud-security',
    'services-group-3',
  ])
  // A repeated name takes its place instead, so no two groups share one.
  assert.deepEqual(groupAnchors(['Cloud', 'cloud']), ['cloud', 'services-group-2'])
})

test('another page names its unnamed or repeated anchors after itself', () => {
  assert.deepEqual(groupAnchors(['Clinics & Healthcare', '', 'Clinics & Healthcare'], 'industry'), ['clinics-healthcare', 'industry-2', 'industry-3'])
})

test('an industry lists the published services it names, and none when it names none', () => {
  const services = [service('cyber-security'), service('cloud-services-dubai')]
  assert.deepEqual(
    namedServices({ service1: 'cloud-services-dubai', service2: 'gone', service3: 'cyber-security' }, services).map((s) => s.slug),
    ['cloud-services-dubai', 'cyber-security'],
  )
  assert.deepEqual(namedServices({ service1: '', service2: '', service3: '' }, services), [])
})

test('{services} is the number of services on the page', () => {
  assert.equal(withServiceCount('{services}', 9), '9')
  assert.equal(withServiceCount('{services} services, {services} teams', 3), '3 services, 3 teams')
  assert.equal(withServiceCount('{clients}', 9), '{clients}')
})

test('a section shows unless it is switched off', () => {
  assert.equal(shown('yes'), true)
  assert.equal(shown(''), true)
  assert.equal(shown(undefined), true)
  assert.equal(shown('no'), false)
})

test('the featured button names the service it opens', () => {
  assert.equal(serviceSlugOf('/it-amc-services-dubai'), 'it-amc-services-dubai')
  assert.equal(serviceSlugOf('/it-amc-services-dubai/#plans'), 'it-amc-services-dubai')
  assert.equal(serviceSlugOf('https://example.com/it-amc'), '')
  assert.equal(serviceSlugOf('/blog/post'), '')
})
