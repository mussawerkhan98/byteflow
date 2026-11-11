'use client'

import Link from 'next/link'
import { figuresFrom } from '../lib/site-figures'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebookF,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { faChevronRight, faClock, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Icon } from './Icon'
import LogoLink from './LogoLink'
import FooterWordmark from './FooterWordmark'

const fallbackUsefulLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
]

const fallbackLegalLinks = [
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
]

/** "+971 54 328 2042" → "tel:+971543282042". */
const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

// Every platform we can render an icon for, in the order they should appear.
const socialIcons: Record<string, IconDefinition> = {
  Facebook: faFacebookF,
  Instagram: faInstagram,
  LinkedIn: faLinkedinIn,
  X: faXTwitter,
  YouTube: faYoutube,
  TikTok: faTiktok,
  GitHub: faGithub,
}

const fallbackSocials = [
  { label: 'Facebook', href: 'https://m.facebook.com/byteflow.ae/' },
  { label: 'Instagram', href: 'https://www.instagram.com/byteflow.ae/' },
  { label: 'LinkedIn', href: 'https://ae.linkedin.com/company/byteflow-techcascade' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@byteflow.ae' },
]

type FooterSettings = { logo_url?: string; header_phone?: string; primary_email?: string; physical_address?: string; business_hours?: string; footer_text?: string; copyright_text?: string; facebook_url?: string; instagram_url?: string; linkedin_url?: string; x_url?: string; youtube_url?: string; tiktok_url?: string; github_url?: string }
// `year` comes from the server: a client component reading the clock would
// disagree with the server's HTML when the two straddle New Year.
// `services` are the published services in the admin's order, so a new one
// is listed here straight away; `legalLinks` are the legal pages, by title.
type FooterLink = { label: string; href: string; new_tab?: boolean }
export default function Footer({ navigation = fallbackUsefulLinks, services = [], legalLinks = fallbackLegalLinks, settings = {}, year }: { navigation?: FooterLink[]; services?: FooterLink[]; legalLinks?: FooterLink[]; settings?: FooterSettings; year: number }) {
  const usefulLinks = navigation
  const phone = settings.header_phone || '+971 54 328 2042'
  const email = settings.primary_email || 'info@byteflow.ae'
  // The registered office, as in the organization markup: Google compares the two.
  const address = settings.physical_address || 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates'
  const hours = settings.business_hours || 'Monday to Saturday, 9:00am to 6:00pm'
  // The site-wide clients and founding year (Contact details & logo).
  const figures = figuresFrom(settings as Record<string, unknown>)
  const configuredSocials = [
    { label: 'Facebook', href: settings.facebook_url },
    { label: 'Instagram', href: settings.instagram_url },
    { label: 'LinkedIn', href: settings.linkedin_url },
    { label: 'X', href: settings.x_url },
    { label: 'YouTube', href: settings.youtube_url },
    { label: 'TikTok', href: settings.tiktok_url },
    { label: 'GitHub', href: settings.github_url },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))
  // Fall back to the hardcoded profiles when the CMS has none configured.
  const shownSocials = (configuredSocials.length ? configuredSocials : fallbackSocials)
    .map((item) => ({ ...item, icon: socialIcons[item.label] }))
    .filter((item) => Boolean(item.icon))
  return (
    <footer className="">
      <div
        className="h-[1px] w-full"
        style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }}
      />

      <div className="page-container py-16">
        {/* Wide screens: contact details, then four link columns. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12">

          <div className="space-y-6 sm:col-span-2 lg:col-span-3">
            <LogoLink
              src={settings.logo_url || '/images/logo.png'}
              // The logo's own shape (portrait, as in the header), so the
              // space kept for it matches before it loads.
              width={56}
              height={72}
              imageClassName="h-10 w-auto object-contain"
            />
            <p className="text-[var(--text-footer-link)] text-sm leading-relaxed">
              {/* The clients and founding year are in the bottom bar. */}
              {settings.footer_text || 'Dubai IT company for managed IT support, cyber security, cloud and digital services.'}
            </p>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href={telLink(phone)}
                  className="flex items-center gap-3 text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                  >
                    <Icon icon={faPhone} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                  >
                    <Icon icon={faEnvelope} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                  </span>
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-[var(--text-footer-link)]">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                >
                  <Icon icon={faLocationDot} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                </span>
                <address className="not-italic leading-relaxed pt-1">{address}</address>
              </li>
              <li className="flex items-start gap-3 text-[var(--text-footer-link)]">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                >
                  <Icon icon={faClock} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                </span>
                <span className="leading-relaxed pt-1">{hours}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Useful Links
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-all duration-200 group"
                  >
                    <Icon
                      icon={faChevronRight}
                      className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: '#2CCDDE' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-all duration-200 group"
                  >
                    <Icon
                      icon={faChevronRight}
                      className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: '#2CCDDE' }}
                    />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-all duration-200 group"
                  >
                    <Icon
                      icon={faChevronRight}
                      className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: '#2CCDDE' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Follow Us
            </h3>
            <p className="text-[var(--text-footer-link)] text-sm mb-6 leading-relaxed">
              Stay updated with our latest news and IT insights.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {shownSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--text-footer-link)] hover:text-black transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_rgba(44,205,222,0.4)]"
                  style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'linear-gradient(135deg, #2CCDDE, #46A3E1)'
                    el.style.border = '1px solid transparent'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'var(--border-subtle)'
                    el.style.border = '1px solid #2CCDDE20'
                  }}
                >
                  <Icon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[var(--text-dim)] text-sm">
            &copy; {year} {settings.copyright_text || 'Byteflow Information Technology. All rights reserved.'}
          </p>
          <p className="text-[var(--text-dim)] text-sm">
            Trusted by {figures.clients} businesses across Dubai and UAE since {figures.founded}.
          </p>
        </div>
      </div>
    </footer>
  )
}
