'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/app/lib/db'

const CATEGORIES = ['All', 'IT Support', 'Web & Apps', 'Cloud', 'Cyber Security', 'System Integration', 'Digital Marketing']

function getCategoryStyle(category: string): { gradient: string; icon: React.ReactNode } {
  const map: Record<string, { gradient: string; icon: React.ReactNode }> = {
    'Cyber Security': {
      gradient: 'linear-gradient(135deg, rgba(220,40,70,0.08) 0%, rgba(44,205,222,0.12) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    'Cloud': {
      gradient: 'linear-gradient(135deg, rgba(70,163,225,0.18) 0%, rgba(44,205,222,0.06) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    },
    'IT Support': {
      gradient: 'linear-gradient(135deg, rgba(44,205,222,0.15) 0%, rgba(14,165,233,0.06) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    'Digital Marketing': {
      gradient: 'linear-gradient(135deg, rgba(70,163,225,0.15) 0%, rgba(44,205,222,0.05) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    'Web & Apps': {
      gradient: 'linear-gradient(135deg, rgba(70,163,225,0.13) 0%, rgba(44,205,222,0.04) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    'System Integration': {
      gradient: 'linear-gradient(135deg, rgba(44,205,222,0.1) 0%, rgba(70,163,225,0.1) 100%)',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      ),
    },
  }

  return map[category] ?? map['IT Support']
}

function PostCard({ post }: { post: Post }) {
  const { gradient, icon } = getCategoryStyle(post.category)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(44,205,222,0.12),0_20px_40px_rgba(0,0,0,0.5)]"
      style={{ background: '#050F18', border: '1px solid rgba(44,205,222,0.12)' }}
    >
      <div className="relative h-44 flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: gradient }}>
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(44,205,222,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(44,205,222,0.15) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="absolute w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(44,205,222,0.22) 0%, transparent 70%)', filter: 'blur(20px)' }} />
            <div
              className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(44,205,222,0.45)]"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(44,205,222,0.3)', color: '#2CCDDE', backdropFilter: 'blur(8px)' }}
            >
              {icon}
            </div>
          </>
        )}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(44,205,222,0.35)', color: '#2CCDDE', backdropFilter: 'blur(8px)' }}
        >
          {post.category}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#374151] font-medium">{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-[#374151]" />
          <span className="text-[10px] text-[#374151] font-medium">{post.read_time}</span>
        </div>
        <h3 className="text-white text-sm font-bold leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200 flex-1">
          {post.title}
        </h3>
        <p className="text-[#5A6272] text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs font-bold" style={{ color: '#2CCDDE' }}>Read article</span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(44,205,222,0.5)] group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, rgba(44,205,222,0.15), rgba(70,163,225,0.1))', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
          >
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeaturedPost({ post }: { post: Post }) {
  const { gradient, icon } = getCategoryStyle(post.category)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(44,205,222,0.14),0_24px_48px_rgba(0,0,0,0.6)]"
      style={{ background: '#050F18', border: '1px solid rgba(44,205,222,0.18)' }}
    >
      <div className="lg:col-span-2 h-56 lg:h-auto relative flex items-center justify-center overflow-hidden" style={{ background: gradient }}>
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(44,205,222,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(44,205,222,0.1) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(44,205,222,0.3) 0%, transparent 65%)', filter: 'blur(32px)' }} />
            <div
              className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(44,205,222,0.55)]"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(44,205,222,0.35)', color: '#2CCDDE', backdropFilter: 'blur(10px)' }}
            >
              <div className="scale-150">{icon}</div>
            </div>
          </>
        )}
        <div
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black opacity-60" />
          Featured
        </div>
      </div>

      <div className="lg:col-span-3 p-8 flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.08)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
            >
              {post.category}
            </span>
            <span className="text-[#374151] text-xs">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[#374151]" />
            <span className="text-[#374151] text-xs">{post.read_time}</span>
          </div>
          <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-4 group-hover:text-[#2CCDDE] transition-colors duration-200">
            {post.title}
          </h2>
          <p className="text-[#5A6272] text-sm leading-relaxed">{post.excerpt}</p>
        </div>
        <div>
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-black text-sm font-bold transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
          >
            Read article
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogContent({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      {/* Header */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">Insights</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="text-white">IT knowledge,</span>
                <br />
                <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  no jargon
                </span>
              </h1>
              <p className="text-[#5A6272] mt-4 text-base max-w-md leading-relaxed">
                Practical guides on IT support, cybersecurity, cloud and digital marketing for businesses in Dubai and the UAE.
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-full flex-shrink-0 self-start"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.18)' }}
            >
              <span className="text-white font-black text-lg leading-none">{posts.length}</span>
              <span className="text-[#5A6272] text-xs">articles published</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={
                active === cat
                  ? { background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }
                  : { background: 'rgba(44,205,222,0.06)', border: '1px solid rgba(44,205,222,0.16)', color: '#5A6272' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {filtered.length === 0 && (
            <p className="text-center text-[#5A6272] text-sm py-20">No articles in this category yet.</p>
          )}
          {featured && <FeaturedPost post={featured} />}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{
              background: 'linear-gradient(135deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.04) 50%, #050F18 100%)',
              border: '1px solid rgba(44,205,222,0.18)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)' }} />
            <div>
              <p className="text-white text-xl font-bold mb-2">Have an IT problem you need solved?</p>
              <p className="text-[#5A6272] text-sm max-w-sm">Reading about it is one thing. Getting it fixed is another. Our team responds within 2 hours.</p>
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
    </div>
  )
}
