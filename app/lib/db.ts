import { createClient, type InArgs } from "@libsql/client";
import { unstable_cache } from "next/cache";

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
  /** Set by the admin panel on save, where the column exists. */
  updated_at: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  /** Cover image description; empty means the title is used. */
  image_alt: string;
  /** "Written by"; empty means the Byteflow team. */
  author_name: string;
  /** Page options set per post in the admin. On unless switched off. */
  show_toc: boolean;
  show_share: boolean;
  show_related: boolean;
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
  /** The home page Services tabs. Blank (or a column not added yet) falls back. */
  image_alt: string;
  cta_label: string;
  cta_link: string;
  eyebrow: string;
  tagline: string;
  /** One bullet per line. */
  highlights: string;
  image_caption: string;
  /** The homepage's featured card only: its heading and its "Explore …" link. Blank falls back to the title. */
  home_heading: string;
  home_link_label: string;
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
  /** The home page Selected Work section. Blank (or not migrated yet) is empty. */
  home_featured: boolean;
  home_order: number;
  /** The card's "Business requirement". */
  challenge: string;
  card_image: string;
  card_image_alt: string;
};

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/** The tag the admin clears (through /api/revalidate) when it saves page content. */
export const SITE_CONTENT_TAG = "site-content";

/**
 * Without a save from the admin, a change reaches the pages within this many
 * seconds: the first view after that still gets the old copy while it
 * refreshes in the background.
 */
const CONTENT_REFRESH_SECONDS = 60;

type ContentRow = Record<string, string | number | null>;

const cachedRows = unstable_cache(
  async (sql: string, args: InArgs): Promise<ContentRow[]> => {
    const result = await db.execute({ sql, args });
    // Plain objects, so the rows can be stored and read back as JSON.
    return result.rows.map((row) =>
      Object.fromEntries(
        result.columns.map((column, i) => {
          const value = row[i];
          return [column, typeof value === "bigint" ? Number(value) : (value as string | number | null)];
        }),
      ),
    );
  },
  ["site-content-rows"],
  { tags: [SITE_CONTENT_TAG], revalidate: CONTENT_REFRESH_SECONDS },
);

/**
 * A SELECT for what the pages show, read from the cache. Every page used to
 * wait on several round trips to the database (in another region) before a
 * byte was sent; now those reads come from memory, and the admin clears them
 * when it saves. Only for text columns: binary data does not survive the cache.
 * A database error still throws, and nothing is cached.
 */
export async function readContent(statement: string | { sql: string; args?: InArgs }): Promise<{ rows: ContentRow[] }> {
  const { sql, args = [] } = typeof statement === "string" ? { sql: statement } : statement;
  return { rows: await cachedRows(sql, args) };
}

import { postDisplay } from "./post-display";

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ── Posts ──────────────────────────────────────────────────────────

/**
 * One row to one post. `date`, `read_time` and `excerpt` can be saved empty in
 * the admin panel, so postDisplay fills those three from the post's own
 * content and creation time; anything typed by hand is kept as typed.
 */
function toPost(row: Record<string, unknown>): Post {
  const shown = postDisplay({
    date: row.date as string | null,
    read_time: row.read_time as string | null,
    excerpt: row.excerpt as string | null,
    content: row.content as string | null,
    created_at: row.created_at as string | null,
  });
  return {
    id: String(row.id),
    slug: row.slug as string,
    category: row.category as string,
    title: row.title as string,
    excerpt: shown.excerpt,
    content: row.content as string,
    date: shown.date,
    read_time: shown.read_time,
    published: Boolean(row.published),
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) ?? null,
    image_url: (row.image_url as string) ?? null,
    meta_title: (row.meta_title as string) ?? null,
    meta_description: (row.meta_description as string) ?? null,
    image_alt: String(row.image_alt ?? "").trim(),
    author_name: String(row.author_name ?? "").trim(),
    show_toc: isOn(row.show_toc),
    show_share: isOn(row.show_share),
    show_related: isOn(row.show_related),
  };
}

/**
 * A page option from the admin. The columns are added by the admin on first
 * use, so a database that has not been migrated yet returns nothing at all,
 * and that means "on" -- the page as it was before the options existed.
 */
function isOn(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  // libSQL returns INTEGER columns as numbers (or bigints in some modes).
  return !(value === false || value === "0" || Number(value) === 0);
}

export async function getPosts(): Promise<Post[]> {
  try {
    const result = await readContent(
      "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC",
    );
    return result.rows.map(toPost);
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
    const result = await readContent({
      sql: "SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return toPost(row);
  } catch (error) {
    console.error(
      "Turso error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// ── Services ───────────────────────────────────────────────────────────────

function toService(row: Record<string, unknown>): DbService {
  return {
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
    image_alt: String(row.image_alt ?? "").trim(),
    cta_label: String(row.cta_label ?? "").trim(),
    cta_link: String(row.cta_link ?? "").trim(),
    eyebrow: String(row.eyebrow ?? "").trim(),
    tagline: String(row.tagline ?? "").trim(),
    highlights: String(row.highlights ?? ""),
    image_caption: String(row.image_caption ?? "").trim(),
    home_heading: String(row.home_heading ?? "").trim(),
    home_link_label: String(row.home_link_label ?? "").trim(),
  };
}

export async function getServices(): Promise<DbService[]> {
  try {
    const result = await readContent(
      "SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC",
    );
    return result.rows.map(toService);
  } catch (error) {
    console.error(
      "Turso services error:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getServiceBySlug(
  slug: string,
): Promise<DbService | null> {
  try {
    const result = await readContent({
      sql: "SELECT * FROM services WHERE slug = ? AND status = 'published' LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return toService(row);
  } catch (error) {
    console.error(
      "Turso service error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// ── Projects ───────────────────────────────────────────────────────────────

const text = (value: unknown) => String(value ?? "").trim();

function toProject(row: Record<string, unknown>): DbProject {
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
    metrics: safeJsonParse<{ value: string; label: string }[]>(row.metrics, []),
    tags: safeJsonParse<string[]>(row.tags, []),
    sort_order: Number(row.sort_order),
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    created_at: row.created_at as string,
    home_featured: Boolean(row.home_featured),
    home_order: Number(row.home_order ?? 0),
    challenge: text(row.challenge),
    card_image: text(row.card_image),
    card_image_alt: text(row.card_image_alt),
  };
}

/**
 * Up to four projects for the home page, those switched on with "Feature on
 * homepage", in their homepage order. Before the admin has added that switch
 * (an older database), the first four published projects stand in.
 */
export async function getHomeProjects(limit = 4): Promise<DbProject[]> {
  try {
    const result = await readContent({
      sql: "SELECT * FROM projects WHERE published = 1 AND home_featured = 1 ORDER BY home_order ASC, sort_order ASC LIMIT ?",
      args: [limit],
    });
    // None ticked "Feature on homepage" yet (a database where the column was
    // only just added starts with all off): the first published projects, so
    // the section never disappears.
    if (!result.rows.length) return (await getProjects()).slice(0, limit);
    return result.rows.map(toProject);
  } catch (error) {
    if (/no such column/i.test(String(error))) return (await getProjects()).slice(0, limit);
    console.error("Turso home projects error:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getProjects(): Promise<DbProject[]> {
  try {
    const result = await readContent(
      "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC",
    );
    return result.rows.map(toProject);
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
    const result = await readContent({
      sql: "SELECT * FROM projects WHERE slug = ? AND published = 1 LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return { ...toProject(row), featured: false };
  } catch (error) {
    console.error(
      "Turso project slug error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
