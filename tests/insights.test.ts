import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { mergeHomeBlock } from '../app/lib/home-content'
import { categoryHref, insightPicks } from '../app/lib/insights'

// Newest first, as getPosts returns them.
const posts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((slug, i) => ({
  slug,
  category: ['Cloud', 'IT Support', 'cyber  security', 'Cloud', 'Web Development', 'Cloud', 'Cloud'][i],
}))

test('by default the newest post is featured and the next five are listed', () => {
  const { featured, picked, list } = insightPicks(mergeHomeBlock('home_insights', null), posts)
  assert.equal(featured?.slug, 'a')
  assert.equal(picked, false)
  assert.deepEqual(list.map((p) => p.slug), ['b', 'c', 'd', 'e', 'f'])
})

test('a picked post is featured, marked as picked and left out of the list', () => {
  const { featured, picked, list } = insightPicks(mergeHomeBlock('home_insights', { featured: 'c', list_count: '4' }), posts)
  assert.equal(featured?.slug, 'c')
  assert.equal(picked, true)
  assert.deepEqual(list.map((p) => p.slug), ['a', 'b', 'd', 'e'])
})

test('a picked post that is no longer published falls back to the newest, not marked as picked', () => {
  const { featured, picked } = insightPicks(mergeHomeBlock('home_insights', { featured: 'gone' }), posts)
  assert.equal(featured?.slug, 'a')
  assert.equal(picked, false)
})

test('the list length stays between 1 and 5', () => {
  const count = (list_count: string) => insightPicks(mergeHomeBlock('home_insights', { list_count }), posts).list.length
  assert.equal(count('0'), 1)
  assert.equal(count('9'), 5)
  assert.equal(count('two'), 3)
})

test('topics link to their category, and only while it has posts', () => {
  const { topics } = insightPicks(mergeHomeBlock('home_insights', null), posts)
  // "Marketing" has no posts, so it is left out; case and spacing don't matter.
  assert.deepEqual(
    topics.map((topic) => [topic.label, topic.href, topic.count]),
    [
      ['IT Support', '/blog?category=IT%20Support', 1],
      ['Cyber Security', '/blog?category=Cyber%20Security', 1],
      ['Cloud', '/blog?category=Cloud', 4],
      ['Web', '/blog?category=Web%20Development', 1],
    ],
  )
  assert.equal(categoryHref(' Web & Apps '), '/blog?category=Web%20%26%20Apps')
})

test('no posts: nothing featured, nothing listed, no topics', () => {
  assert.deepEqual(insightPicks(mergeHomeBlock('home_insights', null), []), { featured: null, picked: false, list: [], topics: [] })
})
