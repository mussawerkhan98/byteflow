import type { Metadata } from 'next'
import { getPosts } from '@/app/lib/db'
import BlogContent from './BlogContent'
import { getPageHero } from '../lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: 'Blog | Byteflow Information Technology',
  description: 'Practical IT guides on cybersecurity, cloud, IT support and digital marketing for businesses in Dubai and the UAE.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const hero = await getPageHero('blog')
  return (
    <>
      {/* Only render the CMS image band when there is actually an image. With
          no image it was 176px of empty page above the real hero, and its
          white heading was invisible against the light theme. */}
      {hero?.hero_background_image && (
        <div
          className="h-44 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(4,13,18,.55),rgba(4,13,18,.95)),url(${hero.hero_background_image})`,
          }}
        >
          {hero.hero_heading && (
            <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-8">
              <p className="text-4xl font-bold text-white">{hero.hero_heading}</p>
            </div>
          )}
        </div>
      )}
      <BlogContent posts={posts} />
    </>
  )
}
