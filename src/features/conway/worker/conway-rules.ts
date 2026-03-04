const RULES_PREFIX = "[Conway Rules]";
const logRules =
  typeof import.meta !== "undefined" && import.meta.env?.DEV
    ? (label: string, data?: Record<string, unknown>) => {
        if (data != null) console.log(`${RULES_PREFIX} ${label}`, data);
        else console.log(`${RULES_PREFIX} ${label}`);
      }
    : () => {};

export function idToKey(n: number, id: number): string {
  const nn = n * n;
  const z = Math.floor(id / nn);
  const r = id % nn;
  const y = Math.floor(r / n);
  const x = r % n;
  return `${z}${y}${x}`;
}

function idToCoords(n: number, id: number): { z: number; y: number; x: number } {
  const nn = n * n;
  const z = Math.floor(id / nn);
  const r = id % nn;
  const y = Math.floor(r / n);
  const x = r % n;
  return { z, y, x };
}

function coordsToId(n: number, z: number, y: number, x: number): number {
  return z * n * n + y * n + x;
}

function getNeighborIds(n: number, id: number): number[] {
  const { z, y, x } = idToCoords(n, id);
  const ids: number[] = [];
  for (const dz of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      for (const dx of [-1, 0, 1]) {
        if (dz === 0 && dy === 0 && dx === 0) continue;
        const nz = z + dz;
        const ny = y + dy;
        const nx = x + dx;
        if (nz >= 0 && nz < n && ny >= 0 && ny < n && nx >= 0 && nx < n) {
          ids.push(coordsToId(n, nz, ny, nx));
        }
      }
    }
  }
  return ids;
}

export interface CellState {
  id: number;
  isAlive: boolean;
}

export interface WorkerInput {
  n: number;
  cells: CellState[];
}

function ruleReason(
  isAlive: boolean,
  livingNeighbors: number,
  nextAlive: boolean
): string {
  if (livingNeighbors < 2) return "die (underpopulation: <2 neighbors)";
  if (livingNeighbors >= 4) return "die (overcrowding: ≥4 neighbors)";
  if (livingNeighbors === 3) return "born (reproduction: exactly 3 neighbors)";
  return isAlive
    ? "survive (2 or 3 neighbors)"
    : "stay dead (not exactly 3 neighbors)";
}

export function computeNextState(input: WorkerInput): CellState[] {
  const { n, cells } = input;
  const aliveById = new Map(cells.map((c) => [c.id, c.isAlive]));
  const result: CellState[] = [];
  const totalCells = cells.length;
  const aliveCount = cells.filter((c) => c.isAlive).length;

  logRules("computeNextState: input summary", {
    n,
    totalCells,
    aliveCount,
    ruleSummary:
      "Die if <2 or ≥4 neighbors; born if exactly 3; survive if 2 or 3 (when alive).",
  });

  let births = 0;
  let deaths = 0;
  let survived = 0;
  const maxDetailCells = Math.min(5, totalCells);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const neighborIds = getNeighborIds(n, cell.id);
    const livingNeighbors = neighborIds.filter(
      (id) => aliveById.get(id) === true
    ).length;
    let nextAlive: boolean;
    if (livingNeighbors < 2 || livingNeighbors >= 4) {
      nextAlive = false;
    } else if (livingNeighbors === 3) {
      nextAlive = true;
    } else {
      nextAlive = cell.isAlive;
    }

    const reason = ruleReason(cell.isAlive, livingNeighbors, nextAlive);
    if (cell.isAlive && !nextAlive) deaths++;
    else if (!cell.isAlive && nextAlive) births++;
    else if (cell.isAlive && nextAlive) survived++;

    if (i < maxDetailCells) {
      const { z, y, x } = idToCoords(n, cell.id);
      logRules(`cell ${cell.id} (z=${z},y=${y},x=${x})`, {
        id: cell.id,
        coords: `(${z},${y},${x})`,
        isAlive: cell.isAlive,
        neighborCount: neighborIds.length,
        livingNeighbors,
        rule: reason,
        nextAlive,
      });
    }

    result.push({ id: cell.id, isAlive: nextAlive });
  }

  logRules("computeNextState: result summary", {
    births,
    deaths,
    survived,
    nextAliveCount: result.filter((c) => c.isAlive).length,
  });

  return result;
}
