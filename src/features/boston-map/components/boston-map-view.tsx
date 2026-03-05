import React from "react";
import { useOutletContext } from "react-router-dom";
import { BostonMap } from "./boston-map";
import type { BostonMapViewContext } from "../types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "";

export function BostonMapView() {
  const ctx = useOutletContext<BostonMapViewContext>();
  const sim = ctx.mapSim;
  if (!sim) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
        <p className="text-sm">Map simulation not available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-950">
      <BostonMap
        getCells={sim.getCells}
        getAliveBuffer={sim.getAliveBuffer}
        counter={sim.counter}
        parcelGeoJSON={ctx.parcelGeoJSON ?? null}
        mapboxAccessToken={MAPBOX_TOKEN}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
