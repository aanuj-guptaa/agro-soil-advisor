import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CountUp, EASE } from './Motion'

const LAYERS = [
  { y: 300, h: 340, fill: '#6B4329', d: 'M0 300 C 90 288, 170 312, 280 298 S 470 286, 560 300 V640 H0Z', label: 'Topsoil', depth: '0 to 15 cm', speed: 0 },
  { y: 400, h: 240, fill: '#82543A', d: 'M0 400 C 120 390, 210 414, 320 402 S 480 392, 560 404 V640 H0Z', label: 'Subsoil', depth: '15 to 60 cm', speed: 12 },
  { y: 490, h: 150, fill: '#A15F3F', d: 'M0 490 C 110 482, 240 500, 330 490 S 490 480, 560 492 V640 H0Z', label: 'Clay band', depth: '60 to 90 cm', speed: 24 },
  { y: 566, h: 74, fill: '#4A2E1C', d: 'M0 566 C 140 558, 260 574, 380 564 S 500 558, 560 568 V640 H0Z', label: 'Parent material', depth: '90 cm +', speed: 36 },
]

const PARTICLES = [
  { x: 92, y: 352, t: 'N', c: '#ECD29A' },
  { x: 168, y: 380, t: 'P', c: '#C9DDAF' },
  { x: 236, y: 344, t: 'K', c: '#F0C9A8' },
  { x: 388, y: 372, t: 'N', c: '#ECD29A' },
  { x: 454, y: 340, t: 'P', c: '#C9DDAF' },
  { x: 130, y: 440, t: 'K', c: '#F0C9A8' },
  { x: 410, y: 446, t: 'N', c: '#ECD29A' },
]

const STONES = [
  [70, 600, 14, 7], [150, 612, 9, 5], [260, 598, 18, 8], [350, 615, 11, 6], [470, 604, 15, 7], [520, 520, 8, 4], [210, 530, 7, 4], [60, 512, 6, 3],
]

