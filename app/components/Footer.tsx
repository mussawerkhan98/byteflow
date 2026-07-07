'use client'

import Link from 'next/link'
import Image from 'next/image'

const usefulLinks = [
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

const socials = [
  {
    label: 'Facebook',
    href: 'https://m.facebook.com/byteflow.ae/',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://ae.linkedin.com/company/byteflow-techcascade',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/byteflow.ae/',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@byteflow.ae',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.76a4.85 4.85 0 01-1.03-.07z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="">
      <div
        className="h-[1px] w-full"
        style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Byteflow"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              Leading IT solutions provider trusted by 500+ businesses across Dubai and UAE since 2017.
            </p>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="tel:+971543282042"
                  className="flex items-center gap-3 text-[#4B5563] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#ffffff08', border: '1px solid #2CCDDE20' }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  +971 54 328 2042
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@byteflow.ae"
                  className="flex items-center gap-3 text-[#4B5563] hover:text-[#2CCDDE] transition-colors duration-200"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#ffffff08', border: '1px solid #2CCDDE20' }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  info@byteflow.ae
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#4B5563]">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#ffffff08', border: '1px solid #2CCDDE20' }}
                >
                  <svg className="w-3.5 h-3.5" style={{ color: '#2CCDDE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Dubai, United Arab Emirates
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
                    className="flex items-center gap-2.5 text-sm text-[#4B5563] hover:text-[#2CCDDE] transition-all duration-200 group"
                  >
                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: '#2CCDDE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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
                    className="flex items-center gap-2.5 text-sm text-[#4B5563] hover:text-[#2CCDDE] transition-all duration-200 group"
                  >
                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: '#2CCDDE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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
            <p className="text-[#4B5563] text-sm mb-6 leading-relaxed">
              Stay updated with our latest news and IT insights.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-[#4B5563] hover:text-black transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_rgba(44,205,222,0.4)]"
                  style={{ background: '#ffffff08', border: '1px solid #2CCDDE20' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'linear-gradient(135deg, #2CCDDE, #46A3E1)'
                    el.style.border = '1px solid transparent'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = '#ffffff08'
                    el.style.border = '1px solid #2CCDDE20'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ffffff08' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#374151] text-sm">
            &copy; 2024 Byteflow Information Technology. All rights reserved.
          </p>
          <p className="text-[#374151] text-sm">
            Trusted by 500+ businesses across Dubai and UAE since 2017.
          </p>
        </div>
      </div>
    </footer>
  )
}
