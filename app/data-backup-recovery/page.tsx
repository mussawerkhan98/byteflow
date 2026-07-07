import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Data Backup and Recovery Dubai | Cloud Backup, Ransomware Recovery | Byteflow',
  description:
    'Automated cloud backup and fast disaster recovery for Dubai businesses. Hourly backups, immutable storage, 4-hour server recovery. Never pay a ransom again.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'data-backup-recovery')!
  return <ServicePageTemplate service={service} />
}
