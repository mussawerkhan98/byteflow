import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { blockParts } from '../app/lib/block-parts'

test('splits a block into its lead, labelled cards and closing note, keeping every word', () => {
  const text = [
    'Priced per user, per month. Prices exclude 5% VAT.',
    'Essential — AED 30 per user, per month. Unlimited remote support.',
    'Standard — AED 60 per user, per month. Everything in Essential.',
    'No setup fee. No minimum term beyond the contract year. How often you call does not change the price — unlimited means unlimited.',
  ].join('\n\n')
  assert.deepEqual(blockParts(text), {
    lead: ['Priced per user, per month. Prices exclude 5% VAT.'],
    items: [
      { label: 'Essential', text: 'AED 30 per user, per month. Unlimited remote support.' },
      { label: 'Standard', text: 'AED 60 per user, per month. Everything in Essential.' },
    ],
    // A long sentence with a dash in it is not a label.
    closing: ['No setup fee. No minimum term beyond the contract year. How often you call does not change the price — unlimited means unlimited.'],
  })
})

test('labelled lines separated by single line breaks are still separate cards', () => {
  const parts = blockParts('Ours:\nMajor projects — scoped separately.\nPaid advertising spend — not included.')
  assert.deepEqual(parts.lead, ['Ours:'])
  assert.deepEqual(parts.items.map((item) => item.label), ['Major projects', 'Paid advertising spend'])
})

test('text without labelled paragraphs is all lead', () => {
  const sentence = 'How often you call does not change the price of the contract you signed — unlimited means unlimited.'
  assert.deepEqual(blockParts(`One paragraph.\n\n${sentence}`), {
    lead: ['One paragraph.', sentence],
    items: [],
    closing: [],
  })
})
