import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { fillDeep, fillFigures, figuresFrom } from '../app/lib/site-figures'

const now = new Date('2026-11-05T12:00:00Z')

test('nothing saved shows the defaults, and the years count from the founding year', () => {
  const figures = figuresFrom(null, now)
  assert.deepEqual(figures, { clients: '574', rating: '4.9', reviews: '50+', founded: '2017', years: '9', googleUrl: '' })
})

test('saved figures win; a bad year or a non-https profile link is ignored', () => {
  const figures = figuresFrom(
    { client_count: ' 600+ ', google_rating: '4.8', google_review_count: '120', founded_year: 'last year', google_business_url: 'javascript:alert(1)', google_maps_url: 'https://maps.app.goo.gl/x' },
    now,
  )
  assert.equal(figures.clients, '600+')
  assert.equal(figures.reviews, '120')
  assert.equal(figures.founded, '2017')
  assert.equal(figures.googleUrl, 'https://maps.app.goo.gl/x')
  assert.equal(figuresFrom({ founded_year: '2015', google_business_url: 'https://g.page/r/abc' }, now).years, '11')
  assert.equal(figuresFrom({ google_business_url: 'https://g.page/r/abc' }, now).googleUrl, 'https://g.page/r/abc')
})

test('placeholders are filled everywhere in saved content; unknown ones are left alone', () => {
  const figures = figuresFrom({ client_count: '574' }, now)
  assert.equal(fillFigures('Trusted by {clients} businesses since {founded} ({years} years) · {rating}★ from {reviews} reviews', figures),
    'Trusted by 574 businesses since 2017 (9 years) · 4.9★ from 50+ reviews')
  assert.equal(fillFigures('{price} stays', figures), '{price} stays')
  assert.deepEqual(fillDeep({ a: ['since {founded}', 3], b: { c: '{clients}' } }, figures), { a: ['since 2017', 3], b: { c: '574' } })
})
