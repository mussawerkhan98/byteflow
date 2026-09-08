import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  alternates: { canonical: "/system-integration" },
  title: 'Data Backup & Recovery Dubai | Cloud Backup | Byteflow',
  description:
    'Complete system integration services for Dubai businesses. Structured cabling, server setup, CCTV, VoIP and multi-site network connectivity across UAE.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'system-integration')!
  return <ServicePageTemplate service={service} />
}
