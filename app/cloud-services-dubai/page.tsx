import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Cloud Services Dubai | Microsoft 365, Azure, Cloud Migration | Byteflow',
  description:
    'Managed cloud services for Dubai businesses. Microsoft 365 migration, Azure setup, cloud backup and hybrid infrastructure. Zero data loss, full ongoing management.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'cloud-services-dubai')!
  return <ServicePageTemplate service={service} />
}
