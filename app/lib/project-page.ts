/**
 * The Projects page (/projects) and each project's own page: the filters,
 * the figures in the banner, the picture each project shows and the related
 * projects, all worked out from the published projects themselves, so every
 * number on the page is a count of real rows.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { DbProject } from './db'
import { homePhotos, type PhotoSlot } from './home-photos'
import { services } from './services-data'

type ProjectLike = Pick<DbProject, 'slug' | 'title' | 'category' | 'industry'> &
  Partial<Pick<DbProject, 'image_url' | 'card_image' | 'card_image_alt'>>

/** "All work", then each category in the order its first project appears, with how many there are. */
export function projectFilters(projects: Pick<DbProject, 'category'>[]): { category: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const project of projects) {
    const category = project.category.trim()
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return [...counts].map(([category, count]) => ({ category, count }))
}

const distinct = (values: string[]) => new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)).size

/** How many projects, services (categories) and industries are published. */
export function projectStats(projects: Pick<DbProject, 'category' | 'industry'>[]) {
  return {
    projects: projects.length,
    services: distinct(projects.map((project) => project.category)),
    industries: distinct(projects.map((project) => project.industry)),
  }
}

// Project categories are typed freely in the admin; these are the ones in
// use and the service page each belongs to.
const categoryAliases: Record<string, string> = {
  'it support': 'it-amc-services-dubai',
  'it amc': 'it-amc-services-dubai',
  'cyber security': 'cyber-security',
  'cloud services': 'cloud-services-dubai',
  cloud: 'cloud-services-dubai',
  'web & apps': 'website-development',
  'web development': 'website-development',
  'digital marketing': 'digital-marketing',
  'system integration': 'system-integration',
  'ui/ux design': 'graphics-designing',
  'graphic design': 'graphics-designing',
  'data backup': 'data-backup-recovery',
  'landing pages': 'landing-page-designing',
}

/** The service page a category belongs to, by alias or by the service's own name; null when none does. */
export function serviceForCategory(category: string): { title: string; href: string } | null {
  const key = category.trim().toLowerCase()
  if (!key) return null
  const slug = categoryAliases[key] ?? services.find((service) => service.title.toLowerCase() === key)?.slug
  const service = slug && services.find((item) => item.slug === slug)
  return service ? { title: service.title, href: `/${service.slug}` } : null
}

// A representative scene for a project without a picture of its own, by
// the kind of work (home-photos.ts): never presented as the client's site.
const scene = (category: string): PhotoSlot => {
  const slug = serviceForCategory(category)?.href.slice(1)
  if (slug === 'cyber-security' || slug === 'data-backup-recovery') return homePhotos.work[1]
  if (slug === 'cloud-services-dubai') return homePhotos.work[3]
  if (slug === 'system-integration') return homePhotos.needs[0]
  if (slug && ['website-development', 'digital-marketing', 'graphics-designing', 'landing-page-designing'].includes(slug)) return homePhotos.work[2]
  return homePhotos.work[0]
}

/** The project's own picture (its featured image, else its card image), or a representative scene. */
export function projectPhoto(project: ProjectLike): PhotoSlot {
  const own = project.image_url?.trim()
  if (own) return { src: own, alt: project.title, brief: '' }
  const card = project.card_image?.trim()
  if (card) return { src: card, alt: project.card_image_alt?.trim() || project.title, brief: '' }
  return scene(project.category)
}

/** Up to `max` other projects: the same category first, then the same industry, then the rest in order. */
export function relatedProjects<T extends ProjectLike>(all: T[], current: ProjectLike, max = 3): T[] {
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase() && a.trim() !== ''
  const others = all.filter((project) => project.slug !== current.slug)
  const rank = (project: T) => (same(project.category, current.category) ? 0 : same(project.industry, current.industry) ? 1 : 2)
  return others
    .map((project, index) => ({ project, index }))
    .sort((a, b) => rank(a.project) - rank(b.project) || a.index - b.index)
    .slice(0, max)
    .map(({ project }) => project)
}
