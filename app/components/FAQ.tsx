'use client'

import { useState } from 'react'

const faqs = [
  {
    category: 'IT Support',
    q: 'What is an IT AMC and why does my business need one?',
    a: 'An Annual Maintenance Contract (AMC) means we manage all your IT — computers, servers, network, printers and software — for a fixed monthly fee. You get predictable costs, faster issue resolution and a dedicated team that knows your setup. No surprise invoices, no chasing vendors.',
  },
  {
    category: 'IT Support',
    q: 'How quickly do your engineers respond to IT issues?',
    a: 'We guarantee on-site or remote support within 2 hours across Dubai, Sharjah and Abu Dhabi. For critical outages, our team is on it immediately. Most issues are resolved remotely within 30 minutes of being reported.',
  },
  {
    category: 'IT Support',
    q: 'Do you support businesses outside Dubai?',
    a: 'Yes — we cover Dubai, Sharjah and Abu Dhabi with on-site engineers. For other emirates and GCC countries, we provide full remote support and can arrange on-site visits for larger projects.',
  },
  {
    category: 'Cloud & Microsoft',
    q: 'Can you migrate our team to Microsoft 365?',
    a: 'Absolutely. We handle the full migration — email, files, Teams, SharePoint and licensing. We move everything with zero data loss, train your staff and manage your Microsoft 365 environment on an ongoing basis so you never have to deal with Microsoft support yourself.',
  },
  {
    category: 'Cloud & Microsoft',
    q: 'What cloud services do you offer?',
    a: 'We cover Microsoft 365, Azure, cloud backup, cloud servers and hybrid setups. Whether you need to move a single application or your entire infrastructure to the cloud, we design, migrate and manage it end-to-end.',
  },
  {
    category: 'Security',
    q: 'How do you protect businesses from ransomware and cyber attacks?',
    a: 'We deploy layered protection: enterprise firewalls, endpoint antivirus, email filtering, network monitoring and automated cloud backups with instant recovery. If an attack does happen, our backup system means we can restore your data and have you operational within hours — not days.',
  },
  {
    category: 'Security',
    q: 'What happens if we get hacked or lose our data?',
    a: 'With our backup and recovery service, your data is automatically backed up multiple times daily. In the event of a ransomware attack, hardware failure or accidental deletion, we restore everything quickly — often within hours. Our clients have recovered from full ransomware attacks without paying a ransom.',
  },
  {
    category: 'Pricing',
    q: 'How much does IT support cost for a small business?',
    a: 'Our packages start from a fixed monthly fee based on your number of users and devices. There are no hidden charges or per-call fees. We offer flexible plans for businesses from 5 to 500+ users. Contact us for a free consultation and a tailored quote within 24 hours.',
  },
  {
    category: 'Pricing',
    q: 'Do you require long-term contracts?',
    a: 'We offer both monthly and annual plans. Annual plans come with better pricing and priority SLAs. We are confident enough in our service that we do not lock you into punishing contracts — most of our clients have been with us for years because they want to be, not because they have to be.',
  },
  {
    category: 'Services',
    q: 'Can you build a website and handle our digital marketing too?',
    a: 'Yes — this is one of our biggest strengths. We offer website development, SEO, Google Ads, social media marketing and graphic design all under one roof. You get a single point of contact, consistent strategy and no blame-shifting between vendors.',
  },
]

const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
            style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
          >
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            <span className="text-white">Questions We Get</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Asked All the Time
            </span>
          </h2>
          <p className="text-[#5A6272] text-base max-w-xl mx-auto">
            Everything you need to know about working with Byteflow. Can not find what you are looking for? Just call us.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpen(null) }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={
                activeCategory === cat
                  ? { background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }
                  : { background: 'rgba(44,205,222,0.06)', border: '1px solid rgba(44,205,222,0.18)', color: '#5A6272' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {filtered.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.q}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen
                    ? 'linear-gradient(160deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.03) 40%, #050F18 100%)'
                    : 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, #040D12 100%)',
                  border: isOpen ? '1px solid rgba(44,205,222,0.3)' : '1px solid rgba(44,205,222,0.1)',
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className={`text-sm font-semibold leading-snug transition-colors duration-200 flex-1 min-w-0 ${isOpen ? 'text-white' : 'text-[#9CA3AF]'}`}>
                    {faq.q}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? 'linear-gradient(135deg, #2CCDDE, #46A3E1)' : 'rgba(44,205,222,0.08)',
                      border: isOpen ? 'none' : '1px solid rgba(44,205,222,0.2)',
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300"
                      style={{ color: isOpen ? '#000' : '#2CCDDE', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-6 pb-6" style={{ borderTop: '1px solid rgba(44,205,222,0.08)' }}>
                    <p className="text-[#5A6272] text-sm leading-relaxed pt-5">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-14 p-8 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, #050F18 100%)',
            border: '1px solid rgba(44,205,222,0.15)',
          }}
        >
          <p className="text-white font-semibold text-base mb-1">Still have questions?</p>
          <p className="text-[#5A6272] text-sm mb-6">Our team is available 24/7 — reach out and get answers fast.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+97143388282"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
              style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call Us Now
            </a>
            <a
              href="https://wa.me/971501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#2CCDDE] font-bold text-sm transition-all duration-300 hover:text-white"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
