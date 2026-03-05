import { getNeighborIds, getCellCount, applyRule } from "./conway-grid";
import type { CellState, WorkerInput } from "./conway-types";

const DEFAULT_DIMENSIONS = 3 as const;

/**
 * Linear algebra
 * How it works: Build full adjacency rows (like the graph), turn cells into a dense state vector of length N, do one matrix–vector multiply to get live neighbor counts, then apply the rule for all ids.
 * Pros: Dense arrays and sequential access are cache-friendly. The “neighbor sum” step is a single, regular pass that could later be moved to SIMD or GPU. Clear structure.
 * Cons: Always dense: full state vector and full N work even if the grid were sparse. Builds adjacency every frame (again, no caching). Higher memory: adjacency + state + result.

 */

function buildAdjacencyRows(n: number, dimensions: 2 | 3): number[][] {
  const N = getCellCount(n, dimensions);
  const rows: number[][] = [];
  for (let id = 0; id < N; id++) {
    rows.push(getNeighborIds(n, id, dimensions));
  }
  return rows;
}

function matrixVectorMultiply(
  adjacencyRows: number[][],
  state: number[]
): number[] {
  const result: number[] = [];
  for (let i = 0; i < adjacencyRows.length; i++) {
    let sum = 0;
    for (const j of adjacencyRows[i]) {
      sum += state[j];
    }
    result.push(sum);
  }
  return result;
}

export function computeNextStateLinearAlgebra(input: WorkerInput): CellState[] {
  const { n, cells, dimensions = DEFAULT_DIMENSIONS } = input;
  const N = getCellCount(n, dimensions);
  const state = new Array<number>(N).fill(0);
  for (const c of cells) {
    state[c.id] = c.isAlive ? 1 : 0;
  }
  const adjacencyRows = buildAdjacencyRows(n, dimensions);
  const liveNeighborCounts = matrixVectorMultiply(adjacencyRows, state);
  const result: CellState[] = [];
  for (let id = 0; id < N; id++) {
    result.push({
      id,
      isAlive: applyRule(state[id] === 1, liveNeighborCounts[id]),
    });
  }
  return result;
}
