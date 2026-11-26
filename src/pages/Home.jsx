import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Arrow } from '../components/Nav'
import { CountUp, EASE, Magnetic, MaskLines, Reveal, ScrollInk } from '../components/Motion'
import Pipeline from '../components/Pipeline'
import PunjabMap from '../components/PunjabMap'
import SoilScene from '../components/SoilScene'
import { BandBar, SoilGauge } from '../components/SoilGauge'
import { ALGORITHMS, DATASET, MENTORS, MODEL_STATS, NEEDS, PROJECT, TEAM } from '../data/project'
import { DISTRICTS, ZONES } from '../data/regions'
import { DEMO_SECONDARY, SOIL_FIELDS } from '../data/soil'
import { useScrollTo } from '../lib/scroll'

function SectionHead({ index, label, title, children, className = '' }) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 ${className}`}>
      <div className="md:col-span-3">
        <Reveal>
          <span className="eyebrow flex items-center gap-3 text-muted">
            <span className="text-ink">{index}</span>
            <span className="h-px w-8 bg-line" />
            {label}
          </span>
        </Reveal>
      </div>
      <div className="md:col-span-9">
        <h2 className="text-[2.4rem] leading-[1.02] md:text-[3.8rem]">
          <MaskLines lines={title} inView />
        </h2>
        {children && (
          <Reveal delay={0.2}>
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{children}</div>
          </Reveal>
        )}
      </div>
    </div>
  )
}

function Hero() {
  const scrollTo = useScrollTo()
  return (
    <section className="relative overflow-hidden pt-[104px] md:pt-[120px]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-16 md:px-10 lg:grid-cols-12 lg:gap-6 lg:pb-24">
        <div className="lg:col-span-6 xl:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-muted"
          >
            <span className="rounded-full border border-line px-2.5 py-1 text-ink">Capstone · {PROJECT.cpg}</span>
            <span>TIET, Patiala</span>
          </motion.p>

          <h1 className="mt-7 text-[3.3rem] leading-[0.95] sm:text-[4.4rem] lg:text-[5.2rem] xl:text-[6rem]">
            <MaskLines
              delay={0.2}
              lines={[
                'Read the soil',
                <>
                  before you <em className="font-light text-leaf" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>sow.</em>
                </>,
              ]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
            className="mt-7 max-w-[30rem] text-lg leading-relaxed text-ink-2 md:text-xl"
          >
            Agro Soil Advisor turns a soil test, live weather and your district’s agro-climatic zone into a short, ranked
            list of crops that suit your field. Built for Punjab, one district at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                to="/advisor"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-4 pr-4 pl-7 text-paper transition-colors hover:bg-leaf"
              >
                Get a recommendation
                <span className="grid h-8 w-8 place-items-center rounded-full bg-paper/10 transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <Arrow />
                </span>
              </Link>
            </Magnetic>
            <button
              onClick={() => scrollTo('#method')}
              className="group inline-flex items-center gap-2 px-2 py-4 text-ink-2 hover:text-ink"
            >
              <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-ink">See how it works</span>
            </button>
          </motion.div>
        </div>

        <div className="relative lg:col-span-6 lg:pl-6 xl:pl-14">
          <SoilScene />
        </div>
      </div>

      <div className="border-y border-line">
        <dl className="mx-auto grid max-w-[1320px] grid-cols-2 md:grid-cols-4">
          {[
            [DISTRICTS.length, 'districts covered'],
            [3, 'agro-climatic zones'],
            [7, 'soil and weather inputs'],
            [5, 'ranked crops per query'],
          ].map(([n, l], i) => (
            <div
              key={l}
              className={`px-5 py-7 md:px-10 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''} border-line`}
            >
              <dt className="font-display text-5xl leading-none md:text-6xl">
                <CountUp to={n} duration={1.4} />
              </dt>
              <dd className="mt-2 text-sm text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Marquee() {
  const names = DISTRICTS.map((d) => d.name)
  const row = [...names, ...names]
  return (
    <div className="overflow-hidden border-b border-line py-5" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((n, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-2xl text-ink/80 md:text-3xl">
            {n}
            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-wheat" fill="currentColor">
              <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

function Problem() {
  return (
    <section id="problem" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <Reveal>
            <span className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-ink">01</span>
              <span className="h-px w-8 bg-line" />
              The problem
            </span>
          </Reveal>
        </div>
        <div className="md:col-span-9">
          <ScrollInk
            className="font-display text-[1.9rem] leading-[1.18] tracking-[-0.015em] md:text-[3rem]"
            text="Most fields in Punjab are planted by habit, wheat after paddy and paddy after wheat, not by what the soil underneath can actually carry. The knowledge to do better exists. It just never reaches the field in a form a farmer can use on a Tuesday morning."
          />
        </div>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line md:grid-cols-3">
        {NEEDS.map((n, i) => (
          <Reveal key={n.no} delay={i * 0.1} className="group relative bg-paper p-8 md:p-10">
            <span className="font-mono text-sm text-muted">{n.no}</span>
            <h3 className="mt-10 text-2xl leading-tight md:text-[1.75rem]">{n.title}</h3>
            <p className="mt-4 leading-relaxed text-ink-2">{n.body}</p>
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-wheat transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Zones() {
  const [zone, setZone] = useState('central')
  const z = ZONES[zone]
  const count = DISTRICTS.filter((d) => d.zone === zone).length
  return (
    <section id="zones" className="bg-paper-2 py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead index="02" label="Agro-climatic zones" title={['One state,', 'three different farms.']}>
          Punjab isn’t one homogeneous field. The advisor places every district in one of three agro-climatic zones, so
          identical soil readings can still lead to different advice.
        </SectionHead>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-[28px] border border-line bg-paper p-6 md:p-10">
              <PunjabMap focusZone={zone} />
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <div role="tablist" aria-label="Agro-climatic zones" className="flex gap-2">
              {Object.values(ZONES).map((zz) => (
                <button
                  key={zz.id}
                  role="tab"
                  aria-selected={zone === zz.id}
                  onClick={() => setZone(zz.id)}
                  className={`relative flex-1 rounded-full border px-3 py-2.5 text-sm transition-colors ${
                    zone === zz.id ? 'border-ink text-paper' : 'border-line text-ink-2 hover:border-ink/40'
                  }`}
                >
                  {zone === zz.id && (
                    <motion.span layoutId="zone-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease: EASE }} />
                  )}
                  <span className="relative">{zz.short}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={zone}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-8"
            >
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded" style={{ background: z.hex }} />
                <span className="eyebrow text-muted">{count} districts</span>
              </div>
              <h3 className="mt-4 text-4xl md:text-5xl">{z.name}</h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">{z.blurb}</p>

              <dl className="mt-8 divide-y divide-line border-y border-line">
                {[
                  ['Rainfall', z.rainfall],
                  ['Soils', z.soil],
                  ['Climate', z.climate],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-3.5">
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 eyebrow text-muted">Commonly grown</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {z.crops.map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted">Rainfall and soil figures are indicative ranges for orientation.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Method() {
  return (
    <section id="method" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead index="03" label="How it works" title={['From a soil card', 'to a shortlist.']}>
        Five steps, the same every time. Each one is a separate module, so the model can be retrained without touching
        the interface.
      </SectionHead>
      <div className="mt-10 md:mt-16">
        <Pipeline />
      </div>
    </section>
  )
}

function SoilHealth() {
  const [vals, setVals] = useState(() => Object.fromEntries(SOIL_FIELDS.map((f) => [f.key, f.default])))
  return (
    <section id="soil" className="bg-ink py-24 text-paper md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-paper/50">
                <span className="text-paper">04</span>
                <span className="h-px w-8 bg-paper/20" />
                Soil health
              </span>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <h2 className="text-[2.4rem] leading-[1.02] md:text-[3.8rem]">
              <MaskLines lines={['Numbers, translated', 'into plain words.']} inView />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
                A soil card full of figures helps no one at a glance. Every reading is placed on a simple scale, Low,
                Medium, Good or High, so you can see what your field is missing. Drag the sliders.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="space-y-7 rounded-[28px] border border-paper/10 bg-paper/[0.04] p-7 md:p-9">
              {SOIL_FIELDS.map((f) => {
                const fill = ((vals[f.key] - f.min) / (f.max - f.min)) * 100
                return (
                  <label key={f.key} className="block">
                    <span className="flex items-baseline justify-between">
                      <span className="text-paper/80">{f.label}</span>
                      <span className="font-mono text-sm">{Number(vals[f.key]).toFixed(f.key === 'ph' ? 1 : 0)}</span>
                    </span>
                    <input
                      type="range"
                      className="soil-range mt-1 [&::-webkit-slider-thumb]:!border-wheat [&::-webkit-slider-thumb]:!bg-ink"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={vals[f.key]}
                      onChange={(e) => setVals((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                      style={{
                        '--fill': `${fill}%`,
                        '--color-ink': '#D8A23E',
                        '--color-paper-3': 'rgba(243,238,227,.15)',
                      }}
                    />
                  </label>
                )
              })}
              <p className="border-t border-paper/10 pt-5 text-xs leading-relaxed text-paper/45">
                Concept from the Soil Health Dashboard design. Band thresholds are placeholders until the final dataset is
                chosen.
              </p>
            </div>
          </Reveal>

          <div className="text-ink lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {SOIL_FIELDS.map((f, i) => (
                <Reveal key={f.key} delay={i * 0.08}>
                  <SoilGauge
                    label={f.label}
                    symbol={f.symbol}
                    value={vals[f.key]}
                    min={f.min}
                    max={f.max}
                    bands={f.bands}
                    bandLabels={f.bandLabels}
                    decimals={f.key === 'ph' ? 1 : 0}
                  />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="mt-4 space-y-5 rounded-2xl border border-line bg-paper p-5">
                {DEMO_SECONDARY.map((s) => (
                  <BandBar key={s.key} label={s.label} value={s.value} max={s.max} bands={s.bands} unit={s.unit} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Model() {
  const ratingDots = { High: 3, Medium: 2, Low: 1 }
  return (
    <section id="model" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead index="05" label="Model and data" title={['A forest of', 'small decisions.']}>
        A Random Forest classifier is the working baseline: robust on noisy field data and explainable enough to show
        which readings drove each result. Three other algorithms are trained on identical inputs for comparison.
      </SectionHead>

      <div className="mt-16 grid gap-6 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="overflow-x-auto rounded-[28px] border border-line">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  {['Algorithm', 'Accuracy', 'Robustness', 'Speed', 'Explainable'].map((h) => (
                    <th key={h} className="px-5 py-4 font-mono text-[0.68rem] font-normal uppercase tracking-wider text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map((a, r) => (
                  <motion.tr
                    key={a.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: r * 0.1 }}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-5 py-4">
                      <span className="block font-medium">{a.name}</span>
                      <span className={`font-mono text-[0.68rem] ${a.role === 'Primary' ? 'text-leaf' : 'text-muted'}`}>{a.role}</span>
                    </td>
                    {['accuracy', 'robustness', 'speed', 'interpretability'].map((k) => (
                      <td key={k} className="px-5 py-4">
                        <span className="flex gap-1" title={a[k]}>
                          {[1, 2, 3].map((d) => (
                            <span key={d} className={`h-2 w-5 rounded-full ${d <= ratingDots[a[k]] ? 'bg-ink' : 'bg-paper-3'}`} />
                          ))}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Qualitative design-stage ratings from the literature survey, not measured results.</p>
        </Reveal>

        <div className="grid min-w-0 gap-6 lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="rounded-[28px] border border-dashed border-ink/25 p-7">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-muted">Evaluation</span>
                <span className="rounded-full bg-wheat-light px-2.5 py-1 font-mono text-[0.62rem] text-ink">awaiting training</span>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                {MODEL_STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="text-sm text-ink-2">{s.label}</dt>
                    <dd className="mt-1 font-display text-4xl text-ink/30">{s.value ?? '—'}</dd>
                    <dd className="font-mono text-[0.65rem] text-muted">{s.hint}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="rounded-[28px] bg-paper-2 p-7">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-muted">Dataset</span>
                <span className="font-mono text-[0.65rem] text-muted">{DATASET.source}</span>
              </div>
              <p className="mt-4 font-display text-2xl">{DATASET.name}</p>
              <div className="mt-2 flex gap-6 font-mono text-xs text-muted">
                <span>rows: {DATASET.rows ?? '—'}</span>
                <span>crop classes: {DATASET.crops ?? '—'}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {DATASET.features.map((f) => (
                  <span key={f} className="rounded-md border border-line bg-paper px-2 py-1 font-mono text-[0.7rem]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Team() {
  return (
    <section id="team" className="border-t border-line bg-paper-2 py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead index="06" label="Team" title={['Five students,', 'one stubborn question.']}>
          Third-year Computer Engineering students at TIET, Patiala, mentored by the Computer Science and Engineering
          Department.
        </SectionHead>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.roll} delay={(i % 3) * 0.08} className="group bg-paper p-7">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-paper-3 font-display text-xl transition-colors duration-500 group-hover:bg-wheat">
                  {m.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </span>
                <span className="font-mono text-[0.68rem] text-muted">{m.roll}</span>
              </div>
              <p className="mt-8 font-display text-2xl">{m.name}</p>
              <p className="mt-2 text-ink-2">{m.role}</p>
              <span className="mt-5 inline-block rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted">
                {m.area}
              </span>
            </Reveal>
          ))}
          <Reveal delay={0.16} className="flex flex-col justify-between bg-ink p-7 text-paper">
            <span className="eyebrow text-paper/50">Mentors</span>
            <div className="mt-8 space-y-6">
              {MENTORS.map((m) => (
                <div key={m.name}>
                  <p className="font-display text-2xl">{m.name}</p>
                  <p className="text-paper/60">
                    {m.title} · {m.role}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-paper/50">CSED, TIET Patiala</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-5 py-28 text-center md:px-10 md:py-40">
        <Reveal>
          <span className="eyebrow text-muted">Try it on your own field</span>
        </Reveal>
        <h2 className="mx-auto mt-6 max-w-4xl text-[2.8rem] leading-[0.98] md:text-[5.4rem]">
          <MaskLines lines={['Three steps.', 'About a minute.']} inView />
        </h2>
        <Reveal delay={0.25}>
          <div className="mt-12 flex justify-center">
            <Magnetic strength={0.35}>
              <Link
                to="/advisor"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-5 pr-5 pl-9 text-lg text-paper transition-colors hover:bg-leaf"
              >
                Open the advisor
                <span className="grid h-9 w-9 place-items-center rounded-full bg-paper/10 transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <Arrow />
                </span>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  const scrollTo = useScrollTo()
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => scrollTo(hash, { immediate: false }), 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  return (
    <main>
      <Hero />
      <Marquee />
      <Problem />
      <Zones />
      <Method />
      <SoilHealth />
      <Model />
      <Team />
      <Closing />
    </main>
  )
}
