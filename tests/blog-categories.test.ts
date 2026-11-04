import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { blogCategories, sameCategory } from '../app/lib/blog-categories'

test('a category added in the admin gets its own button', () => {
  const posts = [{ category: 'IT Support' }, { category: 'Web Development' }, { category: 'Cloud' }]
  assert.deepEqual(blogCategories(posts), ['IT Support', 'Cloud', 'Web Development'])
})

test('case and spacing differences are one category; empty ones are ignored', () => {
  const posts = [{ category: 'Web Development' }, { category: ' web  development ' }, { category: '' }, { category: null }]
  assert.deepEqual(blogCategories(posts), ['Web Development'])
  assert.ok(sameCategory('web development ', 'Web Development'))
  assert.ok(!sameCategory('Web & Apps', 'Web Development'))
})

test('known categories keep their order; new ones follow alphabetically', () => {
  const posts = [{ category: 'Zebra' }, { category: 'Digital Marketing' }, { category: 'Apple' }, { category: 'IT Support' }]
  assert.deepEqual(blogCategories(posts), ['IT Support', 'Digital Marketing', 'Apple', 'Zebra'])
})
