// Project facts taken from the proposal and the mid-semester report.

export const PROJECT = {
  name: 'Agro Soil Advisor',
  tagline: 'Smart Crop Recommendation System',
  cpg: 'CPG No. 280',
  institute: 'Thapar Institute of Engineering and Technology, Patiala',
  department: 'Computer Science and Engineering Department',
  year: '2026',
}

export const MENTORS = [
  { name: 'Dr. Rinkle Rani', title: 'Professor', role: 'Mentor' },
  { name: 'Dr. Nidhi Kalra', title: 'Assistant Professor', role: 'Co-mentor' },
]

export const TEAM = [
  { name: 'Jashan Aggarwal', roll: '102303333', role: 'Dataset preparation and model integration', area: 'Data · ML' },
  { name: 'Anuj Gupta', roll: '102303309', role: 'Frontend development, UI/UX design and testing', area: 'Frontend' },
  { name: 'Tanishak Bansal', roll: '102303398', role: 'Machine learning model development and training', area: 'ML' },
  { name: 'Rakshit Bhadu', roll: '102303023', role: 'Data collection, EDA, soil and agro-climatic zones', area: 'Data' },
  { name: 'Apurv Sharma', roll: '102483087', role: 'Backend API development (Flask / FastAPI)', area: 'Backend' },
]

export const NEEDS = [
  {
    no: '01',
    title: 'Soil is out of balance',
    body: 'Decades of intensive, fertiliser-heavy farming have left NPK levels uneven across large parts of Punjab. Advice has to start from the field’s own test results.',
  },
  {
    no: '02',
    title: 'Water is running out',
    body: 'Paddy is water-hungry and water tables keep falling. Diversifying into crops that suit local conditions is one of the few levers a farmer controls.',
  },
  {
    no: '03',
    title: 'Advice is one-size-fits-all',
    body: 'SMS and app advisories give the same message to a whole region. They don’t read your NPK, your pH, or which part of the state you farm in.',
  },
]

export const PIPELINE = [
  {
    key: 'region',
    title: 'Pick your district',
    body: 'Choose any of Punjab’s districts on the map or from the list. No sign-up, no form to fill first.',
    meta: 'Region selector',
  },
  {
    key: 'zone',
    title: 'We place it in a zone',
    body: 'The district is mapped to its agro-climatic zone, so a farmer in Gurdaspur and one in Bathinda get different climatic assumptions, even with identical soil.',
    meta: 'Zone classifier',
  },
  {
    key: 'inputs',
    title: 'Soil test plus live weather',
    body: 'You enter N, P, K and pH from your soil health card. Temperature, humidity and recent rainfall are pulled in automatically, with manual entry as a fallback.',
    meta: 'Validation · Weather API',
  },
  {
    key: 'model',
    title: 'The model scores every crop',
    body: 'Inputs are standardised, the zone is one-hot encoded, and a Random Forest classifier gives each candidate crop a probability.',
    meta: 'Recommendation engine',
  },
  {
    key: 'output',
    title: 'A ranked, explained shortlist',
    body: 'You get the top crops with a confidence score, plus the soil and weather values that pushed each one up or down. No black box.',
    meta: 'Results dashboard',
  },
]

export const ALGORITHMS = [
  { name: 'Random Forest', role: 'Primary', accuracy: 'High', robustness: 'High', speed: 'Medium', interpretability: 'Medium' },
  { name: 'Support Vector Machine', role: 'Comparison', accuracy: 'High', robustness: 'Medium', speed: 'Medium', interpretability: 'Low' },
  { name: 'Naive Bayes', role: 'Comparison', accuracy: 'Medium', robustness: 'Medium', speed: 'High', interpretability: 'Medium' },
  { name: 'k-Nearest Neighbours', role: 'Comparison', accuracy: 'Medium', robustness: 'Low', speed: 'Medium', interpretability: 'High' },
]

// PLACEHOLDERS: fill these in once the Kaggle dataset and trained model are final.
export const MODEL_STATS = [
  { label: 'Accuracy', value: null, hint: 'Held-out test split' },
  { label: 'Macro F1', value: null, hint: 'Averaged over all crop classes' },
  { label: 'Precision', value: null, hint: 'Macro average' },
  { label: 'Recall', value: null, hint: 'Macro average' },
]

export const DATASET = {
  name: 'Dataset to be finalised',
  source: 'Kaggle (to be linked)',
  rows: null,
  crops: null,
  features: ['N', 'P', 'K', 'pH', 'Temperature', 'Humidity', 'Rainfall', 'Agro-climatic zone'],
}
