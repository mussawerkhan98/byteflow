import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { aboutReasons, linkLabel } from '../app/lib/about-reasons'
import { homeDefaults, mergeHomeBlock } from '../app/lib/home-content'

const services = [
  { slug: 'it-amc-services-dubai', title: 'IT AMC / IT Support' },
  { slug: 'cloud-services-dubai', title: 'Cloud Services' },
]

test('the four default reasons, numbered, each with its picture and a service link', () => {
  const reasons = aboutReasons(mergeHomeBlock('home_about', null), services)
  assert.deepEqual(
    reasons.map((r) => [r.number, r.title, r.kind, r.link.href, r.link.label]),
    [
      ['01', 'Full IT under one roof', 'layers', '/#services', 'Explore all services'],
      ['02', 'Zero hidden costs', 'receipt', '/it-amc-services-dubai', 'Explore IT AMC / IT Support'],
      ['03', 'Rapid on-site response', 'clock', '/it-amc-services-dubai', 'Explore IT AMC / IT Support'],
      ['04', 'Microsoft & cloud ready', 'cloud', '/cloud-services-dubai', 'Explore Cloud Services'],
    ],
  )
})

test('hidden reasons are left out and the rest keep their saved order', () => {
  const [one, two, three, four] = homeDefaults.home_about.lists.highlights
  const block = mergeHomeBlock('home_about', { highlights: [four, { ...one, show: 'no' }, two, three] })
  assert.deepEqual(aboutReasons(block, services).map((r) => [r.number, r.title]), [
    ['01', 'Microsoft & cloud ready'],
    ['02', 'Zero hidden costs'],
    ['03', 'Rapid on-site response'],
  ])
})

test('an unknown picture falls back to its position, and a missing link to contact', () => {
  const block = mergeHomeBlock('home_about', { highlights: [{ title: 'Local team', icon: 'rocket', link: '' }] })
  const [reason] = aboutReasons(block, services)
  assert.equal(reason.kind, 'layers')
  assert.deepEqual(reason.link, { href: '/contact-us', label: 'Find out more' })
})

test('links that are not a service page get plain wording', () => {
  assert.equal(linkLabel('/about-us', services), 'Find out more')
  assert.equal(linkLabel('/cloud-services-dubai?ref=home', services), 'Explore Cloud Services')
})

test('an uploaded picture replaces the preview illustration; none keeps it', () => {
  const [one, two] = homeDefaults.home_about.lists.highlights
  const block = mergeHomeBlock('home_about', { highlights: [{ ...one, image: '/api/media/8/team.webp', image_alt: 'Byteflow team at a client site' }, two] })
  const [withPicture, without] = aboutReasons(block, services)
  assert.deepEqual(withPicture.image, { src: '/api/media/8/team.webp', alt: 'Byteflow team at a client site' })
  assert.equal(without.image, null)
  assert.equal(without.kind, 'receipt')
})
