import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BAND_NAMES, bandIndex } from '../data/soil'
import { EASE } from './Motion'

const BAND_COLORS = ['#C0714A', '#D8A23E', '#4F7A4A', '#39432F']
const R = 70
const CX = 90
const CY = 86

function polar(angle, r = R) {
  const a = (Math.PI * (180 - angle)) / 180
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}

function arc(a0, a1, r = R) {
  const [x0, y0] = polar(a0, r)
  const [x1, y1] = polar(a1, r)
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`
}

/** Semicircular gauge split into Low / Medium / Good / High bands. */
export function SoilGauge({ label, symbol, value, min, max, bands, bandLabels, unit = '', decimals = 0, immediate = false }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.5 })
  const inView = immediate || seen
  const clamp = Math.min(max, Math.max(min, value))
  const toAngle = (v) => ((v - min) / (max - min)) * 180
  const edges = [min, ...bands, max].map(toAngle)
  const idx = bandIndex(value, bands)
  const names = bandLabels ?? BAND_NAMES

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink-2">{label}</span>
        <span className="font-mono text-xs text-muted">{symbol}</span>
      </div>
      <svg viewBox="0 0 180 100" className="mt-1 w-full">
        {edges.slice(0, -1).map((a, i) => (
          <motion.path
            key={i}
            d={arc(a + (i ? 1.2 : 0), edges[i + 1] - (i < 3 ? 1.2 : 0))}
            fill="none"
            stroke={BAND_COLORS[i]}
            strokeWidth="12"
            strokeLinecap="butt"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={inView ? { pathLength: 1, opacity: i === idx ? 1 : 0.35 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          />
        ))}
        <motion.g
          initial={{ rotate: 0 }}
          animate={inView ? { rotate: toAngle(clamp) } : {}}
          transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.3 }}
          style={{ originX: `${CX}px`, originY: `${CY}px`, transformBox: 'view-box' }}
        >
          <line x1={CX} y1={CY} x2={CX - R + 14} y2={CY} stroke="#1C2419" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
        <circle cx={CX} cy={CY} r="5" fill="#1C2419" />
      </svg>
      <div className="-mt-1 flex items-end justify-between">
        <span className="font-display text-3xl leading-none">
          {Number(value).toFixed(decimals)}
          <span className="ml-1 font-mono text-xs text-muted">{unit}</span>
        </span>
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-paper"
          style={{ background: BAND_COLORS[idx] }}
        >
          {names[idx]}
        </motion.span>
      </div>
    </div>
  )
}

/** Horizontal banded bar for secondary parameters. */
export function BandBar({ label, value, max, bands, unit }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const idx = bandIndex(value, bands)
  const stops = [0, ...bands, max]
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-ink-2">{label}</span>
        <span className="font-mono text-xs text-muted">
          {value}
          {unit} · <span style={{ color: BAND_COLORS[idx] }}>{BAND_NAMES[idx]}</span>
        </span>
      </div>
      <div className="relative mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
        {stops.slice(0, -1).map((s, i) => (
          <div
            key={i}
            className="h-full"
            style={{ width: `${((stops[i + 1] - s) / max) * 100}%`, background: BAND_COLORS[i], opacity: i === idx ? 1 : 0.3 }}
          />
        ))}
        <motion.span
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded bg-ink"
          initial={{ left: '0%' }}
          animate={inView ? { left: `${(Math.min(value, max) / max) * 100}%` } : {}}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
