import Link from 'next/link'

const posts = [
  {
    slug: 'ransomware-protection-dubai-businesses',
    category: 'Cyber Security',
    categoryColor: '#2CCDDE',
    title: 'How Dubai Businesses Can Protect Themselves from Ransomware in 2024',
    excerpt: 'Ransomware attacks on UAE companies have surged 300% in two years. Here is exactly what we deploy for every client — and what you can do today.',
    date: 'May 12, 2024',
    readTime: '6 min read',
    author: 'Byteflow Team',
    gradient: 'linear-gradient(135deg, rgba(44,205,222,0.18) 0%, rgba(70,163,225,0.08) 100%)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    slug: 'microsoft-365-migration-guide-uae',
    category: 'Cloud',
    categoryColor: '#46A3E1',
    title: 'The Complete Microsoft 365 Migration Guide for UAE SMEs',
    excerpt: 'Moving 50 users to Microsoft 365 in a weekend with zero downtime. A step-by-step breakdown of how we plan and execute cloud migrations.',
    date: 'Apr 28, 2024',
    readTime: '8 min read',
    author: 'Byteflow Team',
    gradient: 'linear-gradient(135deg, rgba(70,163,225,0.18) 0%, rgba(44,205,222,0.06) 100%)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    slug: 'it-amc-vs-break-fix-dubai',
    category: 'IT Support',
    categoryColor: '#2CCDDE',
    title: 'IT AMC vs Break-Fix: What Actually Saves Your Business More Money?',
    excerpt: 'We crunched the numbers across 200+ Dubai clients. The hidden cost of ad-hoc IT support is far higher than most business owners realise.',
    date: 'Apr 10, 2024',
    readTime: '5 min read',
    author: 'Byteflow Team',
    gradient: 'linear-gradient(135deg, rgba(44,205,222,0.15) 0%, rgba(14,165,233,0.06) 100%)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    slug: 'website-seo-dubai-small-business',
    category: 'Digital Marketing',
    categoryColor: '#46A3E1',
    title: 'Why Your Dubai Business Website Is Invisible on Google (And How to Fix It)',
    excerpt: 'Local SEO in the UAE works differently. The exact on-page and off-page changes that moved our clients from page 5 to position 1 in under 90 days.',
    date: 'Mar 22, 2024',
    readTime: '7 min read',
    author: 'Byteflow Team',
    gradient: 'linear-gradient(135deg, rgba(70,163,225,0.15) 0%, rgba(44,205,222,0.05) 100%)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
]

export default function Blog() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
            >
              Insights
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-[var(--text-primary)]">From Our</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                IT Experts
              </span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 flex-shrink-0"
            style={{ color: '#2CCDDE' }}
          >
            View all articles
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(44,205,222,0.13),_0_20px_40px_rgba(0,0,0,0.5)]"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid rgba(44,205,222,0.12)',
              }}
            >
              {/* Illustration area */}
              <div
                className="relative h-44 flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: post.gradient }}
              >
                {/* Subtle grid pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(44,205,222,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(44,205,222,0.15) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                {/* Glow orb */}
                <div
                  className="absolute w-32 h-32 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(44,205,222,0.25) 0%, transparent 70%)', filter: 'blur(20px)' }}
                />
                {/* Icon */}
                <div
                  className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(44,205,222,0.5)]"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(44,205,222,0.3)',
                    color: '#2CCDDE',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {post.icon}
                </div>

                {/* Category badge */}
                <div
                  className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: `1px solid ${post.categoryColor}40`,
                    color: post.categoryColor,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">

                {/* Meta */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-dim)] font-medium">{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--text-dim)]" />
                  <span className="text-[10px] text-[var(--text-dim)] font-medium">{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-[var(--text-primary)] text-sm font-bold leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200 flex-1">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[var(--text-muted)] text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <div
                  className="flex items-center justify-between pt-4 mt-auto"
                  style={{ borderTop: '1px solid var(--overlay-hover)' }}
                >
                  <span className="text-xs font-bold transition-colors duration-200" style={{ color: '#2CCDDE' }}>
                    Read article
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(44,205,222,0.5)] group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44,205,222,0.15), rgba(70,163,225,0.1))',
                      border: '1px solid rgba(44,205,222,0.25)',
                      color: '#2CCDDE',
                    }}
                  >
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
