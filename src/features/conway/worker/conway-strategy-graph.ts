import { getNeighborIds, getCellCount, applyRule } from "./conway-grid";
import type { CellState, WorkerInput } from "./conway-types";

const DEFAULT_DIMENSIONS = 3 as const;

/**
 * Graph
 * How it works: Build a Map<id, neighborIds[]> for all ids 0..N-1 by calling getNeighborIds for every id, then iterate over cells and use the map to get neighbors and count living.
 * Pros: Per-cell work is just array lookup + filter; no repeated neighbor math during the iteration.
 * Cons: Builds the entire graph every frame (no caching). Extra O(N) memory for the graph and O(N) work in buildGraph each step. So you pay more than nested every frame; only makes sense if the graph were built once and reused.
 */

function buildGraph(n: number, dimensions: 2 | 3): Map<number, number[]> {
  const N = getCellCount(n, dimensions);
  const graph = new Map<number, number[]>();
  for (let id = 0; id < N; id++) {
    graph.set(id, getNeighborIds(n, id, dimensions));
  }
  return graph;
}

export function computeNextStateGraph(input: WorkerInput): CellState[] {
  const { n, cells, dimensions = DEFAULT_DIMENSIONS } = input;
  const aliveById = new Map(cells.map((c) => [c.id, c.isAlive]));
  const graph = buildGraph(n, dimensions);
  const result: CellState[] = [];
  for (const cell of cells) {
    const neighbors = graph.get(cell.id) ?? [];
    const livingNeighbors = neighbors.filter(
      (id) => aliveById.get(id) === true
    ).length;
    result.push({
      id: cell.id,
      isAlive: applyRule(cell.isAlive, livingNeighbors),
    });
  }
  return result;
}
