/**
 * Boston parcels via ArcGIS GeoServices REST API (Parcels25).
 * Layer: ASG.parcels_25 — POLY_TYPE identifies parcels, water, rights-of-way.
 * @see https://gisportal.boston.gov/arcgis/rest/services/Parcels/Parcels25/MapServer/0
 * @see https://data.boston.gov/dataset/parcels-2025
 */

const RECORD_COUNT = 2000;

/** Parcels 2025 MapServer layer (MaxRecordCount: 2000). */
const BOSTON_PARCELS_QUERY_URL =
  "https://gisportal.boston.gov/arcgis/rest/services/Parcels/Parcels25/MapServer/0/query";

export interface ParcelsQueryParams {
  /** Max records per request (default 2000). */
  resultRecordCount?: number;
  /** Offset for pagination. */
  resultOffset?: number;
  /** Optional SQL where clause (e.g. "POLY_TYPE='Parcel'"). */
  where?: string;
}

function buildQueryUrl(params: ParcelsQueryParams = {}): string {
  const {
    resultRecordCount = RECORD_COUNT,
    resultOffset = 0,
    where = "1=1",
  } = params;
  const search = new URLSearchParams({
    where,
    outFields: "*",
    returnGeometry: "true",
    f: "geojson",
    resultRecordCount: String(resultRecordCount),
    resultOffset: String(resultOffset),
  });
  return `${BOSTON_PARCELS_QUERY_URL}?${search.toString()}`;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: unknown;
    properties?: Record<string, unknown>;
  }>;
}

/**
 * Fetches one page of parcels GeoJSON from the Boston ArcGIS REST API.
 */
export async function fetchParcelsPage(
  params: ParcelsQueryParams = {}
): Promise<GeoJSONFeatureCollection> {
  const url = buildQueryUrl(params);
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Parcels API error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as GeoJSONFeatureCollection;
  if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
    throw new Error("Invalid GeoJSON from parcels API");
  }
  return data;
}

/**
 * Fetches all parcels (paginated). Stops when a page returns fewer than resultRecordCount features.
 * Use with caution: Boston has many parcels; consider a bbox or where clause to limit.
 */
export async function fetchAllParcels(
  options: { where?: string; maxRecords?: number } = {}
): Promise<GeoJSONFeatureCollection> {
  const { where = "1=1", maxRecords = 10000 } = options;
  const allFeatures: GeoJSONFeatureCollection["features"] = [];
  let offset = 0;

  while (true) {
    const page = await fetchParcelsPage({
      where,
      resultRecordCount: RECORD_COUNT,
      resultOffset: offset,
    });
    allFeatures.push(...page.features);
    if (page.features.length < RECORD_COUNT || allFeatures.length >= maxRecords) {
      break;
    }
    offset += RECORD_COUNT;
    if (offset >= maxRecords) break;
  }

  return {
    type: "FeatureCollection",
    features: allFeatures.slice(0, maxRecords),
  };
}

/**
 * Fetches parcels GeoJSON from a URL (e.g. local file in public/data/Parcels_2025.geojson).
 * Use when you want to avoid the live API or use a pre-downloaded file.
 * Large files (100MB+) may be slow to load in the browser.
 */
export async function fetchParcelsFromUrl(
  url: string
): Promise<GeoJSONFeatureCollection> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Parcels fetch error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as GeoJSONFeatureCollection;
  if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
    throw new Error("Invalid GeoJSON");
  }
  return data;
}
