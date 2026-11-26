import { motion, useInView, useMotionValue, useScroll, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const EASE = [0.22, 1, 0.36, 1]

/** Fade + rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', once = true, amount = 0.3 }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/** Each word slides up from behind a mask. `lines` is an array of strings or nodes. */
export function MaskLines({ lines, className = '', lineClassName = '', delay = 0, stagger = 0.09, inView = false }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.4 })
  const show = inView ? seen : true
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.08em] ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            initial={{ y: '105%' }}
            animate={show ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Paragraph whose words darken as it scrolls through the viewport. */
export function ScrollInk({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <InkWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </InkWord>
      ))}
    </p>
  )
}

function InkWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  )
}

/** Number that counts up once visible. */
export function CountUp({ to, decimals = 0, duration = 1.6, className = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const mv = useMotionValue(0)
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(mv, to, { duration, ease: EASE, onUpdate: (v) => setVal(v) })
    return () => c.stop()
  }, [inView, to, duration, mv])
  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/** Magnetic hover for buttons. */
export function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() {
    animate(x, 0, { duration: 0.6, ease: EASE })
    animate(y, 0, { duration: 0.6, ease: EASE })
  }
  return (
    <motion.span ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  )
}
