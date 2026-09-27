import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  SIGNUP_GROUP,
  isSignupEmail,
  mergeGroups,
  nextOptOut,
  normaliseSignupEmail,
} from '../app/lib/marketing-signup-rules'

test('addresses are lower-cased and trimmed', () => {
  assert.equal(normaliseSignupEmail('  Someone@Example.COM '), 'someone@example.com')
  assert.equal(normaliseSignupEmail(undefined), '')
})

test('only plausible addresses are accepted', () => {
  assert.ok(isSignupEmail('someone@example.com'))
  assert.ok(isSignupEmail('a.b+tag@sub.example.co.uk'))
  assert.ok(!isSignupEmail(''))
  assert.ok(!isSignupEmail('someone@example'))
  assert.ok(!isSignupEmail('someone.example.com'))
  assert.ok(!isSignupEmail('two words@example.com'))
})

test('a new enquirer receives offers', () => {
  assert.equal(nextOptOut(), 0)
  assert.equal(nextOptOut(null), 0)
  assert.equal(nextOptOut(undefined), 0)
})

test('an existing subscriber stays subscribed', () => {
  assert.equal(nextOptOut(0), 0)
})

test('filling the form again does NOT undo an unsubscribe', () => {
  // The one that matters: if this ever returns 0, the unsubscribe link in
  // every promotion stops meaning anything.
  assert.equal(nextOptOut(1), 1)
})

test('the enquiry group is added without duplicating it', () => {
  assert.equal(mergeGroups('', SIGNUP_GROUP), 'Website enquiry')
  assert.equal(mergeGroups('VIP', SIGNUP_GROUP), 'VIP, Website enquiry')
  assert.equal(mergeGroups('Website enquiry', SIGNUP_GROUP), 'Website enquiry')
  // Case and spacing must not create a second copy of the same group.
  assert.equal(mergeGroups('website ENQUIRY', SIGNUP_GROUP), 'website ENQUIRY')
  assert.equal(mergeGroups(' VIP ,  Corporate ', SIGNUP_GROUP), 'VIP, Corporate, Website enquiry')
})

test('existing groups keep their order', () => {
  assert.equal(mergeGroups('B, A', SIGNUP_GROUP), 'B, A, Website enquiry')
})
