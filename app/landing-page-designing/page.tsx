import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Landing Page Designing Dubai | High-Converting Pages | Byteflow',
  description:
    'Conversion-focused landing pages for Google Ads and social campaigns in Dubai and the UAE. Mobile-first design, fast load times, built to turn clicks into leads.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'landing-page-designing')!
  return <ServicePageTemplate service={service} />
}
