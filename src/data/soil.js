// Input ranges, validation limits and Low / Medium / Good / High bands.
// PLACEHOLDER VALUES: the ranges below follow the common Kaggle crop-recommendation
// schema (N, P, K as soil ratios, pH, temperature °C, humidity %, rainfall mm).
// Replace them with the statistics of the final dataset once it is chosen.

export const SOIL_FIELDS = [
  {
    key: 'n',
    label: 'Nitrogen',
    symbol: 'N',
    unit: 'ratio',
    min: 0,
    max: 140,
    step: 1,
    default: 80,
    hint: 'From your soil health card. Drives leaf and stem growth.',
    bands: [35, 70, 105], // Low < 35 ≤ Medium < 70 ≤ Good < 105 ≤ High
  },
  {
    key: 'p',
    label: 'Phosphorus',
    symbol: 'P',
    unit: 'ratio',
    min: 5,
    max: 145,
    step: 1,
    default: 45,
    hint: 'Roots, flowering and grain fill.',
    bands: [25, 50, 90],
  },
  {
    key: 'k',
    label: 'Potassium',
    symbol: 'K',
    unit: 'ratio',
    min: 5,
    max: 205,
    step: 1,
    default: 40,
    hint: 'Water regulation and disease resistance.',
    bands: [25, 45, 110],
  },
  {
    key: 'ph',
    label: 'Soil pH',
    symbol: 'pH',
    unit: '',
    min: 3.5,
    max: 9.9,
    step: 0.1,
    default: 6.8,
    hint: '7 is neutral. Punjab soils trend alkaline in the south-west.',
    bands: [5.5, 6.5, 7.5],
    bandLabels: ['Acidic', 'Slightly acidic', 'Neutral', 'Alkaline'],
  },
]

export const WEATHER_FIELDS = [
  { key: 'temperature', label: 'Temperature', unit: '°C', min: -5, max: 50, step: 0.1 },
  { key: 'humidity', label: 'Humidity', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'rainfall', label: 'Rainfall, last 30 days', unit: 'mm', min: 0, max: 600, step: 1 },
]

export const BAND_NAMES = ['Low', 'Medium', 'Good', 'High']

export function bandIndex(value, bands) {
  if (value < bands[0]) return 0
  if (value < bands[1]) return 1
  if (value < bands[2]) return 2
  return 3
}

export function validate(field, raw) {
  if (raw === '' || raw === null || raw === undefined) return 'Required'
  const v = Number(raw)
  if (Number.isNaN(v)) return 'Enter a number'
  if (v < field.min || v > field.max) return `Must be between ${field.min} and ${field.max}`
  return null
}

// Concept dashboard extras from the report's Soil Health Dashboard (Figure 31).
export const DEMO_SECONDARY = [
  { key: 'oc', label: 'Organic carbon', unit: '%', value: 0.48, max: 1.2, bands: [0.4, 0.6, 0.75] },
  { key: 'moisture', label: 'Moisture', unit: '%', value: 22, max: 45, bands: [12, 20, 30] },
]
