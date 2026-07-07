'use client'

import { useState } from 'react'
import Link from 'next/link'

const socials = [
  {
    label: 'Facebook',
    href: 'https://m.facebook.com/byteflow.ae/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://ae.linkedin.com/company/byteflow-techcascade',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/byteflow.ae/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@byteflow.ae',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.76a4.85 4.85 0 01-1.03-.07z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/971543282042',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

const contactInfo = [
  {
    label: 'Phone',
    value: '+971 54 328 2042',
    href: 'tel:+971543282042',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'info@byteflow.ae',
    href: 'mailto:info@byteflow.ae',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'Location',
    value: 'Dubai, United Arab Emirates',
    href: 'https://maps.google.com/?q=Dubai,UAE',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: 'Support Hours',
    value: '24 / 7 Always Available',
    href: null,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const services = [
  'IT AMC / IT Support',
  'Cyber Security',
  'Cloud Services / Microsoft 365',
  'Data Backup & Recovery',
  'Website / App Development',
  'Digital Marketing',
  'UI/UX & Graphic Design',
  'System Integration',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle = (name: string) => ({
    background: focused === name ? 'rgba(44,205,222,0.05)' : 'rgba(255,255,255,0.03)',
    border: focused === name ? '1px solid rgba(44,205,222,0.5)' : '1px solid rgba(255,255,255,0.08)',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    color: '#fff',
  })

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(44,205,222,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(70,163,225,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
            style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
          >
            Contact Us
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-white">Let's Talk About</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Your IT Needs
              </span>
            </h2>
            <p className="text-[#5A6272] text-base leading-relaxed max-w-sm lg:text-right">
              Free consultation, no commitment. We will get back to you within 2 hours on business days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Contact cards */}
            {contactInfo.map((item) => {
              const inner = (
                <div
                  className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.12)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(44,205,222,0.35)]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44,205,222,0.14), rgba(70,163,225,0.08))',
                      border: '1px solid rgba(44,205,222,0.22)',
                      color: '#2CCDDE',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#374151] font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-white text-sm font-semibold group-hover:text-[#2CCDDE] transition-colors duration-200">{item.value}</p>
                  </div>
                </div>
              )

              return item.href ? (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={item.label}>{inner}</div>
              )
            })}

            {/* Social links */}
            <div
              className="p-6 rounded-2xl mt-1"
              style={{
                background: 'linear-gradient(160deg, rgba(44,205,222,0.05) 0%, #050F18 100%)',
                border: '1px solid rgba(44,205,222,0.12)',
              }}
            >
              <p className="text-xs text-[#374151] font-semibold uppercase tracking-wider mb-5">Follow Us</p>
              <div className="flex items-center gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(44,205,222,0.4)]"
                    style={{
                      background: 'rgba(44,205,222,0.07)',
                      border: '1px solid rgba(44,205,222,0.18)',
                      color: '#5A6272',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.background = 'linear-gradient(135deg, #2CCDDE, #46A3E1)'
                      el.style.border = '1px solid transparent'
                      el.style.color = '#000'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.background = 'rgba(44,205,222,0.07)'
                      el.style.border = '1px solid rgba(44,205,222,0.18)'
                      el.style.color = '#5A6272'
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, rgba(70,163,225,0.02) 40%, #050F18 100%)',
                border: '1px solid rgba(44,205,222,0.18)',
              }}
            >
              {/* Top gradient line */}
              <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }} />

              <div className="p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
                    >
                      <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-xl font-bold mb-2">Message Sent!</p>
                      <p className="text-[#5A6272] text-sm">Our team will get back to you within 2 hours.</p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', company: '', email: '', phone: '', service: '', message: '' }) }}
                      className="mt-2 text-xs font-semibold text-[#2CCDDE] underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Name + Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Full Name <span style={{ color: '#2CCDDE' }}>*</span></label>
                        <input
                          name="name"
                          type="text"
                          required
                          placeholder="Ahmed Al Mansouri"
                          value={form.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className="px-4 py-3 rounded-xl text-sm placeholder-[#374151] w-full"
                          style={inputStyle('name')}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Company Name</label>
                        <input
                          name="company"
                          type="text"
                          placeholder="Your Company LLC"
                          value={form.company}
                          onChange={handleChange}
                          onFocus={() => setFocused('company')}
                          onBlur={() => setFocused(null)}
                          className="px-4 py-3 rounded-xl text-sm placeholder-[#374151] w-full"
                          style={inputStyle('company')}
                        />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Email Address <span style={{ color: '#2CCDDE' }}>*</span></label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className="px-4 py-3 rounded-xl text-sm placeholder-[#374151] w-full"
                          style={inputStyle('email')}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Phone Number</label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+971 50 000 0000"
                          value={form.phone}
                          onChange={handleChange}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused(null)}
                          className="px-4 py-3 rounded-xl text-sm placeholder-[#374151] w-full"
                          style={inputStyle('phone')}
                        />
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Service Required</label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        onFocus={() => setFocused('service')}
                        onBlur={() => setFocused(null)}
                        className="px-4 py-3 rounded-xl text-sm w-full appearance-none"
                        style={{ ...inputStyle('service'), color: form.service ? '#fff' : '#374151' }}
                      >
                        <option value="" disabled>Select a service...</option>
                        {services.map((s) => (
                          <option key={s} value={s} style={{ background: '#0a0a0a', color: '#fff' }}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#5A6272] uppercase tracking-wider">Message <span style={{ color: '#2CCDDE' }}>*</span></label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us about your IT setup, team size and what you need help with..."
                        value={form.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        className="px-4 py-3 rounded-xl text-sm placeholder-[#374151] w-full resize-none"
                        style={inputStyle('message')}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(44,205,222,0.5)] mt-1"
                      style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
                    >
                      Send Message
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>

                    <p className="text-center text-xs text-[#374151]">
                      We respond within 2 hours &nbsp;·&nbsp; No spam, ever
                    </p>

                  </form>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Map */}
        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(44,205,222,0.18)', height: '420px' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230964.06209009685!2d55.13766789915716!3d25.24320683637232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43a9923d5979%3A0x36f7a80cba19b9eb!2sByteflow%20information%20Technology%20%26%20CO%20LLC!5e0!3m2!1sen!2sae!4v1779350571004!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', filter: 'grayscale(20%) invert(5%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  )
}
