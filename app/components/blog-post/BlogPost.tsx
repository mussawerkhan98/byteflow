import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { getPosts, type Post } from "@/app/lib/db";
import { getSiteSettings } from "@/app/lib/cms";
import { getCategoryStyle } from "../../blog/category-style";
import PostServiceLinks from "../PostServiceLinks";
import JsonLd from "../JsonLd";
import {
  demoteH1,
  postDates,
  prepareArticle,
  textOf,
} from "../../lib/post-article";
import {
  SITE_URL,
  absoluteUrl,
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
  graph,
} from "../../lib/structured-data";
import ReadingProgress from "./ReadingProgress";
import ShareButtons from "./ShareButtons";
import { DesktopToc, MobileToc } from "./TableOfContents";

const BRAND = "Byteflow";
const ORG_NAME = "Byteflow Information Technology";
const DEFAULT_LOGO = "/images/logo.png";
const DEFAULT_PHONE = "+971 54 328 2042";
const BODY_ID = "post-body";

/** The cover is shown 16:9; these are its intrinsic width and height. */
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;

const ALLOWED_TAGS = [
  "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "ul", "ol",
  "li", "blockquote", "a", "code", "pre", "div", "table", "thead", "tbody",
  "tfoot", "tr", "th", "td", "caption",
];

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
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
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The post's content as HTML, whether it was saved as HTML or plain paragraphs. */
function contentHtml(content: string) {
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split("\n\n")
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");
}

/**
 * The image used when the post is shared: its cover when that is a real file
 * (a data: URL cannot be fetched by a social network), else the logo.
 */
export function postShareImage(post: Pick<Post, "image_url">) {
  const image = post.image_url?.trim();
  return image && !/^data:/i.test(image) ? image : DEFAULT_LOGO;
}

const displayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** Up to three other posts, same category first, newest first within each. */
function relatedPosts(all: Post[], post: Post) {
  const others = all.filter((item) => item.slug !== post.slug);
  const same = others.filter((item) => item.category === post.category);
  const rest = others.filter((item) => item.category !== post.category);
  return [...same, ...rest].slice(0, 3);
}

