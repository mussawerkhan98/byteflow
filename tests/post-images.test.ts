import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { postImageAttributes } from '../app/lib/post-images'

test('a picture from this site keeps its src and gains lazy loading and a srcset no wider than the file', () => {
  const out = postImageAttributes({ src: '/api/media/91/server-rack.webp', alt: 'Server rack', width: '1200', height: '800' })
  assert.equal(out.src, '/api/media/91/server-rack.webp')
  assert.equal(out.loading, 'lazy')
  assert.equal(out.decoding, 'async')
  assert.deepEqual([out.width, out.height], ['1200', '800'])
  assert.deepEqual(out.srcset.split(', ').map((entry) => entry.split(' ')[1]), ['640w', '828w', '1080w', '1200w'])
  assert.match(out.srcset, /^\/_next\/image\?url=%2Fapi%2Fmedia%2F91%2Fserver-rack\.webp&w=640&q=75 640w/)
})

test('an older picture without a size still gets one srcset entry; one from another site is left alone', () => {
  assert.equal(postImageAttributes({ src: '/api/media/7', alt: '' }).srcset.split(', ').length, 5)
  const external = postImageAttributes({ src: 'https://example.com/a.jpg', alt: 'x', width: '10', height: 'abc' })
  assert.equal(external.srcset, undefined)
  assert.equal(external.width, undefined)
  assert.equal(postImageAttributes({ src: '//evil.example/a.png', alt: '' }).srcset, undefined)
})
