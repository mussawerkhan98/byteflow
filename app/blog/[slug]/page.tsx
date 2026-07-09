import { permanentRedirect, notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  permanentRedirect(`/${slug}`)
}
