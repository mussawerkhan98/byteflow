import type { Metadata } from 'next'
import Contact from '../components/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | Byteflow Information Technology',
  description:
    'Get in touch with Byteflow IT. Free consultation, on-site and remote support across Dubai, Sharjah and Abu Dhabi. Call, WhatsApp or fill in the form.',
}

export default function ContactPage() {
  return <Contact />
}
