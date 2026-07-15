import { getProjects } from '../lib/db'
import { projects as staticProjects } from '../lib/projects-data'
import ProjectsClient, { type UiProject, CATEGORIES } from './ProjectsClient'

export const dynamic = 'force-dynamic'

function categoryToVisual(category: string): string {
  const map: Record<string, string> = {
    'IT Support': 'it',
    'Cyber Security': 'cyber',
    'Cloud Services': 'cloud',
    'Web & Apps': 'web',
    'Digital Marketing': 'marketing',
    'System Integration': 'integration',
    'UI/UX Design': 'design',
  }
  return map[category] ?? 'it'
}

export default async function ProjectsPage() {
  const dbProjects = await getProjects()

  let uiProjects: UiProject[]

  if (dbProjects.length > 0) {
    // Use DB data — map fields to the UI shape
    uiProjects = dbProjects.map((p, index) => ({
      slug: p.slug,
      client: p.title,
      industry: p.industry,
      category: p.category,
      year: p.year,
      title: p.title,
      story: p.description,
      deliverables: p.bullet_points,
      metrics: p.metrics,
      tags: p.tags,
      featured: index === 0,
      image: p.image_url ?? '',
      visual: categoryToVisual(p.category),
    }))
  } else {
    // Fall back to static data while DB is empty
    uiProjects = staticProjects.map((p) => ({
      slug: p.slug,
      client: p.client,
      industry: p.industry,
      category: p.category,
      year: p.year,
      title: p.title,
      story: p.story,
      deliverables: p.deliverables,
      metrics: p.metrics,
      tags: p.tags,
      featured: !!p.featured,
      image: p.image,
      visual: p.visual,
    }))
  }

  return <ProjectsClient projects={uiProjects} />
}

// Export CATEGORIES for any page that needs them
export { CATEGORIES }
