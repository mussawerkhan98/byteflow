import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { legalAnchors, legalBlocks } from '../app/lib/legal-text'

test('a blank line starts a new paragraph; lines inside one keep their breaks', () => {
  assert.deepEqual(legalBlocks('First paragraph.\n\nByteflow\nEmaar Park 4\nDubai'), [
    { kind: 'paragraph', lines: ['First paragraph.'] },
    { kind: 'paragraph', lines: ['Byteflow', 'Emaar Park 4', 'Dubai'] },
  ])
})

test('lines starting with "- " become one bullet list, after the line that introduces them', () => {
  assert.deepEqual(legalBlocks('We use it to:\n- Reply to you.\n- Send quotes.\n\nThat is all.'), [
    { kind: 'paragraph', lines: ['We use it to:'] },
    { kind: 'list', items: ['Reply to you.', 'Send quotes.'] },
    { kind: 'paragraph', lines: ['That is all.'] },
  ])
})

test('Windows line endings, stray spaces and empty text are handled', () => {
  assert.deepEqual(legalBlocks('  One.\r\n\r\n   \r\n- Two\r\n'), [
    { kind: 'paragraph', lines: ['One.'] },
    { kind: 'list', items: ['Two'] },
  ])
  assert.deepEqual(legalBlocks(''), [])
})

test('section anchors are readable and unique', () => {
  assert.deepEqual(legalAnchors(['Who we are', 'Cookies & analytics', 'Contact us', 'Contact us', '!!!']), [
    'who-we-are',
    'cookies-and-analytics',
    'contact-us',
    'contact-us-2',
    'section',
  ])
})
