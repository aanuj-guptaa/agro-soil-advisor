import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EASE } from '../components/Motion'
import { Arrow } from '../components/Nav'
import PunjabMap from '../components/PunjabMap'
import { SoilGauge } from '../components/SoilGauge'
import { DISTRICTS, ZONES, districtById } from '../data/regions'
import { SOIL_FIELDS, WEATHER_FIELDS, validate } from '../data/soil'
import { IS_SAMPLE_ENGINE, recommend } from '../lib/engine'
import { useScrollTo } from '../lib/scroll'
import { fetchWeather } from '../lib/weather'

const STEPS = ['Your district', 'Soil and weather', 'Recommendation']
const lower = (s) => (s === 'Soil pH' ? 'soil pH' : s.toLowerCase())

function StepBar({ step, maxStep, onGo }) {
  return (
    <ol className="grid grid-cols-3 gap-2 md:gap-4">
      {STEPS.map((s, i) => {
        const done = i < step
        const current = i === step
        const reachable = i <= maxStep
        return (
          <li key={s}>
            <button
              disabled={!reachable || current}
              onClick={() => onGo(i)}
              className="group w-full text-left disabled:cursor-default"
              aria-current={current ? 'step' : undefined}
            >
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-paper-3">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-ink"
                  initial={false}
                  animate={{ width: done || current ? '100%' : '0%' }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </span>
              <span className="mt-3 flex items-baseline gap-2">
                <span className={`font-mono text-xs ${current || done ? 'text-ink' : 'text-muted'}`}>0{i + 1}</span>
                <span
                  className={`text-sm md:text-base ${current ? 'text-ink' : 'hidden sm:inline'} ${done ? 'text-ink-2 group-hover:underline' : !current ? 'text-muted' : ''}`}
                >
                  {s}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

const pane = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.35, ease: 'easeIn' } },
}

/* ───────────────────────── Step 1 ───────────────────────── */

function RegionStep({ district, setDistrict, onNext }) {
  const [q, setQ] = useState('')
  const d = district ? districtById(district) : null
  const zone = d ? ZONES[d.zone] : null
  const filtered = useMemo(
    () => DISTRICTS.filter((x) => x.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)),
    [q],
  )

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="rounded-[28px] border border-line bg-paper-2 p-5 md:p-10">
          <PunjabMap selected={district} onSelect={setDistrict} />
        </div>
        <p className="mt-3 text-sm text-muted">Tap a tile or search by name. Tiles are arranged roughly as on a map, north at the top.</p>
      </div>

      <div className="lg:col-span-5">
        <label className="block">
          <span className="eyebrow text-muted">Search district</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Bathinda"
            className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-lg outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
        </label>
        <ul data-lenis-prevent className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-line bg-paper">
          {filtered.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setDistrict(x.id)}
                className={`flex w-full items-center justify-between border-b border-line px-4 py-2.5 text-left last:border-0 transition-colors ${
                  district === x.id ? 'bg-ink text-paper' : 'hover:bg-paper-2'
                }`}
              >
                <span>{x.name}</span>
                <span className="flex items-center gap-2 font-mono text-[0.68rem] opacity-70">
                  <span className="h-2 w-2 rounded-sm" style={{ background: ZONES[x.zone].hex }} />
                  {ZONES[x.zone].short}
                </span>
              </button>
            </li>
          ))}
          {!filtered.length && <li className="px-4 py-3 text-muted">No district matches “{q}”.</li>}
        </ul>

        <AnimatePresence mode="wait">
          {d ? (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper"
            >
              <div className="p-5">
                <span className="eyebrow text-muted">Selected</span>
                <p className="mt-1 font-display text-3xl">{d.name}</p>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4" style={{ background: zone.hex }}>
                <span className="text-sm text-ink/70">Detected zone</span>
                <span className="font-display text-xl text-ink">{zone.name}</span>
              </div>
              <dl className="grid grid-cols-2 gap-4 p-5 text-sm">
                <div>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">Rainfall</dt>
                  <dd className="mt-1">{zone.rainfall}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">Soils</dt>
                  <dd className="mt-1">{zone.soil}</dd>
                </div>
              </dl>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-dashed border-line p-5 text-muted">
              No district selected yet. Your agro-climatic zone will appear here.
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={onNext}
          disabled={!d}
          className="group mt-6 flex w-full items-center justify-between rounded-full bg-ink px-7 py-4 text-paper transition-all hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink"
        >
          Continue to soil and weather
          <Arrow className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

/* ───────────────────────── Step 2 ───────────────────────── */

function NumberField({ field, value, onChange, error, showError }) {
  const num = Number(value)
  const fill = Number.isFinite(num) ? Math.min(100, Math.max(0, ((num - field.min) / (field.max - field.min)) * 100)) : 0
  const id = `f-${field.key}`
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="block">
          <span className="flex items-baseline gap-2">
            <span className="text-lg">{field.label}</span>
            <span className="font-mono text-xs text-muted">{field.symbol}</span>
          </span>
          <span className="mt-0.5 block text-sm text-muted">{field.hint}</span>
        </label>
        <motion.div animate={showError && error ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }} className="shrink-0">
          <div
            className={`flex items-baseline rounded-xl border bg-paper px-3 py-2 transition-colors focus-within:border-ink ${
              showError && error ? 'border-clay' : 'border-line'
            }`}
          >
            <input
              id={id}
              type="number"
              inputMode="decimal"
              step={field.step}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 bg-transparent text-right font-display text-2xl outline-none"
              aria-invalid={!!(showError && error)}
              aria-describedby={`${id}-err`}
            />
            {field.unit && <span className="ml-1 font-mono text-[0.65rem] text-muted">{field.unit}</span>}
          </div>
        </motion.div>
      </div>
      <input
        type="range"
        className="soil-range mt-2"
        min={field.min}
        max={field.max}
        step={field.step}
        value={Number.isFinite(num) ? Math.min(field.max, Math.max(field.min, num)) : field.min}
        onChange={(e) => onChange(e.target.value)}
        style={{ '--fill': `${fill}%` }}
        aria-label={`${field.label} slider`}
      />
      <div className="flex justify-between font-mono text-[0.62rem] text-muted">
        <span>{field.min}</span>
        <AnimatePresence>
          {showError && error && (
            <motion.span id={`${id}-err`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-clay">
              {error}
            </motion.span>
          )}
        </AnimatePresence>
        <span>{field.max}</span>
      </div>
    </div>
  )
}

function WeatherPanel({ district, weather, setWeather }) {
  const d = districtById(district)
  const [state, setState] = useState(weather.source === 'manual' ? 'manual' : weather.temperature !== '' ? 'live' : 'loading')
  const [err, setErr] = useState('')

  async function load() {
    setState('loading')
    setErr('')
    try {
      const w = await fetchWeather(d)
      setWeather({ temperature: String(w.temperature), humidity: String(w.humidity), rainfall: String(w.rainfall), source: 'live', observedAt: w.observedAt })
      setState('live')
    } catch (e) {
      setErr(e.name === 'AbortError' ? 'The weather service took too long to respond.' : 'Couldn’t reach the weather service.')
      setWeather((w) => ({ ...w, source: 'manual' }))
      setState('error')
    }
  }

  useEffect(() => {
    if (weather.source && weather.temperature !== '' && weather.district === district) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district])

  const editable = state === 'manual' || state === 'error'

  return (
    <div className="rounded-[28px] border border-line bg-paper-2 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted">Weather · {d.name}</span>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.62rem] ${
            state === 'live' ? 'bg-leaf text-paper' : state === 'loading' ? 'bg-paper-3 text-ink-2' : 'bg-wheat-light text-ink'
          }`}
        >
          {state === 'live' && (
            <motion.span className="h-1.5 w-1.5 rounded-full bg-paper" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          )}
          {state === 'live' ? 'live' : state === 'loading' ? 'fetching…' : 'manual'}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {WEATHER_FIELDS.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4 rounded-xl bg-paper px-4 py-3">
            <span className="text-ink-2">{f.label}</span>
            {state === 'loading' ? (
              <span className="shimmer h-7 w-24 rounded-md" />
            ) : editable ? (
              <span className="flex items-baseline">
                <input
                  type="number"
                  step={f.step}
                  value={weather[f.key]}
                  onChange={(e) => setWeather((w) => ({ ...w, [f.key]: e.target.value, source: 'manual' }))}
                  className="w-20 border-b border-line bg-transparent text-right font-display text-2xl outline-none focus:border-ink"
                  aria-label={f.label}
                  placeholder="—"
                />
                <span className="ml-1 font-mono text-[0.65rem] text-muted">{f.unit}</span>
              </span>
            ) : (
              <motion.span key={weather[f.key]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl">
                {weather[f.key]}
                <span className="ml-1 font-mono text-[0.65rem] text-muted">{f.unit}</span>
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {state === 'error' && <p className="mt-4 text-sm text-clay">{err} Enter the values yourself, or try again.</p>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-muted">
          {state === 'live' ? 'Source: Open-Meteo, current conditions and last 30 days of rain.' : 'Values you enter are used as-is.'}
        </span>
        <span className="flex gap-4">
          {state === 'live' && (
            <button onClick={() => setState('manual')} className="underline decoration-line underline-offset-4 hover:decoration-ink">
              Edit values
            </button>
          )}
          {(state === 'error' || state === 'manual') && (
            <button onClick={load} className="underline decoration-line underline-offset-4 hover:decoration-ink">
              Use live weather
            </button>
          )}
        </span>
      </div>
    </div>
  )
}

function InputStep({ district, soil, setSoil, weather, setWeather, onBack, onNext }) {
  const [tried, setTried] = useState(false)
  const errors = Object.fromEntries(SOIL_FIELDS.map((f) => [f.key, validate(f, soil[f.key])]))
  const wErrors = Object.fromEntries(WEATHER_FIELDS.map((f) => [f.key, validate(f, weather[f.key])]))
  const valid = !Object.values(errors).some(Boolean) && !Object.values(wErrors).some(Boolean)

  function submit() {
    setTried(true)
    if (valid) onNext()
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="rounded-[28px] border border-line bg-paper p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="eyebrow text-muted">Soil test values</span>
            <button
              onClick={() => setSoil(Object.fromEntries(SOIL_FIELDS.map((f) => [f.key, String(f.default)])))}
              className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
            >
              Fill sample values
            </button>
          </div>
          {SOIL_FIELDS.map((f) => (
            <NumberField
              key={f.key}
              field={f}
              value={soil[f.key]}
              error={errors[f.key]}
              showError={tried || soil[f.key] !== ''}
              onChange={(v) => setSoil((s) => ({ ...s, [f.key]: v }))}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-5">
        <WeatherPanel district={district} weather={weather} setWeather={setWeather} />
        {tried && !valid && <p className="text-sm text-clay">Some values are missing or out of range. Check the highlighted fields.</p>}
        <div className="flex gap-3">
          <button onClick={onBack} className="rounded-full border border-line px-6 py-4 transition-colors hover:border-ink">
            Back
          </button>
          <button
            onClick={submit}
            className="group flex flex-1 items-center justify-between rounded-full bg-ink px-7 py-4 text-paper transition-colors hover:bg-leaf"
          >
            Get recommendation
            <Arrow className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Step 3 ───────────────────────── */

function Analysing({ district }) {
  const d = districtById(district)
  const lines = [`Mapped ${d.name} to ${ZONES[d.zone].name}`, 'Validated soil and weather inputs', 'Scoring candidate crops']
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20">
        <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#E1D8C4" strokeWidth="3" />
        <motion.circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#3E6B39"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0.1, rotate: 0 }}
          animate={{ pathLength: [0.1, 0.7, 0.1], rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '40px', originY: '40px' }}
        />
      </svg>
      <ul className="mt-8 space-y-2 text-left">
        {lines.map((l, i) => (
          <motion.li
            key={l}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.25 }}
            className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3"
          >
            <motion.span
              className="grid h-5 w-5 place-items-center rounded-full bg-leaf text-[0.6rem] text-paper"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + i * 0.25, type: 'spring' }}
            >
              ✓
            </motion.span>
            {l}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function ResultStep({ district, soil, weather, results, loading, onEdit, onRestart }) {
  const d = districtById(district)
  const zone = ZONES[d.zone]
  if (loading || !results) return <Analysing district={district} />
  const [top, ...rest] = results

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {IS_SAMPLE_ENGINE && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-dashed border-wheat bg-wheat-light/40 px-4 py-3 text-sm">
            <span className="mt-0.5 rounded-full bg-wheat px-2 py-0.5 font-mono text-[0.6rem]">sample</span>
            <span className="text-ink-2">
              These results come from a placeholder scoring engine. They will be replaced by the trained model once the
              dataset is finalised.
            </span>
          </div>
        )}

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-paper md:p-10"
        >
          <motion.div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full"
            style={{ background: zone.hex, opacity: 0.25 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div>
              <span className="eyebrow text-paper/50">Best match · {top.season}</span>
              <h2 className="mt-3 text-6xl md:text-7xl">{top.crop}</h2>
            </div>
            <div className="text-right">
              <span className="font-display text-6xl md:text-7xl">{top.match}</span>
              <span className="ml-1 font-mono text-sm text-paper/50">/100</span>
              <span className="block font-mono text-[0.68rem] text-paper/50">match score</span>
            </div>
          </div>
          <div className="relative mt-8 h-1.5 overflow-hidden rounded-full bg-paper/10">
            <motion.div
              className="h-full rounded-full bg-wheat"
              initial={{ width: 0 }}
              animate={{ width: `${top.match}%` }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}
            />
          </div>
          <div className="relative mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <span className="eyebrow text-paper/50">Working for it</span>
              <ul className="mt-2 space-y-1">
                {top.supports.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sprout" /> {s} is close to ideal
                  </li>
                ))}
                {top.inZone && (
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sprout" /> Commonly grown in the {zone.name.toLowerCase()} zone
                  </li>
                )}
              </ul>
            </div>
            <div>
              <span className="eyebrow text-paper/50">Watch out for</span>
              <ul className="mt-2 space-y-1">
                {top.limits.length ? (
                  top.limits.map((l) => (
                    <li key={l.label} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-clay" /> {l.label} is {l.direction} for this crop
                    </li>
                  ))
                ) : (
                  <li className="text-paper/60">Nothing stands out.</li>
                )}
              </ul>
            </div>
          </div>
        </motion.article>

        <ol className="mt-4 space-y-3">
          {rest.map((r, i) => (
            <motion.li
              key={r.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: EASE }}
              className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/40"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-muted">0{i + 2}</span>
                  <span className="font-display text-2xl">{r.crop}</span>
                  <span className="hidden font-mono text-[0.68rem] text-muted sm:inline">{r.season}</span>
                </span>
                <span className="font-mono">{r.match}</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-3">
                <motion.div
                  className="h-full rounded-full bg-ink-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.match}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: EASE }}
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                Good fit on {r.supports.map(lower).join(' and ')}
                {r.limits.length ? `, but ${r.limits.map((l) => `${lower(l.label)} is ${l.direction}`).join(', ')}` : ''}.
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      <aside className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-line bg-paper-2 p-5">
          <span className="eyebrow text-muted">Your field</span>
          <p className="mt-2 font-display text-2xl">{d.name}</p>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm" style={{ background: zone.hex }}>
            {zone.name}
          </span>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
            {WEATHER_FIELDS.map((f) => (
              <div key={f.key}>
                <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">{f.key === 'rainfall' ? 'Rain 30d' : f.label}</dt>
                <dd className="mt-1 font-display text-lg">
                  {weather[f.key]}
                  <span className="ml-0.5 font-mono text-[0.6rem] text-muted">{f.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-[0.62rem] text-muted">Weather: {weather.source === 'live' ? 'live, Open-Meteo' : 'entered manually'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SOIL_FIELDS.map((f) => (
            <SoilGauge
              key={f.key}
              label={f.label}
              symbol={f.symbol}
              value={Number(soil[f.key])}
              min={f.min}
              max={f.max}
              bands={f.bands}
              bandLabels={f.bandLabels}
              decimals={f.key === 'ph' ? 1 : 0}
              immediate
            />
          ))}
        </div>

        <div className="no-print flex flex-col gap-2 pt-2">
          <button onClick={onEdit} className="rounded-full border border-line px-6 py-3.5 transition-colors hover:border-ink">
            Adjust soil values
          </button>
          <button onClick={() => window.print()} className="rounded-full border border-line px-6 py-3.5 transition-colors hover:border-ink">
            Print or save as PDF
          </button>
          <button onClick={onRestart} className="rounded-full bg-ink px-6 py-3.5 text-paper transition-colors hover:bg-leaf">
            Start over with another district
          </button>
        </div>
      </aside>
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

const emptySoil = Object.fromEntries(SOIL_FIELDS.map((f) => [f.key, '']))
const emptyWeather = { temperature: '', humidity: '', rainfall: '', source: null }

export default function Advisor() {
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [district, setDistrict] = useState(null)
  const [soil, setSoil] = useState(emptySoil)
  const [weather, setWeather] = useState(emptyWeather)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const scrollTo = useScrollTo()

  function go(i) {
    setStep(i)
    setMaxStep((m) => Math.max(m, i))
    scrollTo(0)
  }

  function chooseDistrict(id) {
    if (id !== district) {
      setWeather({ ...emptyWeather })
      setResults(null)
      setMaxStep(0)
    }
    setDistrict(id)
  }

  async function run() {
    go(2)
    setLoading(true)
    setResults(null)
    const d = districtById(district)
    const input = Object.fromEntries([
      ...SOIL_FIELDS.map((f) => [f.key, Number(soil[f.key])]),
      ...['temperature', 'humidity', 'rainfall'].map((k) => [k, Number(weather[k])]),
      ['zone', d.zone],
    ])
    const [res] = await Promise.all([recommend(input), new Promise((r) => setTimeout(r, 1100))])
    setResults(res)
    setLoading(false)
  }

  function restart() {
    setDistrict(null)
    setSoil(emptySoil)
    setWeather({ ...emptyWeather })
    setResults(null)
    setMaxStep(0)
    go(0)
  }

  const headings = [
    ['Where is your field?', 'Choose your district. We’ll work out the agro-climatic zone for you.'],
    ['What does your soil say?', 'Enter the values from your soil health card. Weather is filled in automatically.'],
    ['Here’s what fits your field.', 'Ranked by how well each crop matches your soil, weather and zone.'],
  ]

  return (
    <main className="min-h-screen pt-[100px] pb-24 md:pt-[120px]">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="no-print">
          <StepBar step={step} maxStep={maxStep} onGo={go} />
        </div>

        <div className="mt-12 mb-10 md:mt-16 md:mb-14">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}>
              <h1 className="text-[2.6rem] leading-[1] md:text-[4.4rem]">{headings[step][0]}</h1>
              <p className="mt-4 max-w-xl text-lg text-ink-2">{headings[step][1]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.section key={step} {...pane}>
            {step === 0 && <RegionStep district={district} setDistrict={chooseDistrict} onNext={() => go(1)} />}
            {step === 1 && (
              <InputStep
                district={district}
                soil={soil}
                setSoil={setSoil}
                weather={{ ...weather, district }}
                setWeather={(u) => setWeather((w) => ({ ...(typeof u === 'function' ? u(w) : u), district }))}
                onBack={() => go(0)}
                onNext={run}
              />
            )}
            {step === 2 && (
              <ResultStep
                district={district}
                soil={soil}
                weather={weather}
                results={results}
                loading={loading}
                onEdit={() => go(1)}
                onRestart={restart}
              />
            )}
          </motion.section>
        </AnimatePresence>

        {step === 0 && (
          <p className="mt-16 text-sm text-muted">
            Prefer to read first? <Link to="/#method" className="underline underline-offset-4">See how the advisor works</Link>.
          </p>
        )}
      </div>
    </main>
  )
}
