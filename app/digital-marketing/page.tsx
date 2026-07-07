import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Digital Marketing Dubai | SEO, Google Ads, Social Media | Byteflow',
  description:
    'Results-driven digital marketing for Dubai businesses. SEO, Google Ads, social media advertising and content marketing. Measurable leads, transparent reporting.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'digital-marketing')!
  return <ServicePageTemplate service={service} />
}
