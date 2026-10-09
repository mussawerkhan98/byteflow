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

/**
 * How much of the letter's speed turns into squash and stretch, and the
 * ceiling on it. Kept small on purpose: the letter should read as slightly
 * soft, not as rubber.
 */
const JELLY = 0.009
const JELLY_MAX = 0.075
/** A little give under the finger, so picking a letter up feels like pressing. */
const PRESS = 0.022

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
 * Write a letter's position, with a squash along the way it is travelling.
 *
 * The letter stretches in the direction of motion and narrows across it, by
 * an amount taken from its own speed, which is what reads as jelly: it is
 * only soft while something is happening to it. The spring already overshoots
 * and comes back, so the wobble on release falls out of this for free rather
 * than needing an animation of its own.
 */
function paint(l: Letter) {
  const speed = Math.hypot(l.vx, l.vy)
  const squish = Math.min(speed * JELLY, JELLY_MAX) + (l.dragging ? PRESS : 0)
  const at = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0)`
  if (squish < 0.001) {
    l.el.style.transform = at
    return
  }
  // Rotate the stretch onto the line of travel, then take it back off, so a
  // letter thrown sideways squashes sideways and never ends up tilted.
  const deg = (Math.atan2(l.vy, l.vx) * 180) / Math.PI
  l.el.style.transform =
    `${at} rotate(${deg.toFixed(1)}deg) scale(${(1 + squish).toFixed(3)}, ${(1 - squish).toFixed(3)}) rotate(${(-deg).toFixed(1)}deg)`
}

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
    paint(l)
  }
  frame.current = moving ? requestAnimationFrame(() => step(letters, frame)) : null
}

type DragController = {
  start: (letter: Letter, event: React.PointerEvent) => void
  releaseAll: () => void
}

/**
 * Owns the one letter that is in the air, and the listeners that move it.
 *
 * Move and release are listened for on the window, not on the letter itself.
 * Relying on the letter to receive them is what stranded a letter in mid-air:
 * when the browser ends a gesture its own way — a right-click, an OS swipe, a
 * touch torn away — the release never arrives at the element, `dragging` is
 * never cleared, and a letter that is still "being dragged" is never sprung
 * home. `lostpointercapture` is no cure either; Chromium does not fire it
 * when capture is dropped while the pointer is still down. A release seen on
 * the window always ends the drag, whatever the browser did with the gesture.
 *
 * Built once per mount rather than per render, so the listeners it adds are
 * the same function objects it later removes.
 */
function createDragController(wake: () => void): DragController {
  let active: { letter: Letter; pointerId: number } | null = null

  const onMove = (event: PointerEvent) => {
    if (!active || event.pointerId !== active.pointerId) return
    const l = active.letter
    const nx = l.originX + (event.clientX - l.grabX)
    const ny = l.originY + (event.clientY - l.grabY)
    // Velocity for the throw comes from the movement of this frame, so a
    // quick flick travels further than a slow drag to the same place.
    l.vx = nx - l.x
    l.vy = ny - l.y
    l.x = nx
    l.y = ny
    paint(l)
  }

  // A declaration, not a const, so it can be named by `releaseAll` below
  // while still calling back into it.
  function onRelease(event: PointerEvent) {
    if (active && event.pointerId !== active.pointerId) return
    releaseAll()
    wake()
  }

  const releaseAll = () => {
    if (active) {
      active.letter.dragging = false
      // Take the press squash straight off. A letter tapped without being
      // moved is already home, so the spring has nothing to do and would
      // never repaint it, leaving it squashed until the next drag.
      paint(active.letter)
    }
    active = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onRelease)
    window.removeEventListener('pointercancel', onRelease)
  }

  const start = (letter: Letter, event: React.PointerEvent) => {
    // Only one letter travels at a time: a second finger takes over rather
    // than leaving the first one behind, still marked as dragging.
    releaseAll()
    event.preventDefault()
    active = { letter, pointerId: event.pointerId }
    letter.dragging = true
    letter.grabX = event.clientX
    letter.grabY = event.clientY
    letter.originX = letter.x
    letter.originY = letter.y
    letter.vx = 0
    letter.vy = 0
    paint(letter)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onRelease)
    window.addEventListener('pointercancel', onRelease)
    wake()
  }

  return { start, releaseAll }
}

export default function FooterWordmark() {
  const host = useRef<HTMLDivElement>(null)
  const letters = useRef<Letter[]>([])
  const frame = useRef<number | null>(null)
  const drag = useRef<DragController | null>(null)
  const reduced = useRef(false)

  useEffect(() => {
    const root = host.current
    if (!root) return
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    letters.current = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-letter]')).map((el) => ({
      el, x: 0, y: 0, vx: 0, vy: 0, dragging: false, grabX: 0, grabY: 0, originX: 0, originY: 0,
    }))

    const controller = createDragController(() => {
      if (frame.current === null) {
        frame.current = requestAnimationFrame(() => step(letters.current, frame))
      }
    })
    drag.current = controller

    // Letters rise into place the first time the footer is reached. Done with
    // a class rather than inline styles so the transition can be turned off
    // wholesale by the reduced-motion rules in globals.css.
    let io: IntersectionObserver | null = null
    if (!reduced.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            root.classList.add('wordmark-in')
            io?.disconnect()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(root)
    } else {
      root.classList.add('wordmark-in')
    }

    return () => {
      io?.disconnect()
      controller.releaseAll()
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [])

  const onPointerDown = (index: number) => (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced.current) return
    const letter = letters.current[index]
    if (letter) drag.current?.start(letter, event)
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
            className="footer-wordmark-letter"
            // The stagger travels as a custom property, NOT as transitionDelay.
            // transition-property defaults to `all`, so a delay set here applies
            // to the transform the drag writes too: every frame of a drag was
            // held back by up to 385ms, and the letter lagged behind the pointer.
            style={{ '--stagger': `${i * 55}ms` } as React.CSSProperties}
          >
            <span className={i >= ACCENT_FROM ? 'footer-wordmark-accent' : undefined}>{char}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">Byteflow</span>
    </div>
  )
}
