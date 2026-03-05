import type { GridDimensions } from "./conway-types";

const DEFAULT_DIMENSIONS: GridDimensions = 3;

export function getCellCount(n: number, dimensions: GridDimensions = DEFAULT_DIMENSIONS): number {
  return dimensions === 2 ? n * n : n * n * n;
}

/** Returns a 3-char key for 3D (zyx) or 2D (0yx so the app can use matrix[0][y][x]). */
export function idToKey(n: number, id: number, dimensions: GridDimensions = DEFAULT_DIMENSIONS): string {
  if (dimensions === 2) {
    const y = Math.floor(id / n);
    const x = id % n;
    return `0${y}${x}`;
  }
  const nn = n * n;
  const z = Math.floor(id / nn);
  const r = id % nn;
  const y = Math.floor(r / n);
  const x = r % n;
  return `${z}${y}${x}`;
}

function idToCoords(n: number, id: number, dimensions: GridDimensions): { z: number; y: number; x: number } {
  if (dimensions === 2) {
    const y = Math.floor(id / n);
    const x = id % n;
    return { z: 0, y, x };
  }
  const nn = n * n;
  const z = Math.floor(id / nn);
  const r = id % nn;
  const y = Math.floor(r / n);
  const x = r % n;
  return { z, y, x };
}

function coordsToId(n: number, z: number, y: number, x: number, dimensions: GridDimensions): number {
  if (dimensions === 2) return y * n + x;
  return z * n * n + y * n + x;
}

export function getNeighborIds(n: number, id: number, dimensions: GridDimensions = DEFAULT_DIMENSIONS): number[] {
  const { z, y, x } = idToCoords(n, id, dimensions);
  const ids: number[] = [];
  if (dimensions === 2) {
    for (const dy of [-1, 0, 1]) {
      for (const dx of [-1, 0, 1]) {
        if (dy === 0 && dx === 0) continue;
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < n && nx >= 0 && nx < n) {
          ids.push(coordsToId(n, 0, ny, nx, 2));
        }
      }
    }
    return ids;
  }
  for (const dz of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      for (const dx of [-1, 0, 1]) {
        if (dz === 0 && dy === 0 && dx === 0) continue;
        const nz = z + dz;
        const ny = y + dy;
        const nx = x + dx;
        if (nz >= 0 && nz < n && ny >= 0 && ny < n && nx >= 0 && nx < n) {
          ids.push(coordsToId(n, nz, ny, nx, 3));
        }
      }
    }
  }
  return ids;
}

export function applyRule(isAlive: boolean, livingNeighbors: number): boolean {
  if (livingNeighbors < 2 || livingNeighbors >= 4) return false;
  if (livingNeighbors === 3) return true;
  return isAlive;
}
