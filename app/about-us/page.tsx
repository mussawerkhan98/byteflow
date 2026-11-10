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
import HomeMotion from '../components/home/HomeMotion'
import { getPageHero, getPageMetadata, getSection, getSiteFigures, getSiteSettings, getTeam, getTestimonials } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { fillFigures } from '../lib/site-figures'

// The built-in founder story; {founded}, {years} and {clients} are the
// site-wide figures from the admin, so it never contradicts the home page.
const DEFAULT_STORY = `Byteflow was born out of frustration. Too many Dubai businesses were being overcharged, underserved, and left waiting days for a simple fix. We started in {founded} with one goal: build the kind of IT company that actually shows up.

{years} years later, we manage IT for {clients} businesses across Dubai, Sharjah and Abu Dhabi. We have grown from a two-person team to a full-service operation covering everything from server rooms to Google Ads campaigns — all under one roof, one monthly fee.

The philosophy has never changed: respond fast, be honest about pricing, and treat every client like they are your only one.`

export async function generateMetadata() {
  const [cms, figures] = await Promise.all([getPageMetadata('about-us'), getSiteFigures()])
  return {
    ...(cms ?? {
      title: `About Byteflow | IT Company in Dubai Since ${figures.founded}`,
      description: `Meet the team behind ${figures.clients} UAE businesses. Byteflow delivers IT support, AMC and software development across Dubai.`,
    }),
    alternates: { canonical: '/about-us' },
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

  return (
    // .hp scopes the home page's design system (home.css).
    <div className="hp">
      <HomeMotion />
      <AboutHero hero={hero} stats={stats} figures={figures} />
      <AboutFounder
        founder={{
          eyebrow: text(founder?.eyebrow) || 'Meet the founder',
          heading: text(founder?.heading) || 'Started with a laptop and a promise to fix IT in Dubai properly.',
          story: founderStory.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
          name: text(founder?.name),
          role: text(founder?.role) || 'Founder & CEO',
          company: text(founder?.company) || 'Byteflow Information Technology',
          // When a founder record exists, its photo is the source of truth,
          // including when it's deliberately empty (the admin removed the
          // photo and wants none shown). Only with no record at all does the
          // bundled photo stand in.
          imageUrl: founder ? text(founder.image_url) : '/images/owner/owner.png',
          imageAlt: text(founder?.image_alt) || 'Byteflow Founder',
          linkedinUrl: text(founder?.linkedin_url) || 'https://ae.linkedin.com/company/byteflow-techcascade',
          phoneLabel: text(founder?.phone_label) || '+971 54 328 2042',
          phoneUrl: text(founder?.phone_url) || 'tel:+971543282042',
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
          phone: text(settings?.header_phone) || '+971 54 328 2042',
          email: text(settings?.primary_email) || 'info@byteflow.ae',
          address: text(settings?.physical_address) || 'Dubai, United Arab Emirates',
        }}
      />
    </div>
  )
}
