import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { firstSentences, projectCard } from '../app/lib/project-cards'

const project = {
  slug: 'al-mansouri-trading-group',
  title: 'Full IT Infrastructure Overhaul Across Three Dubai Offices',
  description:
    '<p>Three offices running on completely separate setups, no central management. Engineers were firefighting daily. We consolidated everything.</p>',
  category: 'IT Support',
  industry: 'Trading & Distribution',
  bullet_points: ['IT AMC contract covering 62 users', 'Microsoft 365 migration', 'Fortigate firewall deployment', 'Structured cabling'],
  tags: ['IT AMC', 'Microsoft 365', 'Fortigate', 'Cabling', 'Wi-Fi'],
  challenge: '',
  card_image: '',
  card_image_alt: '',
}

test('a card is built from the project as published, linking to its own page', () => {
  const card = projectCard(project, 1)
  assert.equal(card.href, '/projects/al-mansouri-trading-group')
  assert.equal(card.number, '02')
  assert.equal(card.category, 'IT Support')
  assert.equal(card.industry, 'Trading & Distribution')
  assert.equal(card.requirement, 'Three offices running on completely separate setups, no central management. Engineers were firefighting daily.')
})

test('the scope is the first three deliverables and the tags the first four, blanks skipped', () => {
  const card = projectCard({ ...project, bullet_points: [' ', ...project.bullet_points], tags: ['', ...project.tags] })
  assert.deepEqual(card.scope, project.bullet_points.slice(0, 3))
  assert.deepEqual(card.tags, project.tags.slice(0, 4))
})

test('the business requirement typed in the admin wins over the description', () => {
  assert.equal(projectCard({ ...project, challenge: 'Saved requirement.' }).requirement, 'Saved requirement.')
})

test('a picture only when uploaded, with its alt text', () => {
  assert.equal(projectCard(project).image, null)
  const withImage = projectCard({ ...project, card_image: '/api/media/2', card_image_alt: 'Server room after the rebuild' })
  assert.deepEqual(withImage.image, { src: '/api/media/2', alt: 'Server room after the rebuild' })
  assert.equal(projectCard({ ...project, card_image: '/api/media/2' }).image?.alt, project.title)
})

test('a long first sentence is cut at a word, not mid-word', () => {
  const long = `${'word '.repeat(80)}end.`
  const short = firstSentences(long)
  assert.ok(short.length <= 221 && short.endsWith('…') && !/\bwor…$/.test(short))
})
