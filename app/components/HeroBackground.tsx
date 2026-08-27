'use client'

import { useEffect, useRef } from 'react'

const CYAN_DARK = '44,205,222'
const BLUE_DARK = '70,163,225'
// Deeper, more saturated tones so the mesh holds contrast against a light/white background.
const CYAN_LIGHT = '8,145,178'
const BLUE_LIGHT = '29,78,216'

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let theme: 'dark' | 'light' = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    const themeObserver = new MutationObserver(() => {
      theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = width + 'px'
      canvas!.style.height = height + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // A full-bleed grid of intersection points, warped by a slow flowing
    // wave field so the straight rows/columns bend into smooth, continuous
    // wavy contours — like a fabric of lines rippling — rather than the
    // grid ever appearing as straight rulings.
    const cellsX = 34
    const cellsY = 34

    // sin/cos are naturally periodic, so the warp never resets or jumps —
    // it flows forever without a visible loop point.
    function warp(nx: number, ny: number, t: number) {
      const a1 = nx * 5.2 + ny * 3.1 + t * 0.7
      const a2 = nx * 3.4 - ny * 4.6 + t * 0.5
      const dx = (Math.sin(a1) * 0.6 + Math.sin(a2 * 1.6) * 0.4)
      const dy = (Math.cos(a1 * 0.85) * 0.6 + Math.cos(a2 * 1.3) * 0.4)
      return { dx, dy }
    }

    let raf = 0
    let frame = 0

    function pointAt(i: number, j: number, t: number, cellW: number, cellH: number) {
      const nx = i / cellsX
      const ny = j / cellsY
      const { dx, dy } = warp(nx, ny, t)
      return {
        x: i * cellW + dx * cellW * 0.85,
        y: j * cellH + dy * cellH * 0.85,
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      const isLight = theme === 'light'
      const cyan = isLight ? CYAN_LIGHT : CYAN_DARK
      const blue = isLight ? BLUE_LIGHT : BLUE_DARK
      const lineAlpha = isLight ? 0.4 : 0.32

      const t = frame * 0.003
      const cellW = width / cellsX
      const cellH = height / cellsY

      ctx!.lineWidth = 1

      // Horizontal strands.
      for (let j = 0; j <= cellsY; j++) {
        ctx!.strokeStyle = `rgba(${j % 3 === 0 ? blue : cyan},${lineAlpha})`
        ctx!.beginPath()
        for (let i = 0; i <= cellsX; i++) {
          const p = pointAt(i, j, t, cellW, cellH)
          if (i === 0) ctx!.moveTo(p.x, p.y)
          else ctx!.lineTo(p.x, p.y)
        }
        ctx!.stroke()
      }

      // Vertical strands.
      for (let i = 0; i <= cellsX; i++) {
        ctx!.strokeStyle = `rgba(${i % 3 === 0 ? blue : cyan},${lineAlpha})`
        ctx!.beginPath()
        for (let j = 0; j <= cellsY; j++) {
          const p = pointAt(i, j, t, cellW, cellH)
          if (j === 0) ctx!.moveTo(p.x, p.y)
          else ctx!.lineTo(p.x, p.y)
        }
        ctx!.stroke()
      }

      frame++
      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
