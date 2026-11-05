import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { buildNav, isCurrent, serviceGroups } from '../app/lib/header-menu'
import { mergeHomeBlock } from '../app/lib/home-content'

const menu = mergeHomeBlock('header_menu', null)

// The same menu once two industries have pages of their own.
const withPages = mergeHomeBlock('header_menu', {
  industries: [
    { title: 'Clinics & Healthcare', link: '/industries/healthcare' },
    { title: 'Schools & Education', link: '/#industries' },
    { title: 'Real Estate', link: '' },
    { title: 'Hospitality', link: '/industries/hospitality' },
  ],
})

// The menu as the admin had it before the redesign.
const live = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '#', children: [{ label: 'Cyber Security', href: '/cyber-security' }] },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact-us' },
]

const labels = (nav: ReturnType<typeof buildNav>) =>
  nav.map((entry) => (entry.kind === 'link' ? entry.item.label : `${entry.label}▾`))

test('Home and the button\'s own page are dropped; Industries follows Services', () => {
  assert.deepEqual(labels(buildNav(live, withPages, '/contact-us')), ['About Us', 'Projects', 'Services▾', 'Industries▾', 'Blog'])
})

test('Industries stays hidden while no industry has a page', () => {
  assert.deepEqual(labels(buildNav(live, menu, '/contact-us')), ['About Us', 'Projects', 'Services▾', 'Blog'])
  // Not even when the admin's menu names it.
  const nav = buildNav([{ label: 'Industries', href: '#' }, { label: 'Services', href: '#' }], menu, '/contact-us')
  assert.deepEqual(nav.map((entry) => entry.key), ['services'])
})

test('only industries with a page of their own are listed', () => {
  const industries = buildNav(live, withPages, '/contact-us').find((entry) => entry.key === 'industries')
  assert.ok(industries?.kind === 'list')
  assert.deepEqual(industries.items.map((item) => item.href), ['/industries/healthcare', '/industries/hospitality'])
})

test('an Industries entry in the menu is used where it stands, never added twice', () => {
  const nav = buildNav(
    [{ label: 'Industries', href: '#' }, { label: 'Services', href: '#' }],
    withPages,
    '/contact-us',
  )
  assert.deepEqual(nav.map((entry) => entry.key), ['industries', 'services'])
})

test('other entries with sub-links open a plain list of their links', () => {
  const nav = buildNav(
    [{ label: 'Company', href: '#', children: [{ label: 'Team', href: '#', children: [{ label: 'Careers', href: '/careers' }] }] }],
    menu,
    '/contact-us',
  )
  const company = nav.find((entry) => entry.key.startsWith('Company'))
  assert.ok(company?.kind === 'list')
  assert.deepEqual(company.items.map((item) => item.href), ['/careers'])
})

test('services are grouped in the order saved, including Landing Page Design', () => {
  const groups = serviceGroups(menu)
  assert.deepEqual(groups.map((g) => g.title), ['IT Support & Infrastructure', 'Cloud & Security', 'Digital & Creative'])
  assert.ok(groups[2].items.some((item) => item.link === '/landing-page-designing'))
})

test('current page matching ignores anchors on the home page', () => {
  assert.ok(isCurrent('/cyber-security', '/cyber-security'))
  assert.ok(isCurrent('/blog/some-post', '/blog'))
  assert.ok(!isCurrent('/', '/#industries'))
  assert.ok(isCurrent('/', '/'))
})
