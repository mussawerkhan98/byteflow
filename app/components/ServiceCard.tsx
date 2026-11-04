import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowIcon } from './InlineIcons'

export type ServiceCardProps = {
  href: string
  num: string
  title: string
  /** The featured card gets the full summary; the others a one-line tagline. */
  summary: string
  /** Headline features from the service's own page, shown on featured and wide cards. */
  features: string[]
  /** Headline numbers from the service's own page, shown on the featured card. */
  stats: { value: string; label: string }[]
  icon: ReactNode
  featured?: boolean
  /** A card stretched across two or more columns lays its features out beside the title. */
  wide?: boolean
  /** Grid placement, set by the bento layout in Services. */
  className?: string
}

function FeatureList({ features, columns }: { features: string[]; columns?: boolean }) {
  return (
    <ul className={`grid gap-x-6 gap-y-2.5 ${columns ? 'sm:grid-cols-2' : ''}`}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-[14px] leading-snug text-[var(--text-primary)]">
          <span aria-hidden="true" className="mt-2 h-0.5 w-3 shrink-0 bg-[#2CCDDE]" />
          {feature}
        </li>
      ))}
    </ul>
  )
}

export default function ServiceCard({
  href,
  num,
  title,
  summary,
  features,
  stats,
  icon,
  featured = false,
  wide = false,
  className = '',
}: ServiceCardProps) {
  const iconTile = (
    <span
      aria-hidden="true"
      className="service-card-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
    >
      {icon}
    </span>
  )

  if (featured)
    return (
      <Link
        href={href}
        className={`reveal service-card-featured group relative isolate flex flex-col overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-7 transition-colors duration-300 hover:border-[#2CCDDE]/50 sm:p-10 ${className}`}
      >
        {/* A corner of the grid from the Byteflow mark, as texture. */}
        <span aria-hidden="true" className="service-card-grid pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3" />

        <span className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            {iconTile}
            <span className="text-[13px] font-medium text-[var(--text-nav)]">Featured service</span>
          </span>
          <span className="text-[13px] font-medium tabular-nums text-[var(--text-nav)]">{num}</span>
        </span>

        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-[var(--border-default)] py-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-[var(--text-primary)] sm:text-[2.25rem]">
                  {stat.value}
                </dd>
                <dd aria-hidden="true" className="mt-2 text-[12.5px] leading-snug text-[var(--text-nav)]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto block pt-10">
          <h3 className="font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2.75rem]">
            {title}
          </h3>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--text-body)]">{summary}</p>
          {features.length > 0 && (
            <span className="mt-7 block">
              <FeatureList features={features} columns />
            </span>
          )}
          <span className="mt-9 inline-flex h-11 items-center gap-2 rounded-full bg-[#2CCDDE] pl-5 pr-4 text-[14px] font-semibold text-[#04121A] transition-colors duration-200 group-hover:bg-[#5BDCE9]">
            Learn more<span className="sr-only"> about {title}</span>
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </span>
      </Link>
    )

  return (
    <Link
      href={href}
      className={`reveal group relative isolate flex flex-col overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-(--shadow-card) transition-[translate,border-color,box-shadow] duration-300 hover:border-[#2CCDDE]/50 hover:shadow-(--shadow-pop) motion-safe:hover:-translate-y-1 ${className}`}
    >
      {/* Hover: a cyan line draws across the top and a faint wash rises from the corner. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[#2CCDDE] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="service-card-wash pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="flex items-start justify-between gap-4">
          {iconTile}
          <span className="text-[13px] font-medium tabular-nums text-[var(--text-nav)] transition-colors duration-300 group-hover:text-[var(--text-primary)]">
            {num}
          </span>
        </span>

        <span className={`mt-auto pt-10 ${wide && features.length ? 'grid gap-6 sm:grid-cols-2 sm:items-end sm:gap-10' : 'block'}`}>
          <span className="block">
            <h3 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-body)]">{summary}</p>
          </span>
          {wide && features.length > 0 && <FeatureList features={features} />}
        </span>
      </span>

      <span className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-4 text-[13.5px] font-semibold text-[var(--text-primary)] sm:px-7">
        <span>
          Learn more<span className="sr-only"> about {title}</span>
        </span>
        {/* On hover the circle fills and the arrow slides through it. */}
        <span
          aria-hidden="true"
          className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[var(--border-default)] transition-colors duration-300 group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A]"
        >
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-6 motion-reduce:transition-none" />
          <ArrowIcon className="absolute h-3.5 w-3.5 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:transition-none" />
        </span>
      </span>
    </Link>
  )
}
