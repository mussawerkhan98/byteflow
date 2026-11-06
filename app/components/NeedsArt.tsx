// Small illustrated scenes for the "Where does your IT need help?" cards,
// picked by the linked service's slug. Decorative: the card's words carry the
// meaning. Motion is in globals.css (needs-art) and stops with reduced motion.

const NAVY = '#0f1b27'
const CYAN = '#2CCDDE'
const LINE = '#cfe2e7'

/** A round device on the plan, with a small glyph inside. */
function Node({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="13" fill="#fff" stroke={CYAN} strokeWidth="1.5" />
      <g stroke={NAVY} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </g>
  )
}

/** Moving into or opening an office: a floor plan wired to one hub. */
function OfficeScene() {
  const hub = { x: 168, y: 122 }
  const nodes = [
    { x: 74, y: 64, glyph: <><rect x="-6" y="-4.5" width="12" height="8" rx="1" /><path d="M-7.5 5.5h15" /></> },
    { x: 262, y: 56, glyph: <><rect x="-6" y="-3.5" width="9" height="7" rx="1.5" /><path d="M3 -1.5l4 -2v7l-4 -2" /></> },
    { x: 70, y: 158, glyph: <><rect x="-6" y="-3.5" width="9" height="7" rx="1.5" /><path d="M3 -1.5l4 -2v7l-4 -2" /></> },
    { x: 262, y: 156, glyph: <><rect x="-4.5" y="-6" width="9" height="12" rx="1.5" /><path d="M-2 -2.5h4M-2 1h4" /></> },
  ]
  return (
    <>
      <rect x="30" y="22" width="260" height="158" rx="16" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <path d={`M150 22v70M150 92h-46M196 108h94M196 108v72`} stroke={LINE} strokeWidth="1.5" fill="none" />
      {/* Desks and a meeting table. */}
      <rect x="48" y="38" width="44" height="12" rx="3" fill="#e6f7f9" />
      <rect x="104" y="38" width="32" height="12" rx="3" fill="#e6f7f9" />
      <rect x="216" y="128" width="54" height="30" rx="8" fill="#e6f7f9" />
      <rect x="174" y="40" width="40" height="10" rx="3" fill="#e6f7f9" />
      <rect x="226" y="80" width="46" height="10" rx="3" fill="#e6f7f9" />

      {nodes.map((node) => (
        <path key={`${node.x}-${node.y}`} className="art-flow" d={`M${hub.x} ${hub.y} L${node.x} ${node.y}`} stroke={CYAN} strokeWidth="1.5" fill="none" />
      ))}
      {nodes.map((node) => (
        <Node key={`n-${node.x}-${node.y}`} x={node.x} y={node.y}>
          {node.glyph}
        </Node>
      ))}

      {/* The hub, sending Wi-Fi. */}
      <circle className="art-pulse" cx={hub.x} cy={hub.y} r="17" fill={CYAN} opacity="0.5" />
      <circle cx={hub.x} cy={hub.y} r="17" fill={NAVY} />
      <g stroke={CYAN} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d={`M${hub.x - 7} ${hub.y - 1}a10 10 0 0 1 14 0`} />
        <path d={`M${hub.x - 3.5} ${hub.y + 3}a5 5 0 0 1 7 0`} />
      </g>
      <circle cx={hub.x} cy={hub.y + 7} r="1.6" fill={CYAN} />
    </>
  )
}

