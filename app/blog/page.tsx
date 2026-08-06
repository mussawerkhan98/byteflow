import type { Metadata } from 'next'
import { getPosts } from '@/app/lib/db'
import BlogContent from './BlogContent'
import { getPageHero } from '../lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | Byteflow Information Technology',
  description: 'Practical IT guides on cybersecurity, cloud, IT support and digital marketing for businesses in Dubai and the UAE.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const hero = await getPageHero('blog')
  return <><div className="h-44 bg-cover bg-center" style={hero?.hero_background_image?{backgroundImage:`linear-gradient(rgba(4,13,18,.55),rgba(4,13,18,.95)),url(${hero.hero_background_image})`}:undefined}>{hero?.hero_heading&&<div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-8"><h1 className="text-4xl font-bold text-white">{hero.hero_heading}</h1></div>}</div><BlogContent posts={posts} /></>
}
