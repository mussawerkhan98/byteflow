import Link from 'next/link'
import type { ReactNode } from 'react'
import type { AboutReason, PreviewKind } from '../lib/about-reasons'
import { ArrowUpRightIcon } from './InlineIcons'

/**
 * The light card beside the About reasons: the reason's text, a small
 * illustrative picture and a link to the service it relates to. The pictures
 * are drawn in HTML (nothing to load) and hidden from screen readers; the
 * card's text says the same thing.
 */

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const frame = 'rounded-2xl border border-[rgba(11,23,36,0.08)] bg-white p-4 shadow-[0_1px_2px_rgba(11,23,36,0.04)]'
const chip = 'rounded-lg border border-[rgba(11,23,36,0.08)] bg-[#f4f8fb] px-3 py-2 text-[12px] font-semibold text-[#0b1724]'
const tick = 'grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[rgba(14,116,144,0.12)] text-[#0e7490]'

function Rows({ title, badge, rows }: { title: string; badge: string; rows: [string, string][] }) {
  return (
    <div className={frame}>
      <div className="flex items-center justify-between border-b border-[rgba(11,23,36,0.08)] pb-3">
        <span className="text-[12px] font-semibold text-[#0b1724]">{title}</span>
        <span className="rounded-full bg-[#0b1724] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#7fe3ec]">{badge}</span>
      </div>
      <ul className="mt-2">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-center justify-between py-1.5 text-[12px]">
            <span className="flex items-center gap-2 text-[#334155]">
              <span className={tick}>
                <Check />
              </span>
              {label}
            </span>
            <span className="font-semibold text-[#0e7490]">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const mockups: Record<PreviewKind, ReactNode> = {
  // Everything in one place: four areas under one team.
  layers: (
    <div className={frame}>
      <div className="mx-auto w-fit rounded-full bg-[#0b1724] px-4 py-1.5 text-[11.5px] font-semibold text-white">One team · one contract</div>
      <div className="mx-auto h-4 w-px bg-[rgba(11,23,36,0.18)]" />
      <div className="grid grid-cols-2 gap-2">
        {['Network', 'Cloud', 'Security', 'Web'].map((area) => (
          <span key={area} className={`${chip} flex items-center gap-2`}>
            <span className={tick}>
              <Check />
            </span>
            {area}
          </span>
        ))}
      </div>
    </div>
  ),
  receipt: (
    <Rows
      title="Monthly IT plan"
      badge="Fixed"
      rows={[
        ['Support visits', 'Included'],
        ['Remote help', 'Included'],
        ['Extra invoices', 'None'],
      ]}
    />
  ),
  // The 2-hour on-site response the site promises everywhere.
  clock: (
    <div className={frame}>
      <ol className="flex items-start justify-between gap-2">
        {['Call logged', 'Engineer assigned', 'On site'].map((step, i) => (
          <li key={step} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && <span className="absolute right-1/2 top-[7px] h-px w-full bg-[rgba(14,116,144,0.35)]" />}
            <span className={`relative h-3.5 w-3.5 rounded-full border-2 ${i === 2 ? 'border-[#0e7490] bg-[#2CCDDE]' : 'border-[#0e7490] bg-white'}`} />
            <span className="mt-2 text-[11.5px] font-semibold leading-tight text-[#0b1724]">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-lg bg-[#f4f8fb] px-3 py-2 text-center text-[12px] font-semibold text-[#0e7490]">On site within 2 hours</p>
    </div>
  ),
  cloud: (
    <Rows
      title="Microsoft 365"
      badge="Set up"
      rows={[
        ['Business email', 'Ready'],
        ['Teams', 'Ready'],
        ['OneDrive & SharePoint', 'Ready'],
      ]}
    />
  ),
  shield: (
    <Rows
      title="Protection"
      badge="On"
      rows={[
        ['Firewall', 'Active'],
        ['Endpoint', 'Active'],
        ['Email filtering', 'Active'],
      ]}
    />
  ),
  chat: (
    <div className={`${frame} space-y-2`}>
      <p className="w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-[#f4f8fb] px-3 py-2 text-[12px] text-[#334155]">The office Wi-Fi keeps dropping.</p>
      <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-[#0b1724] px-3 py-2 text-[12px] text-white">On it. An engineer is on the way.</p>
    </div>
  ),
}

/** `compact` drops the title, for the phone accordion where the button above already shows it. */
export default function AboutPreview({ reason, compact = false }: { reason: AboutReason; compact?: boolean }) {
  return (
    <div className="rounded-[1.75rem] bg-[#f4f8fb] p-6 text-[#0b1724] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)] sm:p-8">
      {!compact && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e7490]">Reason {reason.number}</p>
          <p className="mt-3 font-display text-[1.625rem] font-semibold leading-tight tracking-[-0.02em]">{reason.title}</p>
        </>
      )}
      {reason.description && <p className={`${compact ? '' : 'mt-3'} text-[15px] leading-relaxed text-[#475569]`}>{reason.description}</p>}
      <div aria-hidden="true" className="mt-6">
        {mockups[reason.kind]}
      </div>
      <Link
        href={reason.link.href}
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b1724] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#0e7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490]"
      >
        {reason.link.label}
        <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
      </Link>
    </div>
  )
}
