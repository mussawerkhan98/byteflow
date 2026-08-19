import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { getPostBySlug, getPosts } from "@/app/lib/db";
import { getCategoryStyle } from "../blog/category-style";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta_title || `${post.title} | Byteflow Blog`,
    description: post.meta_description || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { gradient, icon } = getCategoryStyle(post.category);
  const isHtmlContent = /<[a-z][\s\S]*>/i.test(post.content);
  const paragraphs = isHtmlContent
    ? []
    : post.content.split("\n\n").filter(Boolean);
  const richContent = sanitizeHtml(post.content, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "code",
      "pre",
      "div",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "caption",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      div: ["class"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedClasses: { div: ["table-scroll"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });

  return (
    <article>
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: "#2CCDDE" }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: "rgba(44,205,222,0.08)",
                border: "1px solid rgba(44,205,222,0.25)",
                color: "#2CCDDE",
              }}
            >
              {post.category}
            </span>
            <span className="text-[var(--text-dim)] text-xs">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-dim)]" />
            <span className="text-[var(--text-dim)] text-xs">
              {post.read_time}
            </span>
          </div>

          <h1 className="text-[var(--text-primary)] text-3xl sm:text-4xl font-bold leading-tight mb-8">
            {post.title}
          </h1>

          <div
            className="relative h-56 sm:h-72 rounded-2xl overflow-hidden flex items-center justify-center mb-10"
            style={{
              background: gradient,
              border: "1px solid rgba(44,205,222,0.18)",
            }}
          >
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                priority
                className="object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(44,205,222,0.3)",
                  color: "#2CCDDE",
                  backdropFilter: "blur(8px)",
                }}
              >
                {icon}
              </div>
            )}
          </div>

          {isHtmlContent ? (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: richContent }}
            />
          ) : (
            <div className="flex flex-col gap-5">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[var(--text-body)] text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-28 pt-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.04) 50%, var(--bg-surface) 100%)",
              border: "1px solid rgba(44,205,222,0.18)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)",
              }}
            />
            <div>
              <p className="text-[var(--text-primary)] text-xl font-bold mb-2">
                Have an IT problem you need solved?
              </p>
              <p className="text-[var(--text-muted)] text-sm max-w-sm">
                Reading about it is one thing. Getting it fixed is another. Our
                team responds within 2 hours.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-black text-sm font-bold flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
              style={{
                background: "linear-gradient(135deg, #2CCDDE, #46A3E1)",
              }}
            >
              Talk to our team
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
