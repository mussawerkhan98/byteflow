import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { projectFilters, projectPhoto, projectStats, relatedProjects, serviceForCategory } from '../app/lib/project-page'

const row = (slug: string, category: string, industry: string, image_url: string | null = null) => ({ slug, title: slug, category, industry, image_url, card_image: '', card_image_alt: '' })
const projects = [
  row('a', 'IT Support', 'Trading'),
  row('b', 'Cyber Security', 'Logistics', '/api/media/1/b.webp'),
  row('c', 'Web & Apps', 'Legal'),
  row('d', 'Cyber Security', 'Finance'),
  row('e', 'Cloud Services', 'Logistics'),
]

test('the filters are the categories in first-seen order, with their counts', () => {
  assert.deepEqual(projectFilters([...projects, row('f', ' ', 'X')]), [
    { category: 'IT Support', count: 1 },
    { category: 'Cyber Security', count: 2 },
    { category: 'Web & Apps', count: 1 },
    { category: 'Cloud Services', count: 1 },
  ])
})

test('the banner figures count the published projects, services and industries', () => {
  assert.deepEqual(projectStats(projects), { projects: 5, services: 4, industries: 4 })
})

test('a category links to its service page, by alias or by the service name; unknown ones link nowhere', () => {
  assert.deepEqual(serviceForCategory('IT Support'), { title: 'IT AMC / IT Support', href: '/it-amc-services-dubai' })
  assert.equal(serviceForCategory('web & apps')?.href, '/website-development')
  assert.equal(serviceForCategory('Data Backup & Recovery')?.href, '/data-backup-recovery')
  assert.equal(serviceForCategory('Catering'), null)
})

test("a project shows its own picture, else its card picture, else a scene for its kind of work", () => {
  assert.equal(projectPhoto(projects[1]).src, '/api/media/1/b.webp')
  assert.deepEqual(projectPhoto({ ...projects[0], card_image: '/c.webp', card_image_alt: 'Dashboard' }), { src: '/c.webp', alt: 'Dashboard', brief: '' })
  assert.notEqual(projectPhoto(projects[0]).src, projectPhoto(projects[3]).src)
  assert.ok(projectPhoto(projects[2]).src)
})

test('related projects: same category first, then same industry, then the rest, never itself', () => {
  assert.deepEqual(relatedProjects(projects, projects[1]).map((p) => p.slug), ['d', 'e', 'a'])
  assert.deepEqual(relatedProjects(projects, projects[0], 2).map((p) => p.slug), ['b', 'c'])
})
