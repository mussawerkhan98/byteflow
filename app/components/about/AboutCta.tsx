import type { ReactNode } from 'react'
import type { HomeBlock } from '../../lib/home-content'
import { PhoneIcon, PinIcon } from '../InlineIcons'
import { ArrowRight, Button, Eyebrow, SectionTitle } from '../home/ui'

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export type AboutContact = { phone: string; email: string; address: string }

/**
 * The closing panel, on a light brand-tinted wash: the free consultation on
 * the left, and how to reach us on frosted rows on the right. The words are
 * "Closing panel" on the admin's About page sections; the phone, email and
 * address are Contact details & logo.
 */
export default function AboutCta({ content, contact }: { content: HomeBlock; contact: AboutContact }) {
  const copy = content.fields
  const rows: { label: string; value: string; href?: string; icon: ReactNode }[] = [
    { label: copy.phone_label, value: contact.phone, href: contact.phone && `tel:${contact.phone.replace(/[^\d+]/g, '')}`, icon: <PhoneIcon className="h-[18px] w-[18px]" /> },
    { label: copy.email_label, value: contact.email, href: contact.email && `mailto:${contact.email}`, icon: <MailIcon className="h-[18px] w-[18px]" /> },
    { label: copy.address_label, value: contact.address, icon: <PinIcon className="h-[18px] w-[18px]" /> },
    { label: copy.support_label, value: copy.support_text, icon: <ClockIcon className="h-[18px] w-[18px]" /> },
  ].filter((row) => row.value)

  return (
    <section aria-labelledby="about-cta-title" className="hp-section">
      <div className="page-container">
        <div data-reveal className="ab-cta grid gap-10 overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-14 lg:p-14">
          <div className="lg:col-span-6">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="about-cta-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
            {copy.intro && <p className="hp-lead mt-5 max-w-xl">{copy.intro}</p>}
            {copy.link_label && copy.link && (
              <Button href={copy.link} className="mt-8">
                {copy.link_label}
              </Button>
            )}
          </div>

          <ul className="grid gap-3 lg:col-span-6">
            {rows.map((row) => {
              const inner = (
                <>
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[var(--hp-accent)] shadow-[var(--hp-shadow-sm)]">
                    {row.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">{row.label}</span>
                    <span className="mt-0.5 block break-words text-[16px] font-semibold text-[var(--hp-ink)]">{row.value}</span>
                  </span>
                  {row.href && <ArrowRight className="h-4 w-4 shrink-0 text-[var(--hp-accent)]" />}
                </>
              )
              const cls = 'ab-cta-row flex items-center gap-4 rounded-[1rem] px-5 py-4'
              return (
                <li key={row.label}>
                  {row.href ? (
                    <a href={row.href} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
