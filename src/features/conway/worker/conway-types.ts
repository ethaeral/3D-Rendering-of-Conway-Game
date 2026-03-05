import type { CellState, TopologyMap } from "../../../types/cellular-automata";

export type { CellState, TopologyMap };

/** 2 = n×n grid (8 neighbors), 3 = n×n×n cube (26 neighbors). */
export type GridDimensions = 2 | 3;

export type ComputeStrategy =
  | "nested"
  | "linear-algebra"
  | "graph"
  | "cached-linear-algebra"
  | "explicit-topology";

export interface WorkerInput {
  n: number;
  cells: CellState[];
  strategy?: ComputeStrategy;
  /** 2 = 2D grid (n×n, 8 neighbors), 3 = 3D grid (n×n×n, 26 neighbors). Default 3. */
  dimensions?: GridDimensions;
  /** Optional: neighbor ids per cell id. When set, explicit-topology uses this instead of grid. */
  topology?: TopologyMap;
}