export default function SoilScene() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const p1 = useTransform(scrollYProgress, [0, 1], [0, -12])
  const p2 = useTransform(scrollYProgress, [0, 1], [0, -24])
  const p3 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const p4 = useTransform(scrollYProgress, [0, 1], [0, -56])
  const parallax = [p1, p2, p3, p4]

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 640" className="h-auto w-full" aria-hidden="true">
        <defs>
          <clipPath id="frame">
            <rect x="0" y="0" width="560" height="640" rx="28" />
          </clipPath>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EFE7D4" />
            <stop offset="1" stopColor="#E6D9BC" />
          </linearGradient>
        </defs>
        <g clipPath="url(#frame)">
          <rect width="560" height="640" fill="url(#sky)" />

          {/* sun */}
          <motion.g style={{ y: sunY }}>
            <motion.circle
              cx="430"
              cy="120"
              r="54"
              fill="#E3B65A"
              initial={{ cy: 190, opacity: 0 }}
              animate={{ cy: 120, opacity: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
            />
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="430"
                cy="120"
                r="54"
                fill="none"
                stroke="#E3B65A"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ r: [54, 120], opacity: [0.5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, delay: 1.2 + i * 1.5, ease: 'easeOut' }}
              />
            ))}
          </motion.g>

          {/* distant field rows */}
          <motion.path
            d="M0 262 C 120 250, 260 258, 560 246 V300 H0Z"
            fill="#C9B98B"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.line
              key={i}
              x1={30 + i * 62}
              y1={300}
              x2={160 + i * 40}
              y2={255}
              stroke="#B5A372"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.7 + i * 0.05, ease: EASE }}
            />
          ))}

          {/* soil layers */}
          {LAYERS.map((l, i) => (
            <motion.g key={l.label} style={{ y: parallax[i] }}>
              <motion.path
                d={l.d}
                fill={l.fill}
                initial={{ y: 260 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.15 + i * 0.12 }}
              />
            </motion.g>
          ))}

          {/* stones in the deep layers */}
          {STONES.map(([x, y, rx, ry], i) => (
            <motion.ellipse
              key={i}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill="#2F1D12"
              opacity="0.55"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 + i * 0.05, duration: 0.6, ease: EASE }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          ))}

          {/* roots */}
          <motion.path
            d="M200 300 C 202 330, 190 350, 196 380 M200 312 C 214 330, 226 336, 232 360 M200 320 C 186 336, 172 340, 166 366 M196 380 C 198 400, 206 414, 202 436"
            fill="none"
            stroke="#E9DCC0"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 2.2, delay: 1.5, ease: EASE }}
          />

          {/* sprout, swaying gently once grown */}
          <motion.g
            animate={{ rotate: [0, 2, 0, -1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3.4 }}
            style={{ transformOrigin: '200px 300px', transformBox: 'view-box' }}
          >
          <motion.path
            d="M200 300 C 200 270, 198 250, 202 222"
            fill="none"
            stroke="#3E6B39"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1.4, ease: EASE }}
          />
          <motion.path
            d="M201 250 C 180 250, 164 236, 160 216 C 182 216, 198 228, 201 250Z"
            fill="#8FB46A"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 2.1, ease: EASE }}
            style={{ transformOrigin: '201px 250px' }}
          />
          <motion.path
            d="M202 232 C 222 230, 240 214, 246 194 C 222 194, 206 208, 202 232Z"
            fill="#6E9A4E"
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 2.35, ease: EASE }}
            style={{ transformOrigin: '202px 232px' }}
          />
          </motion.g>

          {/* nutrient particles */}
          {PARTICLES.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 1.8 + i * 0.1, duration: 0.6 },
                y: { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
              }}
            >
              <circle cx={p.x} cy={p.y} r="11" fill={p.c} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono" fill="#3A2416" fontWeight="500">
                {p.t}
              </text>
            </motion.g>
          ))}

          {/* soil probe */}
          <motion.g initial={{ y: -180 }} animate={{ y: 0 }} transition={{ duration: 1.3, delay: 1.0, ease: EASE }}>
            <rect x="372" y="200" width="10" height="250" rx="3" fill="#C9C3B5" />
            <rect x="372" y="200" width="4" height="250" rx="2" fill="#E8E3D8" />
            <rect x="362" y="186" width="30" height="22" rx="5" fill="#1C2419" />
            <motion.circle
              cx="377"
              cy="197"
              r="3"
              fill="#8FB46A"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <path d="M377 448 L372 462 L382 462Z" fill="#C9C3B5" />
          </motion.g>

          {/* layer labels */}
          {LAYERS.map((l, i) => (
            <motion.g
              key={`lbl-${l.label}`}
              style={{ y: parallax[i] }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + i * 0.12, duration: 0.8, ease: EASE }}
            >
              <line x1="22" y1={l.y + 26} x2="44" y2={l.y + 26} stroke="rgba(243,238,227,.55)" />
              <text x="50" y={l.y + 30} fontSize="11" fontFamily="IBM Plex Mono" fill="rgba(243,238,227,.9)" letterSpacing="0.08em">
                {l.label.toUpperCase()}
              </text>
              <text x="50" y={l.y + 45} fontSize="10" fontFamily="IBM Plex Mono" fill="rgba(243,238,227,.55)">
                {l.depth}
              </text>
            </motion.g>
          ))}
        </g>
        <rect x="0.5" y="0.5" width="559" height="639" rx="27.5" fill="none" stroke="rgba(28,36,25,.15)" />
      </svg>

      {/* probe readout */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 2.2, duration: 1, ease: EASE }}
        className="absolute right-[-4%] top-[6%] w-[46%] min-w-[190px] rounded-2xl border border-line bg-paper/95 p-4 shadow-[0_20px_40px_-20px_rgba(28,36,25,.35)] backdrop-blur sm:right-[-10%]"
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow truncate text-muted">Probe reading</span>
          <span className="flex items-center gap-1.5 rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[0.6rem] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> sample
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[
            ['N', 82, 0],
            ['P', 44, 0],
            ['K', 39, 0],
            ['pH', 6.6, 1],
          ].map(([k, v, d]) => (
            <div key={k} className="border-t border-line pt-1.5">
              <dt className="font-mono text-[0.65rem] text-muted">{k}</dt>
              <dd className="font-display text-2xl leading-none">
                <CountUp to={v} decimals={d} duration={2} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
          <span className="font-mono text-[0.65rem] text-muted">Zone</span>
          <span className="text-sm font-medium">Central plain</span>
        </div>
      </motion.div>
    </div>
  )
}
