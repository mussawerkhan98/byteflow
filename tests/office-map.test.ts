import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { directionsUrl, safeMapUrl } from '../app/lib/office-map'

test('only Google Maps embeds are used for the office map', () => {
  assert.equal(safeMapUrl('https://www.google.com/maps/embed?pb=abc'), 'https://www.google.com/maps/embed?pb=abc')
  assert.equal(safeMapUrl('https://evil.example/maps/embed'), '')
  assert.equal(safeMapUrl('javascript:alert(1)'), '')
  assert.equal(safeMapUrl(''), '')
})

test('directions use the link set in the admin, else a search for the address', () => {
  assert.equal(directionsUrl('https://maps.app.goo.gl/abc', 'Dubai'), 'https://maps.app.goo.gl/abc')
  assert.equal(directionsUrl('', 'Emaar Park 4, Dubai'), 'https://www.google.com/maps/search/?api=1&query=Emaar%20Park%204%2C%20Dubai')
  assert.equal(directionsUrl('javascript:alert(1)', 'Dubai'), 'https://www.google.com/maps/search/?api=1&query=Dubai')
})
