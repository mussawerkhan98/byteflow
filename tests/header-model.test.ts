import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { defaultHeaderBar } from '../app/lib/header-bar'
import {
  fallbackHeader,
  headerSettings,
  insightTopics,
  menuGroups,
  modelFromLegacy,
  modelFromTables,
  pageSlug,
  servicePreview,
  withServiceNames,
  withServicePreviews,
  withServicesOffMenu,
  type GroupRow,
  type ItemRow,
  type NavRow,
  type PostCard,
} from '../app/lib/header-model'
import { mergeHomeBlock } from '../app/lib/home-content'

const post = (n: number): PostCard => ({
  title: `Post ${n}`,
  href: `/post-${n}`,
  category: 'IT Support',
  date: 'Nov 1, 2026',
  readTime: '4 min read',
  image: `/api/media/${n}`,
  alt: `Post ${n}`,
})
const posts = [1, 2, 3, 4, 5, 6, 7].map(post)

const nav: NavRow[] = [
  { label: 'Services', href: '', kind: 'services', visible: true, new_tab: false },
  { label: 'Industries', href: '', kind: 'industries', visible: false, new_tab: false },
  { label: 'Projects', href: '/projects', kind: 'link', visible: true, new_tab: false },
  { label: 'About', href: '/about-us', kind: 'link', visible: true, new_tab: false },
  { label: 'Insights', href: '/blog', kind: 'insights', visible: true, new_tab: false },
]
const groups: GroupRow[] = [
  { id: 1, menu: 'services', title: 'Cloud & Security', visible: true },
  { id: 2, menu: 'services', title: 'Hidden group', visible: false },
  { id: 3, menu: 'industries', title: 'Industries', visible: true },
]
const items: ItemRow[] = [
  { group_id: 1, label: 'Cyber Security', href: '/cyber-security', description: 'Firewalls', visible: true },
  { group_id: 1, label: 'Hidden item', href: '/hidden', description: '', visible: false },
  { group_id: 2, label: 'In a hidden group', href: '/x', description: '', visible: true },
  { group_id: 3, label: 'Clinics', href: '', description: '', visible: true },
]

const tables = (over: Partial<Parameters<typeof modelFromTables>[0]> = {}) =>
  modelFromTables({
    nav,
    groups,
    items,
    settings: {},
    bar: defaultHeaderBar,
    categories: ['IT Support', 'it support', 'Cloud', 'Cyber Security'],
    posts,
    ...over,
  })

test('nothing saved yet means the older sources are used', () => {
  assert.equal(tables({ nav: [] }), null)
})

test('hidden entries, groups and items stay off the menu', () => {
  const model = tables()!
  assert.deepEqual(
    model.nav.map((entry) => entry.kind),
    ['services', 'link', 'link', 'insights'],
  )
  assert.deepEqual(model.services.groups, [
    { title: 'Cloud & Security', items: [{ label: 'Cyber Security', href: '/cyber-security', description: 'Firewalls' }] },
  ])
})

test('Industries stays hidden when switched on but no industry has a page', () => {
  const shown = nav.map((row) => (row.kind === 'industries' ? { ...row, visible: true } : row))
  assert.ok(!tables({ nav: shown })!.nav.some((entry) => entry.kind === 'industries'))
  const withPage = items.map((item) => (item.label === 'Clinics' ? { ...item, href: '/industries/clinics' } : item))
  assert.ok(tables({ nav: shown, items: withPage })!.nav.some((entry) => entry.kind === 'industries'))
})

test('Insights shows 3 latest posts by default and never more than 6', () => {
  assert.equal(tables()!.insights.posts.length, 3)
  assert.equal(tables({ settings: { 'insights.latest_count': '50' } })!.insights.posts.length, 6)
  assert.equal(tables({ settings: { 'insights.latest_count': 'lots' } })!.insights.posts.length, 3)
})

test('the menu always holds a real link to the blog', () => {
  const model = tables({ posts: [] })!
  assert.equal(model.insights.viewAll.href, '/blog')
  assert.equal(model.insights.footer.link.href, '/blog')
})

test('switches: featured card, WhatsApp and the theme toggle can be turned off', () => {
  const model = tables({
    settings: { 'services.featured_show': '0', 'services.whatsapp_show': '0', 'header.theme_toggle': '0' },
  })!
  assert.equal(model.services.featured, null)
  assert.equal(model.services.footer.whatsappLabel, null)
  assert.equal(model.showThemeToggle, false)
})

