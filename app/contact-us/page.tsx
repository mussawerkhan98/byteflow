import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import Contact from '../components/Contact'
import HomeMotion from '../components/home/HomeMotion'
import { Button, Eyebrow, SectionTitle, delay } from '../components/home/ui'
import JsonLd from '../components/JsonLd'
import { getPageHero, getPageMetadata, getSiteSettings } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { DEFAULT_MAP_URL, directionsUrl, safeMapUrl } from '../lib/office-map'
import { breadcrumbSchema, graph } from '../lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageMetadata('contact-us')
  return {
    ...(cms ?? { title: 'Contact Us | Byteflow Information Technology', description: 'Get in touch with Byteflow IT. Free consultation, on-site and remote support across Dubai, Sharjah and Abu Dhabi.' }),
    alternates: { canonical: '/contact-us' },
  }
}

const text = (value: unknown) => String(value ?? '').trim()

/**
 * The Contact page, in the home page's design. The banner words are the
 * page's hero (Heroes); the phone, email, WhatsApp, address, hours, socials
 * and map are Contact details & logo; every other word is the admin's
 * "Contact page" screen. At the top, the ways to reach us beside the
 * enquiry form; then what happens after a message; then the office and its
 * map. FAQs and a call to action added for this page follow (layout.tsx).
 */
export default async function ContactPage() {
  const [settings, hero, page, steps, office] = await Promise.all([
    getSiteSettings(),
    getPageHero('contact-us'),
    getHomeBlock('contact_page'),
    getHomeBlock('contact_steps'),
    getHomeBlock('contact_office'),
  ])
  const copy = page.fields
  const address = text(settings?.physical_address)
  const hours = text(settings?.business_hours)
  const showMap = settings?.map_enabled === undefined || settings?.map_enabled === '' || Boolean(Number(settings?.map_enabled))
  const map = safeMapUrl(text(settings?.map_embed_url)) || DEFAULT_MAP_URL
  const o = office.fields

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact Us', path: '/contact-us' },
          ]),
        )}
      />
      <HomeMotion />

      <Contact
        settings={(settings ?? {}) as never}
        asPage
        page={{
          label: hero?.hero_label || 'Contact us',
          heading: hero?.hero_heading || 'Contact Byteflow',
          highlight: hero?.hero_highlight || '',
          description: hero?.hero_description || '',
          call_label: copy.call_label,
          whatsapp_label: copy.whatsapp_label,
          whatsapp_text: copy.whatsapp_text,
          email_label: copy.email_label,
          socials_label: copy.socials_label,
          form_heading: copy.form_heading,
          form_intro: copy.form_intro,
          promises: lines(copy.promises ?? ''),
        }}
      />

      {steps.lists.steps.length > 0 && (
        <section aria-labelledby="contact-steps-title" className="border-y border-[var(--hp-line)] bg-[var(--hp-soft)]">
          <div className="page-container py-14 lg:py-20">
            <div data-reveal className="max-w-2xl">
              <Eyebrow>{steps.fields.eyebrow}</Eyebrow>
              <SectionTitle id="contact-steps-title" heading={steps.fields.heading} soft={steps.fields.heading_soft} className="mt-4" />
            </div>
            <ol className={`mt-10 grid gap-5 ${steps.lists.steps.length >= 3 ? 'md:grid-cols-3' : steps.lists.steps.length === 2 ? 'md:grid-cols-2' : ''}`}>
              {steps.lists.steps.map((step, i) => (
                <li key={step.title} data-reveal style={delay(i * 120)} className="hp-card relative rounded-[1.25rem] p-6 sm:p-7">
                  <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--hp-navy)] font-display text-[15px] font-semibold text-[#2ccdde]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-[1.1875rem] font-semibold tracking-[-0.01em] text-[var(--hp-ink)]">{step.title}</h3>
                  {step.description && <p className="mt-2 text-[15px] leading-relaxed text-[var(--hp-body)]">{step.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(showMap || address) && (
        <section aria-labelledby="contact-office-title" className="page-container py-14 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div data-reveal className="flex flex-col justify-center lg:col-span-4">
              <Eyebrow>{o.eyebrow}</Eyebrow>
              <SectionTitle id="contact-office-title" heading={o.heading} soft={o.heading_soft} softBlock className="mt-4" />
              {o.text && <p className="hp-lead mt-5">{o.text}</p>}
              {(address || hours) && (
                <dl className="mt-7 grid gap-4">
                  {address && (
                    <div>
                      <dt className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{copy.address_label}</dt>
                      <dd className="mt-1 text-[15.5px] font-medium leading-snug text-[var(--hp-ink)]">{address}</dd>
                    </div>
                  )}
                  {hours && (
                    <div>
                      <dt className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{copy.hours_label}</dt>
                      <dd className="mt-1 text-[15.5px] font-medium leading-snug text-[var(--hp-ink)]">{hours}</dd>
                    </div>
                  )}
                </dl>
              )}
              {o.directions_label && (
                <Button href={directionsUrl(o.directions_link ?? '', address)} variant="ghost" className="mt-8 self-start">
                  {o.directions_label}
                </Button>
              )}
            </div>
            {showMap && (
              <div data-reveal className="hp-frame relative aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:col-span-8 lg:aspect-auto lg:min-h-[24rem]">
                <iframe
                  src={map}
                  title={`${o.heading} ${o.heading_soft}`.trim() || 'Our office on Google Maps'}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
