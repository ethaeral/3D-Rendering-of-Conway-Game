import React from "react";
import { useOutletContext } from "react-router-dom";
import { BostonMap } from "./boston-map";
import type { BostonMapViewContext } from "../types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "";

export function BostonMapView({ parcelsOnly = false }: { parcelsOnly?: boolean }) {
  const ctx = useOutletContext<BostonMapViewContext>();
  const sim = ctx.mapSim;
  const parcelGeoJSON = ctx.parcelGeoJSON ?? null;

  if (!parcelGeoJSON && !sim) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
        <p className="text-sm">Map not available.</p>
      </div>
    );
  }

  if (!parcelsOnly && sim) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-slate-950">
        <BostonMap
          getCells={sim.getCells}
          getAliveBuffer={sim.getAliveBuffer}
          counter={sim.counter}
          parcelGeoJSON={parcelGeoJSON}
          mapboxAccessToken={MAPBOX_TOKEN}
          className="min-h-0 flex-1"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-950">
      <BostonMap
        parcelGeoJSON={parcelGeoJSON}
        mapboxAccessToken={MAPBOX_TOKEN}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
