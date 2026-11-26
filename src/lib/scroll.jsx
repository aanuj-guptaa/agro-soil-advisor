import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const LenisCtx = createContext(null)

export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const raf = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    setLenis(l)
    const loop = (time) => {
      l.raf(time)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf.current)
      l.destroy()
    }
  }, [])

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}

export function useScrollTo() {
  const lenis = useContext(LenisCtx)
  return (target, opts = {}) => {
    const offset = opts.offset ?? -72
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: opts.immediate ? 0 : 1.4, immediate: !!opts.immediate })
    } else {
      const el = typeof target === 'number' ? null : document.querySelector(target)
      const top = el ? el.getBoundingClientRect().top + window.scrollY + offset : target
      window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' })
    }
  }
}
