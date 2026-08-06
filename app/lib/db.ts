import { createClient } from "@libsql/client";

export type Post = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  published: boolean;
  created_at: string;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type DbService = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  year: string;
  image_url: string | null;
  bullet_points: string[];
  metrics: { value: string; label: string }[];
  tags: string[];
  sort_order: number;
  published: boolean;
  featured: boolean;
  created_at: string;
};

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  try {
    const result = await db.execute(
      "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC",
    );
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
      meta_title: (row.meta_title as string) ?? null,
      meta_description: (row.meta_description as string) ?? null,
    }));
  } catch (error) {
    console.error(
      "Turso error:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
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
      meta_title: (row.meta_title as string) ?? null,
      meta_description: (row.meta_description as string) ?? null,
    };
  } catch (error) {
    console.error(
      "Turso error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// ── Services ───────────────────────────────────────────────────────────────

export async function getServices(): Promise<DbService[]> {
  try {
    const result = await db.execute(
      "SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC",
    );
    return result.rows.map((row) => ({
      id: String(row.id),
      slug: row.slug as string,
      title: row.title as string,
      icon: (row.icon as string) || "",
      excerpt: (row.excerpt as string) || "",
      description: (row.description as string) || "",
      image_url: (row.image_url as string) ?? null,
      sort_order: Number(row.sort_order),
      published: Boolean(row.published),
      created_at: row.created_at as string,
    }));
  } catch (error) {
    console.error(
      "Turso services error:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

// ── Projects ───────────────────────────────────────────────────────────────

export async function getProjects(): Promise<DbProject[]> {
  try {
    const result = await db.execute(
      "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC",
    );
    return result.rows.map((row) => ({
      id: String(row.id),
      slug: row.slug as string,
      title: row.title as string,
      description: (row.description as string) || "",
      category: (row.category as string) || "",
      industry: (row.industry as string) || "",
      year: (row.year as string) || "",
      image_url: (row.image_url as string) ?? null,
      bullet_points: safeJsonParse<string[]>(row.bullet_points, []),
      metrics: safeJsonParse<{ value: string; label: string }[]>(
        row.metrics,
        [],
      ),
      tags: safeJsonParse<string[]>(row.tags, []),
      sort_order: Number(row.sort_order),
      published: Boolean(row.published),
      featured: Boolean(row.featured),
      created_at: row.created_at as string,
    }));
  } catch (error) {
    console.error(
      "Turso projects error:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<DbProject | null> {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ? AND published = 1 LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: String(row.id),
      slug: row.slug as string,
      title: row.title as string,
      description: (row.description as string) || "",
      category: (row.category as string) || "",
      industry: (row.industry as string) || "",
      year: (row.year as string) || "",
      image_url: (row.image_url as string) ?? null,
      bullet_points: safeJsonParse<string[]>(row.bullet_points, []),
      metrics: safeJsonParse<{ value: string; label: string }[]>(
        row.metrics,
        [],
      ),
      tags: safeJsonParse<string[]>(row.tags, []),
      sort_order: Number(row.sort_order),
      published: Boolean(row.published),
      featured: false,
      created_at: row.created_at as string,
    };
  } catch (error) {
    console.error(
      "Turso project slug error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
