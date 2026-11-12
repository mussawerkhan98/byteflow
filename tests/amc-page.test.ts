import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { amcSections, planCell, priceNumber, servicesByCategory } from '../app/lib/amc-page'

test('the sections follow the admin order, switched-off and unknown ones left out, each once', () => {
  assert.deepEqual(
    amcSections([
      { title: 'plans', show: 'yes' },
      { title: 'intro', show: 'no' },
      { title: 'made-up', show: 'yes' },
      { title: 'faq', show: '' },
      { title: 'plans', show: 'yes' },
    ]),
    ['plans', 'faq'],
  )
  assert.deepEqual(amcSections([]), [])
})

test('a plans table cell is a tick, a dash or the words typed', () => {
  assert.deepEqual(planCell('yes'), { kind: 'yes' })
  assert.deepEqual(planCell(' Yes '), { kind: 'yes' })
  assert.deepEqual(planCell('✓'), { kind: 'yes' })
  assert.deepEqual(planCell('no'), { kind: 'no' })
  assert.deepEqual(planCell(''), { kind: 'no' })
  assert.deepEqual(planCell('—'), { kind: 'no' })
  assert.deepEqual(planCell('2 visits a month'), { kind: 'text', text: '2 visits a month' })
})

test('services sit under their category; those with no category left are kept at the end', () => {
  const groups = servicesByCategory(
    [{ title: 'Cloud' }, { title: 'Empty' }, { title: 'Security' }],
    [
      { title: 'A', tab: 'cloud' },
      { title: 'B', tab: 'Security' },
      { title: 'C', tab: 'Gone' },
    ],
  )
  assert.deepEqual(
    groups.map((group) => [group.category?.title ?? null, group.services.map((s) => s.title)]),
    [
      ['Cloud', ['A']],
      ['Security', ['B']],
      [null, ['C']],
    ],
  )
})

test('a plan price reads as a number for search engines', () => {
  assert.equal(priceNumber('AED 30'), 30)
  assert.equal(priceNumber('AED 1,250'), 1250)
  assert.equal(priceNumber('On request'), null)
})
