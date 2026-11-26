import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { DISTRICTS, ZONES } from '../data/regions'
import { EASE } from './Motion'

const T = 64
const G = 8
const COLS = 7
const ROWS = 6
const W = COLS * (T + G) - G
const H = ROWS * (T + G) - G

// furrow patterns give each zone its own "field" texture
function Patterns() {
  return (
    <defs>
      <pattern id="furrow-sub" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 6 Q2.5 3 5 6 T10 6" fill="none" stroke="rgba(28,36,25,.28)" strokeWidth="1" />
      </pattern>
      <pattern id="furrow-central" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(28,36,25,.22)" strokeWidth="1.2" />
      </pattern>
      <pattern id="furrow-sw" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.9" fill="rgba(28,36,25,.3)" />
        <circle cx="6.5" cy="6.5" r="0.7" fill="rgba(28,36,25,.22)" />
      </pattern>
    </defs>
  )
}

export default function PunjabMap({ selected, onSelect, focusZone, className = '', showLegend = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [hover, setHover] = useState(null)
  const hovered = DISTRICTS.find((d) => d.id === hover)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="h-auto w-full overflow-visible" role="group" aria-label="Map of Punjab districts">
        <Patterns />
        {DISTRICTS.map((d, i) => {
          const x = d.col * (T + G)
          const y = d.row * (T + G)
          const zone = ZONES[d.zone]
          const isSel = selected === d.id
          const dim = focusZone && focusZone !== d.zone
          const isHover = hover === d.id
          return (
            <motion.g
              key={d.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: dim ? 0.28 : 1, scale: 1 } : {}}
              transition={{
                opacity: { duration: 0.6, delay: inView && !focusZone ? 0.1 + (d.row + d.col) * 0.045 : 0 },
                scale: { duration: 0.9, ease: EASE, delay: 0.1 + (d.row + d.col) * 0.045 },
              }}
              style={{ transformOrigin: `${x + T / 2}px ${y + T / 2}px`, transformBox: 'view-box' }}
            >
              <motion.g
                animate={{ y: isHover || isSel ? -4 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(d.id)}
                onBlur={() => setHover(null)}
                onClick={() => onSelect?.(d.id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
                    e.preventDefault()
                    onSelect(d.id)
                  }
                }}
                role={onSelect ? 'button' : undefined}
                tabIndex={onSelect ? 0 : -1}
                aria-label={`${d.name}, ${zone.name} zone`}
                aria-pressed={onSelect ? isSel : undefined}
                className={onSelect ? 'cursor-pointer outline-none' : ''}
              >
                {/* shadow plate */}
                <rect x={x} y={y + 4} width={T} height={T} rx="9" fill="rgba(28,36,25,.12)" />
                <rect x={x} y={y} width={T} height={T} rx="9" fill={isSel ? '#1C2419' : zone.hex} />
                {!isSel && <rect x={x} y={y} width={T} height={T} rx="9" fill={`url(#furrow-${d.zone})`} />}
                <rect
                  x={x + 0.5}
                  y={y + 0.5}
                  width={T - 1}
                  height={T - 1}
                  rx="8.5"
                  fill="none"
                  stroke={isSel ? '#D8A23E' : isHover ? '#1C2419' : 'rgba(28,36,25,.18)'}
                  strokeWidth={isSel || isHover ? 2 : 1}
                />
                <text
                  x={x + 8}
                  y={y + T - 10}
                  className="font-mono"
                  fontSize="11"
                  letterSpacing="0.06em"
                  fill={isSel ? '#F3EEE3' : '#1C2419'}
                >
                  {d.abbr}
                </text>
                {isSel && (
                  <motion.circle
                    cx={x + T - 12}
                    cy={y + 12}
                    r="4"
                    fill="#D8A23E"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.4, 1] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.g>
            </motion.g>
          )
        })}
      </svg>

      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-paper shadow-lg"
            style={{
              left: `${((hovered.col * (T + G) + T / 2 + 6) / (W + 12)) * 100}%`,
              top: `${((hovered.row * (T + G) - 2) / (H + 12)) * 100}%`,
            }}
          >
            <span className="block text-sm font-medium">{hovered.name}</span>
            <span className="eyebrow !text-[0.6rem] text-paper/60">{ZONES[hovered.zone].name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {showLegend && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {Object.values(ZONES).map((z) => (
            <span key={z.id} className="inline-flex items-center gap-2 text-sm text-ink-2">
              <span className="h-3 w-3 rounded-[3px]" style={{ background: z.hex }} />
              {z.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
