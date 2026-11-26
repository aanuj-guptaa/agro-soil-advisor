// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE RECOMMENDATION ENGINE
// This is a stand-in so the interface works end to end before the real model
// exists. Crop profiles below are PLACEHOLDER values, not agronomic advice.
//
// To connect the trained model, replace `recommend()` with a call to the backend,
// e.g. POST /api/recommend { n, p, k, ph, temperature, humidity, rainfall, zone }
// returning [{ crop, probability, drivers }]. The UI only depends on the shape
// of the object returned at the bottom of this file.
// ─────────────────────────────────────────────────────────────────────────────

export const IS_SAMPLE_ENGINE = true

// mean profile per crop + zones where it is commonly grown (placeholder)
const CROPS = [
  { crop: 'Rice', season: 'Kharif', n: 80, p: 48, k: 40, ph: 6.4, temperature: 24, humidity: 82, rainfall: 230, zones: ['central', 'sub'] },
  { crop: 'Wheat', season: 'Rabi', n: 85, p: 45, k: 40, ph: 7.1, temperature: 20, humidity: 60, rainfall: 80, zones: ['central', 'sw', 'sub'] },
  { crop: 'Maize', season: 'Kharif', n: 78, p: 48, k: 20, ph: 6.3, temperature: 22, humidity: 65, rainfall: 85, zones: ['sub', 'central'] },
  { crop: 'Cotton', season: 'Kharif', n: 118, p: 46, k: 20, ph: 7.0, temperature: 24, humidity: 80, rainfall: 80, zones: ['sw'] },
  { crop: 'Sugarcane', season: 'Annual', n: 100, p: 50, k: 50, ph: 6.8, temperature: 27, humidity: 70, rainfall: 150, zones: ['sub', 'central'] },
  { crop: 'Mustard', season: 'Rabi', n: 60, p: 40, k: 30, ph: 7.4, temperature: 18, humidity: 55, rainfall: 45, zones: ['sw', 'central'] },
  { crop: 'Chickpea', season: 'Rabi', n: 40, p: 68, k: 80, ph: 7.3, temperature: 19, humidity: 17, rainfall: 80, zones: ['sw'] },
  { crop: 'Moong', season: 'Zaid', n: 21, p: 47, k: 20, ph: 6.7, temperature: 28, humidity: 85, rainfall: 48, zones: ['sw', 'central'] },
  { crop: 'Potato', season: 'Rabi', n: 90, p: 60, k: 70, ph: 6.0, temperature: 18, humidity: 70, rainfall: 60, zones: ['central', 'sub'] },
  { crop: 'Sunflower', season: 'Spring', n: 60, p: 50, k: 40, ph: 7.0, temperature: 24, humidity: 55, rainfall: 60, zones: ['central'] },
  { crop: 'Lentil', season: 'Rabi', n: 19, p: 68, k: 19, ph: 6.9, temperature: 24, humidity: 65, rainfall: 46, zones: ['sub'] },
  { crop: 'Barley', season: 'Rabi', n: 55, p: 35, k: 30, ph: 7.6, temperature: 17, humidity: 50, rainfall: 40, zones: ['sw'] },
]

// how forgiving each feature is (≈ one standard deviation)
const SCALE = { n: 30, p: 22, k: 30, ph: 0.8, temperature: 5, humidity: 18, rainfall: 70 }
const LABEL = { n: 'Nitrogen', p: 'Phosphorus', k: 'Potassium', ph: 'Soil pH', temperature: 'Temperature', humidity: 'Humidity', rainfall: 'Rainfall' }
const FEATURES = Object.keys(SCALE)

function scoreCrop(profile, input) {
  const diffs = FEATURES.map((f) => {
    const z = (Number(input[f]) - profile[f]) / SCALE[f]
    return { feature: f, label: LABEL[f], z, fit: Math.exp(-0.5 * z * z) }
  })
  const meanSq = diffs.reduce((s, d) => s + d.z * d.z, 0) / diffs.length
  let score = Math.exp(-0.5 * meanSq)
  const inZone = profile.zones.includes(input.zone)
  score *= inZone ? 1 : 0.55
  return { score, diffs, inZone }
}

export async function recommend(input) {
  // simulate model latency so loading states are exercised
  await new Promise((r) => setTimeout(r, 900))

  const scored = CROPS.map((c) => ({ ...c, ...scoreCrop(c, input) }))
  const total = scored.reduce((s, c) => s + c.score, 0) || 1
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 5).map((c) => {
    const sorted = [...c.diffs].sort((a, b) => b.fit - a.fit)
    return {
      crop: c.crop,
      season: c.season,
      probability: c.score / total,
      match: Math.round(c.score * 100),
      inZone: c.inZone,
      supports: sorted.slice(0, 2).map((d) => d.label),
      limits: sorted.slice(-2).filter((d) => d.fit < 0.6).map((d) => ({ label: d.label, direction: d.z > 0 ? 'high' : 'low' })),
    }
  })
}
