import ServicePageTemplate from '../components/ServicePageTemplate'
import { services } from '../lib/services-data'

export const metadata = {
  title: 'Website Development Dubai | Apps, E-commerce, WhatsApp Bots | Byteflow',
  description:
    'Professional website development, mobile apps and AI chatbots for Dubai businesses. WordPress, custom development, UAE payment gateways and Arabic language support.',
}

export default function Page() {
  const service = services.find((s) => s.slug === 'website-development')!
  return <ServicePageTemplate service={service} />
}
