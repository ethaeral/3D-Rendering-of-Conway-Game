import { getNeighborIds, applyRule } from "./conway-grid";
import type { CellState, WorkerInput } from "./conway-types";

const DEFAULT_DIMENSIONS = 3 as const;

/**
 * Nested (default)
 * How it works: For each cell in cells, call getNeighborIds(n, cell.id), count living neighbors via aliveById, then apply the rule.
 * Pros: Minimal memory (one Map for aliveById + result). Simple. No precomputation. Easy to adapt if you ever use a sparse cell list.
 * Cons: getNeighborIds is called N times per frame (same work repeated every step). No reuse of neighbor structure, no particular cache pattern.
 */
export function computeNextStateNested(input: WorkerInput): CellState[] {
  const { n, cells, dimensions = DEFAULT_DIMENSIONS } = input;
  const aliveById = new Map(cells.map((c) => [c.id, c.isAlive]));
  const result: CellState[] = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const neighborIds = getNeighborIds(n, cell.id, dimensions);
    const livingNeighbors = neighborIds.filter(
      (id) => aliveById.get(id) === true
    ).length;
    result.push({
      id: cell.id,
      isAlive: applyRule(cell.isAlive, livingNeighbors),
    });
  }
  return result;
}
