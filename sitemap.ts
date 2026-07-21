import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from './lib/db'
import { projects as staticProjects } from './lib/projects-data'

const BASE_URL = 'https://byteflow.ae'

export const revalidate = 3600

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'daily' },
  { path: '/projects', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/it-amc-services-dubai', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/cyber-security', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/system-integration', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/data-backup-recovery', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/website-development', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/cloud-services-dubai', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/graphics-designing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/digital-marketing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/landing-page-designing', priority: 0.9, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, dbProjects] = await Promise.all([getPosts(), getProjects()])

  const projectSlugs = dbProjects.length > 0 ? dbProjects.map((p) => p.slug) : staticProjects.map((p) => p.slug)

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...blogEntries, ...projectEntries]
}
