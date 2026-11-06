import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { fillRow, reviewerInitials, reviewWall, toWallReview } from '../app/lib/review-wall'

const review = (id: number, text: string, extra: Record<string, unknown> = {}) => ({
  id,
  customer_name: `Client ${id}`,
  customer_role: 'Manager',
  review_text: text,
  rating: 5,
  source: '',
  ...extra,
})

test('the longest review is the spotlight when none is featured; the rest make the row in order', () => {
  const result = reviewWall([review(1, 'Good.'), review(2, 'A much longer review of the work.'), review(3, 'Fine.'), review(4, 'Fast.')])
  assert.equal(result.spotlight?.id, 2)
  assert.deepEqual(result.wall.map((r) => r.id), [1, 3, 4])
})

test('a review marked Featured is the spotlight, however short', () => {
  const result = reviewWall([review(1, 'A much longer review of the work.'), review(2, 'Great!', { featured: true })])
  assert.equal(result.spotlight?.id, 2)
  assert.deepEqual(result.wall.map((r) => r.id), [1])
})

test('only reviews whose source says Google are called Google reviews', () => {
  assert.deepEqual([toWallReview(review(1, 'x', { source: ' google ' })), toWallReview(review(2, 'x', { source: 'Facebook' })), toWallReview(review(3, 'x'))].map((r) => [r.google, r.source]), [
    [true, 'Google'],
    [false, 'Facebook'],
    [false, ''],
  ])
})

test('nothing made up: no reviews, no spotlight and no rows; blank ones are skipped', () => {
  assert.deepEqual(reviewWall([]), { spotlight: null, wall: [] })
  assert.deepEqual(reviewWall([review(1, '   ')]), { spotlight: null, wall: [] })
})

test('ratings stay between 1 and 5', () => {
  assert.deepEqual([0, 3.4, 9, Number.NaN].map((rating) => toWallReview(review(1, 'x', { rating })).rating), [1, 3, 5, 5])
})

test('a short row is repeated so the moving wall stays full', () => {
  assert.deepEqual(fillRow([1, 2], 5), [1, 2, 1, 2, 1, 2])
  assert.deepEqual(fillRow([], 5), [])
})

test('initials for the avatar', () => {
  assert.deepEqual(['Glam Glow Aesthetic Clinic', 'soft light', 'Alim', '123'].map(reviewerInitials), ['GG', 'SL', 'A', '·'])
})
