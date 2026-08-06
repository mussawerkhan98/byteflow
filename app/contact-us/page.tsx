import type { Metadata } from 'next'
import Contact from '../components/Contact'
import { getPageHero, getPageMetadata, getSiteSettings } from '../lib/cms'

export async function generateMetadata(): Promise<Metadata> { return await getPageMetadata('contact-us') ?? { title: 'Contact Us | Byteflow Information Technology', description: 'Get in touch with Byteflow IT. Free consultation, on-site and remote support across Dubai, Sharjah and Abu Dhabi.' } }

export default async function ContactPage() {
  const [settings,hero] = await Promise.all([getSiteSettings(),getPageHero('contact-us')])
  return <Contact settings={(settings ?? {}) as never} hero={hero} />
}
