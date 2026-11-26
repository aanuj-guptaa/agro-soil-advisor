# Agro Soil Advisor (website)

Region-aware crop recommendation for Punjab. React + Tailwind CSS + Vite, with Framer Motion and Lenis for animation.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Pages

- `/`: landing page (problem, agro-climatic zones, how it works, soil health, model and data, team)
- `/advisor`: the 3-step tool: district → soil and weather → ranked crops

## Where the placeholders are (swap these when the Kaggle dataset is final)

| What | File | Notes |
|---|---|---|
| Recommendation engine | `src/lib/engine.js` | Sample scoring with placeholder crop profiles. Replace `recommend()` with a call to the Flask/FastAPI backend. Keep the returned shape. Set `IS_SAMPLE_ENGINE = false` to hide the "sample" banner. |
| Input ranges and Low/Medium/Good/High bands | `src/data/soil.js` | Currently follow the common Kaggle crop-recommendation schema. Update from the real dataset statistics. |
| Model metrics, dataset name, row and class counts | `src/data/project.js` (`MODEL_STATS`, `DATASET`) | `null` shows as "—". |
| District → zone mapping, coordinates | `src/data/regions.js` | 23 districts in 3 zones as in the report. |

## Live data

Weather comes from Open-Meteo (free, no API key): current temperature and humidity plus the last 30 days of rain
(`src/lib/weather.js`). If it fails or times out, the form switches to manual entry.
