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

test('ticking the box opts a new contact in', () => {
  assert.equal(nextOptOut(true), 0)
})

test('a new contact who did not tick is added but switched off', () => {
  assert.equal(nextOptOut(false), 1)
})

test('not ticking never removes someone who already opted in', () => {
  // The important one: writing in a second time without ticking is not a
  // request to be taken off the list.
  assert.equal(nextOptOut(false, 0), 0)
})

test('someone already opted out stays opted out', () => {
  assert.equal(nextOptOut(false, 1), 1)
})

test('ticking the box re-subscribes someone who had opted out', () => {
  assert.equal(nextOptOut(true, 1), 0)
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
