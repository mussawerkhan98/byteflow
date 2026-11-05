import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { orderedTabs } from '../lib/service-tabs'
import { services as servicePages } from '../lib/services-data'
import ServiceTabs from './ServiceTabs'

// With no published services in the database, each service page's own
// wording (services-data.ts) fills the tabs, so the section never goes empty.
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

export default async function Services() {
  const [dbServices, intro, header] = await Promise.all([
    getServices(),
    getHomeBlock('home_services_intro'),
    getHeaderModel(),
  ])
  const copy = intro.fields
  // Same order as the header's Services menu, so services are arranged in one place.
  const menuHrefs = header.services.groups.flatMap((group) => group.items.map((item) => item.href))
  const tabs = orderedTabs(dbServices.length ? dbServices : pageServices, menuHrefs)

  return (
    <section id="services" className="home-services scroll-mt-28 py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the section's left and right edges
          sit under the logo and the Contact button. */}
      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading}{' '}
              <span className="block text-[var(--ink-soft)]">{copy.heading_soft}</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-body)] lg:col-span-5 lg:justify-self-end">
            {copy.intro}
          </p>
        </div>

        <div className="mt-14 lg:mt-20">
          <ServiceTabs tabs={tabs} />
        </div>
      </div>
    </section>
  )
}
