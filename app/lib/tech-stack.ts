/**
 * The tabs of the home Technologies section (home_tech), ready to show: hidden
 * tabs and logos left out, each logo under the tab it names, in saved order.
 * A tab with no logos to show is left out too, so no tab opens on an empty
 * grid.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { HomeBlock } from './home-content'

export type TechLogo = { name: string; logo: string }
export type TechTab = { id: string; title: string; description: string; logos: TechLogo[] }

/** The same tab name however it is spaced or capitalised. */
const tabKey = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase()

/** "Google Workspace" → "GW"; "Microsoft 365" → "M" (numbers are skipped). */
export function initials(name: string): string {
  const words = name.split(/[\s/&+-]+/).filter((word) => /^\p{L}/u.test(word))
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || name.trim().slice(0, 1)
}

/** How many different platforms the tabs show, and in how many areas (tabs). */
export function techCounts(tabs: TechTab[]): { platforms: number; areas: number } {
  const names = new Set(tabs.flatMap((tab) => tab.logos.map((logo) => tabKey(logo.name))))
  return { platforms: names.size, areas: tabs.length }
}

/** The icon a tab shows, from its name; anything unrecognised gets "layers". */
export function tabIcon(title: string): 'microsoft' | 'shield' | 'network' | 'backup' | 'cloud' | 'code' | 'layers' {
  const key = tabKey(title)
  if (/microsoft|office|365/.test(key)) return 'microsoft'
  if (/secur|cctv|firewall|protect/.test(key)) return 'shield'
  if (/network|wi-?fi|cabling/.test(key)) return 'network'
  if (/backup|recover|storage/.test(key)) return 'backup'
  if (/cloud|azure|aws/.test(key)) return 'cloud'
  if (/web|app|software|develop/.test(key)) return 'code'
  return 'layers'
}

export function techTabs(block: HomeBlock): TechTab[] {
  const logos = (block.lists.logos ?? []).filter((item) => item.show !== 'no' && item.title)
  const seen = new Set<string>()
  return (block.lists.tabs ?? [])
    .filter((tab) => tab.show !== 'no' && tab.title)
    .flatMap((tab) => {
      const key = tabKey(tab.title)
      if (seen.has(key)) return []
      seen.add(key)
      const items = logos.filter((item) => tabKey(item.tab ?? '') === key).map((item) => ({ name: item.title, logo: item.logo ?? '' }))
      if (!items.length) return []
      return [{ id: key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tab', title: tab.title, description: tab.description ?? '', logos: items }]
    })
    .map((tab, index) => ({ ...tab, id: `${tab.id}-${index}` }))
}
