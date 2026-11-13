import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { blogStats, blogTopics, featuredPost, findPosts } from '../app/lib/blog-page'

const post = (slug: string, category: string, title: string, excerpt = '', date = 'Nov 1, 2026') => ({ slug, category, title, excerpt, date })
// Newest first, as the posts table returns them.
const posts = [
  post('a', 'Cloud', 'Moving email to Microsoft 365', 'A guide to migrating mail.', 'Nov 4, 2026'),
  post('b', 'Cyber Security', 'Backup rules that stop ransomware', 'Three copies, one offline.'),
  post('c', 'cloud ', 'Choosing Azure or AWS', 'Costs compared.'),
  post('d', 'IT Support', 'What an IT AMC covers', 'Support, visits and backup checks.'),
]

test('the featured article is the one picked, else the newest; an unknown pick falls back', () => {
  assert.deepEqual(featuredPost(posts, 'c'), { post: posts[2], picked: true })
  assert.deepEqual(featuredPost(posts, 'latest'), { post: posts[0], picked: false })
  assert.deepEqual(featuredPost(posts, 'gone'), { post: posts[0], picked: false })
  assert.deepEqual(featuredPost([], 'latest'), { post: null, picked: false })
})

test('the banner counts articles and topics, and dates the newest', () => {
  assert.deepEqual(blogStats(posts), { articles: 4, topics: 3, latest: 'Nov 4, 2026' })
})

test('topics count their articles, spelling differences counted together', () => {
  assert.deepEqual(blogTopics(posts), [
    { category: 'IT Support', count: 1 },
    { category: 'Cloud', count: 2 },
    { category: 'Cyber Security', count: 1 },
  ])
})

test('search needs every word, in the title, excerpt or topic, in any case; topics narrow it', () => {
  assert.deepEqual(findPosts(posts, '', 'backup').map((p) => p.slug), ['b', 'd'])
  assert.deepEqual(findPosts(posts, '', 'BACKUP ransomware').map((p) => p.slug), ['b'])
  assert.deepEqual(findPosts(posts, 'Cloud', '').map((p) => p.slug), ['a', 'c'])
  assert.deepEqual(findPosts(posts, 'Cloud', 'azure').map((p) => p.slug), ['c'])
  assert.deepEqual(findPosts(posts, '', '  ').length, 4)
  assert.deepEqual(findPosts(posts, '', 'printer'), [])
})
