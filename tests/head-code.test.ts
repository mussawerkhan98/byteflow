import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { splitHeadCode } from '../app/lib/head-code'

test('meta and link tags are pulled out for <head>, the rest stays', () => {
  const { tags, rest } = splitHeadCode(
    '<meta name="google-site-verification" content="abc">\n<link rel="preconnect" href="https://x.com" crossorigin>\n<script>gtag()</script>',
  )
  assert.deepEqual(tags, [
    { tag: 'meta', attrs: { name: 'google-site-verification', content: 'abc' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://x.com', crossOrigin: '' } },
  ])
  assert.equal(rest, '<script>gtag()</script>')
})

test('JSON-LD and other scripts are left untouched, even if they mention <meta', () => {
  const code = '<script type="application/ld+json">{"a":"<meta name=x>"}</script><noscript><link rel="x" href="y"></noscript>'
  const { tags, rest } = splitHeadCode(code)
  assert.deepEqual(tags, [])
  assert.equal(rest, code)
})

test('property, http-equiv and single-quoted values are kept; charset is dropped', () => {
  const { tags } = splitHeadCode(`<meta property='og:site_name' content='Byteflow' /><meta http-equiv="x-ua-compatible" content="ie=edge"><meta charset="utf-8">`)
  assert.deepEqual(tags, [
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Byteflow' } },
    { tag: 'meta', attrs: { httpEquiv: 'x-ua-compatible', content: 'ie=edge' } },
  ])
})

test('empty code gives nothing', () => {
  assert.deepEqual(splitHeadCode(''), { tags: [], rest: '' })
})
