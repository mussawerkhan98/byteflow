import Link from 'next/link'
import { getSiteSettings } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { ArrowIcon, PhoneIcon } from './InlineIcons'

const DEFAULT_PHONE = '+971 54 328 2042'

/**
 * "Not sure which service you need?" prompt, shown on the home page after the
 * How it works steps. Same tinted surface as the service promise in AboutUs.
 * Shown only when switched on in the admin (Home page sections → Help panel).
 */
export default async function HelpPanel() {
  const [settings, block] = await Promise.all([getSiteSettings(), getHomeBlock('home_help')])
  const phone = String(settings?.header_phone || '') || DEFAULT_PHONE
  const copy = block.fields
  if (copy.show === 'no') return null

  return (
    <section className="home-help pb-20 sm:pb-24 lg:-mt-8 lg:pb-28">
      <div className="page-container">
        <div className="tint-panel flex flex-col gap-7 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-start gap-5">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--border-default)] bg-[var(--promise-tile)] text-[var(--promise-accent)]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </span>
            <div>
              <h2 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.5rem]">
                {copy.heading}
              </h2>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-[var(--text-body)]">{copy.description}</p>
            </div>
          </div>

          <div className="grid shrink-0 gap-3 sm:flex sm:items-center">
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-[var(--promise-tile)] px-5 text-[15px] font-semibold tabular-nums text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--promise-accent)]"
            >
              <PhoneIcon className="h-4 w-4" />
              {phone}
            </a>
            <Link
              href={copy.button_link}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] pl-6 pr-5 text-[15px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
            >
              {copy.button_label}
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
