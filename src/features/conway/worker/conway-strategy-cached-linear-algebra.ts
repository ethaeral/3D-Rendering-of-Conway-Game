import { getNeighborIds, getCellCount, applyRule } from "./conway-grid";
import type { CellState, WorkerInput } from "./conway-types";

const DEFAULT_DIMENSIONS = 3 as const;
const adjacencyCache = new Map<string, number[][]>();

function cacheKey(n: number, dimensions: 2 | 3): string {
  return `${n},${dimensions}`;
}

function getOrBuildAdjacencyRows(n: number, dimensions: 2 | 3): number[][] {
  const key = cacheKey(n, dimensions);
  let rows = adjacencyCache.get(key);
  if (rows !== undefined) return rows;
  const N = getCellCount(n, dimensions);
  rows = [];
  for (let id = 0; id < N; id++) {
    rows.push(getNeighborIds(n, id, dimensions));
  }
  adjacencyCache.set(key, rows);
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

export function computeNextStateCachedLinearAlgebra(
  input: WorkerInput
): CellState[] {
  const { n, cells, dimensions = DEFAULT_DIMENSIONS } = input;
  const N = getCellCount(n, dimensions);
  const state = new Array<number>(N).fill(0);
  for (const c of cells) {
    state[c.id] = c.isAlive ? 1 : 0;
  }
  const adjacencyRows = getOrBuildAdjacencyRows(n, dimensions);
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
