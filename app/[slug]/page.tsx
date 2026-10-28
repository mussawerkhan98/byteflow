import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPosts,
  getServiceBySlug,
  getServices,
} from "@/app/lib/db";
import CmsServicePage from "../components/CmsServicePage";
import JsonLd from "../components/JsonLd";
import BlogPost, { postShareImage } from "../components/blog-post/BlogPost";
import { postDates } from "../lib/post-article";
import {
  absoluteUrl,
  breadcrumbSchema,
  graph,
  serviceSchema,
} from "../lib/structured-data";

export const revalidate = 3600;

/**
 * This route serves both CMS services and blog posts, so both have to be
 * listed here or the service pages fall back to rendering on every request.
 * Slugs added in the admin panel after a build are still served: they miss
 * the prerender and are rendered once, then cached like the rest.
 */
export async function generateStaticParams() {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);
  const slugs = new Set<string>();
  for (const post of posts) if (post.slug) slugs.add(post.slug);
  for (const service of services) if (service.slug) slugs.add(service.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (post) {
    const title = post.meta_title || `${post.title} | Byteflow Blog`;
    const description = post.meta_description || post.excerpt;
    const { published, modified } = postDates(post);
    const image = postShareImage(post);
    const images = [{ url: absoluteUrl(image), alt: post.title }];
    return {
      title,
      description,
      alternates: { canonical: `/${slug}` },
      // Replaces the site-wide Open Graph block from the root layout, which
      // describes the home page: shared links show this article instead.
      openGraph: {
        type: "article",
        url: `/${slug}`,
        siteName: "Byteflow Information Technology",
        locale: "en_AE",
        title,
        description,
        images,
        ...(published ? { publishedTime: published.toISOString() } : {}),
        ...(modified ? { modifiedTime: modified.toISOString() } : {}),
        section: post.category || undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: images.map((item) => item.url),
      },
    };
  }
  const service = await getServiceBySlug(slug);
  if (service) {
    return {
      title: `${service.title} | Byteflow Information Technology`,
      description: service.excerpt || service.description.slice(0, 160),
      alternates: { canonical: `/${slug}` },
    };
  }
  return {};
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Services added in the admin panel don't have a hand-written route the way
  // the original nine do, so they resolve here instead of 404-ing.
  if (!post) {
    const service = await getServiceBySlug(slug);
    if (service) {
      const related = (await getServices())
        .filter((item) => item.slug !== service.slug)
        .slice(0, 3);
      return (
        <>
          <JsonLd
            data={graph(
              serviceSchema({
                name: service.title,
                description: service.description,
                path: `/${service.slug}`,
                image: service.image_url || "",
              }),
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: service.title, path: `/${service.slug}` },
              ]),
            )}
          />
          <CmsServicePage service={service} related={related} />
        </>
      );
    }
    notFound();
  }

  return <BlogPost post={post} />;
}
