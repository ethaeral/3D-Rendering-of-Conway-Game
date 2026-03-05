import * as Comlink from "comlink";
import type { ConwayWorkerApi } from "./conway.worker";
import type { CellState, ComputeStrategy, GridDimensions } from "./conway-rules";
import type { TopologyMap } from "./conway-types";
import { idToKey } from "./conway-rules";
import { stringKeyToInt, randomRGBColorGen } from "../utils/helpers";
import type { Matrix3D } from "../types";
import type { IIIDMatrix } from "../utils/3d-matrix-structure";

let workerInstance: Comlink.Remote<ConwayWorkerApi> | null = null;

function getWorker(): Comlink.Remote<ConwayWorkerApi> {
  if (workerInstance) return workerInstance;
  const worker = new Worker(
    new URL("./conway.worker.ts", import.meta.url),
    { type: "module" }
  );
  workerInstance = Comlink.wrap<ConwayWorkerApi>(worker);
  return workerInstance;
}

export interface WorkerInput {
  n: number;
  cells: CellState[];
}

export function serializeMatrix(
  matrix: Matrix3D,
  n: number,
  dimensions: GridDimensions = 3
): WorkerInput {
  const cells: CellState[] = [];
  if (dimensions === 2) {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const unit = matrix[0][y][x];
        cells.push({ id: y * n + x, isAlive: unit.isAlive });
      }
    }
  } else {
    for (let z = 0; z < n; z++) {
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const unit = matrix[z][y][x];
          cells.push({ id: unit.id, isAlive: unit.isAlive });
        }
      }
    }
  }
  return { n, cells };
}

export function applyWorkerResult(
  matrixInstance: IIIDMatrix,
  n: number,
  result: CellState[],
  dimensions: GridDimensions = 3
): void {
  const matrix = matrixInstance.matrix;
  for (const cell of result) {
    const key = idToKey(n, cell.id, dimensions);
    const { gpIdx, pIdx, cIdx } = stringKeyToInt(key);
    const unit = matrix[gpIdx][pIdx][cIdx];
    if (unit.isAlive !== cell.isAlive) {
      unit.isAlive = cell.isAlive;
      if (cell.isAlive) unit.color = randomRGBColorGen();
      matrixInstance.setAliveNeighborCount(key, cell.isAlive);
    }
  }
}

export async function computeNextStateInWorker(
  matrix: Matrix3D,
  n: number,
  strategy: ComputeStrategy = "nested",
  dimensions: GridDimensions = 3
): Promise<CellState[]> {
  const worker = getWorker();
  const input = {
    ...serializeMatrix(matrix, n, dimensions),
    strategy,
    dimensions,
  };
  return worker.computeNextState(input);
}

/**
 * Cache topology in the worker so steps only transfer cells (critical for ~99k parcels).
 * Call once when topology is available (e.g. when parcel data loads).
 */
export async function setExplicitTopologyForMap(topology: TopologyMap | null): Promise<void> {
  const worker = getWorker();
  return worker.setExplicitTopology(topology);
}

/**
 * Run one Conway step with explicit topology (e.g. Boston neighborhoods).
 * Topology must have been set earlier via setExplicitTopologyForMap; only cells are sent.
 */
export async function computeNextStateWithTopology(cells: CellState[]): Promise<CellState[]> {
  const worker = getWorker();
  const input = {
    n: cells.length,
    cells,
    strategy: "explicit-topology" as ComputeStrategy,
  };
  return worker.computeNextState(input);
}

/**
 * Buffer-based step: one Uint8Array in/out (fast transfer, no 99k objects).
 * Topology must be set via setExplicitTopologyForMap. Returns new buffer (1 = alive, 0 = dead).
 */
export async function computeNextStateWithTopologyBuffer(aliveIn: Uint8Array): Promise<Uint8Array> {
  const worker = getWorker();
  return worker.computeNextStateFromBuffer(aliveIn);
}