test('an unsafe saved link falls back to the default', () => {
  const model = tables({ settings: { 'services.featured_button_link': 'javascript:alert(1)' } })!
  assert.equal(model.services.featured?.button.href, '/it-amc-services-dubai')
})

test('topics: only categories with posts, case variants merged, busiest first on auto', () => {
  const topics = insightTopics(['Cloud', 'IT Support', 'it support ', 'IT Support', 'Cyber Security'], 'auto')
  assert.deepEqual(
    topics.map((t) => [t.label, t.count]),
    [['IT Support', 3], ['Cloud', 1], ['Cyber Security', 1]],
  )
  assert.ok(topics.every((t) => t.href === '/blog'))
})

test('topics: a chosen list keeps its order and drops categories with no posts', () => {
  const topics = insightTopics(['Cloud', 'IT Support'], 'IT Support, Web Development\nCloud')
  assert.deepEqual(topics.map((t) => t.label), ['IT Support', 'Cloud'])
})

test('blank saved settings fall back to the defaults', () => {
  assert.equal(headerSettings({ 'insights.heading': '  ' })['insights.heading'], 'Practical IT advice for UAE businesses.')
})

test('the older header turns its Blog link into the Insights menu', () => {
  const model = modelFromLegacy({
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '#' },
      { label: 'Blog', href: '/blog' },
    ],
    menu: mergeHomeBlock('header_menu', null),
    bar: defaultHeaderBar,
    categories: [],
    posts: [post(1)],
  })
  assert.deepEqual(
    model.nav.map((entry) => `${entry.kind}:${'label' in entry ? entry.label : entry.item.label}`),
    ['services:Services', 'insights:Blog'],
  )
  assert.equal(model.services.groups.length, 3)
})

test('with no database the header still has its menu', () => {
  const model = fallbackHeader()
  assert.deepEqual(
    model.nav.map((entry) => entry.kind),
    ['services', 'link', 'link', 'insights'],
  )
  assert.equal(model.cta.href, '/contact-us')
})

test('service links in the menu take the name the rest of the site uses', () => {
  const names = new Map([['cloud-services-dubai', 'Cloud Services'], ['landing-page-designing', 'Landing Page Designing']])
  const model = withServiceNames(fallbackHeader(), names)
  const labels = model.services.groups.flatMap((group) => group.items.map((item) => `${item.href}=${item.label}`))
  assert.ok(labels.includes('/cloud-services-dubai=Cloud Services'))
  assert.ok(labels.includes('/landing-page-designing=Landing Page Designing'))
  // A link that is not a known service keeps its own label.
  const custom = withServiceNames({ ...model, services: { ...model.services, groups: [{ title: 'X', items: [{ label: 'Pricing', href: '/pricing#amc' }] }] } }, names)
  assert.equal(custom.services.groups[0].items[0].label, 'Pricing')
})

test('a page slug is read from a site path, never from another site', () => {
  assert.equal(pageSlug('/cyber-security'), 'cyber-security')
  assert.equal(pageSlug('/cyber-security/?ref=menu#top'), 'cyber-security')
  assert.equal(pageSlug('https://example.com/cyber-security'), null)
  assert.equal(pageSlug('/projects/abc'), null)
})

test('a service preview takes the admin record, then the service page', () => {
  const page = { tagline: 'Predictable IT costs.' }
  assert.deepEqual(servicePreview({ title: 'IT AMC', tagline: '', image_url: '/api/media/9/amc.webp', image_alt: '' }, page), {
    subtitle: 'Predictable IT costs.',
    image: '/api/media/9/amc.webp',
    alt: 'IT AMC by Byteflow in Dubai',
  })
  const own = servicePreview({ title: 'IT AMC', tagline: 'Fixed monthly support', image_url: 'https://cdn.example.com/a.webp', image_alt: 'Engineer at a rack' }, page)
  assert.equal(own.subtitle, 'Fixed monthly support')
  assert.equal(own.alt, 'Engineer at a rack')
  // An inline picture would ride along with every page: it is left out.
  assert.equal(servicePreview({ title: 'X', image_url: 'data:image/png;base64,AAAA' }).image, null)
  assert.equal(servicePreview({ title: 'X', image_url: '//evil.example/a.png' }).image, null)
})

