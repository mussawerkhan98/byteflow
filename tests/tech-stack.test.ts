import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { mergeHomeBlock } from '../app/lib/home-content'
import { initials, techTabs } from '../app/lib/tech-stack'

test('the default tabs, with a tab that has no logos (Backup) left out', () => {
  const tabs = techTabs(mergeHomeBlock('home_tech', null))
  assert.deepEqual(tabs.map((tab) => tab.title), ['Microsoft', 'Security', 'Networking', 'Cloud', 'Web'])
  assert.deepEqual(tabs[2].logos.map((logo) => logo.name), ['Cisco', 'Ubiquiti', 'HPE Aruba', 'Fortinet'])
})

test('logos follow their tab by name, in saved order; hidden tabs and logos are left out', () => {
  const block = mergeHomeBlock('home_tech', {
    tabs: [
      { title: 'Backup', description: 'Restores', show: 'yes' },
      { title: 'Cloud', description: '', show: 'no' },
      { title: 'backup ', description: 'A second tab with the same name', show: 'yes' },
    ],
    logos: [
      { title: 'Veeam', tab: ' BACKUP', logo: '/api/media/7/veeam.svg', show: 'yes' },
      { title: 'Azure', tab: 'Cloud', logo: '', show: 'yes' },
      { title: 'Old vendor', tab: 'Backup', logo: '', show: 'no' },
      { title: 'Acronis', tab: 'Backup', logo: '', show: 'yes' },
      { title: 'Lost', tab: 'No such tab', logo: '', show: 'yes' },
    ],
  })
  assert.deepEqual(techTabs(block), [
    {
      id: 'backup-0',
      title: 'Backup',
      description: 'Restores',
      logos: [
        { name: 'Veeam', logo: '/api/media/7/veeam.svg' },
        { name: 'Acronis', logo: '' },
      ],
    },
  ])
})

test('nothing to show when every tab is hidden', () => {
  const block = mergeHomeBlock('home_tech', { tabs: [{ title: 'Web', show: 'no' }] })
  assert.deepEqual(techTabs(block), [])
})

test('a tile without a logo shows the name’s initials', () => {
  assert.equal(initials('Google Workspace'), 'GW')
  assert.equal(initials('Fortinet'), 'F')
  assert.equal(initials('Microsoft 365'), 'M')
  assert.equal(initials('HPE Aruba'), 'HA')
  assert.equal(initials('3CX'), '3')
})
