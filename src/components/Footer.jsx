import { Link } from 'react-router-dom'
import { PROJECT } from '../data/project'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="no-print relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1320px] px-5 pt-20 pb-10 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="[&_.text-muted]:text-paper/50" />
            <p className="mt-6 max-w-sm text-paper/70">
              A capstone project at the {PROJECT.department}, {PROJECT.institute}.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-paper/40">Explore</p>
            <ul className="mt-4 space-y-2 text-paper/80">
              <li><Link className="hover:text-wheat transition-colors" to="/advisor">Crop advisor</Link></li>
              <li><Link className="hover:text-wheat transition-colors" to="/#zones">Agro-climatic zones</Link></li>
              <li><Link className="hover:text-wheat transition-colors" to="/#method">How it works</Link></li>
              <li><Link className="hover:text-wheat transition-colors" to="/#model">Model and data</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow text-paper/40">A note on the advice</p>
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              Recommendations are decision support, not a guarantee. Always cross-check with your soil health card and
              your local Krishi Vigyan Kendra before sowing.
            </p>
          </div>
        </div>

        <div className="mt-20 select-none font-display text-[18vw] leading-[0.8] tracking-[-0.05em] text-paper/[0.06] md:text-[13vw]">
          Read the soil.
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-paper/10 pt-6 text-sm text-paper/50 md:flex-row">
          <span>© {PROJECT.year} Agro Soil Advisor · {PROJECT.cpg}</span>
          <span className="font-mono text-xs">Made in Patiala, Punjab</span>
        </div>
      </div>
    </footer>
  )
}
