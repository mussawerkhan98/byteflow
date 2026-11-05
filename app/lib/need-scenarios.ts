/**
 * The "Where does your IT need help?" columns (home_needs), resolved against
 * the published services: each scenario links to its service's page under the
 * service's own name, so the wording matches the menu and the Services tabs.
 * A scenario switched to Hide, or with no title, is left out; one whose service
 * is gone or unpublished still shows, without a link.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { HomeBlock } from './home-content'

export type NeedScenario = {
  number: string
  label: string
  title: string
  description: string
  link: { href: string; label: string } | null
}

export const MAX_SCENARIOS = 3

export function needScenarios(block: HomeBlock, services: { slug: string; title: string }[]): NeedScenario[] {
  return (block.lists.scenarios ?? [])
    .filter((item) => item.show !== 'no' && item.title)
    .slice(0, MAX_SCENARIOS)
    .map((item, index) => {
      const service = services.find((s) => s.slug === item.service)
      return {
        number: String(index + 1).padStart(2, '0'),
        label: item.label,
        title: item.title,
        description: item.description,
        link: service ? { href: `/${service.slug}`, label: service.title } : null,
      }
    })
}
