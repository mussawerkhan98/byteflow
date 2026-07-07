'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const services = [
  { label: 'IT AMC / IT Support', href: '/it-amc-services-dubai' },
  { label: 'Cyber Security', href: '/cyber-security' },
  { label: 'System Integration', href: '/system-integration' },
  { label: 'Data Backup and Recovery', href: '/data-backup-recovery' },
  { label: 'Website / Apps / Bots', href: '/website-development' },
  { label: 'Cloud Services', href: '/cloud-services-dubai' },
  { label: 'UI/UX and Graphic Design', href: '/graphics-designing' },
  { label: 'Digital Marketing', href: '/digital-marketing' },
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(44,205,222,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px] gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Byteflow"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#9CA3AF] hover:text-[#2CCDDE] text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#2CCDDE] text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                Services
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 rounded-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden"
                style={{
                  background: '#040D12',
                  borderColor: '#2CCDDE30',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(44,205,222,0.08)',
                }}
              >
                <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }} />
                {services.map((s, i) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#6B7280] hover:text-[#2CCDDE] hover:bg-white/[0.03] transition-all duration-150"
                    style={{ borderBottom: i < services.length - 1 ? '1px solid #ffffff08' : 'none' }}
                  >
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#2CCDDE' }} />
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#9CA3AF] hover:text-[#2CCDDE] text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact-us"
            className="hidden lg:inline-flex group items-center gap-2 text-black text-sm font-bold px-5 py-2.5 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
          >
            Contact Us
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
            style={{ background: 'rgba(44,205,222,0.08)', border: '1px solid rgba(44,205,222,0.2)', color: '#2CCDDE' }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[calc(100vh-76px)]' : 'max-h-0'}`}
        style={{ background: '#040D12', borderTop: mobileOpen ? '1px solid rgba(44,205,222,0.12)' : 'none' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100vh - 76px)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[#9CA3AF] hover:text-[#2CCDDE] text-sm font-medium py-3 transition-colors duration-200"
              style={{ borderBottom: '1px solid #ffffff08' }}
            >
              {link.label}
            </Link>
          ))}

          <p className="text-[#374151] text-xs font-bold uppercase tracking-widest pt-5 pb-2">Services</p>
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 text-[#6B7280] hover:text-[#2CCDDE] text-sm py-2.5 transition-colors duration-200"
            >
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#2CCDDE' }} />
              {s.label}
            </Link>
          ))}

          <Link
            href="/contact-us"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center gap-2 text-black text-sm font-bold px-5 py-3 rounded-full mt-6 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
          >
            Contact Us
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
