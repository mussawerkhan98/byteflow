import '../home.css'
import '../about.css'
import AboutCompany from '../components/about/AboutCompany'
import AboutCta from '../components/about/AboutCta'
import AboutFounder from '../components/about/AboutFounder'
import AboutHero from '../components/about/AboutHero'
import AboutPrinciples from '../components/about/AboutPrinciples'
import AboutReviews from '../components/about/AboutReviews'
import AboutServices from '../components/about/AboutServices'
import AboutStory from '../components/about/AboutStory'
import AboutTeam from '../components/about/AboutTeam'
import type { Metadata } from 'next'
import HomeMotion from '../components/home/HomeMotion'
import JsonLd from '../components/JsonLd'
import { getPageHero, getPageMetadata, getSection, getSiteFigures, getSiteSettings, getTeam, getTestimonials } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { homePhotos } from '../lib/home-photos'
import { fillFigures, type SiteFigures } from '../lib/site-figures'
import { aboutPageSchema, breadcrumbSchema, founderSchema, graph } from '../lib/structured-data'

// The built-in founder story: why Byteflow started, not the figures, which
// the banner and the timeline already give. {founded} is the site-wide
// founding year from the admin.
const DEFAULT_STORY = `Byteflow was born out of frustration. Too many Dubai businesses were being overcharged, underserved, and left waiting days for a simple fix. We started in {founded} with one goal: build the kind of IT company that actually shows up.

We have grown from a two-person team to a full-service operation covering everything from server rooms to Google Ads campaigns.

The philosophy has never changed: respond fast, be honest about pricing, and treat every client like they are your only one.`

const fallbackTitle = (figures: SiteFigures) => `About Byteflow | IT Company in Dubai Since ${figures.founded}`
const fallbackDescription = (figures: SiteFigures) =>
  `Dubai IT company since ${figures.founded}, trusted by ${figures.clients} businesses across the UAE for IT support, AMC, cloud, cyber security, websites and digital marketing.`

export async function generateMetadata(): Promise<Metadata> {
  const [cms, figures] = await Promise.all([getPageMetadata('about-us'), getSiteFigures()])
  const title = cms?.title || fallbackTitle(figures)
  const description = cms?.description || fallbackDescription(figures)
  return {
    ...cms,
    title,
    description,
    alternates: { canonical: '/about-us' },
    // Shared links show the page's share image or banner photo (cms.ts),
    // otherwise the banner's stand-in photo.
    openGraph: {
      title,
      description,
      ...cms?.openGraph,
      url: '/about-us',
      type: 'website',
      images: cms?.openGraph?.images ?? [homePhotos.about.src],
    },
  }
}

/**
 * About Us, in the home page's colours, type and motion (.hp, home.css)
 * with layouts of its own (about.css): the banner (Heroes screen), the
 * founder (About Us — Founder), the team (Team members) and the reviews
 * (Customer reviews); every other section's words are the admin's About
 * page sections.
 */
export default async function AboutPage() {
  const [hero, founder, testimonials, team, figures, settings, stats, story, principles, services, teamCopy, reviewsCopy, company, cta] = await Promise.all([
    getPageHero('about-us'),
    getSection('about-us', 'founder'),
    getTestimonials(),
    getTeam(),
    getSiteFigures(),
    getSiteSettings(),
    getHomeBlock('about_stats'),
    getHomeBlock('about_story'),
    getHomeBlock('about_principles'),
    getHomeBlock('about_services'),
    getHomeBlock('about_team'),
    getHomeBlock('about_reviews'),
    getHomeBlock('about_company'),
    getHomeBlock('about_cta'),
  ])
  const text = (value: unknown) => String(value ?? '').trim()
  const founderStory = text(founder?.story) || fillFigures(DEFAULT_STORY, figures)
  const companyPhone = text(settings?.header_phone) || '+971 54 328 2042'
  const digits = (value: string) => value.replace(/\D/g, '').replace(/^0+/, '')
  // The founder's phone is shown only when it's a direct line: the company
  // number is already in the closing panel, the header and the footer.
  const founderPhone = text(founder?.phone_url)
  const directPhone = founderPhone && digits(founderPhone) !== digits(companyPhone) ? founderPhone : ''
  const founderName = text(founder?.name)
  const founderRole = text(founder?.role) || 'Founder & CEO'
  // No photo is shown until one is uploaded on About Us — Founder.
  const founderImage = text(founder?.image_url)
  const pageTitle = text(hero?.hero_heading).replace(/\s+/g, ' ') || 'About Byteflow'
  const schema = graph(
    aboutPageSchema({
      name: pageTitle,
      description: text(hero?.hero_description),
      path: '/about-us',
      image: text(hero?.hero_image) || text(hero?.hero_background_image) || homePhotos.about.src,
    }),
    founderSchema({ name: founderName, jobTitle: founderRole, image: founderImage, linkedinUrl: text(founder?.linkedin_url) }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about-us' },
    ]),
  )

  return (
    // .hp scopes the home page's design system (home.css).
    <div className="hp">
      <JsonLd data={schema} />
      <HomeMotion />
      <AboutHero hero={hero} stats={stats} figures={figures} />
      <AboutFounder
        founder={{
          eyebrow: text(founder?.eyebrow) || 'Meet the founder',
          heading: text(founder?.heading) || 'Started with a laptop and a promise to fix IT in Dubai properly.',
          story: founderStory.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
          name: founderName,
          role: founderRole,
          company: text(founder?.company) || 'Byteflow Information Technology',
          imageUrl: founderImage,
          imageAlt: text(founder?.image_alt) || founderName || 'Byteflow Founder',
          linkedinUrl: text(founder?.linkedin_url) || 'https://ae.linkedin.com/company/byteflow-techcascade',
          phoneLabel: text(founder?.phone_label) || founderPhone.replace(/^tel:/i, ''),
          phoneUrl: directPhone,
        }}
      />
      <AboutStory content={story} />
      <AboutPrinciples content={principles} />
      <AboutServices content={services} />
      <AboutTeam members={team} content={teamCopy} />
      <AboutReviews items={testimonials} figures={figures} content={reviewsCopy} />
      <AboutCompany content={company} />
      <AboutCta
        content={cta}
        contact={{
          phone: companyPhone,
          email: text(settings?.primary_email) || 'info@byteflow.ae',
          address: text(settings?.physical_address) || 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates',
        }}
      />
    </div>
  )
}
