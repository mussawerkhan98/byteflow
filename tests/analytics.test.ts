import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { LEAD_EVENT, leadEventForLink } from '../app/lib/analytics'

test('the WhatsApp button is recognised in every form the site uses', () => {
  assert.equal(leadEventForLink('https://wa.me/971543282042'), 'whatsapp_click')
  assert.equal(leadEventForLink('https://api.whatsapp.com/send?phone=971543282042'), 'whatsapp_click')
  assert.equal(leadEventForLink('https://web.whatsapp.com/send?phone=971543282042'), 'whatsapp_click')
  assert.equal(leadEventForLink('whatsapp://send?phone=971543282042'), 'whatsapp_click')
})

test('a phone link counts as a lead, an email link does not', () => {
  assert.equal(leadEventForLink('tel:+971543282042'), 'phone_click')
  assert.equal(leadEventForLink('TEL:+971543282042'), 'phone_click')
  assert.equal(leadEventForLink('mailto:info@byteflow.ae'), null)
})

test('ordinary links are ignored', () => {
  assert.equal(leadEventForLink('/contact-us'), null)
  assert.equal(leadEventForLink('https://www.byteflow.ae/it-amc-services-dubai'), null)
  assert.equal(leadEventForLink(''), null)
  assert.equal(leadEventForLink(null), null)
  assert.equal(leadEventForLink(undefined), null)
})

test('a lookalike host is not WhatsApp', () => {
  // A substring match would call both of these WhatsApp. The host is
  // compared exactly, so neither is counted.
  assert.equal(leadEventForLink('https://wa.me.example.com/971543282042'), null)
  assert.equal(leadEventForLink('https://notwhatsapp.com/send'), null)
  // A real subdomain of whatsapp.com still counts.
  assert.equal(leadEventForLink('https://chat.whatsapp.com/ABC123'), 'whatsapp_click')
})

test('the enquiry event keeps the name GA4 is configured for', () => {
  // Renaming this silently stops every key event in GA4 from firing.
  assert.equal(LEAD_EVENT, 'generate_lead')
})
