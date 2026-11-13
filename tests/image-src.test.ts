import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { unoptimizedSrc } from '../app/lib/image-src'

test('uploads with a file name and site files are resized; others are shown as they are', () => {
  assert.equal(unoptimizedSrc('/api/media/122/it-consultation.webp'), false)
  assert.equal(unoptimizedSrc('/images/home/hero.png'), false)
  // An older upload without a name may be an SVG the optimizer would refuse.
  assert.equal(unoptimizedSrc('/api/media/7'), true)
  assert.equal(unoptimizedSrc('/api/media/3/logo.svg'), true)
  assert.equal(unoptimizedSrc('https://example.com/photo.jpg'), true)
  assert.equal(unoptimizedSrc('//cdn.example.com/photo.jpg'), true)
})
