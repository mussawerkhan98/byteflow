import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { defaultHeaderBar, headerBarFrom } from '../app/lib/header-bar'

test('no settings, or settings saved before these fields existed, give the current bar', () => {
  assert.deepEqual(headerBarFrom(null), defaultHeaderBar)
  assert.deepEqual(headerBarFrom({ header_phone: '+971 1' }), defaultHeaderBar)
  assert.equal(defaultHeaderBar.uppercase, true)
})

test('saved values are used; blanks fall back', () => {
  const bar = headerBarFrom({
    header_cta_label: ' Get a quote ',
    header_cta_link: '/contact-us#quote',
    header_dropdown_note: '',
    header_dropdown_cta: 'Talk to us',
  })
  assert.equal(bar.ctaLabel, 'Get a quote')
  assert.equal(bar.ctaLink, '/contact-us#quote')
  assert.equal(bar.dropdownNote, defaultHeaderBar.dropdownNote)
  assert.equal(bar.dropdownCta, 'Talk to us')
})

test('the switches read the database 0/1, and unsafe links are refused', () => {
  assert.equal(headerBarFrom({ header_menu_uppercase: 0 }).uppercase, false)
  assert.equal(headerBarFrom({ header_menu_uppercase: 1 }).uppercase, true)
  assert.equal(headerBarFrom({ header_show_phone: 0 }).showPhone, false)
  assert.equal(headerBarFrom({ header_cta_link: 'javascript:alert(1)' }).ctaLink, '/contact-us')
  assert.equal(headerBarFrom({ header_cta_link: '//evil.example' }).ctaLink, '/contact-us')
  assert.equal(headerBarFrom({ header_cta_link: 'tel:+971543282042' }).ctaLink, 'tel:+971543282042')
})
