import type { Metadata } from 'next'
import ServicePage from '../components/service-page/ServicePage'
import { getServiceBlocks, seoMetadata } from '../lib/service-blocks'
import { services } from '../lib/services-data'

const page = services.find((service) => service.slug === 'cloud-services-dubai')!

// Its search title and description are on its SEO tab (Service pages), which
// starts with the ones this page has always had.
export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata(page.slug, (await getServiceBlocks(page)).seo)
}

export default function Page() {
  return <ServicePage page={page} />
}
