import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Graphic Design Dubai | Logo, Branding, UI/UX, Social Media | Byteflow',
  description:
    'Professional logo design, brand identity, UI/UX design and social media graphics for Dubai businesses. Arabic and English, unlimited revisions, fast turnaround.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'graphics-designing')!
  return <ServicePageTemplate service={service} />
}
