import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { fillDeep, fillFigures, figuresFrom, logosFrom, splitFigure, statsFrom } from '../app/lib/site-figures'
import { logoBox } from '../app/components/TrustStrip'
import { homeDefaults } from '../app/lib/home-content'

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

test('a figure splits around its number for the count-up', () => {
  assert.deepEqual(splitFigure('200+'), { before: '', number: 200, decimals: 0, after: '+' })
  assert.deepEqual(splitFigure('4.9'), { before: '', number: 4.9, decimals: 1, after: '' })
  assert.deepEqual(splitFigure('~24/7'), { before: '~', number: 24, decimals: 0, after: '/7' })
  assert.equal(splitFigure('n/a'), null)
})

const defaults = homeDefaults.home_trust.lists.stats

test('the trust strip with logos: clients, rating with a star, years with a plus; the rating links to Google', () => {
  const figures = figuresFrom({ google_business_url: 'https://g.page/r/abc' }, now)
  const stats = statsFrom(defaults, figures, { hasLogos: true })
  assert.deepEqual(stats.map((s) => [s.value, s.text]), [
    ['574', 'Businesses supported across the UAE'],
    ['4.9★', 'Google rating · 50+ reviews'],
    ['9+', 'Years in Dubai'],
  ])
  assert.equal(stats[1].href, 'https://g.page/r/abc')
  assert.ok([stats[0], stats[2]].every((s) => s.href === null))
})

test('with no logos up, the stand-in stat joins the row; no profile link means no link', () => {
  const stats = statsFrom(defaults, figuresFrom(null, now), { hasLogos: false })
  assert.deepEqual(stats.map((s) => s.value), ['574', '4.9★', '9+', '2 hrs'])
  assert.equal(stats[3].text, 'On-site response across Dubai, Sharjah & Abu Dhabi')
  assert.equal(stats[1].href, null)
})

test('stats keep their saved order, drop hidden or empty ones, ignore a typed value for a site-wide figure, stop at four', () => {
  const stats = statsFrom(
    [
      { title: 'Years', figure: 'years', value: '', show: 'yes' },
      { title: 'Clients', figure: 'clients', value: '9999', show: 'yes' },
      { title: 'Hidden', figure: 'custom', value: '1', show: 'no' },
      { title: 'Empty', figure: 'custom', value: '', show: 'yes' },
      { title: 'A', figure: 'custom', value: '1', show: 'yes' },
      { title: 'B', figure: 'custom', value: '2', show: 'yes' },
      { title: 'C', figure: 'custom', value: '3', show: 'yes' },
    ],
    figuresFrom(null, now),
    { hasLogos: true },
  )
  assert.deepEqual(stats.map((s) => s.text + '=' + s.value), ['Years=9+', 'Clients=574', 'A=1', 'B=2'])
})

test('logos need a name and a safe image; links must be on this site or https; hidden ones go', () => {
  const logos = logosFrom([
    { title: 'Acme', image: '/api/media/12/acme.svg', link: 'https://acme.ae', show: 'yes' },
    { title: 'No image', image: '', link: '', show: 'yes' },
    { title: '', image: '/api/media/13', link: '', show: 'yes' },
    { title: 'Bad', image: 'javascript:alert(1)', link: '', show: 'yes' },
    { title: 'Hidden', image: '/api/media/14', link: '', show: 'no' },
    { title: 'Plain', image: '/api/media/15', link: 'http://plain.ae', show: 'yes' },
  ])
  assert.deepEqual(logos.map((l) => [l.name, l.href]), [['Acme', 'https://acme.ae'], ['Plain', null]])
})

test('logos share a height; the width follows the file, capped, with a box when unknown', () => {
  assert.deepEqual(logoBox({ width: 400, height: 100 }), { width: 128, height: 32 })
  assert.deepEqual(logoBox({ width: 1000, height: 100 }), { width: 140, height: 32 })
  assert.deepEqual(logoBox(undefined), { width: 120, height: 32 })
})
