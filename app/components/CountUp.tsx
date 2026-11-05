'use client'

import { useEffect, useRef } from 'react'
import { splitFigure } from '../lib/site-figures'

const DURATION = 1400

/**
 * A figure that counts up from `from` when it scrolls into view.
 *
 * One element, counted in place: its text is the final value in the HTML
 * the server sends, for search engines and anyone without JavaScript, and it
 * is the only copy of the number in the page text. The width is held by a
 * ::before holding the final value (globals.css .count-up), which takes up
 * space but is not text, so nothing beside or below moves while it counts.
 *
 * It only counts when the number starts off screen: one already in view
 * when the page loads stays as it is instead of jumping back to zero.
 * Reduced motion: no count at all.
 */
export default function CountUp({ value, from = 0 }: { value: string; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const parts = splitFigure(value)
    if (!el || !parts || parts.number <= from) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    const show = (n: number) => {
      el.textContent = `${parts.before}${n.toFixed(parts.decimals)}${parts.after}`
    }
    let frame = 0
    show(from)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION)
          const eased = 1 - (1 - progress) ** 3
          show(from + (parts.number - from) * eased)
          if (progress < 1) frame = requestAnimationFrame(tick)
          else el.textContent = value
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = value
    }
  }, [value, from])

  return (
    <span data-final={value} className="count-up inline-grid tabular-nums">
      <span ref={ref} className="[grid-area:1/1]">
        {value}
      </span>
    </span>
  )
}
