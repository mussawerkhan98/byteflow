'use client'

import { useEffect, useRef } from 'react'

const CYAN_DARK = '44,205,222'
const BLUE_DARK = '70,163,225'
// Deeper, more saturated tones so the network holds contrast against a light/white background.
const CYAN_LIGHT = '8,145,178'
const BLUE_LIGHT = '29,78,216'

type Node = { x: number; y: number; vx: number; vy: number; r: number; isBlue: boolean }

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
    let nodes: Node[] = []

    function makeNodes() {
      const count = Math.min(140, Math.max(55, Math.round((width * height) / 9000)))
      nodes = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.12 + Math.random() * 0.22
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 1.3 + 0.9,
          isBlue: Math.random() > 0.72,
        }
      })
    }

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
      makeNodes()
    }
    resize()
    window.addEventListener('resize', resize)

    // Cursor tracking — nearby neurons light up and reach toward wherever
    // the pointer last was, eased so it feels alive rather than mechanical.
    let targetX = -9999
    let targetY = -9999
    let cursorX = -9999
    let cursorY = -9999

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    }
    function onPointerLeave() {
      targetX = -9999
      targetY = -9999
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    const linkDistance = 130
    const cursorLinkDistance = 190
    const cursorPull = 0.0022

    let raf = 0

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      cursorX += (targetX - cursorX) * 0.1
      cursorY += (targetY - cursorY) * 0.1

      const isLight = theme === 'light'
      const cyan = isLight ? CYAN_LIGHT : CYAN_DARK
      const blue = isLight ? BLUE_LIGHT : BLUE_DARK
      const linkAlpha = isLight ? 0.35 : 0.28
      const nodeAlpha = isLight ? 0.6 : 0.7

      // Drift each neuron slowly and wrap it around the edges so the
      // network flows forever with no visible reset.
      for (const n of nodes) {
        const distX = cursorX - n.x
        const distY = cursorY - n.y
        const dist = Math.sqrt(distX * distX + distY * distY)
        if (dist < cursorLinkDistance) {
          n.vx += distX * cursorPull * (1 - dist / cursorLinkDistance)
          n.vy += distY * cursorPull * (1 - dist / cursorLinkDistance)
        }
        n.vx *= 0.985
        n.vy *= 0.985
        n.x += n.vx
        n.y += n.vy
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20
      }

      // Neuron-style connective web: link any two nodes close enough, fading
      // out with distance.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist >= linkDistance) continue
          const alpha = (1 - dist / linkDistance) * linkAlpha
          ctx!.strokeStyle = `rgba(${a.isBlue || b.isBlue ? blue : cyan},${alpha})`
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }

        // Reach toward the cursor, like a synapse firing.
        const distX = cursorX - a.x
        const distY = cursorY - a.y
        const dist = Math.sqrt(distX * distX + distY * distY)
        if (dist < cursorLinkDistance) {
          const alpha = (1 - dist / cursorLinkDistance) * (linkAlpha + 0.25)
          ctx!.strokeStyle = `rgba(${a.isBlue ? blue : cyan},${alpha})`
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(cursorX, cursorY)
          ctx!.stroke()
        }
      }

      // Glowing neuron nodes on top of the web.
      for (const n of nodes) {
        const color = n.isBlue ? blue : cyan
        ctx!.shadowBlur = 4
        ctx!.shadowColor = `rgba(${color},0.6)`
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${color},${nodeAlpha})`
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0

      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      themeObserver.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
