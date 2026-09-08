import type { Metadata } from 'next'
import Contact from '../components/Contact'
import { getPageHero, getPageMetadata, getSiteSettings } from '../lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageMetadata('contact-us')
  return {
    ...(cms ?? { title: 'Contact Us | Byteflow Information Technology', description: 'Get in touch with Byteflow IT. Free consultation, on-site and remote support across Dubai, Sharjah and Abu Dhabi.' }),
    alternates: { canonical: '/contact-us' },
  }
}

export default async function ContactPage() {
  const [settings,hero] = await Promise.all([getSiteSettings(),getPageHero('contact-us')])
  return <Contact settings={(settings ?? {}) as never} hero={hero} />
}
