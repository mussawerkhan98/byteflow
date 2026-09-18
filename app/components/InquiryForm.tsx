'use client'

import { useState } from 'react'
import { getRecaptchaToken } from '../lib/recaptcha'

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

type InquiryFormProps = {
  /** Called by the confirmation screen's close button. */
  onClose: () => void
  badge?: string
  heading?: string
  description?: string
  /** Two columns fit the popup; the narrow drawer stacks them instead. */
  layout?: 'grid' | 'stacked'
}

/**
 * The shared inquiry form — used by both the timed lead popup and the side
 * drawer, so validation, the reCAPTCHA token and the /api/contact payload stay
 * identical no matter which shell the visitor opened.
 */
export default function InquiryForm({
  onClose,
  badge = 'Get In Touch',
  heading = "Let's Talk About Your IT Needs",
  description = 'Free consultation, no commitment. We reply within 2 hours.',
  layout = 'grid',
}: InquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<string | null>(null)

  const pairClass = layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFieldErrors((current) => ({ ...current, [e.target.name]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (form.name.trim().length < 2) errors.name = 'Please enter your full name.'
    if (!form.email.trim()) errors.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address.'
    if (!form.message.trim()) errors.message = 'Message is required.'
    else if (form.message.trim().length < 5) errors.message = 'Please add a little more detail to your message.'
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setSubmitError('Please complete the highlighted fields.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    setFieldErrors({})
    try {
      const recaptchaToken = await getRecaptchaToken('contact')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
          message: `${form.message}${form.service ? `\nService: ${form.service}` : ''}`,
          sourcePage: window.location.pathname,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {})
        setSubmitError(data.error ?? 'Please check the form and try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setSubmitError('We could not send your message. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = (name: string) => ({
    background: focused === name ? 'rgba(44,205,222,0.05)' : 'var(--overlay-hover-soft)',
    border: focused === name ? '1px solid rgba(44,205,222,0.5)' : '1px solid var(--overlay-strong)',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    color: 'var(--input-text)',
  })

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
        >
          <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-[var(--text-primary)] text-xl font-bold mb-2">Message Sent!</p>
          <p className="text-[var(--text-muted)] text-sm">Our team will get back to you within 2 hours.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2.5 rounded-full text-black font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 pr-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-widest"
          style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
        >
          {badge}
        </div>
        <h3 className="text-2xl font-bold leading-tight text-[var(--text-primary)]">{heading}</h3>
        <p className="text-[var(--text-muted)] text-sm mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className={pairClass}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Full Name <span style={{ color: '#2CCDDE' }}>*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              className="px-4 py-3 rounded-xl text-sm placeholder-[var(--text-dim)] w-full"
              style={inputStyle('name')}
            />
            {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Email Address <span style={{ color: '#2CCDDE' }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              className="px-4 py-3 rounded-xl text-sm placeholder-[var(--text-dim)] w-full"
              style={inputStyle('email')}
            />
            {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
          </div>
        </div>

        <div className={pairClass}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+971 50 000 0000"
              value={form.phone}
              onChange={handleChange}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              className="px-4 py-3 rounded-xl text-sm placeholder-[var(--text-dim)] w-full"
              style={inputStyle('phone')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Service Required</label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              onFocus={() => setFocused('service')}
              onBlur={() => setFocused(null)}
              className="px-4 py-3 rounded-xl text-sm w-full appearance-none"
              style={{ ...inputStyle('service'), color: form.service ? 'var(--input-text)' : 'var(--text-dim)' }}
            >
              <option value="" disabled>
                Select a service...
              </option>
              {services.map((s) => (
                <option key={s} value={s} style={{ background: 'var(--option-bg)', color: 'var(--input-text)' }}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Message <span style={{ color: '#2CCDDE' }}>*</span>
          </label>
          <textarea
            name="message"
            required
            rows={layout === 'stacked' ? 4 : 3}
            placeholder="Tell us what you need help with..."
            value={form.message}
            onChange={handleChange}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            className="px-4 py-3 rounded-xl text-sm placeholder-[var(--text-dim)] w-full resize-none"
            style={inputStyle('message')}
          />
          {fieldErrors.message && <p className="text-xs text-red-400">{fieldErrors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(44,205,222,0.5)] mt-1"
          style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
        >
          {submitting ? 'Sending…' : 'Send Message'}
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {submitError && (
          <p role="alert" className="text-center text-sm text-red-400">
            {submitError}
          </p>
        )}
      </form>
    </>
  )
}
