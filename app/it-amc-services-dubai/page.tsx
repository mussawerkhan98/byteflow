import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  alternates: { canonical: "/it-amc-services-dubai" },
  title: 'IT AMC Services Dubai | Managed IT Support | Byteflow',
  description:
    'IT AMC and managed IT support for businesses across Dubai, Sharjah and Abu Dhabi. 2-hour on-site response, 24/7 monitoring, zero surprise costs.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'it-amc-services-dubai')!
  return <ServicePageTemplate service={service} />
}
