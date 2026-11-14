import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { DEFAULT_MAP_URL, directionsUrl, officeMapUrl, officePlaceUrl, safeMapUrl } from '../app/lib/office-map'

const OFFICE_PLACE = 'https://maps.google.com/?cid=3960819169910962667'

test('only Google Maps embeds are used for the office map', () => {
  assert.equal(safeMapUrl('https://www.google.com/maps/embed?pb=abc'), 'https://www.google.com/maps/embed?pb=abc')
  assert.equal(safeMapUrl('https://evil.example/maps/embed'), '')
  assert.equal(safeMapUrl('javascript:alert(1)'), '')
  assert.equal(safeMapUrl(''), '')
  assert.equal(officeMapUrl(''), DEFAULT_MAP_URL)
})

test('the location link opens the listing the map is pinned to', () => {
  // The office's own map: Byteflow information Technology & CO LLC.
  assert.equal(officePlaceUrl('', 'Dubai, United Arab Emirates'), OFFICE_PLACE)
  assert.equal(officePlaceUrl(DEFAULT_MAP_URL, 'anything'), OFFICE_PLACE)
  // A map naming a place but no listing id: a search for that place.
  assert.equal(officePlaceUrl('https://www.google.com/maps/embed?pb=!1m2!2sAcme%20Office!5e0', 'Dubai'), 'https://www.google.com/maps/search/?api=1&query=Acme%20Office')
  // A map with neither: a search for the address.
  assert.equal(officePlaceUrl('https://www.google.com/maps/embed?pb=!1m2!5e0', 'Emaar Park 4, Dubai'), 'https://www.google.com/maps/search/?api=1&query=Emaar%20Park%204%2C%20Dubai')
})

test('directions use the link set in the admin, else the place on the map', () => {
  assert.equal(directionsUrl('https://maps.app.goo.gl/abc', 'Dubai'), 'https://maps.app.goo.gl/abc')
  assert.equal(directionsUrl('', 'Dubai, United Arab Emirates'), OFFICE_PLACE)
  assert.equal(directionsUrl('javascript:alert(1)', 'Dubai', ''), OFFICE_PLACE)
})
