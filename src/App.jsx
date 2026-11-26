import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import { EASE } from './components/Motion'
import Nav from './components/Nav'
import { SmoothScroll, useScrollTo } from './lib/scroll'
import Advisor from './pages/Advisor'
import Home from './pages/Home'

function ScrollReset() {
  const { pathname, hash } = useLocation()
  const scrollTo = useScrollTo()
  useEffect(() => {
    if (!hash) scrollTo(0, { immediate: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  return null
}

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.25 } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  )
}

function Curtain() {
  // a soil-coloured panel sweeps across on every route change
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] origin-bottom bg-soil"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0, transition: { duration: 0.7, ease: EASE, delay: 0.05 } }}
      exit={{ scaleY: 0 }}
      style={{ originY: 0 }}
    />
  )
}

export default function App() {
  const location = useLocation()
  return (
    <SmoothScroll>
      <div className="grain">
        <ScrollReset />
        <Nav />
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}>
            <Curtain />
            <Routes location={location}>
              <Route path="/" element={<Page><Home /></Page>} />
              <Route path="/advisor" element={<Page><Advisor /></Page>} />
              <Route path="*" element={<Page><Home /></Page>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