/** Ransomware or data loss: a shield guarding mail, laptops and backups. */
function SecurityScene() {
  const c = { x: 160, y: 102 }
  return (
    <>
      <circle className="art-spin" cx={c.x} cy={c.y} r="72" fill="none" stroke={CYAN} strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
      <circle cx={c.x} cy={c.y} r="50" fill="#e6f7f9" />

      {/* Protected: mail, a laptop, the backups. */}
      <path className="art-flow" d={`M${c.x} ${c.y} L96 50 M${c.x} ${c.y} L232 52 M${c.x} ${c.y} L238 156`} stroke={CYAN} strokeWidth="1.5" fill="none" />
      <Node x={96} y={50}>
        <rect x="-6.5" y="-4.5" width="13" height="9" rx="1.5" />
        <path d="M-6 -3.5l6 4.5 6 -4.5" />
      </Node>
      <Node x={232} y={52}>
        <rect x="-6" y="-4.5" width="12" height="8" rx="1" />
        <path d="M-7.5 5.5h15" />
      </Node>
      <Node x={238} y={156}>
        <ellipse cx="0" cy="-4" rx="6" ry="2.5" />
        <path d="M-6 -4v8c0 1.4 2.7 2.5 6 2.5s6 -1.1 6 -2.5v-8M-6 0c0 1.4 2.7 2.5 6 2.5s6 -1.1 6 -2.5" />
      </Node>

      {/* A threat, stopped short of the shield. */}
      <path d="M80 152 L112 132" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
      <g transform="translate(80 156)">
        <circle r="12" fill="#fff1f1" stroke="#f87171" strokeWidth="1.5" />
        <path d="M-4 -4l8 8M4 -4l-8 8" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <path d="M110 126l8 8M118 126l-8 8" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />

      <circle className="art-pulse" cx={c.x} cy={c.y} r="30" fill={CYAN} opacity="0.4" />
      <path
        d={`M${c.x} ${c.y - 36}l30 11v23c0 21 -13 35 -30 42c-17 -7 -30 -21 -30 -42v-23z`}
        fill={NAVY}
      />
      <path d={`M${c.x - 11} ${c.y + 1}l8 8 15 -16`} stroke={CYAN} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

/** A better website and more leads: a site with its enquiries climbing. */
function WebScene() {
  const chart = 'M58 150 L92 138 L124 142 L156 118 L188 106 L220 78'
  return (
    // Moved right and down, clear of the card's number badge.
    <g transform="translate(12 6)">
      <defs>
        <linearGradient id="needs-art-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.28" />
          <stop offset="1" stopColor={CYAN} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="34" y="22" width="214" height="152" rx="14" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <path d="M34 46h214" stroke={LINE} strokeWidth="1.5" />
      <circle cx="50" cy="34" r="3.5" fill="#f87171" />
      <circle cx="62" cy="34" r="3.5" fill="#fbbf24" />
      <circle cx="74" cy="34" r="3.5" fill="#34d399" />
      <rect x="92" y="29" width="120" height="10" rx="5" fill="#eef4f6" />
      <rect x="52" y="60" width="88" height="9" rx="3" fill={NAVY} />
      <rect x="52" y="75" width="62" height="6" rx="3" fill="#dbe7eb" />
      <rect x="52" y="90" width="44" height="13" rx="6.5" fill={CYAN} />

      <path d={`${chart} L220 160 L58 160 Z`} fill="url(#needs-art-area)" />
      <path className="art-draw" d={chart} stroke={CYAN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[[92, 138], [156, 118], [220, 78]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.5" fill="#fff" stroke={CYAN} strokeWidth="2" />
      ))}

      {/* The enquiry it brought in. */}
      <g className="art-float">
        <rect x="186" y="112" width="112" height="50" rx="12" fill={NAVY} />
        <circle cx="206" cy="137" r="9" fill={CYAN} />
        <path d="M202 137l3 3 5.5 -6" stroke={NAVY} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="222" y="133" fill="#fff" fontSize="10" fontWeight="600" fontFamily="inherit">New enquiry</text>
        <rect x="222" y="140" width="58" height="5" rx="2.5" fill="rgba(255,255,255,0.35)" />
      </g>
    </g>
  )
}

/** Any other service: a grid of tiles with one lit. */
function DefaultScene() {
  return (
    <>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={56 + col * 54}
            y={34 + row * 46}
            width="44"
            height="36"
            rx="9"
            fill={row === 1 && col === 2 ? NAVY : '#fff'}
            stroke={row === 1 && col === 2 ? NAVY : LINE}
            strokeWidth="1.5"
          />
        )),
      )}
      <circle className="art-pulse" cx="186" cy="98" r="10" fill={CYAN} opacity="0.5" />
      <circle cx="186" cy="98" r="6" fill={CYAN} />
    </>
  )
}

const scenes: Record<string, () => React.ReactElement> = {
  'system-integration': OfficeScene,
  'cyber-security': SecurityScene,
  'data-backup-recovery': SecurityScene,
  'website-development': WebScene,
  'landing-page-designing': WebScene,
  'digital-marketing': WebScene,
}

export default function NeedsArt({ service }: { service: string }) {
  const Scene = scenes[service.replace(/^\/+|\/+$/g, '')] ?? DefaultScene
  return (
    <svg aria-hidden="true" viewBox="0 0 320 200" className="needs-art h-full w-full" fontFamily="var(--font-body), system-ui, sans-serif">
      <Scene />
    </svg>
  )
}
