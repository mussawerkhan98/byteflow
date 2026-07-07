import type { Metadata } from 'next'
import { getPosts } from '@/app/lib/db'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog | Byteflow Information Technology',
  description: 'Practical IT guides on cybersecurity, cloud, IT support and digital marketing for businesses in Dubai and the UAE.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogContent posts={posts} />
}
