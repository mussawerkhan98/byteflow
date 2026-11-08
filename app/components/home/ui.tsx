import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import type { PhotoSlot } from '../../lib/home-photos'

/**
 * Building blocks shared by the home page sections (app/components/home).
 * The look lives in globals.css under "Home page"; these keep the markup of
 * headings, buttons and photos the same in every section.
 */

/** Delay for a staggered reveal, as the --d custom property. */
export const delay = (ms: number) => ({ '--d': `${Math.round(ms * 1.5)}ms` }) as CSSProperties

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`hp-eyebrow ${className}`}>{children}</p>
}

/** A section's h2: the heading, then its softer second line. */
export function SectionTitle({
  id,
  heading,
  soft,
  className = '',
  softBlock = false,
}: {
  id?: string
  heading: string
  soft?: string
  className?: string
  /** Put the soft line on its own line. */
  softBlock?: boolean
}) {
  return (
    <h2 id={id} className={`hp-h2 ${className}`}>
      {heading}
      {soft && (
        <>
          {' '}
          <span className={`hp-h2-soft ${softBlock ? 'block' : ''}`}>{soft}</span>
        </>
      )}
    </h2>
  )
}

export function ArrowRight({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
      <path d="M2.5 8h11m-4-4.5L14 8l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Check({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'light'
  className?: string
  external?: boolean
}

/** A pill button with an arrow that moves on hover. */
export function Button({ href, children, variant = 'primary', className = '', external }: ButtonProps) {
  const inner = (
    <>
      <span>{children}</span>
      <span aria-hidden="true" className="hp-btn-arrow">
        <ArrowRight className="h-4 w-4" />
      </span>
    </>
  )
  const cls = `hp-btn hp-btn-${variant} group ${className}`
  if (external || /^(https?:|tel:|mailto:)/.test(href))
    return (
      <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

/** A text link with an arrow, for "Explore …" and "View all …". */
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`hp-textlink group ${className}`}>
      {children}
      <ArrowRight className="hp-arrow h-4 w-4" />
    </Link>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <path
        d="M3 8.25A2.25 2.25 0 015.25 6h1.6a1.5 1.5 0 001.24-.66l.82-1.18A1.5 1.5 0 0110.15 3.5h3.7a1.5 1.5 0 011.24.66l.82 1.18a1.5 1.5 0 001.24.66h1.6A2.25 2.25 0 0121 8.25v9.5A2.25 2.25 0 0118.75 20H5.25A2.25 2.25 0 013 17.75v-9.5z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.75" r="3.75" />
    </svg>
  )
}

/**
 * A photo, or until one is chosen (home-photos.ts) a placeholder naming the
 * shot it is waiting for. It fills its parent, which sets the size and shape.
 * `zoom` lets a hovered card (`group`) ease the picture forward a little.
 */
export function Photo({
  slot,
  sizes,
  priority = false,
  zoom = false,
  mini = false,
}: {
  slot: PhotoSlot
  sizes: string
  priority?: boolean
  zoom?: boolean
  /** A thumbnail: just the icon, no wording. */
  mini?: boolean
}) {
  if (slot.src)
    return (
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        {...(priority ? { preload: true, fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
        className={`object-cover ${zoom ? 'hp-zoom' : ''}`}
      />
    )
  return (
    <div aria-hidden="true" className={`hp-ph ${zoom ? 'hp-zoom' : ''} ${mini ? 'hp-ph-mini' : ''}`}>
      <span className="hp-ph-icon">
        <CameraIcon className={mini ? 'h-5 w-5' : 'h-6 w-6'} />
      </span>
      {!mini && (
        <>
          <span className="hp-ph-label">Image placeholder</span>
          <span className="hp-ph-brief">{slot.brief}</span>
        </>
      )}
    </div>
  )
}
