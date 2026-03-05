/**
 * Shared types for cellular-automata features (grid and map).
 * Lives in src/types so no feature imports from another feature.
 */

export interface CellState {
  id: number;
  isAlive: boolean;
}

/** Neighbor cell IDs per cell id. Used by topology-based simulations (e.g. map). */
export type TopologyMap = Record<number, number[]>;
