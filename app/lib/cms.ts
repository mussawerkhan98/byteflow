import 'server-only'
import { cache } from 'react'
import type { Metadata } from 'next'
import { readContent } from './db'
import { hasContent, type PageSection } from '../components/PageSectionCards'
import { fillDeep, fillFigures, figuresFrom } from './site-figures'
import { services as builtInServices } from './services-data'

export type SiteSettings = Record<string, string | number>
export type MenuItem = { id: number; area: string; label: string; href: string; parent_id: number | null; sort_order: number; new_tab: boolean; visible: boolean }
export type CmsFaq = { id: number; category: string; question: string; answer: string; sort_order: number }
export type CmsReview = { id: number; customer_name: string; customer_role: string; review_text: string; rating: number; image_url: string; image_alt: string; source: string; featured: boolean }
export type CmsTeamMember = { id: number; name: string; job_title: string; biography: string; image_url: string; image_alt: string; email: string; phone: string; linkedin_url: string; x_url: string; github_url: string }
export type PageHero = { hero_label:string; hero_heading:string; hero_description:string; hero_background_image:string; hero_primary_label:string; hero_primary_link:string; hero_secondary_label:string; hero_secondary_link:string }
  /** The home page's extra hero fields; blank until the admin fills them in. */
  & Partial<Record<'hero_highlight'|'hero_trust_line'|'hero_image'|'hero_image_alt'|'hero_strip_text'|'hero_strip_link_label'|'hero_strip_link', string>>
const HERO_COLUMNS = 'hero_label,hero_heading,hero_description,hero_background_image,hero_primary_label,hero_primary_link,hero_secondary_label,hero_secondary_link'
const HERO_EXTRA_COLUMNS = 'hero_highlight,hero_trust_line,hero_image,hero_image_alt,hero_strip_text,hero_strip_link_label,hero_strip_link'
export type WebsiteScript = { id:number; name:string; placement:'head'|'body_end'; code:string; sort_order:number }

