import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrollTo } from '../lib/scroll'
import Logo from './Logo'
import { EASE } from './Motion'

const LINKS = [
  { id: 'problem', label: 'Problem' },
  { id: 'zones', label: 'Zones' },
  { id: 'method', label: 'How it works' },
  { id: 'soil', label: 'Soil health' },
  { id: 'team', label: 'Team' },
]

export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const scrollTo = useScrollTo()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 400 && y > prev && !open)
  })

  function go(id) {
    setOpen(false)
    if (loc.pathname === '/') scrollTo(`#${id}`)
    else nav(`/#${id}`)
  }

  return (
    <motion.header
      className="no-print fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
          scrolled || open ? 'bg-paper/85 backdrop-blur-md border-line' : 'bg-transparent border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 md:px-10">
          <Link to="/" onClick={() => loc.pathname === '/' && scrollTo(0)} aria-label="Agro Soil Advisor home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative px-3.5 py-2 text-[0.92rem] text-ink-2 transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/advisor"
              className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.9rem] text-paper transition-colors hover:bg-leaf sm:inline-flex"
            >
              Open the advisor
              <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <button
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className={`absolute h-px w-4 bg-ink transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-4 bg-ink transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="mx-auto max-w-[1320px] px-5 pb-6 md:px-10">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
                    className="border-b border-line"
                  >
                    <button onClick={() => go(l.id)} className="flex w-full items-baseline justify-between py-4 text-left">
                      <span className="font-display text-2xl">{l.label}</span>
                      <span className="eyebrow text-muted">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
                <li className="pt-5">
                  <Link
                    to="/advisor"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-full bg-ink px-6 py-4 text-paper"
                  >
                    Open the advisor <Arrow />
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export function Arrow({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
