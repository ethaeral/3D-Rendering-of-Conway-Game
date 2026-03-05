import React, { useMemo, useRef, useEffect, useState } from "react";
import MapboxMap, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MapboxMapType } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import type { GeoJSONFeatureCollection } from "../api/parcels";
import type { CellState } from "../../../types/cellular-automata";

const BOSTON_CENTER = { longitude: -71.06, latitude: 42.36 };
const BOSTON_ZOOM = 11;

/** Bounds [SW, NE] — restricts panning to greater Boston area. */
const BOSTON_BOUNDS: [[number, number], [number, number]] = [
  [-71.28, 42.12],
  [-70.82, 42.48],
];
const BOSTON_MIN_ZOOM = 9;

/** Throttle map visual updates to avoid tanking FPS (max ~8 updates/sec). */
const MAP_UPDATE_THROTTLE_MS = 120;
/** Chunk size for setFeatureState so we don't block main thread (e.g. 99k parcels). */
const FEATURE_STATE_CHUNK = 5000;

/**
 * Mapbox billing: only map loads count (initial Map init). Updating the source
 * or layer filters does not count as additional API calls.
 * @see https://docs.mapbox.com/help/glossary/map-loads/
 * Performance: static GeoJSON + feature-state for alive/dead; no large filter
 * and throttled updates to keep refresh rate up.
 * @see https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance
 */

export interface BostonMapProps {
  getCells: () => CellState[];
  /** When set (Conway path): use buffer + delta updates (only changed parcels). */
  getAliveBuffer?: () => Uint8Array | null;
  counter: number;
  parcelGeoJSON: GeoJSONFeatureCollection | null;
  mapboxAccessToken: string;
  className?: string;
}

/** Static parcel GeoJSON with top-level id per feature (required for setFeatureState). */
function useStaticParcelSource(parcelGeoJSON: GeoJSONFeatureCollection | null) {
  return useMemo(() => {
    if (!parcelGeoJSON?.features?.length) return null;
    const features = parcelGeoJSON.features.map((f, i) => ({
      ...f,
      id: i,
      properties: { ...f.properties, __index: i },
    }));
    return { type: "FeatureCollection" as const, features };
  }, [parcelGeoJSON]);
}

function syncFeatureState(
  map: MapboxMapType,
  cells: CellState[],
  sourceId: string,
  chunkSize: number
): void {
  const source = map.getSource(sourceId);
  if (!source) return;
  const n = cells.length;
  let i = 0;
  function runChunk() {
    const end = Math.min(i + chunkSize, n);
    for (; i < end; i++) {
      try {
        map.setFeatureState({ source: sourceId, id: i }, { alive: cells[i].isAlive });
      } catch {
        return;
      }
    }
    if (i < n) requestAnimationFrame(runChunk);
  }
  runChunk();
}

/** Only update parcels whose alive state changed; then copy current into previous. */
function syncFeatureStateDelta(
  map: MapboxMapType,
  current: Uint8Array,
  previousRef: React.MutableRefObject<Uint8Array | null>,
  sourceId: string,
  chunkSize: number
): void {
  const source = map.getSource(sourceId);
  if (!source) return;
  const n = current.length;
  const prev = previousRef.current;
  if (prev == null || prev.length !== n) {
    previousRef.current = current.slice();
    let i = 0;
    function runChunk() {
      const end = Math.min(i + chunkSize, n);
      for (; i < end; i++) {
        try {
          map.setFeatureState({ source: sourceId, id: i }, { alive: current[i] === 1 });
        } catch {
          return;
        }
      }
      if (i < n) requestAnimationFrame(runChunk);
    }
    runChunk();
    return;
  }
  const changed: number[] = [];
  for (let i = 0; i < n; i++) {
    if (current[i] !== prev[i]) changed.push(i);
  }
  previousRef.current = current.slice();
  let idx = 0;
  function runChunk() {
    const end = Math.min(idx + chunkSize, changed.length);
    for (; idx < end; idx++) {
      const i = changed[idx];
      try {
        map.setFeatureState({ source: sourceId, id: i }, { alive: current[i] === 1 });
      } catch {
        return;
      }
    }
    if (idx < changed.length) requestAnimationFrame(runChunk);
  }
  runChunk();
}

export function BostonMap({
  getCells,
  getAliveBuffer,
  counter,
  parcelGeoJSON,
  mapboxAccessToken,
  className = "",
}: BostonMapProps) {
  const staticParcels = useStaticParcelSource(parcelGeoJSON);
  const mapRef = useRef<MapboxMapType | null>(null);
  const previousSyncedRef = useRef<Uint8Array | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const throttleRef = useRef<{ last: number; timer: ReturnType<typeof setTimeout> | null }>({
    last: 0,
    timer: null,
  });

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !staticParcels || !mapReady) return;
    const run = () => {
      const m = mapRef.current;
      if (!m) return;
      throttleRef.current.last = Date.now();
      throttleRef.current.timer = null;
      const buf = getAliveBuffer?.();
      if (buf != null) {
        syncFeatureStateDelta(m, buf, previousSyncedRef, "boston-parcels", FEATURE_STATE_CHUNK);
      } else {
        syncFeatureState(m, getCells(), "boston-parcels", FEATURE_STATE_CHUNK);
      }
    };
    const now = Date.now();
    const elapsed = now - throttleRef.current.last;
    if (elapsed >= MAP_UPDATE_THROTTLE_MS || throttleRef.current.last === 0) {
      run();
    } else if (!throttleRef.current.timer) {
      throttleRef.current.timer = setTimeout(run, MAP_UPDATE_THROTTLE_MS - elapsed);
    }
    return () => {
      if (throttleRef.current.timer) {
        clearTimeout(throttleRef.current.timer);
        throttleRef.current.timer = null;
      }
    };
  }, [counter, getCells, getAliveBuffer, staticParcels, mapReady]);

  if (!mapboxAccessToken) {
    return (
      <div
        className={
          "flex items-center justify-center bg-slate-900 text-slate-400 " +
          className
        }
      >
        <p className="text-sm">
          Set <code className="rounded bg-slate-800 px-1">VITE_MAPBOX_ACCESS_TOKEN</code> to show the map.
        </p>
      </div>
    );
  }

  if (!staticParcels) {
    return (
      <div
        className={
          "flex items-center justify-center bg-slate-900 text-slate-400 " +
          className
        }
      >
        <p className="text-sm">Loading parcels…</p>
      </div>
    );
  }

  const onMapLoad = (e: { target: MapboxMapType }) => {
    mapRef.current = e.target;
    setMapReady(true);
  };

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <MapboxMap
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={{
          ...BOSTON_CENTER,
          zoom: BOSTON_ZOOM,
        }}
        maxBounds={BOSTON_BOUNDS}
        minZoom={BOSTON_MIN_ZOOM}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={onMapLoad}
      >
        <Source
          id="boston-parcels"
          type="geojson"
          data={staticParcels as FeatureCollection}
        >
          <Layer
            id="boston-parcels-fill"
            type="fill"
            paint={{
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "alive"], false],
                "rgb(16, 185, 129)",
                "rgba(51, 65, 85, 0.6)",
              ],
              "fill-opacity": 0.85,
              "fill-outline-color": "rgba(148, 163, 184, 0.4)",
            }}
          />
        </Source>
      </MapboxMap>
    </div>
  );
}
