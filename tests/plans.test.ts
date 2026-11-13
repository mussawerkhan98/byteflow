import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { cardPrice, planButton, planDeliverables, planGroups, planPrice, priceText, pricedPlans, shownPlans, tableGroups } from '../app/lib/plans'
import { previewPath, previewSignature, validPreview } from '../app/lib/preview'
import { homeDefaults, planLabels } from '../app/lib/home-content'

type Item = Record<string, string>
const fields = { ...planLabels, unit: 'per month', button_label: 'Request an SEO Quote', button_link: '/contact-us' }

test('a fixed price shows with its unit; "Starting from" adds the From words', () => {
  assert.deepEqual(planPrice({ price: 'AED 1,500', price_type: 'fixed' }, fields), { kind: 'price', prefix: '', amount: 'AED 1,500', unit: 'per month' })
  // Saved before price types existed: a fixed price.
  assert.deepEqual(planPrice({ price: 'AED 30' }, fields), { kind: 'price', prefix: '', amount: 'AED 30', unit: 'per month' })
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
  assert.deepEqual(cardPrice(shownPlans(plans), fields), { kind: 'price', prefix: '', amount: 'AED 3,500', unit: 'per month' })
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
