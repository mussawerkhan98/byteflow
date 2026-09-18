'use client'

import Link from 'next/link'
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
import { faChevronRight, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Icon } from './Icon'
import LogoLink from './LogoLink'

const fallbackUsefulLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
]

const services = [
  { label: 'Digital Marketing', href: '/digital-marketing' },
  { label: 'IT AMC', href: '/it-amc-services-dubai' },
  { label: 'Website Development', href: '/website-development' },
  { label: 'Landing Page Designing', href: '/landing-page-designing' },
  { label: 'Graphics Designing', href: '/graphics-designing' },
]

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

type FooterSettings = { logo_url?: string; header_phone?: string; primary_email?: string; physical_address?: string; footer_text?: string; copyright_text?: string; facebook_url?: string; instagram_url?: string; linkedin_url?: string; x_url?: string; youtube_url?: string; tiktok_url?: string; github_url?: string }
export default function Footer({ navigation = fallbackUsefulLinks, settings = {} }: { navigation?: { label: string; href: string; new_tab?: boolean }[]; settings?: FooterSettings }) {
  const usefulLinks = navigation
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="space-y-6">
            <LogoLink
              src={settings.logo_url || '/images/logo.png'}
              width={140}
              height={40}
              imageClassName="h-10 w-auto object-contain"
            />
            <p className="text-[var(--text-footer-link)] text-sm leading-relaxed">
              {settings.footer_text || 'Leading IT solutions provider trusted by 500+ businesses across Dubai and UAE since 2017.'}
            </p>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="tel:+971543282042"
                  className="flex items-center gap-3 text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                  >
                    <Icon icon={faPhone} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                  </span>
                  {settings.header_phone || '+971 54 328 2042'}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@byteflow.ae"
                  className="flex items-center gap-3 text-[var(--text-footer-link)] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                  >
                    <Icon icon={faEnvelope} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                  </span>
                  {settings.primary_email || 'info@byteflow.ae'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[var(--text-footer-link)]">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--border-subtle)', border: '1px solid #2CCDDE20' }}
                >
                  <Icon icon={faLocationDot} className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} />
                </span>
                {settings.physical_address || 'Dubai, United Arab Emirates'}
              </li>
            </ul>
          </div>

          <div>
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

          <div>
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

          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Follow Us
            </h3>
            <p className="text-[var(--text-footer-link)] text-sm mb-6 leading-relaxed">
              Stay updated with our latest news and IT insights.
            </p>
            <div className="flex gap-2.5">
              {shownSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-footer-link)] hover:text-black transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_rgba(44,205,222,0.4)]"
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

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[var(--text-dim)] text-sm">
            &copy; {new Date().getFullYear()} {settings.copyright_text || 'Byteflow Information Technology. All rights reserved.'}
          </p>
          <p className="text-[var(--text-dim)] text-sm">
            Trusted by 500+ businesses across Dubai and UAE since 2017.
          </p>
        </div>
      </div>
    </footer>
  )
}
