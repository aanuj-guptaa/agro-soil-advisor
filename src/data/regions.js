// Punjab districts mapped to the three agro-climatic zones used in the project report.
// Tile positions (col, row) form a rough geographic cartogram, north at the top.
// Coordinates are district headquarters, used for the live weather lookup.

export const ZONES = {
  sub: {
    id: 'sub',
    name: 'Sub-mountainous',
    short: 'Sub-mountain',
    color: 'var(--color-zone-sub)',
    hex: '#4f7a4a',
    rainfall: '≈ 800 to 1,000+ mm / yr',
    soil: 'Loamy to sandy-loam, better organic content',
    climate: 'Wettest belt, cooler, at the Shivalik foothills',
    crops: ['Maize', 'Sugarcane', 'Rice', 'Wheat'],
    blurb:
      'The north-eastern foothill belt. More rain, rolling terrain and loamy soils make it the most balanced zone, but run-off and erosion matter here.',
  },
  central: {
    id: 'central',
    name: 'Central plain',
    short: 'Central',
    color: 'var(--color-zone-central)',
    hex: '#d8a23e',
    rainfall: '≈ 500 to 750 mm / yr',
    soil: 'Deep alluvial loam, highly fertile',
    climate: 'Assured canal and tube-well irrigation',
    crops: ['Wheat', 'Rice', 'Potato', 'Maize'],
    blurb:
      'The fertile heart of the state and the home of the wheat to paddy rotation. Productive, but the most exposed to falling water tables and nutrient imbalance.',
  },
  sw: {
    id: 'sw',
    name: 'South-western',
    short: 'South-west',
    color: 'var(--color-zone-sw)',
    hex: '#c0714a',
    rainfall: '≈ 300 to 400 mm / yr',
    soil: 'Light, sandy soils, often alkaline',
    climate: 'Semi-arid, hot summers, bordering Rajasthan',
    crops: ['Cotton', 'Mustard', 'Wheat', 'Moong'],
    blurb:
      'The semi-arid tract along the Rajasthan border. Low rainfall, higher alkalinity and lower potassium call for very different choices.',
  },
}

export const DISTRICTS = [
  { id: 'pathankot', name: 'Pathankot', abbr: 'PTK', zone: 'sub', col: 4, row: 0, lat: 32.27, lon: 75.65 },
  { id: 'amritsar', name: 'Amritsar', abbr: 'ASR', zone: 'central', col: 2, row: 1, lat: 31.63, lon: 74.87 },
  { id: 'gurdaspur', name: 'Gurdaspur', abbr: 'GSP', zone: 'sub', col: 3, row: 1, lat: 32.04, lon: 75.4 },
  { id: 'hoshiarpur', name: 'Hoshiarpur', abbr: 'HSP', zone: 'sub', col: 4, row: 1, lat: 31.53, lon: 75.91 },
  { id: 'tarntaran', name: 'Tarn Taran', abbr: 'TTN', zone: 'central', col: 2, row: 2, lat: 31.45, lon: 74.93 },
  { id: 'kapurthala', name: 'Kapurthala', abbr: 'KPT', zone: 'central', col: 3, row: 2, lat: 31.38, lon: 75.38 },
  { id: 'jalandhar', name: 'Jalandhar', abbr: 'JAL', zone: 'central', col: 4, row: 2, lat: 31.33, lon: 75.58 },
  { id: 'sbsnagar', name: 'SBS Nagar', abbr: 'SBS', zone: 'sub', col: 5, row: 2, lat: 31.12, lon: 76.12 },
  { id: 'rupnagar', name: 'Rupnagar', abbr: 'RPR', zone: 'sub', col: 6, row: 2, lat: 30.97, lon: 76.53 },
  { id: 'ferozepur', name: 'Ferozepur', abbr: 'FZR', zone: 'sw', col: 1, row: 3, lat: 30.93, lon: 74.61 },
  { id: 'faridkot', name: 'Faridkot', abbr: 'FDK', zone: 'sw', col: 2, row: 3, lat: 30.67, lon: 74.76 },
  { id: 'moga', name: 'Moga', abbr: 'MOG', zone: 'central', col: 3, row: 3, lat: 30.82, lon: 75.17 },
  { id: 'ludhiana', name: 'Ludhiana', abbr: 'LDH', zone: 'central', col: 4, row: 3, lat: 30.9, lon: 75.86 },
  { id: 'fatehgarh', name: 'Fatehgarh Sahib', abbr: 'FGS', zone: 'central', col: 5, row: 3, lat: 30.65, lon: 76.39 },
  { id: 'sasnagar', name: 'SAS Nagar', abbr: 'SAS', zone: 'sub', col: 6, row: 3, lat: 30.7, lon: 76.72 },
  { id: 'fazilka', name: 'Fazilka', abbr: 'FZK', zone: 'sw', col: 0, row: 4, lat: 30.4, lon: 74.03 },
  { id: 'muktsar', name: 'Sri Muktsar Sahib', abbr: 'MKT', zone: 'sw', col: 1, row: 4, lat: 30.47, lon: 74.52 },
  { id: 'bathinda', name: 'Bathinda', abbr: 'BTI', zone: 'sw', col: 2, row: 4, lat: 30.21, lon: 74.95 },
  { id: 'barnala', name: 'Barnala', abbr: 'BNL', zone: 'central', col: 3, row: 4, lat: 30.38, lon: 75.55 },
  { id: 'malerkotla', name: 'Malerkotla', abbr: 'MLK', zone: 'central', col: 4, row: 4, lat: 30.53, lon: 75.88 },
  { id: 'patiala', name: 'Patiala', abbr: 'PTL', zone: 'central', col: 5, row: 4, lat: 30.34, lon: 76.39 },
  { id: 'mansa', name: 'Mansa', abbr: 'MNS', zone: 'sw', col: 2, row: 5, lat: 29.99, lon: 75.39 },
  { id: 'sangrur', name: 'Sangrur', abbr: 'SGR', zone: 'central', col: 3, row: 5, lat: 30.25, lon: 75.84 },
]

export const districtById = (id) => DISTRICTS.find((d) => d.id === id)
export const zoneOf = (districtId) => ZONES[districtById(districtId)?.zone]
