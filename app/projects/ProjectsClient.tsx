'use client'

import { useState } from 'react'
import Link from 'next/link'

export type UiProject = {
  slug: string
  client: string
  industry: string
  category: string
  year: string
  title: string
  story: string
  deliverables: string[]
  metrics: { value: string; label: string }[]
  tags: string[]
  featured: boolean
  image: string
  visual: string
}

export const CATEGORIES = [
  'All',
  'IT Support',
  'Cyber Security',
  'Cloud Services',
  'Web & Apps',
  'Digital Marketing',
  'System Integration',
  'UI/UX Design',
]

function ImagePlaceholder({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center gap-3 ${className ?? 'h-44'}`}
      style={{
        background: 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, var(--bg-surface-alt) 100%)',
        border: '1px dashed rgba(44,205,222,0.18)',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
        style={{ display: 'block' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
      <svg className="w-9 h-9 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: 'rgba(44,205,222,0.25)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <span className="relative z-10 text-[10px] font-medium tracking-wide" style={{ color: 'rgba(44,205,222,0.2)' }}>{alt}</span>
    </div>
  )
}

function Visual({ type, className }: { type: string; className?: string }) {
  const base = `relative w-full overflow-hidden rounded-xl ${className ?? 'h-44'}`
  if (type === 'it') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(44,205,222,0.13) 0%, rgba(44,205,222,0.03) 55%, var(--bg-page) 100%)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(44,205,222,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(44,205,222,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {([[22,24,28],[57,17,18],[42,55,22],[73,62,13],[31,73,11]] as [number,number,number][]).map(([x,y,s],i) => (
        <div key={i} className="absolute rounded-full" style={{ left:`${x}%`, top:`${y}%`, width:s, height:s, background:'rgba(44,205,222,0.11)', border:'1px solid rgba(44,205,222,0.38)', transform:'translate(-50%,-50%)' }} />
      ))}
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(44,205,222,0.28)' }}>IT / NETWORK</span></div>
    </div>
  )
  if (type === 'cyber') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(220,40,70,0.06) 0%, rgba(44,205,222,0.09) 60%, var(--bg-page) 100%)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(60deg, rgba(44,205,222,0.04) 0, rgba(44,205,222,0.04) 1px, transparent 1px, transparent 26px)', backgroundSize: '30px 52px' }} />
      <div className="absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]">
        <svg width="68" height="80" viewBox="0 0 68 80" fill="none"><path d="M34 3L5 14v22c0 17.5 12 32.5 29 37 17-4.5 29-19.5 29-37V14L34 3z" fill="rgba(44,205,222,0.5)" stroke="rgba(44,205,222,0.8)" strokeWidth="1.5" /></svg>
      </div>
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(44,205,222,0.28)' }}>SECURITY</span></div>
    </div>
  )
  if (type === 'web') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(70,163,225,0.13) 0%, rgba(44,205,222,0.04) 60%, var(--bg-page) 100%)' }}>
      {([[14,55,40],[22,65,30],[30,45,60],[38,68,22],[46,52,50],[54,72,35],[62,42,65]] as [number,number,number][]).map(([top,left,width],i) => (
        <div key={i} className="absolute h-[2px] rounded-full" style={{ top:`${top}%`, left:`${left*0.14}%`, width:`${width*0.55}%`, background:`rgba(70,163,225,${0.1+(i%3)*0.05})` }} />
      ))}
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(70,163,225,0.28)' }}>WEB / DEV</span></div>
    </div>
  )
  if (type === 'cloud') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(44,205,222,0.07) 0%, rgba(70,163,225,0.13) 55%, var(--bg-page) 100%)' }}>
      <div className="absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-[60%] opacity-[0.12]">
        <svg width="100" height="68" viewBox="0 0 100 68" fill="none"><path d="M75 44H22A18 18 0 1122 8a18 18 0 0133-4 22 22 0 1120 40z" fill="rgba(44,205,222,0.5)" /></svg>
      </div>
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(44,205,222,0.28)' }}>CLOUD</span></div>
    </div>
  )
  if (type === 'marketing') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(44,205,222,0.09) 0%, rgba(70,163,225,0.09) 55%, var(--bg-page) 100%)' }}>
      {([36,52,42,68,50,78,64] as number[]).map((h,i) => (
        <div key={i} className="absolute bottom-10 rounded-t" style={{ left:`${11+i*11.5}%`, width:'7%', height:`${h*0.55}%`, background:`rgba(44,205,222,${0.1+i*0.04})`, border:'1px solid rgba(44,205,222,0.22)' }} />
      ))}
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(44,205,222,0.28)' }}>MARKETING</span></div>
    </div>
  )
  if (type === 'integration') return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(44,205,222,0.09) 0%, rgba(70,163,225,0.07) 55%, var(--bg-page) 100%)' }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {[[16,25,48,20],[48,20,78,30],[22,60,52,65],[52,65,80,62],[16,25,22,60],[48,20,52,65],[78,30,80,62]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="rgba(44,205,222,0.15)" strokeWidth="1" />
        ))}
      </svg>
      {([[16,25],[48,20],[78,30],[22,60],[52,65],[80,62]] as [number,number][]).map(([x,y],i) => (
        <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left:`${x}%`, top:`${y}%`, background:'rgba(44,205,222,0.45)', transform:'translate(-50%,-50%)' }} />
      ))}
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(44,205,222,0.28)' }}>INTEGRATION</span></div>
    </div>
  )
  return (
    <div className={base} style={{ background: 'linear-gradient(145deg, rgba(70,163,225,0.11) 0%, rgba(44,205,222,0.07) 55%, var(--bg-page) 100%)' }}>
      {([80,60,42,24] as number[]).map((size,i) => (
        <div key={i} className="absolute rounded-full" style={{ width:size, height:size, top:'50%', left:'35%', transform:'translate(-50%,-50%)', border:`1px solid rgba(44,205,222,${0.08+i*0.07})` }} />
      ))}
      <div className="absolute bottom-3 left-4"><span className="text-[9px] font-mono tracking-[0.2em]" style={{ color:'rgba(70,163,225,0.28)' }}>DESIGN</span></div>
    </div>
  )
}

function FeaturedCard({ project }: { project: UiProject }) {
  return (
    <Link href={`/projects/${project.slug}`} className="relative rounded-2xl overflow-hidden block transition-all duration-300 hover:border-[rgba(44,205,222,0.35)]"
      style={{ background:'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, rgba(70,163,225,0.03) 35%, var(--bg-surface) 100%)', border:'1px solid rgba(44,205,222,0.2)' }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background:'linear-gradient(90deg, transparent, rgba(44,205,222,0.5), transparent)' }} />
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 p-5">
          <ImagePlaceholder src={project.image} alt={project.client || project.title} className="h-56 lg:h-full min-h-[280px]" />
        </div>
        <div className="lg:col-span-3 p-7 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color:'#2CCDDE' }}>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#2CCDDE] opacity-40" />
              <span className="text-[var(--text-muted)] text-xs">{project.industry}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-40" />
              <span className="text-[var(--text-muted)] text-xs">{project.year}</span>
            </div>
            <h2 className="text-[var(--text-primary)] text-xl sm:text-2xl font-bold leading-snug mb-4">{project.title}</h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">{project.story}</p>
            {project.deliverables.length > 0 && (
              <ul className="flex flex-col gap-2">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#2CCDDE', opacity:0.7 }} />{d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {project.metrics.length > 0 && (
              <div className="flex items-start gap-8 py-5 mb-5" style={{ borderTop:'1px solid var(--overlay-hover)', borderBottom:'1px solid var(--overlay-hover)' }}>
                {project.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-2xl font-black leading-none" style={{ background:'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{m.value}</span>
                    <span className="text-[var(--text-muted)] text-xs mt-1 leading-tight">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background:'rgba(44,205,222,0.07)', border:'1px solid rgba(44,205,222,0.18)', color:'var(--text-muted)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProjectCard({ project }: { project: UiProject }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:border-[rgba(44,205,222,0.3)]"
      style={{ background:'linear-gradient(160deg, rgba(44,205,222,0.05) 0%, rgba(70,163,225,0.02) 30%, var(--bg-surface) 100%)', border:'1px solid rgba(44,205,222,0.12)' }}>
      <div className="p-4 pb-0">
        <ImagePlaceholder src={project.image} alt={project.client || project.title} className="h-44" />
      </div>
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color:'#2CCDDE' }}>{project.category}</span>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] text-xs">{project.industry}</span>
            <span className="text-[var(--text-muted)] text-xs opacity-50">/</span>
            <span className="text-[var(--text-muted)] text-xs">{project.year}</span>
          </div>
        </div>
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold leading-snug">{project.title}</h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1">{project.story}</p>
        {project.metrics.length > 0 && (
          <div className="flex items-start justify-between gap-3 py-4" style={{ borderTop:'1px solid var(--overlay-hover)', borderBottom:'1px solid var(--overlay-hover)' }}>
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col">
                <span className="text-xl font-black leading-none" style={{ background:'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{m.value}</span>
                <span className="text-[var(--text-muted)] text-[10px] mt-1 leading-tight">{m.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background:'rgba(44,205,222,0.06)', border:'1px solid rgba(44,205,222,0.15)', color:'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function ProjectsClient({ projects }: { projects: UiProject[] }) {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)
  const featured = filtered.find((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured)

  return (
    <div>
      {/* Header */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">Our Work</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="text-[var(--text-primary)]">Projects that</span><br />
                <span style={{ background:'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>moved the needle</span>
              </h1>
              <p className="text-[var(--text-muted)] mt-4 text-base max-w-md leading-relaxed">Real work, real clients, real numbers. Every project on this page has a name attached to it.</p>
            </div>
            <div className="flex items-center gap-8 px-7 py-5 rounded-2xl flex-shrink-0 self-start"
              style={{ background:'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, var(--bg-surface) 100%)', border:'1px solid rgba(44,205,222,0.15)' }}>
              {[['500+','Clients served'],['8+','Years operating'],['24/7','Support, always']].map(([v,l]) => (
                <div key={l} className="flex flex-col items-center">
                  <span className="text-xl font-black text-[var(--text-primary)] leading-none">{v}</span>
                  <span className="text-[var(--text-muted)] text-[10px] mt-1 whitespace-nowrap">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={active === cat
                  ? { background:'linear-gradient(135deg, #2CCDDE, #46A3E1)', color:'#000' }
                  : { background:'rgba(44,205,222,0.06)', border:'1px solid rgba(44,205,222,0.16)', color:'var(--text-muted)' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {featured && <div className="relative"><FeaturedCard project={featured} /></div>}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[var(--text-muted)] text-sm">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{ background:'linear-gradient(135deg, rgba(44,205,222,0.09) 0%, rgba(70,163,225,0.05) 50%, var(--bg-surface) 100%)', border:'1px solid rgba(44,205,222,0.18)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)' }} />
            <div>
              <p className="text-[var(--text-primary)] text-xl font-bold mb-2">Have a project in mind?</p>
              <p className="text-[var(--text-muted)] text-sm max-w-sm">Tell us what you are trying to achieve and we will come back to you with a plan, not a sales pitch.</p>
            </div>
            <a href="/contact-us" className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-black text-sm font-bold flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
              style={{ background:'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}>
              Start a conversation
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
