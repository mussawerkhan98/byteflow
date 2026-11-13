import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { cardPrice, listLayout, planButton, planDeliverables, planGroups, planPrice, planUnit, priceText, pricedPlans, quoteHref, showTable, shownPlans, tableGroups } from '../app/lib/plans'
import { quotePrefill } from '../app/lib/quote-prefill'
import { serviceDefaults } from '../app/lib/service-page'
import { services as servicePages } from '../app/lib/services-data'
import { previewPath, previewSignature, validPreview } from '../app/lib/preview'
import { homeDefaults, planLabels } from '../app/lib/home-content'

type Item = Record<string, string>
const fields = { ...planLabels, unit: 'per month', button_label: 'Request an SEO Quote', button_link: '/contact-us' }

test('a fixed price shows with its unit; "Starting from" adds the From words', () => {
  assert.deepEqual(planPrice({ price: 'AED 1,500', price_type: 'fixed' }, fields), { kind: 'price', prefix: '', amount: 'AED 1,500', unit: 'per month', parts: [] })
  // Saved before price types existed: a fixed price.
  assert.deepEqual(planPrice({ price: 'AED 30' }, fields), { kind: 'price', prefix: '', amount: 'AED 30', unit: 'per month', parts: [] })
  const from = planPrice({ price: 'AED 2,000', price_type: 'from' }, fields)
  assert.equal(priceText(from), 'From AED 2,000')
})

test('a custom quote or a blank price shows Request Pricing with no unit', () => {
  assert.deepEqual(planPrice({ price: 'AED 5,000', price_type: 'custom' }, fields), { kind: 'custom', label: 'Request Pricing' })
  assert.deepEqual(planPrice({ price: '  ', price_type: 'fixed' }, fields), { kind: 'custom', label: 'Request Pricing' })
  assert.equal(priceText(planPrice({ price: '' }, { ...fields, custom_label: 'Ask for a price' })), 'Ask for a price')
})

test('hidden plans are left out but keep their table column; a preview shows them marked', () => {
  const plans: Item[] = [{ title: 'A', show: 'yes' }, { title: 'B', show: 'no' }, { title: 'C' }]
  assert.deepEqual(
    shownPlans(plans).map((shown) => [shown.plan.title, shown.column]),
    [['A', 0], ['C', 2]],
  )
  assert.deepEqual(
    shownPlans(plans, true).map((shown) => [shown.plan.title, shown.hidden]),
    [['A', false], ['B', true], ['C', false]],
  )
})

test('each plan has its own button, else the section one', () => {
  assert.deepEqual(planButton({ button_label: 'Book a call', button_link: '/book' }, fields), { label: 'Book a call', href: '/book' })
  assert.deepEqual(planButton({}, fields), { label: 'Request an SEO Quote', href: '/contact-us' })
})

test('deliverables and inclusion groups show only when filled, under the section names', () => {
  const plan = { d_keywords: '25', d_pages: '', d_content: '4', g_technical: 'Site audit\nSpeed fixes', g_links: '', g_local: '- Google Business Profile' }
  assert.deepEqual(planDeliverables(plan, fields), [
    { value: '25', label: 'Keywords' },
    { value: '4', label: 'Content pieces' },
  ])
  assert.deepEqual(planGroups(plan, fields).map((group) => group.title), ['Technical', 'Local SEO'])
  assert.deepEqual(planGroups(plan, fields)[0].items, ['Site audit', 'Speed fixes'])
})

test('table rows sit under a heading each time their group changes', () => {
  const rows: Item[] = [{ title: 'r1', group: 'Technical' }, { title: 'r2', group: 'Technical' }, { title: 'r3', group: 'On-page' }, { title: 'r4' }]
  assert.deepEqual(
    tableGroups(rows).map((group) => [group.title, group.rows.map((row) => row.title)]),
    [['Technical', ['r1', 'r2']], ['On-page', ['r3']], ['', ['r4']]],
  )
})