function ArrowRight({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export default async function BlogPost({ post }: { post: Post }) {
  const [settings, allPosts] = await Promise.all([getSiteSettings(), getPosts()]);
  const logo = String(settings?.logo_url || DEFAULT_LOGO);
  const phone = String(settings?.header_phone || DEFAULT_PHONE);
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const whatsapp =
    String(settings?.whatsapp_link || "") ||
    `https://wa.me/${phone.replace(/[^\d]/g, "")}`;

  const article = prepareArticle(sanitize(demoteH1(contentHtml(post.content ?? ""))));
  const { published, modified } = postDates(post);
  const related = relatedPosts(allPosts, post);
  const { gradient, icon } = getCategoryStyle(post.category);
  const path = `/${post.slug}`;
  const url = absoluteUrl(path);
  const excerpt = textOf(post.excerpt ?? "");

  const schema = graph(
    blogPostingSchema({
      title: post.title,
      description: post.meta_description || post.excerpt,
      path,
      image: postShareImage(post),
      published: published?.toISOString(),
      modified: modified?.toISOString(),
      wordCount: article.wordCount,
      section: post.category,
      organization: { name: ORG_NAME, logo, url: SITE_URL },
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
    article.faq
      ? faqPageSchema(
          article.faq.items.map((item) => ({
            question: item.question,
            answer: item.answerHtml,
          })),
        )
      : null,
  );

  return (
    <article className="post-page" aria-labelledby="article-title">
      <ReadingProgress targetId={BODY_ID} />
      <JsonLd data={schema} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="post-breadcrumb">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="truncate">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            {post.category && (
              <span className="post-chip mb-5">{post.category}</span>
            )}
            <h1
              id="article-title"
              className="text-[var(--text-primary)] text-3xl sm:text-4xl lg:text-[2.85rem] font-bold leading-[1.15] mb-5"
            >
              {post.title}
            </h1>
            {excerpt && (
              <p className="text-[var(--text-body)] text-base sm:text-lg leading-relaxed mb-7 max-w-3xl">
                {excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2.5">
                <span className="post-avatar" aria-hidden="true">
                  <Image src={logo} alt="" width={36} height={36} className="h-6 w-6 object-contain" />
                </span>
                <span>
                  Written by{" "}
                  <Link href="/about-us" className="font-semibold text-[var(--text-primary)]">
                    {BRAND} team
                  </Link>
                </span>
              </span>
              <span className="post-meta-dot" aria-hidden="true" />
              <span>
                Published{" "}
                {published ? (
                  <time dateTime={published.toISOString()} className="text-[var(--text-primary)] font-medium">
                    {post.date || displayDate(published)}
                  </time>
                ) : (
                  <span className="text-[var(--text-primary)] font-medium">{post.date}</span>
                )}
              </span>
              {modified && (
                <>
                  <span className="post-meta-dot" aria-hidden="true" />
                  <span>
                    Updated{" "}
                    <time dateTime={modified.toISOString()} className="text-[var(--text-primary)] font-medium">
                      {displayDate(modified)}
                    </time>
                  </span>
                </>
              )}
              {post.read_time && (
                <>
                  <span className="post-meta-dot" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.read_time}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Cover */}
          <figure
            className="post-cover mt-10"
            style={{ background: gradient }}
          >
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                width={COVER_WIDTH}
                height={COVER_HEIGHT}
                sizes="(min-width: 1152px) 1152px, 100vw"
                preload
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ color: "#2CCDDE" }}>
                <div className="post-cover-icon">{icon}</div>
              </div>
            )}
          </figure>
        </div>
      </header>

      {/* ── Body + sidebar ─────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-16">
          <div className="min-w-0 max-w-3xl">
            <MobileToc items={article.toc} />

            <div
              id={BODY_ID}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            <div className="post-divider mt-12 pt-8">
              <ShareButtons url={url} title={post.title} />
            </div>

            <PostServiceLinks title={post.title} category={post.category} embedded />

            {/* About the publisher */}
            <section aria-labelledby="publisher-heading" className="post-panel mt-10 p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row gap-5">
                <span className="post-avatar post-avatar-lg flex-shrink-0" aria-hidden="true">
                  <Image src={logo} alt="" width={64} height={64} className="h-10 w-10 object-contain" />
                </span>
                <div>
                  <p className="post-eyebrow mb-1">About the publisher</p>
                  <h2 id="publisher-heading" className="text-[var(--text-primary)] text-lg font-bold mb-2">
                    {ORG_NAME}
                  </h2>
                  <p className="text-[var(--text-body)] text-sm leading-relaxed mb-4">
                    This guide was written by the {BRAND} team, an IT solutions
                    provider serving 500+ businesses across Dubai and the UAE
                    since 2017 with IT AMC support, cyber security, cloud
                    services and system integration.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                    <Link href="/about-us" className="post-text-link">
                      About {BRAND} <ArrowRight />
                    </Link>
                    <Link href="/blog" className="post-text-link">
                      More guides <ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="hidden lg:block" aria-label="Article tools">
            <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-6">
              <div className="min-h-0 overflow-y-auto overscroll-contain pr-1">
                <DesktopToc items={article.toc} />
              </div>
              <ContactCard phone={phone} phoneHref={phoneHref} whatsapp={whatsapp} />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Call to action ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16" aria-labelledby="post-cta-heading">
        <div className="max-w-6xl mx-auto">
          <div className="post-cta relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)" }} />
            <div>
              <h2 id="post-cta-heading" className="text-[var(--text-primary)] text-xl sm:text-2xl font-bold mb-2">
                Have an IT problem you need solved?
              </h2>
              <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-md">
                Reading about it is one thing. Getting it fixed is another. Our
                team responds within 2 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/contact-us" className="post-btn-primary">
                Talk to our team <ArrowRight />
              </Link>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="post-btn-secondary">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related posts ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16" aria-labelledby="related-heading">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="post-eyebrow mb-2">Keep reading</p>
                <h2 id="related-heading" className="text-[var(--text-primary)] text-2xl font-bold">
                  Related articles
                </h2>
              </div>
              <Link href="/blog" className="post-text-link text-sm font-semibold flex-shrink-0">
                All articles <ArrowRight />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {related.map((item) => (
                <li key={item.slug}>
                  <RelatedCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── FAQs ───────────────────────────────────────────────── */}
      {article.faq && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby={article.faq.id}>
          <div className="max-w-3xl mx-auto">
            <p className="post-eyebrow mb-2 text-center">FAQs</p>
            <h2
              id={article.faq.id}
              className="post-anchor text-[var(--text-primary)] text-2xl sm:text-3xl font-bold text-center mb-4"
            >
              {article.faq.heading}
            </h2>
            {article.faq.introHtml && (
              <div
                className="blog-content text-center mb-6"
                dangerouslySetInnerHTML={{ __html: article.faq.introHtml }}
              />
            )}
            <div className="flex flex-col gap-3 mt-8">
              {article.faq.items.map((item, index) => (
                <details key={item.id} id={item.id} className="post-faq post-anchor" open={index === 0}>
                  <summary>
                    <h3 className="text-[var(--text-primary)] text-base font-semibold leading-snug">
                      {item.question}
                    </h3>
                    <span className="post-faq-icon" aria-hidden="true" />
                  </summary>
                  <div
                    className="blog-content post-faq-answer"
                    dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                  />
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function ContactCard({
  phone,
  phoneHref,
  whatsapp,
}: {
  phone: string;
  phoneHref: string;
  whatsapp: string;
}) {
  return (
    <section aria-labelledby="contact-card-heading" className="post-panel post-contact-card p-5">
      <p className="post-eyebrow mb-2">Need help with this?</p>
      <h2 id="contact-card-heading" className="text-[var(--text-primary)] text-base font-bold leading-snug mb-1.5">
        Talk to a Byteflow IT expert
      </h2>
      <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4">
        Free consultation and a clear quote. We reply within 2 hours.
      </p>
      <div className="flex flex-col gap-2">
        <Link href="/contact-us" className="post-btn-primary justify-center">
          Get a free quote <ArrowRight />
        </Link>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="post-btn-whatsapp justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.42-8.42zm-3.05 10.92c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z" />
          </svg>
          WhatsApp
        </a>
        <a href={phoneHref} className="post-btn-secondary justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Call {phone}
        </a>
      </div>
    </section>
  );
}

function RelatedCard({ post }: { post: Post }) {
  const { gradient, icon } = getCategoryStyle(post.category);
  return (
    <Link href={`/${post.slug}`} className="post-related card-hover group">
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: gradient }}>
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center" style={{ color: "#2CCDDE" }}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--text-muted)]">
          {post.category && <span className="post-chip post-chip-sm">{post.category}</span>}
          {post.read_time && <span>{post.read_time}</span>}
        </div>
        <h3 className="text-[var(--text-primary)] text-base font-bold leading-snug mb-2 transition-colors duration-200 group-hover:text-[#2CCDDE]">
          {post.title}
        </h3>
        {post.date && <p className="mt-auto text-xs text-[var(--text-muted)]">{post.date}</p>}
      </div>
    </Link>
  );
}
