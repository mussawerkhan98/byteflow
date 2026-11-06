import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { highlight, matchesFaq } from '../app/lib/faq-search'

const faq = { question: 'How much does IT support cost in Dubai?', answer: 'Our IT AMC is priced per user, per month.' }

test('every word typed must appear in the question or the answer, in any order and case', () => {
  assert.equal(matchesFaq(faq, ''), true)
  assert.equal(matchesFaq(faq, 'COST dubai'), true)
  assert.equal(matchesFaq(faq, 'amc month'), true)
  assert.equal(matchesFaq(faq, 'cost sharjah'), false)
})

test('the matching words are marked, keeping the original case', () => {
  assert.deepEqual(highlight('IT support cost in Dubai', 'dubai cost'), [
    { text: 'IT support ', match: false },
    { text: 'cost', match: true },
    { text: ' in ', match: false },
    { text: 'Dubai', match: true },
  ])
})

test('nothing typed, nothing marked; symbols are searched as they are', () => {
  assert.deepEqual(highlight('Microsoft 365', ''), [{ text: 'Microsoft 365', match: false }])
  assert.deepEqual(highlight('Price (AED)', '(aed)'), [
    { text: 'Price ', match: false },
    { text: '(AED)', match: true },
  ])
})
