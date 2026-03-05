import type { UseBostonMapSimulationReturn } from "./hooks/use-boston-map-simulation";
import type { GeoJSONFeatureCollection } from "./api/parcels";

/** Context slice required by BostonMapView. App layout provides this via Outlet. */
export interface BostonMapViewContext {
  mapSim?: UseBostonMapSimulationReturn;
  parcelGeoJSON?: GeoJSONFeatureCollection | null;
}
