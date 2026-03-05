import type { ComputeStrategy } from "./conway-types";

export interface StrategyMeta {
  id: ComputeStrategy;
  /** Long label for sidebar dropdown */
  label: string;
  /** Short label for performance bar */
  shortLabel: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const STRATEGY_METADATA: StrategyMeta[] = [
  { id: "nested", label: "Nested arrays", shortLabel: "Nested", timeComplexity: "Θ(N)", spaceComplexity: "Θ(N)" },
  { id: "linear-algebra", label: "Linear algebra", shortLabel: "Linear alg.", timeComplexity: "Θ(N)", spaceComplexity: "Θ(N)" },
  { id: "graph", label: "Graph", shortLabel: "Graph", timeComplexity: "Θ(N)", spaceComplexity: "Θ(N)" },
  { id: "cached-linear-algebra", label: "Cached linear algebra", shortLabel: "Cached LA", timeComplexity: "Θ(N)", spaceComplexity: "Θ(N)" },
  { id: "explicit-topology", label: "Explicit topology", shortLabel: "Explicit top.", timeComplexity: "Θ(C+E)", spaceComplexity: "Θ(C+E)" },
];

const BY_ID = new Map(STRATEGY_METADATA.map((m) => [m.id, m]));

export function getStrategyMeta(strategy: string): StrategyMeta | undefined {
  return BY_ID.get(strategy as ComputeStrategy);
}

/** Strategies for V1/V2 grid only; explicit-topology is for V3 map. */
export const STRATEGIES_V1_V2 = STRATEGY_METADATA.filter((m) => m.id !== "explicit-topology");

/** V1: nested only (dropdown shown but disabled). */
export const STRATEGIES_V1 = STRATEGY_METADATA.filter((m) => m.id === "nested");

/** V2: all grid strategies except nested. */
export const STRATEGIES_V2 = STRATEGY_METADATA.filter(
  (m) => m.id !== "explicit-topology" && m.id !== "nested"
);

export const DEFAULT_V2_STRATEGY: ComputeStrategy = "cached-linear-algebra";
