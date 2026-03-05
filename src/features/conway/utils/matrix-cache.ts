import { CONWAY_GRID_MAX } from "../../../config/conway";
import { IIIDMatrix } from "./3d-matrix-structure";

function createMatrix(n: number): IIIDMatrix {
  const m = new IIIDMatrix(n);
  m.genMatrix();
  m.matrixGenCxn();
  return m;
}

const cache: Record<number, IIIDMatrix> = {};
for (let i = 1; i <= CONWAY_GRID_MAX; i++) {
  cache[i] = createMatrix(i);
}

export function getMatrix(n: number): IIIDMatrix {
  if (!cache[n]) {
    cache[n] = createMatrix(n);
  }
  return cache[n];
}

export { cache as matrixCache };
