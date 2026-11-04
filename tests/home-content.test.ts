import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { homeDefaults, lines, mergeHomeBlock } from '../app/lib/home-content'

test('nothing saved gives the website defaults', () => {
  assert.deepEqual(mergeHomeBlock('home_help', null), homeDefaults.home_help)
})

test('saved fields win, blank ones fall back, unknown ones are ignored', () => {
  const block = mergeHomeBlock('home_help', { heading: '  Need a hand?  ', description: '   ', extra: 'x' })
  assert.equal(block.fields.heading, 'Need a hand?')
  assert.equal(block.fields.description, homeDefaults.home_help.fields.description)
  assert.ok(!('extra' in block.fields))
})

test('a saved list replaces the default list; items without a title are dropped', () => {
  const block = mergeHomeBlock('home_promise', {
    rows: [
      { title: 'Fast', value: '1', unit: 'hr', description: 'Quick', icon: '<script>' },
      { title: '', value: '9' },
      'not an item',
    ],
  })
  assert.deepEqual(block.lists.rows, [{ title: 'Fast', value: '1', unit: 'hr', description: 'Quick' }])
})

test('an emptied list keeps the default, so the section never goes blank', () => {
  const block = mergeHomeBlock('home_process', { steps: [] })
  assert.equal(block.lists.steps, homeDefaults.home_process.lists.steps)
})

test('points are typed one per line', () => {
  assert.deepEqual(lines(' A \r\n\nB\n  '), ['A', 'B'])
})