test('menu links to service pages are given their preview', () => {
  const previews = new Map([['cyber-security', { subtitle: 'Protection', image: null, alt: 'Cyber' }]])
  const model = withServicePreviews(tables()!, previews)
  assert.equal(model.services.groups[0].items[0].preview?.subtitle, 'Protection')
  assert.equal(model.services.preview?.button, 'View service')
  const off = tables({ settings: { 'services.preview_show': '0', 'insights.preview_show': '0' } })!
  assert.equal(off.services.preview, null)
  assert.equal(off.insights.preview, null)
})

test('each topic carries its newest post for the preview', () => {
  const cloud = { ...post(9), category: 'cloud' }
  const model = tables({ topicPosts: [post(1), cloud] })!
  const byLabel = new Map(model.insights.topics.map((topic) => [topic.label, topic.latest?.href]))
  assert.equal(byLabel.get('IT Support'), '/post-1')
  assert.equal(byLabel.get('Cloud'), '/post-9')
  assert.equal(byLabel.get('Cyber Security'), undefined)
  assert.equal(model.insights.preview?.button, 'Read article')
})

test('the Services entry links to its page, /services unless the admin sets one', () => {
  const services = (model: ReturnType<typeof fallbackHeader>) => model.nav.find((entry) => entry.kind === 'services')
  assert.deepEqual(services(tables()!), { kind: 'services', key: 'services', label: 'Services', href: '/services' })
  const custom = tables({ nav: nav.map((row) => (row.kind === 'services' ? { ...row, href: '/our-services' } : row)) })!
  assert.equal(services(custom)?.kind === 'services' && services(custom)?.href, '/our-services')
  assert.equal(services(fallbackHeader())?.kind === 'services' && (services(fallbackHeader()) as { href: string }).href, '/services')
})

const clinic = { title: 'Clinics', anchor: 'clinics', icon: 'health', summary: 'Clinic systems', points: ['Backups', 'Networks'] }

test('an industry with no link of its own opens its card on the Industries page, with that card as its preview', () => {
  const model = tables({ nav: nav.map((row) => ({ ...row, visible: true })), industryPages: [clinic] })!
  assert.ok(model.nav.some((entry) => entry.kind === 'industries'))
  const [item] = model.industries.groups[0].items
  assert.equal(item.href, '/industries#clinics')
  assert.deepEqual(item.industry, { icon: 'health', summary: 'Clinic systems', points: ['Backups', 'Networks'] })
})

test('an industry linked by hand keeps its link, and is previewed by the card it opens', () => {
  const linked = items.map((item) => (item.group_id === 3 ? { ...item, label: 'Healthcare', href: '/industries#clinics' } : item))
  const [item] = tables({ items: linked, industryPages: [clinic] })!.industries.groups[0].items
  assert.equal(item.href, '/industries#clinics')
  assert.equal(item.industry?.summary, 'Clinic systems')
})

test('with no Industries page card for it, an unlinked industry stays off the menu', () => {
  assert.deepEqual(tables({ industryPages: [] })!.industries.groups, [])
})

test('the older header links its industries to their cards too', () => {
  const model = modelFromLegacy({
    navigation: [{ label: 'Industries', href: '#' }],
    menu: mergeHomeBlock('header_menu', null),
    bar: defaultHeaderBar,
    categories: [],
    posts: [],
    industryPages: [{ ...clinic, title: 'Logistics', anchor: 'logistics', icon: 'logistics' }],
  })
  const items = model.industries.groups.flatMap((group) => group.items)
  assert.deepEqual(
    items.map((item) => item.href),
    ['/industries#logistics'],
  )
  assert.equal(model.industries.viewAll?.href, '/industries')
})

test('a service switched off the menu bar leaves the menu but keeps its place for the Services page', () => {
  const model = withServicesOffMenu(tables()!, new Set(['cyber-security']))
  // Still in its group, marked, so the Services page groups it as before.
  assert.equal(model.services.groups[0].items[0].offMenu, true)
  // Out of what the menu shows; a group left empty goes too.
  assert.deepEqual(menuGroups(model.services.groups), [])
  assert.equal(withServicesOffMenu(tables()!, new Set()).services.groups[0].items[0].offMenu, undefined)
})