test('structured data and the banner card skip hidden plans and custom quotes', () => {
  const plans: Item[] = [
    { title: 'Starter', price: '', price_type: 'custom' },
    { title: 'Growth', price: 'AED 3,500', price_type: 'from' },
    { title: 'Scale', price: 'AED 6,000', show: 'no' },
  ]
  assert.deepEqual(pricedPlans(plans, fields), [{ title: 'Growth', price: 3500 }])
  assert.deepEqual(cardPrice(shownPlans(plans), fields), { kind: 'price', prefix: '', amount: 'AED 3,500', unit: 'per month', parts: [] })
  assert.deepEqual(cardPrice(shownPlans([plans[0]]), fields), { kind: 'custom', label: 'Request Pricing' })
})

test('the IT AMC plans start shown, at fixed prices, as before', () => {
  for (const plan of homeDefaults.amc_plans.lists.plans) assert.deepEqual(planPrice(plan, homeDefaults.amc_plans.fields).kind, 'price')
  assert.equal(shownPlans(homeDefaults.amc_plans.lists.plans).length, 3)
})

test('a preview link works for its path until it expires, and only on this site', () => {
  const secret = 'a-long-shared-secret-value'
  const now = 1_800_000_000_000
  const expires = now / 1000 + 600
  const signature = previewSignature(secret, '/digital-marketing', expires)
  const check = (overrides: Partial<Parameters<typeof validPreview>[0]>) =>
    validPreview({ secret, path: '/digital-marketing', expires: String(expires), signature, now, ...overrides })
  assert.equal(check({}), true)
  assert.equal(check({ path: '/cyber-security' }), false)
  assert.equal(check({ now: now + 601_000 }), false)
  assert.equal(check({ signature: signature.replace(/.$/, (c) => (c === '0' ? '1' : '0')) }), false)
  assert.equal(check({ secret: 'short' }), false)
  assert.equal(previewPath('//evil.example'), null)
  assert.equal(previewPath('https://evil.example'), null)
  assert.equal(previewPath('/it-amc-services-dubai'), '/it-amc-services-dubai')
})

const units = serviceDefaults(servicePages.find((page) => page.slug === 'cloud-services-dubai')!).plans.fields

test('each plan can have its own billing unit; blank keeps the page one', () => {
  const page = { ...units, unit: 'per month' }
  assert.equal(planUnit({}, page), 'per month')
  assert.equal(planUnit({ unit_type: 'user_month' }, page), 'per user / month')
  assert.equal(planUnit({ unit_type: 'one_time' }, page), 'one-time')
  assert.equal(planUnit({ unit_type: 'project' }, page), 'per project')
  assert.equal(planUnit({ unit_type: 'custom', unit_custom: 'per mailbox / month' }, page), 'per mailbox / month')
  assert.equal(planUnit({ unit_type: 'custom', unit_custom: ' ' }, page), 'per month')
  const device = planPrice({ price: 'AED 25', unit_type: 'device_month' }, page)
  assert.equal(device.kind === 'price' ? device.unit : '', 'per device / month')
})

test('a two-part price lists the setup and management fees; with no price, the management fee leads', () => {
  assert.deepEqual(planPrice({ price: 'AED 900', setup_fee: 'AED 2,000', management_fee: 'AED 450' }, units), {
    kind: 'price',
    prefix: '',
    amount: 'AED 900',
    unit: '',
    parts: [
      { label: 'Setup fee', amount: 'AED 2,000', unit: 'one-time' },
      { label: 'Management fee', amount: 'AED 450', unit: 'per month' },
    ],
  })
  assert.deepEqual(planPrice({ price: '', price_type: 'from', setup_fee: 'AED 2,000', management_fee: 'AED 450' }, units), {
    kind: 'price',
    prefix: 'From',
    amount: 'AED 450',
    unit: 'per month',
    parts: [{ label: 'Setup fee', amount: 'AED 2,000', unit: 'one-time' }],
  })
  assert.deepEqual(planPrice({ price: '', setup_fee: 'AED 5,000' }, units), { kind: 'price', prefix: '', amount: 'AED 5,000', unit: 'one-time', parts: [] })
  assert.equal(planPrice({ price: '', setup_fee: 'AED 5,000', price_type: 'custom' }, units).kind, 'custom')
})

