import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects } from '@/app/lib/projects-data'

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} | Byteflow Projects`,
    description: project.story,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <article>
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: '#2CCDDE' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.08)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
            >
              {project.category}
            </span>
            <span className="text-[var(--text-dim)] text-xs">{project.industry}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-dim)]" />
            <span className="text-[var(--text-dim)] text-xs">{project.year}</span>
          </div>

          <h1 className="text-[var(--text-primary)] text-3xl sm:text-4xl font-bold leading-tight mb-4">{project.title}</h1>
          <p className="text-[var(--text-muted)] text-sm font-semibold mb-10">{project.client}</p>

          <p className="text-[var(--text-body)] text-base leading-relaxed mb-10">{project.story}</p>

          <h2 className="text-[var(--text-primary)] text-lg font-bold mb-4">What we delivered</h2>
          <ul className="flex flex-col gap-2.5 mb-10">
            {project.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2CCDDE', opacity: 0.7 }} />
                {d}
              </li>
            ))}
          </ul>

          {project.metrics.length > 0 && (
            <div
              className="flex items-start gap-8 py-6 mb-10"
              style={{ borderTop: '1px solid var(--overlay-hover)', borderBottom: '1px solid var(--overlay-hover)' }}
            >
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span
                    className="text-2xl font-black leading-none mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {m.value}
                  </span>
                  <span className="text-[var(--text-muted)] text-xs leading-snug">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.18)', color: 'var(--text-muted)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-28 pt-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{
              background: 'linear-gradient(135deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.04) 50%, var(--bg-surface) 100%)',
              border: '1px solid rgba(44,205,222,0.18)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)' }} />
            <div>
              <p className="text-[var(--text-primary)] text-xl font-bold mb-2">Want results like this for your business?</p>
              <p className="text-[var(--text-muted)] text-sm max-w-sm">Tell us what you're working with. Our team responds within 2 hours.</p>
            </div>
            <a
              href="/contact-us"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-black text-sm font-bold flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
              style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
            >
              Talk to our team
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </article>
  )
}
