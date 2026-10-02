import Link from 'next/link'
import { servicesForPost } from '../lib/post-services'

/**
 * The three services most relevant to an article, offered at the end of it.
 *
 * Every post used to end with one link to /contact-us and nothing else, so
 * the blog — which carries most of this site's search visibility — passed
 * none of that standing to the pages that sell anything, and a reader who
 * had just finished a guide was given no obvious next step short of filling
 * in a form.
 *
 * Three links rather than a list of everything: at the bottom of an article
 * a long menu reads as filler and helps nobody choose.
 */
export default function PostServiceLinks({
  title,
  category,
}: {
  title: string
  category?: string
}) {
  const links = servicesForPost(title, category)
  if (!links.length) return null

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#2CCDDE' }}>
          How we can help with this
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3 list-none p-0 m-0">
          {links.map((link) => (
            <li key={link.slug}>
              <Link
                href={`/${link.slug}`}
                className="block h-full rounded-xl px-5 py-4 text-sm font-semibold transition-colors duration-200"
                style={{
                  color: 'var(--text-primary)',
                  background: 'var(--overlay-hover-soft)',
                  border: '1px solid var(--overlay-strong)',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