test('the table shows automatically with up to four plans, or as switched', () => {
  assert.equal(showTable({}, 4), true)
  assert.equal(showTable({ show_table: 'auto' }, 9), false)
  assert.equal(showTable({ show_table: 'yes' }, 9), true)
  assert.equal(showTable({ show_table: 'no' }, 3), false)
})

test('twelve plans show; a thirteenth is left out', () => {
  const plans = Array.from({ length: 13 }, (_, i) => ({ title: `Plan ${i + 1}` }))
  assert.equal(shownPlans(plans).length, 12)
})

test('quote buttons carry the service and package on the five pages set up for it', () => {
  assert.equal(quoteHref('/contact-us', 'cloud-services-dubai', 'Business & Co'), '/contact-us?service=cloud-services-dubai&package=Business+%26+Co')
  assert.equal(quoteHref('/contact-us?ref=x#form', 'cyber-security', 'Pro'), '/contact-us?ref=x&service=cyber-security&package=Pro#form')
  assert.equal(quoteHref('https://wa.me/971', 'cyber-security', 'Pro'), 'https://wa.me/971')
  assert.equal(planButton({ title: 'Pro' }, { ...units, quote_prefill: 'yes' }, 'cyber-security').href, '/contact-us?service=cyber-security&package=Pro')
  assert.equal(planButton({ title: 'Pro' }, { ...units, quote_prefill: 'no' }, 'cyber-security').href, '/contact-us')
  const prefill = (slug: string) => serviceDefaults(servicePages.find((page) => page.slug === slug)!).plans.fields.quote_prefill
  for (const slug of ['cloud-services-dubai', 'cyber-security', 'data-backup-recovery', 'system-integration', 'graphics-designing']) assert.equal(prefill(slug), 'yes', slug)
  for (const slug of ['digital-marketing', 'website-development', 'landing-page-designing']) assert.equal(prefill(slug), 'no', slug)
})

test('every service page starts with the table on Automatic and the banner card on What’s included', () => {
  for (const page of servicePages) {
    const fields = serviceDefaults(page).plans.fields
    assert.equal(fields.show_table, 'auto')
    assert.equal(fields.banner_card, 'included')
  }
})

test('the enquiry form picks the service and names the package from the address', () => {
  const options = ['Cyber Security', 'Cloud Services / Microsoft 365', 'Other']
  assert.deepEqual(quotePrefill('?service=cloud-services-dubai&package=Business', options), { service: 'Cloud Services / Microsoft 365', message: 'Package: Business\n\n' })
  assert.deepEqual(quotePrefill('?service=unknown&package=X', options), { service: '', message: 'Package: X\n\n' })
  assert.equal(quotePrefill('?ref=ad', options), null)
})

test('more than four quote-only packages show as a price list; detailed ones and short lists stay cards', () => {
  const quoteOnly = (n: number) => shownPlans(Array.from({ length: n }, (_, i) => ({ title: `P${i}`, price_type: 'custom', third_party: 'Billed separately', summary: 'A line' })))
  assert.equal(listLayout({ layout: 'auto' }, quoteOnly(9)), true)
  assert.equal(listLayout({ layout: 'auto' }, quoteOnly(4)), false, 'four or fewer stay cards')
  const detailed = shownPlans([...quoteOnly(8).map((s) => s.plan), { title: 'Pro', points: 'Firewall\nEDR' }])
  assert.equal(listLayout({ layout: 'auto' }, detailed), false)
  assert.equal(listLayout({ layout: 'list' }, quoteOnly(2)), true)
  assert.equal(listLayout({ layout: 'cards' }, quoteOnly(9)), false)
  // The IT AMC page (no layout field) is always cards.
  assert.equal(listLayout({}, quoteOnly(9)), false)
  assert.equal(quoteHref('/contact-us', 'cloud-services-dubai', ''), '/contact-us?service=cloud-services-dubai')
})
