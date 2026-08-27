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
    // wave field so the rows/columns bend into smooth, continuous wavy
    // contours — each point rendered as a binary digit riding the wave
    // instead of a connecting line.
    const cellsX = 22
    const cellsY = 22
    const digits: { char: '0' | '1'; isBlue: boolean }[] = []
    for (let j = 0; j <= cellsY; j++) {
      for (let i = 0; i <= cellsX; i++) {
        digits.push({ char: Math.random() > 0.5 ? '1' : '0', isBlue: Math.random() > 0.72 })
      }
    }

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
      const digitAlpha = isLight ? 0.45 : 0.38

      const t = frame * 0.003
      const cellW = width / cellsX
      const cellH = height / cellsY
      const fontSize = Math.min(cellW, cellH) * 0.6

      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.font = `600 ${fontSize}px 'Space Mono', 'Courier New', monospace`

      let k = 0
      for (let j = 0; j <= cellsY; j++) {
        for (let i = 0; i <= cellsX; i++) {
          const p = pointAt(i, j, t, cellW, cellH)
          const dgt = digits[k++]
          ctx!.fillStyle = `rgba(${dgt.isBlue ? blue : cyan},${digitAlpha})`
          ctx!.fillText(dgt.char, p.x, p.y)
        }
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
