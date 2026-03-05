import { useState, useEffect } from "react";
import {
  fetchParcelsPage,
  fetchParcelsFromUrl,
} from "../api/parcels";
import type { GeoJSONFeatureCollection } from "../api/parcels";
import { buildParcelTopology } from "../utils/parcel-topology";
import type { TopologyMap } from "../../../types/cellular-automata";

export interface ParcelDataResult {
  parcels: GeoJSONFeatureCollection | null;
  topology: TopologyMap;
  cellCount: number;
  ready: boolean;
}

const MOCK_PARCELS_URL = "http://localhost:3001/parcels";

function getParcelsSource(): { type: "url"; url: string } | { type: "api" } {
  const envUrl = import.meta.env.VITE_PARCELS_URL as string | undefined;
  if (envUrl != null && envUrl !== "") return { type: "url", url: envUrl };
  if (import.meta.env.DEV) return { type: "url", url: MOCK_PARCELS_URL };
  return { type: "api" };
}

export function useParcelData(): ParcelDataResult {
  const [parcels, setParcels] = useState<GeoJSONFeatureCollection | null>(null);
  const source = getParcelsSource();

  useEffect(() => {
    let cancelled = false;
    const load =
      source.type === "url"
        ? fetchParcelsFromUrl(source.url)
        : fetchParcelsPage({
            resultRecordCount: 2000,
            resultOffset: 0,
            where: "POLY_TYPE='Parcel'",
          });
    load
      .then((data) => {
        if (!cancelled) setParcels(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Parcel data load failed:", err);
          setParcels(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [source.type === "url" ? source.url : "api"]);

  const topology = parcels
    ? buildParcelTopology(parcels as Parameters<typeof buildParcelTopology>[0])
    : {};
  const cellCount = parcels?.features?.length ?? 0;
  const ready = cellCount > 0;

  return {
    parcels,
    topology,
    cellCount,
    ready,
  };
}
