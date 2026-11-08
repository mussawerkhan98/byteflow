'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The home page's motion, all in one small client component:
 *
 * - Elements marked data-reveal fade up as they come into view, once. The
 *   hiding is switched on here (the hp-js class), so without JavaScript
 *   everything is simply shown. Reduced motion skips it in the CSS.
 * - A thin brand-coloured bar along the top shows how far down the page is.
 * - A back-to-top button appears after the first screen.
 */
export default function HomeMotion() {
  const bar = useRef<HTMLDivElement>(null)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const root = document.querySelector('.hp')
    if (!root) return
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

    // Anything already on screen is marked shown before hiding starts, so the
    // first screen never blinks.
    const vh = window.innerHeight
    for (const el of targets) {
      const box = el.getBoundingClientRect()
      if (box.top < vh * 0.92 && box.bottom > 0) el.setAttribute('data-shown', '')
    }
    root.classList.add('hp-js')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-shown', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    for (const el of targets) if (!el.hasAttribute('data-shown')) observer.observe(el)

    // Elements that arrive later (content re-rendered after load, or a hot
    // reload while developing) are watched too, so none stays hidden.
    // Observing an element twice is harmless.
    let pending = 0
    const watchNew = new MutationObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])').forEach((el) => observer.observe(el))
      })
    })
    watchNew.observe(root, { childList: true, subtree: true })

    // A safety net beside the observer: on each scroll, anything still hidden
    // that has reached the screen is shown, so nothing can stay invisible.
    const showVisible = () => {
      const height = window.innerHeight
      root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])').forEach((el) => {
        const box = el.getBoundingClientRect()
        if (box.top < height * 0.95 && box.bottom > 0) el.setAttribute('data-shown', '')
      })
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        showVisible()
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
        bar.current?.style.setProperty('--p', String(progress))
        setShowTop(window.scrollY > window.innerHeight)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      observer.disconnect()
      watchNew.disconnect()
      cancelAnimationFrame(pending)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.classList.remove('hp-js')
    }
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <>
      <div ref={bar} aria-hidden="true" className="hp-progress" />
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`hp-totop ${showTop ? 'is-on' : ''}`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  )
}
