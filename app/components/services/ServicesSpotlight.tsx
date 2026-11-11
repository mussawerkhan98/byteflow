import type { HeaderModel } from '../../lib/header-model'
import type { ServiceTab } from '../../lib/service-tabs'
import { ServiceIcon } from '../ServiceIcon'
import { Button, Check, TextLink } from '../home/ui'

type Featured = NonNullable<HeaderModel['services']['featured']>

/**
 * The most popular offer as a plan card: what it is and its button on the
 * left, its figures large in the middle, and what the plan includes on the
 * right, over a faint glow in the brand colour. The words are the Services
 * menu's "Most popular" card (Header menu → Services → Featured); the
 * highlights are those of the service its button opens.
 */
export default function ServicesSpotlight({ featured, tab }: { featured: Featured; tab?: ServiceTab }) {
  const text = featured.text || tab?.text || ''
  const bullets = tab?.bullets ?? []
  return (
    <section aria-labelledby="services-spotlight-title" className="page-container pb-16 lg:pb-24">
      <div
        data-reveal
        className="relative isolate overflow-hidden rounded-[1.5rem] border border-[var(--hp-line)] bg-[var(--hp-card)] p-6 shadow-[var(--hp-shadow)] sm:p-10 lg:p-12"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.22),transparent_68%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-24 -z-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_70%)]" />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <p className="hp-badge">
              <span aria-hidden="true" className="hp-dot" />
              {featured.eyebrow}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span aria-hidden="true" className="hp-svc-icon hp-svc-icon-lg">
                <ServiceIcon link={featured.button.href} className="h-6 w-6" />
              </span>
              <h2 id="services-spotlight-title" className="hp-h2">
                {featured.title}
              </h2>
            </div>
            {tab?.subtitle && <p className="mt-5 text-[17px] font-semibold leading-snug text-[var(--hp-accent)]">{tab.subtitle}</p>}
            {text && <p className="mt-2 text-[16px] leading-relaxed text-[var(--hp-body)]">{text}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href={featured.button.href}>{featured.button.label}</Button>
              {tab?.button.href && tab.button.href !== featured.button.href && <TextLink href={tab.button.href}>{tab.button.label}</TextLink>}
            </div>
          </div>

          {featured.stats.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 lg:col-span-3 lg:grid-cols-1">
              {featured.stats.map((stat) => (
                <div key={stat.value + stat.label} className="flex flex-col rounded-2xl border border-[rgba(14,116,144,0.14)] bg-[linear-gradient(145deg,#effafc,#eef3fb)] p-5 sm:p-6">
                  <dt className="order-2 mt-1.5 text-[14px] font-medium text-[var(--hp-body)]">{stat.label}</dt>
                  <dd className="order-1 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)] sm:text-[3rem]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {bullets.length > 0 && (
            <ul className={`divide-y divide-[var(--hp-line)] ${featured.stats.length > 0 ? 'lg:col-span-4' : 'lg:col-span-7'}`}>
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 py-3.5 text-[15.5px] font-medium text-[var(--hp-ink)] first:pt-0 last:pb-0">
                  <span className="hp-tick">
                    <Check />
                  </span>
                  {bullet}
                </li>
              ))}
              {tab?.caption && (
                <li className="flex items-center gap-2 pt-4 text-[13.5px] font-semibold text-[var(--hp-accent)]">
                  <span aria-hidden="true" className="hp-dot" />
                  {tab.caption}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
