# Boston parcels data

- **Parcels_2025.geojson** — Downloaded from [Boston Parcels (2025)](https://data.boston.gov/dataset/parcels-2025) / [ArcGIS MapServer](https://gisportal.boston.gov/arcgis/rest/services/Parcels/Parcels25/MapServer/0). Polygons for parcels, water, and rights-of-way; `POLY_TYPE` identifies the type.

**Behavior:**
- **Development:** Run the mock API so the app can load parcels from this file: `npm run parcels-api` (serves `http://localhost:3001/parcels`). Keep it running in a separate terminal while using `npm run dev`.
- **Production:** The map uses the live ArcGIS API (first 2000 parcel records).

Optional: set `VITE_PARCELS_URL` to override the source (e.g. a different URL in dev). Set `PARCELS_API_PORT` when running the mock API to use another port.
