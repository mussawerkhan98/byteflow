'use client'

/**
 * The oversized BYTEFLOW wordmark that closes the footer.
 *
 * Each letter can be picked up and thrown, and springs back to its place when
 * released. The whole thing is decoration, so it is hidden from assistive
 * technology and replaced by a plain text name; nothing here is the only way
 * to reach anything.
 *
 * The animation loop only runs while a letter is away from home, so a footer
 * sitting untouched at the bottom of the page costs nothing.
 */

import { useEffect, useRef } from 'react'

const WORD = 'BYTEFLOW'
/** The last letter carries the brand gradient, the rest are the page's own ink. */
const ACCENT_FROM = WORD.length - 1

/** Spring constants, tuned so a thrown letter settles in well under a second. */
const STIFFNESS = 0.12
const DAMPING = 0.78
/** Below this, the letter is close enough to home to stop animating. */
const AT_REST = 0.08

type Letter = {
  el: HTMLSpanElement
  x: number
  y: number
  vx: number
  vy: number
  dragging: boolean
  /** Pointer position when the drag began, so the letter does not jump. */
  grabX: number
  grabY: number
  originX: number
  originY: number
}

type Loop = { current: number | null }

/**
 * One tick of the spring, for every letter that is not already home.
 *
 * Lives outside the component because it schedules itself and closes over
 * nothing that changes between renders: it is given the two refs it needs.
 * The loop stops as soon as every letter is at rest, so an untouched footer
 * costs no frames at all.
 */
function step(letters: Letter[], frame: Loop) {
  let moving = false
  for (const l of letters) {
    if (l.dragging) {
      moving = true
    } else if (Math.abs(l.x) > AT_REST || Math.abs(l.y) > AT_REST || Math.abs(l.vx) > AT_REST || Math.abs(l.vy) > AT_REST) {
      l.vx = (l.vx - l.x * STIFFNESS) * DAMPING
      l.vy = (l.vy - l.y * STIFFNESS) * DAMPING
      l.x += l.vx
      l.y += l.vy
      moving = true
    } else if (l.x !== 0 || l.y !== 0) {
      // Settle exactly on zero rather than leaving a fractional offset
      // behind, which would keep the loop alive forever.
      l.x = 0
      l.y = 0
      l.vx = 0
      l.vy = 0
    } else {
      continue
    }
    l.el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0)`
  }
  frame.current = moving ? requestAnimationFrame(() => step(letters, frame)) : null
}

export default function FooterWordmark() {
  const host = useRef<HTMLDivElement>(null)
  const letters = useRef<Letter[]>([])
  const frame = useRef<number | null>(null)
  const reduced = useRef(false)

  const wake = () => {
    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => step(letters.current, frame))
    }
  }

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = host.current
    if (!root) return
    letters.current = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-letter]')).map((el) => ({
      el, x: 0, y: 0, vx: 0, vy: 0, dragging: false, grabX: 0, grabY: 0, originX: 0, originY: 0,
    }))

    // Letters rise into place the first time the footer is reached. Done with
    // a class rather than inline styles so the transition can be turned off
    // wholesale by the reduced-motion rules in globals.css.
    if (!reduced.current && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            root.classList.add('wordmark-in')
            io.disconnect()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(root)
      return () => io.disconnect()
    }
    root.classList.add('wordmark-in')
  }, [])

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  const onPointerDown = (index: number) => (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced.current) return
    const l = letters.current[index]
    if (!l) return
    // Keep the letter under the finger that grabbed it even if the pointer
    // leaves the element, and stop the gesture turning into a text selection.
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    l.dragging = true
    l.grabX = event.clientX
    l.grabY = event.clientY
    l.originX = l.x
    l.originY = l.y
    l.vx = 0
    l.vy = 0
    wake()
  }

  const onPointerMove = (index: number) => (event: React.PointerEvent<HTMLSpanElement>) => {
    const l = letters.current[index]
    if (!l?.dragging) return
    const nx = l.originX + (event.clientX - l.grabX)
    const ny = l.originY + (event.clientY - l.grabY)
    // Velocity for the throw comes from the movement of this frame, so a
    // quick flick travels further than a slow drag to the same place.
    l.vx = nx - l.x
    l.vy = ny - l.y
    l.x = nx
    l.y = ny
    l.el.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0)`
  }

  const onPointerUp = (index: number) => () => {
    const l = letters.current[index]
    if (!l) return
    l.dragging = false
    wake()
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 pb-4 select-none">
      <div
        ref={host}
        aria-hidden="true"
        className="footer-wordmark max-w-page mx-auto flex justify-center items-end leading-none"
      >
        {WORD.split('').map((char, i) => (
          <span
            key={`${char}-${i}`}
            data-letter
            onPointerDown={onPointerDown(i)}
            onPointerMove={onPointerMove(i)}
            onPointerUp={onPointerUp(i)}
            onPointerCancel={onPointerUp(i)}
            className="footer-wordmark-letter"
            style={{ transitionDelay: `${i * 55}ms` }}
          >
            <span className={i >= ACCENT_FROM ? 'footer-wordmark-accent' : undefined}>{char}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">Byteflow</span>
    </div>
  )
}
