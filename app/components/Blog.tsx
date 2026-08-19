import Image from "next/image";
import Link from "next/link";
import type { Post } from "../lib/db";
import { getCategoryStyle } from "../blog/category-style";

export default function Blog({ posts }: { posts: Post[] }) {
  return (
    <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(ellipse, rgba(44,205,222,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#2CCDDE]">Insights</div>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl"><span className="text-[var(--text-primary)]">From Our</span><br /><span className="bg-gradient-to-br from-[#2CCDDE] to-[#46A3E1] bg-clip-text text-transparent">IT Experts</span></h2>
          </div>
          <Link href="/blog" className="group inline-flex flex-shrink-0 items-center gap-2 text-sm font-bold text-[#2CCDDE]">View all articles <span className="transition-transform group-hover:translate-x-1">→</span></Link>
        </div>

        {posts.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => {
              const { gradient, icon } = getCategoryStyle(post.category);
              return (
                <Link key={post.id} href={`/${post.slug}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan-400/10 bg-[var(--bg-surface)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(44,205,222,0.13),_0_20px_40px_rgba(0,0,0,0.5)]">
                  <div className="relative flex h-44 flex-shrink-0 items-center justify-center overflow-hidden" style={{ background: gradient }}>
                    {post.image_url ? (
                      <Image src={post.image_url} alt={post.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <><div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(44,205,222,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(44,205,222,.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} /><div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-black/50 text-[#2CCDDE] transition-transform group-hover:scale-110">{icon}</div></>
                    )}
                    <div className="absolute left-4 top-4 rounded-full border border-cyan-400/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2CCDDE] backdrop-blur">{post.category}</div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[var(--text-dim)]"><span>{post.date}</span><span>•</span><span>{post.read_time}</span></div>
                    <h3 className="flex-1 text-sm font-bold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#2CCDDE]">{post.title}</h3>
                    <p className="line-clamp-3 text-xs leading-relaxed text-[var(--text-muted)]">{post.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-xs font-bold text-[#2CCDDE]"><span>Read article</span><span>→</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/5 bg-[var(--bg-surface)] p-10 text-center text-sm text-[var(--text-muted)]">No published articles yet.</p>
        )}
      </div>
    </section>
  );
}
