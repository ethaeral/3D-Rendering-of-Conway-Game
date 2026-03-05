import type { CellState, TopologyMap } from "../../../types/cellular-automata";
import type { MapRule } from "./types";

/**
 * Boston-map step: given cells and topology, apply a Conway-esque rule.
 * No dependency on the conway (grid) feature or its worker.
 * Uses array index for alive lookup (parcel ids are 0..n-1) for speed.
 */
export function computeNextStateMap(
  cells: CellState[],
  topology: TopologyMap,
  rule: MapRule
): CellState[] {
  const n = cells.length;
  const aliveByIndex = new Uint8Array(n);
  for (let i = 0; i < n; i++) aliveByIndex[i] = cells[i].isAlive ? 1 : 0;

  const result: CellState[] = [];
  for (const cell of cells) {
    const neighborIds = topology[cell.id] ?? [];
    let livingNeighbors = 0;
    for (let i = 0; i < neighborIds.length; i++) {
      if (aliveByIndex[neighborIds[i]]) livingNeighbors++;
    }
    result.push({
      id: cell.id,
      isAlive: rule(cell.isAlive, livingNeighbors),
    });
  }
  return result;
}
