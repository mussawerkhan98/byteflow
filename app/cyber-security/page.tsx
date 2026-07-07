import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Cyber Security Services Dubai | Firewall, EDR, Email Security | Byteflow',
  description:
    'Enterprise cyber security for UAE businesses. Next-gen firewall, endpoint detection, email security and 24/7 threat monitoring. Stop ransomware before it encrypts.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'cyber-security')!
  return <ServicePageTemplate service={service} />
}
