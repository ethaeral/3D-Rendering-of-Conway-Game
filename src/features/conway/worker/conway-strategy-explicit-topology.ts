import { getNeighborIds } from "./conway-grid";
import type { CellState, WorkerInput } from "./conway-types";
import { getCachedTopology } from "./conway-worker-cache";

/**
 * Explicit topology (ArcGIS / external graph)
 *
 * Uses neighbor lists supplied in input.topology instead of deriving from a
 * regular 3D grid. For use with:
 * - ArcGIS: polygon adjacency, raster with mask, or feature topology
 * - Any irregular graph: cells + Map<id, neighborIds>
 *
 * When topology is missing, falls back to building it from n (same as nested)
 * so the UI still works when this strategy is selected without ArcGIS data.
 *
 * Optimized for large N: index-based alive lookup (Uint8Array), tight neighbor
 * count loop (no filter alloc), pre-allocated result, inlined Conway rule.
 */
const DEFAULT_DIMENSIONS = 3 as const;

function getNeighbors(
  topology: WorkerInput["topology"] | null,
  n: number,
  id: number,
  dimensions: 2 | 3
): number[] {
  if (topology != null) {
    const list = topology[id];
    if (list !== undefined) return list;
  }
  return getNeighborIds(n, id, dimensions);
}

/** Conway B3/S23 inlined to avoid per-cell call overhead. */
function nextAlive(isAlive: boolean, livingNeighbors: number): boolean {
  if (livingNeighbors < 2 || livingNeighbors >= 4) return false;
  if (livingNeighbors === 3) return true;
  return isAlive;
}

export function computeNextStateExplicitTopology(
  input: WorkerInput
): CellState[] {
  const { n, cells, dimensions = DEFAULT_DIMENSIONS } = input;
  const topology = input.topology ?? getCachedTopology();
  const len = cells.length;

  const aliveByIndex = new Uint8Array(len);
  for (let i = 0; i < len; i++) aliveByIndex[i] = cells[i].isAlive ? 1 : 0;

  const result: CellState[] = new Array(len);
  for (let i = 0; i < len; i++) {
    const cell = cells[i];
    const neighborIds = getNeighbors(topology, n, cell.id, dimensions);
    let livingNeighbors = 0;
    for (let j = 0; j < neighborIds.length; j++) {
      if (aliveByIndex[neighborIds[j]]) livingNeighbors++;
    }
    result[i] = {
      id: cell.id,
      isAlive: nextAlive(cell.isAlive, livingNeighbors),
    };
  }
  return result;
}

/**
 * Buffer-based step for map: Uint8Array in/out (transferable, no 99k objects).
 * Uses cached topology; indices 0..len-1 are cell ids.
 */
export function computeNextStateExplicitTopologyFromBuffer(aliveIn: Uint8Array): Uint8Array {
  const topology = getCachedTopology();
  if (topology == null) return aliveIn.slice();
  const len = aliveIn.length;
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const neighborIds = topology[i];
    if (neighborIds === undefined) {
      result[i] = aliveIn[i];
      continue;
    }
    let livingNeighbors = 0;
    for (let j = 0; j < neighborIds.length; j++) {
      if (aliveIn[neighborIds[j]]) livingNeighbors++;
    }
    result[i] = nextAlive(aliveIn[i] !== 0, livingNeighbors) ? 1 : 0;
  }
  return result;
}
