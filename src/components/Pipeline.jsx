import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PIPELINE } from '../data/project'
import { ZONES } from '../data/regions'
import PunjabMap from './PunjabMap'
import { EASE } from './Motion'

function Step({ step, index, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  return (
    <div ref={ref} className="flex min-h-[46vh] flex-col justify-center py-10 lg:min-h-[62vh]">
      <span className="eyebrow text-muted">
        Step {String(index + 1).padStart(2, '0')} · {step.meta}
      </span>
      <h3 className="mt-3 text-3xl leading-tight md:text-[2.6rem]">{step.title}</h3>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-2">{step.body}</p>
      {/* on small screens the visual sits inline with each step */}
      <div className="mt-8 lg:hidden">
        <Visual active={index} />
      </div>
    </div>
  )
}

function Visual({ active }) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-line bg-paper-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 grid place-items-center p-6 md:p-10"
        >
          {active === 0 && <PunjabMap selected="ludhiana" showLegend={false} className="w-[82%]" />}
          {active === 1 && <ZoneVisual />}
          {active === 2 && <InputsVisual />}
          {active === 3 && <ModelVisual />}
          {active === 4 && <OutputVisual />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ZoneVisual() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-line bg-paper p-4">
        <span className="eyebrow text-muted">District</span>
        <p className="mt-1 font-display text-2xl">Ludhiana</p>
      </div>
      <motion.div
        className="mx-auto my-2 h-10 w-px bg-ink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ originY: 0 }}
      />
      <div className="grid grid-cols-3 gap-2">
        {Object.values(ZONES).map((z, i) => (
          <motion.div
            key={z.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: z.id === 'central' ? 1 : 0.35, y: 0, scale: z.id === 'central' ? 1.04 : 1 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: EASE }}
            className="rounded-xl p-3 text-paper"
            style={{ background: z.hex }}
          >
            <span className="block text-sm font-medium leading-tight text-ink">{z.short}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function InputsVisual() {
  const rows = [
    ['N', '82', 'soil card'],
    ['P', '44', 'soil card'],
    ['K', '39', 'soil card'],
    ['pH', '6.6', 'soil card'],
    ['Temp', '24.1 °C', 'live'],
    ['Humidity', '68 %', 'live'],
    ['Rain · 30d', '41 mm', 'live'],
  ]
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-2">
      {rows.map(([k, v, src], i) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
          className="flex items-center justify-between border-b border-line px-3 py-2 last:border-0"
        >
          <span className="font-mono text-xs text-muted">{k}</span>
          <span className="flex items-center gap-3">
            <span className="font-display text-lg">{v}</span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] ${src === 'live' ? 'bg-leaf text-paper' : 'bg-paper-3 text-ink-2'}`}
            >
              {src}
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function ModelVisual() {
  const trees = 7
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-md">
      {Array.from({ length: trees }).map((_, t) => {
        const x = 30 + t * 57
        return (
          <g key={t}>
            {[
              [x, 40, x - 14, 90],
              [x, 40, x + 14, 90],
              [x - 14, 90, x - 22, 140],
              [x - 14, 90, x - 6, 140],
              [x + 14, 90, x + 6, 140],
              [x + 14, 90, x + 22, 140],
            ].map(([x1, y1, x2, y2], i) => (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#39432F"
                strokeWidth="1.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: t * 0.08 + i * 0.05, duration: 0.4 }}
              />
            ))}
            <motion.circle cx={x} cy={40} r="6" fill="#1C2419" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: t * 0.08 }} />
            {[-22, -6, 6, 22].map((dx, i) => (
              <motion.circle
                key={i}
                cx={x + dx}
                cy={140}
                r="4"
                fill={['#4F7A4A', '#D8A23E', '#C0714A', '#4F7A4A'][(t + i) % 4]}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + t * 0.06 + i * 0.03 }}
              />
            ))}
            <motion.line
              x1={x}
              y1={150}
              x2={200}
              y2={225}
              stroke="#1C2419"
              strokeOpacity=".25"
              strokeDasharray="3 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9 + t * 0.05, duration: 0.5 }}
            />
          </g>
        )
      })}
      <motion.rect x="140" y="225" width="120" height="44" rx="22" fill="#1C2419" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3, type: 'spring' }} style={{ transformOrigin: '200px 247px' }} />
      <motion.text x="200" y="252" textAnchor="middle" fill="#F3EEE3" fontFamily="IBM Plex Mono" fontSize="12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        majority vote
      </motion.text>
    </svg>
  )
}

function OutputVisual() {
  const rows = [
    ['Wheat', 0.86],
    ['Potato', 0.71],
    ['Maize', 0.58],
    ['Sunflower', 0.41],
  ]
  return (
    <div className="w-full max-w-sm space-y-3">
      {rows.map(([c, v], i) => (
        <motion.div
          key={c}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-baseline justify-between">
            <span className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <span className="font-display text-xl">{c}</span>
            </span>
            <span className="font-mono text-sm">{Math.round(v * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
            <motion.div
              className="h-full rounded-full"
              style={{ background: i === 0 ? '#3E6B39' : '#39432F' }}
              initial={{ width: 0 }}
              animate={{ width: `${v * 100}%` }}
              transition={{ delay: 0.3 + i * 0.12, duration: 1, ease: EASE }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function Pipeline() {
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 0.6', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <div ref={wrap} className="relative grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        {PIPELINE.map((s, i) => (
          <Step key={s.key} step={s} index={i} onActive={setActive} />
        ))}
      </div>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[14vh]">
          <div className="mb-5 flex items-center gap-4">
            {PIPELINE.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <motion.span
                  className="grid h-7 w-7 place-items-center rounded-full border font-mono text-[0.7rem]"
                  animate={{
                    backgroundColor: i <= active ? '#1C2419' : 'rgba(0,0,0,0)',
                    color: i <= active ? '#F3EEE3' : '#6C705F',
                    borderColor: i <= active ? '#1C2419' : 'rgba(28,36,25,.2)',
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {i + 1}
                </motion.span>
                {i < PIPELINE.length - 1 && <span className="h-px w-6 bg-line xl:w-10" />}
              </div>
            ))}
          </div>
          <Visual active={active} />
          <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-paper-3">
            <motion.div className="h-full origin-left bg-leaf" style={{ scaleX: progress }} />
          </div>
        </div>
      </div>
    </div>
  )
}
