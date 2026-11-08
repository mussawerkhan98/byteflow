import { getServices } from '../../lib/db'
import { getHeaderModel } from '../../lib/header-data'
import { getHomeBlock } from '../../lib/home-blocks'
import { orderedTabs, type ServiceTab } from '../../lib/service-tabs'
import { services as servicePages } from '../../lib/services-data'
import { ServiceIcon } from '../ServiceIcon'
import { Button, Check, Eyebrow, SectionTitle, TextLink } from './ui'

// With no published services in the database, each service page's own
// wording (services-data.ts) fills the section, so it never goes empty.
const pageServices = servicePages.map((page) => ({
  slug: page.slug,
  title: page.title,
  excerpt: '',
  description: page.description,
  image_url: null,
  image_alt: '',
  cta_label: '',
  cta_link: '',
  eyebrow: '',
  tagline: '',
  highlights: '',
  image_caption: '',
}))

/**
 * One service as a wide card: its story (icon, eyebrow, title, tagline,
 * description and buttons) on the left, its highlights on a soft-blue field
 * with the hero's diagonal edge on the right. Every service uses the same
 * layout.
 */
function ServiceCard({ tab, heading: Heading = 'h4' }: { tab: ServiceTab; heading?: 'h3' | 'h4' }) {
  return (
    <article data-reveal className="hp-svc-feature relative grid overflow-hidden rounded-[1rem] lg:grid-cols-12">
      <div className="relative z-[1] p-6 sm:p-9 lg:col-span-7 lg:py-11 lg:pl-11 lg:pr-6">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="hp-svc-icon hp-svc-icon-lg">
            <ServiceIcon link={tab.href} className="h-6 w-6" />
          </span>
          <Eyebrow>{tab.eyebrow}</Eyebrow>
        </div>
        <Heading className="hp-h3-lg mt-6">{tab.title}</Heading>
        {tab.subtitle && <p className="mt-2 text-[17px] font-semibold leading-snug text-[var(--hp-accent)]">{tab.subtitle}</p>}
        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--hp-body)]">{tab.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Button href={tab.button.href}>{tab.button.label}</Button>
          <TextLink href={tab.href}>Explore {tab.title}</TextLink>
        </div>
      </div>

      <div className="hp-svc-feature-side relative flex flex-col justify-center p-6 sm:p-9 lg:col-span-5 lg:py-11 lg:pl-28 lg:pr-11">
        {tab.bullets.length > 0 && (
          <ul className="grid gap-3">
            {tab.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 rounded-lg border border-[var(--hp-line)] bg-[var(--hp-card)] px-4 py-3 text-[15px] font-medium text-[var(--hp-ink)]">
                <span className="hp-tick">
                  <Check />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
        {tab.caption && (
          <p className="mt-5 flex items-center gap-2 text-[13.5px] font-semibold text-[var(--hp-accent)]">
            <span aria-hidden="true" className="hp-dot" />
            {tab.caption}
          </p>
        )}
      </div>
    </article>
  )
}

/**
 * Services: every published service in the header menu's order, each with its
 * own words from the admin, as the same wide card. The first stands on its
 * own; the rest sit under the header menu's groups. Icons only, no
 * photographs.
 */
export default async function HomeServices() {
  const [dbServices, intro, header] = await Promise.all([getServices(), getHomeBlock('home_services_intro'), getHeaderModel()])
  const copy = intro.fields
  const menuHrefs = header.services.groups.flatMap((group) => group.items.map((item) => item.href))
  const tabs = orderedTabs(dbServices.length ? dbServices : pageServices, menuHrefs)
  if (!tabs.length) return null
  const [featured, ...rest] = tabs

  // The rest under the header menu's own groups ("IT Support &
  // Infrastructure", "Cloud & Security"…); anything the menu doesn't group
  // goes in a last, untitled group.
  const path = (href: string) => href.split(/[?#]/)[0].replace(/\/$/, '')
  const placed = new Set<string>()
  const groups = header.services.groups
    .map((group) => {
      const hrefs = new Set(group.items.map((item) => path(item.href)))
      const items = rest.filter((tab) => hrefs.has(tab.href) && !placed.has(tab.slug))
      items.forEach((tab) => placed.add(tab.slug))
      return { title: group.title, items }
    })
    .filter((group) => group.items.length)
  const loose = rest.filter((tab) => !placed.has(tab.slug))
  if (loose.length) groups.push({ title: '', items: loose })

  return (
    <section id="services" aria-labelledby="services-title" className="hp-section scroll-mt-28">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="services-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          <p className="hp-lead max-w-md lg:col-span-5 lg:justify-self-end">{copy.intro}</p>
        </header>

        <div className="mt-12 lg:mt-14">
          <ServiceCard tab={featured} heading="h3" />
        </div>

        {groups.map((group) => (
          <div key={group.title || 'more'} className="mt-12 lg:mt-14">
            <div data-reveal className="flex items-center gap-4">
              {group.title && <h3 className="shrink-0 font-display text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--hp-ink)]">{group.title}</h3>}
              <span aria-hidden="true" className="h-px flex-1 bg-[var(--hp-line-strong)]" />
              <span className="shrink-0 text-[13px] font-medium text-[var(--hp-muted)]">
                {group.items.length} {group.items.length === 1 ? 'service' : 'services'}
              </span>
            </div>
            <div className="mt-5 grid gap-4">
              {group.items.map((tab) => (
                <ServiceCard key={tab.slug} tab={tab} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
