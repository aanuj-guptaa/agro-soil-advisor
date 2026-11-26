// Live weather from Open-Meteo (free, no API key).
// Returns current temperature and humidity plus total rainfall over the last 30 days.
// If the request fails or times out, the caller falls back to manual entry
// (graceful degradation, SRS 2.2.4.4).

const cache = new Map()

export async function fetchWeather({ lat, lon }, { timeoutMs = 7000 } = {}) {
  const key = `${lat},${lon}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < 15 * 60 * 1000) return hit.data

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum` +
    `&past_days=30&forecast_days=1&timezone=Asia%2FKolkata`

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`Weather service returned ${res.status}`)
    const json = await res.json()
    const rain = (json.daily?.precipitation_sum ?? []).slice(0, 30).reduce((s, v) => s + (v ?? 0), 0)
    const data = {
      temperature: Math.round(json.current.temperature_2m * 10) / 10,
      humidity: Math.round(json.current.relative_humidity_2m),
      rainfall: Math.round(rain),
      observedAt: json.current.time,
      source: 'Open-Meteo',
    }
    cache.set(key, { at: Date.now(), data })
    return data
  } finally {
    clearTimeout(timer)
  }
}
