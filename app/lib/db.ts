import { createClient } from '@libsql/client'

export type Post = {
  id: string
  slug: string
  category: string
  title: string
  excerpt: string
  content: string
  date: string
  read_time: string
  published: boolean
  created_at: string
  image_url: string | null
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export async function getPosts(): Promise<Post[]> {
  try {
    const result = await db.execute(
      'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC'
    )
    return result.rows.map((row) => ({
      id: String(row.id),
      slug: row.slug as string,
      category: row.category as string,
      title: row.title as string,
      excerpt: row.excerpt as string,
      content: row.content as string,
      date: row.date as string,
      read_time: row.read_time as string,
      published: Boolean(row.published),
      created_at: row.created_at as string,
      image_url: (row.image_url as string) ?? null,
    }))
  } catch (error) {
    console.error('Turso error:', error instanceof Error ? error.message : error)
    return []
  }
}
