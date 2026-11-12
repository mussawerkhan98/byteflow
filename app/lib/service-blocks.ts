import type { Metadata } from 'next'
import { getPageMetadata, getSection, getSiteFigures } from './cms'
import { mergeBlock, type HomeBlock } from './home-content'
import { serviceBlockKeys, serviceDefaults, type ServiceBlockKey } from './service-page'
import type { ServiceData } from './services-data'
import { fillDeep } from './site-figures'

/**
 * A service page's blocks as saved on the admin's "Service pages" screen
 * (section types svc_*, on the page with the service's slug), over the
 * page's starting content. Text can quote the site-wide figures.
 */
export async function getServiceBlocks(page: ServiceData): Promise<Record<ServiceBlockKey, HomeBlock>> {
  const defaults = serviceDefaults(page)
  const [figures, ...saved] = await Promise.all([getSiteFigures(), ...serviceBlockKeys.map((key) => getSection(page.slug, `svc_${key}`))])
  return Object.fromEntries(serviceBlockKeys.map((key, i) => [key, fillDeep(mergeBlock(defaults[key], saved[i]), figures)])) as Record<ServiceBlockKey, HomeBlock>
}

/**
 * A service page's metadata: the title and description from its SEO tab
 * (which start as the page's long-standing ones), its own address as the
 * canonical, and the share picture and indexing from its row under Pages.
 */
export async function seoMetadata(slug: string, seo: HomeBlock): Promise<Metadata> {
  const cms = await getPageMetadata(slug)
  const { title, description } = seo.fields
  return {
    ...cms,
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { ...cms?.openGraph, title, description, url: `/${slug}`, type: 'website' },
  }
}
