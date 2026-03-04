import * as Comlink from "comlink";
import type { ConwayWorkerApi } from "./conway.worker";
import type { CellState } from "./conway-rules";
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

export function serializeMatrix(matrix: Matrix3D, n: number): WorkerInput {
  const cells: CellState[] = [];
  for (let z = 0; z < n; z++) {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const unit = matrix[z][y][x];
        cells.push({ id: unit.id, isAlive: unit.isAlive });
      }
    }
  }
  return { n, cells };
}

export function applyWorkerResult(
  matrixInstance: IIIDMatrix,
  n: number,
  result: CellState[]
): void {
  const matrix = matrixInstance.matrix;
  for (const cell of result) {
    const key = idToKey(n, cell.id);
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
  n: number
): Promise<CellState[]> {
  const worker = getWorker();
  const input = serializeMatrix(matrix, n);
  return worker.computeNextState(input);
}
