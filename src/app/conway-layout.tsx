import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppContainer } from "./app-styles";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { PerformanceBar } from "./components/performance-bar";
import { ImplementationDetailsPanel } from "./components/implementation-details-panel";
import { usePerformanceMonitor } from "./hooks/use-performance-monitor";
import { useConwaySimulation } from "../features/conway/hooks/use-conway-simulation";
import { useBostonMapSimulation } from "../features/boston-map/hooks/use-boston-map-simulation";
import { useParcelData } from "../features/boston-map/hooks/use-parcel-data";
import type { GeoJSONFeatureCollection } from "../features/boston-map/api/parcels";
import type { Matrix3D } from "../features/conway/types";
import type { ComputeStrategy, GridDimensions } from "../features/conway/worker/conway-rules";
import { getStrategyMeta, DEFAULT_V2_STRATEGY } from "../features/conway/worker/conway-strategy-metadata";
import type { UseBostonMapSimulationReturn } from "../features/boston-map/hooks/use-boston-map-simulation";

export interface ConwayLayoutContext {
  curr: Matrix3D;
  counter: number;
  animation: boolean;
  outline: boolean;
  onGoing: boolean;
  n: number;
  strategy: ComputeStrategy;
  dimensions: GridDimensions;
  onReset: () => void;
  onNext: () => void;
  implementChangeState: () => Promise<void>;
  setAnimation: (v: boolean) => void;
  setOutline: (v: boolean) => void;
  setOnGoing: (v: boolean) => void;
  setStrategy: (s: ComputeStrategy) => void;
  setDimensions: (d: GridDimensions) => void;
  /** V3: Boston map simulation. */
  mapSim?: UseBostonMapSimulationReturn;
  /** V3: parcel GeoJSON for map fill layer. */
  parcelGeoJSON?: GeoJSONFeatureCollection | null;
}

export function ConwayLayout() {
  const simulation = useConwaySimulation();
  const parcelData = useParcelData();
  const mapSim = useBostonMapSimulation({
    topology: parcelData.topology,
    cellCount: parcelData.cellCount,
    rulePreset: "conway",
    initialAliveFraction: 0.35,
  });
  const { pathname } = useLocation();
  const isMapView = pathname.startsWith("/v3") || pathname.startsWith("/v4");
  const perfSnapshot = usePerformanceMonitor(simulation.lastStepMs);

  useEffect(() => {
    if (pathname.startsWith("/v1")) {
      simulation.setStrategy("nested");
    } else if (pathname.startsWith("/v2") && (simulation.strategy === "nested" || simulation.strategy === "explicit-topology")) {
      simulation.setStrategy(DEFAULT_V2_STRATEGY);
    }
  }, [pathname, simulation.strategy, simulation.setStrategy]);

  const context: ConwayLayoutContext = {
    curr: simulation.curr,
    counter: simulation.counter,
    animation: simulation.animation,
    outline: simulation.outline,
    onGoing: simulation.onGoing,
    n: simulation.n,
    strategy: simulation.strategy,
    dimensions: simulation.dimensions,
    onReset: simulation.onReset,
    onNext: simulation.implementChangeState,
    implementChangeState: simulation.implementChangeState,
    setAnimation: simulation.setAnimation,
    setOutline: simulation.setOutline,
    setOnGoing: simulation.setOnGoing,
    setStrategy: simulation.setStrategy,
    setDimensions: simulation.setDimensions,
    mapSim,
    parcelGeoJSON: parcelData.parcels,
  };

  return (
    <SidebarProvider>
      <AppContainer className="flex h-screen w-full flex-col">
        <PerformanceBar
          snapshot={perfSnapshot}
          simulation={
            isMapView
              ? undefined
              : {
                  n: simulation.n,
                  dimensions: simulation.dimensions,
                  strategy: simulation.strategy,
                  avgStepMs: simulation.avgStepMs,
                  stepSampleCount: simulation.stepSampleCount,
                }
          }
          mapContext={
            isMapView && parcelData.ready
              ? (() => {
                  if (pathname.startsWith("/v4")) {
                    return {
                      parcelCount: parcelData.cellCount,
                      rulePreset: "conway" as const,
                      counter: 0,
                      timeComplexity: "—",
                      spaceComplexity: "—",
                    };
                  }
                  const mapMeta = getStrategyMeta("explicit-topology");
                  return {
                    parcelCount: parcelData.cellCount,
                    rulePreset: mapSim.rulePreset,
                    counter: mapSim.counter,
                    timeComplexity: mapMeta?.timeComplexity ?? "—",
                    spaceComplexity: mapMeta?.spaceComplexity ?? "—",
                  };
                })()
              : undefined
          }
          className="shrink-0"
        />
        <ImplementationDetailsPanel
          version={
            pathname.startsWith("/v4")
              ? "v4"
              : pathname.startsWith("/v3")
                ? "v3"
                : pathname.startsWith("/v2")
                  ? "v2"
                  : "v1"
          }
          className="shrink-0"
        />
        <div className="flex min-h-0 flex-1">
          <AppSidebar
            ctx={context}
            onAdjustCubeCount={simulation.adjustCubeCount}
          />
          <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1">
              <Outlet context={context} />
            </div>
            <div
              id="implementation-details-portal"
              className="pointer-events-none absolute inset-0 z-10"
              aria-hidden
            />
          </main>
        </div>
      </AppContainer>
    </SidebarProvider>
  );
}