// Read once per request. Its own text (the footer line and so on) can quote
// the site-wide figures, which live in the same row (see site-figures.ts).
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => { try { const result = await readContent('SELECT * FROM site_settings WHERE id = 1'); if (!result.rows[0]) return null; const row = Object.fromEntries(Object.entries(result.rows[0]).map(([key,value]) => [key, typeof value === 'bigint' ? Number(value) : value ?? ''])) as SiteSettings; return fillDeep(row, figuresFrom(row)) } catch { return null } })
/** Clients, Google rating, reviews and founding year, as set in the admin. */
export const getSiteFigures = cache(async () => figuresFrom(await getSiteSettings()))
export async function getWebsiteScripts(): Promise<WebsiteScript[]> { try { const [result, figures]=await Promise.all([readContent("SELECT id,name,placement,code,sort_order FROM website_scripts WHERE enabled=1 ORDER BY placement,sort_order,name"), getSiteFigures()]); return result.rows.map((row)=>({id:Number(row.id),name:String(row.name),placement:row.placement==='body_end'?'body_end':'head',code:fillFigures(String(row.code), figures),sort_order:Number(row.sort_order)})) } catch { return [] } }
export async function getMenu(area: 'header' | 'footer'): Promise<MenuItem[]> { try { const result = await readContent({ sql: 'SELECT * FROM menu_items WHERE area = ? AND visible = 1 ORDER BY sort_order', args: [area] }); return result.rows.map((row) => ({ id:Number(row.id), area:String(row.area), label:String(row.label), href:String(row.href), parent_id:row.parent_id == null ? null : Number(row.parent_id), sort_order:Number(row.sort_order), new_tab:Boolean(row.new_tab), visible:Boolean(row.visible) })) } catch { return [] } }
export async function getFaqs(pageSlug = 'home'): Promise<CmsFaq[]> { try { const [result, figures] = await Promise.all([readContent({ sql: `SELECT f.* FROM faqs f LEFT JOIN pages p ON p.id=f.page_id WHERE f.active=1 AND (f.page_id IS NULL OR p.slug=?) ORDER BY f.sort_order`, args:[pageSlug] }), getSiteFigures()]); return fillDeep(result.rows.map((row) => ({ id:Number(row.id), category:String(row.category), question:String(row.question), answer:String(row.answer), sort_order:Number(row.sort_order) })), figures) } catch { return [] } }
// Same shape as /api/page-faqs: only FAQs explicitly assigned to this exact
// page (no page_id-is-null fallback), used by ServicePageTemplate to merge
// CMS-added questions into the single FAQ section the 9 static services render.
export async function getFaqsForSlug(pageSlug: string): Promise<CmsFaq[]> { try { const [result, figures] = await Promise.all([readContent({ sql: `SELECT f.id,f.category,f.question,f.answer,f.sort_order FROM faqs f JOIN pages p ON p.id=f.page_id WHERE f.active=1 AND p.slug=? ORDER BY f.sort_order,f.id`, args:[pageSlug] }), getSiteFigures()]); return fillDeep(result.rows.map((row) => ({ id:Number(row.id), category:String(row.category), question:String(row.question), answer:String(row.answer), sort_order:Number(row.sort_order) })), figures) } catch { return [] } }
// The custom content blocks an editor assigned to one page in the admin
// panel. Same rows, filters and ordering as /api/page-sections — that route
// serves every other page from the browser, this serves the 9 static service
// pages on the server so their blocks are in the HTML a crawler receives.
// The variable fields live in a JSON `content` column; the keys below are
// the ones the admin panel's block editor writes.
export async function getCustomSections(pageSlug: string): Promise<PageSection[]> {
  try {
    const [result, figures] = await Promise.all([readContent({
      sql: `SELECT s.id, s.name, s.content
            FROM page_sections s JOIN pages p ON p.id = s.page_id
            WHERE p.slug = ? AND s.section_type = 'custom'
              AND s.visible = 1 AND s.status = 'published'
            ORDER BY s.sort_order, s.id`,
      args: [pageSlug],
    }), getSiteFigures()])
    return result.rows
      .map((row) => {
        let content: Record<string, string> = {}
        try { content = fillDeep(JSON.parse(String(row.content ?? '{}')), figures) } catch { content = {} }
        return {
          id: Number(row.id),
          name: String(row.name ?? ''),
          heading: String(content.heading ?? ''),
          text: String(content.text ?? ''),
          image_url: String(content.image_url ?? ''),
          button_label: String(content.button_label ?? ''),
          button_link: String(content.button_link ?? ''),
          placement: content.placement === 'after_faq' ? 'after_faq' as const : 'before_faq' as const,
        }
      })
      .filter(hasContent)
  } catch { return [] }
}
export async function getTestimonials(): Promise<CmsReview[]> { try { const result=await readContent("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order"); return result.rows.map((row)=>({ id:Number(row.id), customer_name:String(row.customer_name), customer_role:String(row.customer_role), review_text:String(row.review_text), rating:Number(row.rating), image_url:String(row.image_url||''), image_alt:String(row.image_alt||''), source:String(row.source||''), featured:Number(row.featured)===1 })) } catch { return [] } }
export async function getTeam(): Promise<CmsTeamMember[]> { try { const result=await readContent(`SELECT * FROM team_members WHERE status='published' ORDER BY sort_order`); return result.rows.map((row)=>({id:Number(row.id),name:String(row.name),job_title:String(row.job_title),biography:String(row.biography),image_url:String(row.image_url||''),image_alt:String(row.image_alt||''),email:String(row.email||''),phone:String(row.phone||''),linkedin_url:String(row.linkedin_url||''),x_url:String(row.x_url||''),github_url:String(row.github_url||'')})) } catch { return [] } }
export async function getSection(pageSlug:string, type:string) { try { const [result, figures]=await Promise.all([readContent({sql:`SELECT s.content FROM page_sections s JOIN pages p ON p.id=s.page_id WHERE p.slug=? AND s.section_type=? AND s.visible=1 AND s.status='published' ORDER BY s.sort_order LIMIT 1`,args:[pageSlug,type]}), getSiteFigures()]); const value=result.rows[0]?.content; return typeof value==='string' ? fillDeep(JSON.parse(value) as Record<string,unknown>, figures) : null } catch { return null } }
export async function getPageMetadata(slug:string):Promise<Metadata|null> { try { const [result, figures]=await Promise.all([readContent({sql:"SELECT * FROM pages WHERE slug=? AND status='published' LIMIT 1",args:[slug]}), getSiteFigures()]); const row=result.rows[0]; if(!row)return null; const text=(value:unknown)=>fillFigures(String(value||''), figures); return { title:text(row.meta_title||row.name), description:text(row.meta_description), alternates:row.canonical_url?{canonical:String(row.canonical_url)}:undefined, robots:{index:Boolean(row.indexable),follow:Boolean(row.indexable)}, openGraph:{title:text(row.og_title||row.meta_title||row.name),description:text(row.og_description||row.meta_description),images:row.og_image?[String(row.og_image)]:undefined} } } catch{return null} }
// The extra columns come from an admin migration; until it has run, the
// banner is read without them rather than not at all.
export async function getPageHero(slug:string):Promise<PageHero|null>{
  const read=(columns:string)=>readContent({sql:`SELECT ${columns} FROM pages WHERE slug=? AND status='published' LIMIT 1`,args:[slug]})
  try{
    const [result, figures]=await Promise.all([read(`${HERO_COLUMNS},${HERO_EXTRA_COLUMNS}`).catch((error)=>{if(/no such column/i.test(String(error)))return read(HERO_COLUMNS);throw error}), getSiteFigures()])
    const row=result.rows[0];if(!row)return null
    return Object.fromEntries(Object.entries(row).map(([key,value])=>[key,fillFigures(String(value||''), figures)])) as PageHero
  }catch{return null}
}
export async function getCmsService(slug:string){try{const result=await readContent({sql:"SELECT * FROM services WHERE slug=? AND status='published' LIMIT 1",args:[slug]});return result.rows[0]??null}catch{return null}}
/**
 * Each service's name by page slug, from the admin's Services list (what the
 * home page tabs show), so the menu, footer and service pages all call a
 * service the same thing. A service not published there keeps its built-in
 * name from services-data.ts.
 */
export const getServiceNames = cache(async (): Promise<Map<string, string>> => {
  const names = new Map(builtInServices.map((service) => [service.slug, service.title]))
  try {
    const result = await readContent("SELECT slug, title FROM services WHERE status = 'published'")
    for (const row of result.rows) if (row.slug && String(row.title ?? '').trim()) names.set(String(row.slug), String(row.title).trim())
  } catch { /* the built-in names stand */ }
  return names
})
