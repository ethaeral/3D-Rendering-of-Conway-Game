import React from "react";
import type {
  PerformanceSnapshot,
  SimulationContext,
} from "../hooks/use-performance-monitor";
import { getStrategyMeta } from "../../features/conway/worker/conway-strategy-metadata";
import { getMapRulePreset } from "../../features/boston-map/rules/presets";

export interface MapContext {
  parcelCount: number;
  rulePreset: string;
  counter: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface PerformanceBarProps {
  snapshot: PerformanceSnapshot;
  simulation?: SimulationContext | null;
  mapContext?: MapContext | null;
  className?: string;
}

function formatN(n: number, dimensions: 2 | 3): string {
  return dimensions === 2 ? `${n}²` : `${n}³`;
}

function stateSize(n: number, dimensions: 2 | 3): number {
  return dimensions === 2 ? n * n : n * n * n;
}

const NA = <span className="text-white/40">N/A</span>;

function MetricRow({
  label,
  value,
  valueClassName = "tabular-nums text-sky-300/90",
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white/50">{label}</span>
      <span className={valueClassName}>{value ?? NA}</span>
    </div>
  );
}

function rulePresetLabel(rulePreset: string): string {
  try {
    return getMapRulePreset(rulePreset as "conway" | "high-life" | "maze").label;
  } catch {
    return rulePreset;
  }
}

export function PerformanceBar({
  snapshot,
  simulation = null,
  mapContext = null,
  className = "",
}: PerformanceBarProps) {
  const { fps, frameMs } = snapshot;
  const isMap = mapContext != null;
  const N = simulation ? stateSize(simulation.n, simulation.dimensions) : 0;
  const avgMs = simulation?.avgStepMs ?? null;
  const nSamples = simulation?.stepSampleCount ?? 0;
  const useAvg = nSamples > 0 && avgMs != null && avgMs > 0;
  const throughput =
    useAvg && N > 0 && !isMap
      ? (N / (avgMs / 1000)).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " cells/s"
      : null;
  const meta = simulation ? getStrategyMeta(simulation.strategy) : undefined;
  const algoLabel = meta?.shortLabel ?? simulation?.strategy ?? null;
  const timeComplexity = simulation ? (meta?.timeComplexity ?? "—") : null;
  const spaceComplexity = simulation ? (meta?.spaceComplexity ?? "—") : null;

  return (
    <div
      className={
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-3 py-1.5 text-xs font-mono bg-black/85 text-white/95 backdrop-blur-sm border-b border-white/10 " +
        className
      }
      role="status"
      aria-label={isMap ? "Map simulation metrics" : "Computer science performance metrics"}
    >
      <span className="text-white/50 uppercase tracking-wider">
        {isMap ? "Map" : "Metrics"}
      </span>
      {isMap ? (
        <>
          <MetricRow
            label="Parcels"
            value={mapContext.parcelCount.toLocaleString("en-US")}
            valueClassName="font-semibold tabular-nums text-amber-400/90"
          />
          <MetricRow
            label="Rule"
            value={rulePresetLabel(mapContext.rulePreset)}
            valueClassName="tabular-nums text-sky-300/90"
          />
          <MetricRow
            label="Generation"
            value={mapContext.counter.toLocaleString("en-US")}
            valueClassName="tabular-nums text-sky-300/90"
          />
          <MetricRow
            label="Time"
            value={mapContext.timeComplexity}
            valueClassName="tabular-nums text-orange-300/90"
          />
          <MetricRow
            label="Space"
            value={mapContext.spaceComplexity}
            valueClassName="tabular-nums text-orange-300/90"
          />
        </>
      ) : (
        <>
          <MetricRow
            label="Algorithm"
            value={algoLabel}
            valueClassName="font-semibold text-amber-400/90"
          />
          <MetricRow
            label="Grid"
            value={simulation ? formatN(simulation.n, simulation.dimensions) : null}
          />
          <MetricRow
            label="N"
            value={simulation ? N.toLocaleString("en-US") : null}
          />
          <MetricRow
            label="Time"
            value={simulation ? timeComplexity : null}
            valueClassName="tabular-nums text-orange-300/90"
          />
          <MetricRow
            label="Space"
            value={simulation ? spaceComplexity : null}
            valueClassName="tabular-nums text-orange-300/90"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-white/50">T(step) avg</span>
            {useAvg ? (
              <>
                <span className="font-semibold tabular-nums text-violet-400">
                  {avgMs!.toFixed(2)} ms
                </span>
                {nSamples > 1 && (
                  <span className="text-white/40 tabular-nums">(n={nSamples})</span>
                )}
              </>
            ) : (
              NA
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/50">Throughput</span>
            <span className="tabular-nums text-emerald-400">
              {throughput ?? NA}
            </span>
            {throughput != null && nSamples > 1 && (
              <span className="text-white/40 text-[10px]">avg</span>
            )}
          </div>
        </>
      )}
      <MetricRow
        label="Render"
        value={`${frameMs.toFixed(1)} ms`}
        valueClassName="tabular-nums text-white/80"
      />
      <div className="flex items-center gap-1.5">
        <span className="text-white/50">Refresh</span>
        <span
          className={
            "tabular-nums " +
            (fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-red-400")
          }
        >
          {fps} Hz
        </span>
      </div>
    </div>
  );
}
