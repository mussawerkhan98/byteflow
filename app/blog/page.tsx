import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import AboutCta from '../components/about/AboutCta'
import BlogBrowser from '../components/blog/BlogBrowser'
import { BlogFeatured } from '../components/blog/BlogCards'
import { Button, Eyebrow, SectionTitle, delay } from '../components/home/ui'
import HomeMotion from '../components/home/HomeMotion'
import JsonLd from '../components/JsonLd'
import { blogStats, blogTopics, featuredPost } from '../lib/blog-page'
import { getPageHero, getPageMetadata, getSiteSettings } from '../lib/cms'
import { getPosts } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { breadcrumbSchema, graph, serviceListSchema } from '../lib/structured-data'

export const revalidate = 3600

const PATH = '/blog'
const title = 'Blog | Byteflow Information Technology'
const description = 'Practical IT guides on cybersecurity, cloud, IT support and digital marketing for businesses in Dubai and the UAE.'

// The title and description stay as they are; the share picture is the one
// set for this page under Pages (SEO), if any.
export async function generateMetadata(): Promise<Metadata> {
  const images = (await getPageMetadata('blog'))?.openGraph?.images
  return {
    alternates: { canonical: PATH },
    title,
    description,
    openGraph: { title, description, url: PATH, type: 'website', ...(images ? { images } : {}) },
  }
}

const text = (value: unknown) => String(value ?? '').trim()

/** The figures band's columns, by how many figures there are (whole class names, so Tailwind sees them). */
const statColumns = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-1 sm:grid-cols-3']

/**
 * The blog. The banner is the page's hero (Pages → Blog), with figures
 * counted from the published posts; the articles are Blog posts, newest
 * first, with a topic filter and a search; every other word is the admin's
 * "Blog page" screen. FAQs and a call to action added for this page in the
 * admin follow it (layout.tsx).
 */
export default async function BlogPage() {
  const [posts, hero, header, settings, copyBlock, cta] = await Promise.all([
    getPosts(),
    getPageHero('blog'),
    getHeaderModel(),
    getSiteSettings(),
    getHomeBlock('blog_page'),
    getHomeBlock('blog_cta'),
  ])
  const copy = copyBlock.fields
  const counts = blogStats(posts)
  const featured = featuredPost(posts, copy.featured)
  const stats = [
    { value: String(counts.articles), label: copy.stat_articles },
    { value: String(counts.topics), label: copy.stat_topics },
    { value: counts.latest, label: copy.stat_latest },
  ].filter((stat) => stat.label && stat.value && stat.value !== '0')
  const cards = posts.map(({ slug, title, excerpt, category, date, read_time, image_url, image_alt, author_name }) => ({ slug, title, excerpt, category, date, read_time, image_url, image_alt, author_name }))

  const heading = hero?.hero_heading || 'IT knowledge,'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'no jargon.')

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: PATH },
          ]),
          serviceListSchema(posts.map((post) => ({ name: post.title, path: `/${post.slug}` }))),
        )}
      />
      <HomeMotion />

      <section aria-labelledby="blog-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]" />
        <div className="page-container grid gap-8 pb-10 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || 'Insights'}
            </p>
            <h1 id="blog-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
              {heading}
              {highlight && ' '}
              {highlight && <span className="hp-h1-accent block">{highlight}</span>}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="hp-lead hp-enter" style={delay(200)}>
              {hero?.hero_description || 'Practical guides on IT support, cybersecurity, cloud and digital marketing for businesses in Dubai and the UAE.'}
            </p>
            {(hero?.hero_primary_label || hero?.hero_secondary_label) && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {hero?.hero_primary_label && (
                  <span className="block hp-enter sm:inline-block" style={delay(300)}>
                    <Button href={hero.hero_primary_link || header.cta.href} className="w-full sm:w-auto">
                      {hero.hero_primary_label}
                    </Button>
                  </span>
                )}
                {hero?.hero_secondary_label && (
                  <span className="block hp-enter sm:inline-block" style={delay(380)}>
                    <Button href={hero.hero_secondary_link || '/services'} variant="ghost" className="w-full sm:w-auto">
                      {hero.hero_secondary_label}
                    </Button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {stats.length > 0 && (
          <div className="page-container pb-14 lg:pb-20">
            <dl className={`hp-band hp-enter grid gap-px overflow-hidden rounded-[1.5rem] !bg-[var(--hp-line)] ${statColumns[Math.min(stats.length, 3)]}`} style={delay(460)}>
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-[var(--hp-card)] p-5 sm:p-7">
                  <dt className="order-2 mt-1 text-[13.5px] text-[var(--hp-body)]">{stat.label}</dt>
                  <dd className="hp-stat order-1 !text-[2rem] sm:!text-[2.5rem]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {featured.post && (
        <div data-reveal className="page-container pb-16 lg:pb-24">
          <BlogFeatured post={featured.post} badge={featured.picked ? copy.picked_badge : copy.latest_badge} readLabel={copy.read_label} author={copy.author_fallback} />
        </div>
      )}

      <section aria-labelledby="blog-articles-title" className="page-container pb-16 lg:pb-24">
        <BlogBrowser
          heading={
            <div data-reveal className="max-w-3xl">
              {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
              <SectionTitle id="blog-articles-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-4" />
            </div>
          }
          posts={cards}
          topics={blogTopics(posts)}
          featured={featured.post?.slug ?? null}
          labels={{
            all: copy.all_label,
            filter: copy.filter_label,
            search: copy.search_label,
            placeholder: copy.search_placeholder,
            empty: copy.empty_text,
            clear: copy.clear_label,
            more: copy.more_label,
            read: copy.read_label,
            author: copy.author_fallback,
            article: copy.article_word,
            articles: copy.articles_word,
          }}
        />
      </section>

      <AboutCta
        content={cta}
        contact={{
          phone: text(settings?.header_phone) || '+971 54 328 2042',
          email: text(settings?.primary_email) || 'info@byteflow.ae',
          address: text(settings?.physical_address) || 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates',
        }}
      />
    </div>
  )
}
