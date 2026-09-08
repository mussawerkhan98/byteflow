import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  alternates: { canonical: "/data-backup-recovery" },
   title: 'Data Backup & Recovery Dubai | Cloud Backup | Byteflow',
  description:
    'Automated cloud backup and fast disaster recovery for Dubai businesses. Hourly backups, immutable storage, 4-hour server recovery. Never pay a ransom again.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'data-backup-recovery')!
  return <ServicePageTemplate service={service} />
}
