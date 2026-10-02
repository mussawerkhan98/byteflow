import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  alternates: { canonical: "/it-amc-services-dubai" },
  // "IT AMC support Dubai" is the query this page already ranks closest to
  // — position 10.4 on 450 impressions — and the old title never contained
  // that phrase. "Services" is kept because "IT AMC services in Dubai" is the
  // larger term at 718 impressions, even though it sits further back.
  title: 'IT AMC Support & Services in Dubai | Byteflow',
  description:
    'IT AMC support across Dubai, Business Bay, JLT and WTC included. One fixed monthly fee, 2-hour on-site response, 24/7 monitoring and no surprise bills.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'it-amc-services-dubai')!
  return <ServicePageTemplate service={service} />
}
