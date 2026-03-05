import { describe, it, expect } from "vitest";
import { getNeighborIds } from "../conway-grid";
import { getCellCount } from "../conway-rules";
import {
  idToKey,
  computeNextState,
  computeNextStateLinearAlgebra,
  computeNextStateGraph,
  computeNextStateExplicitTopology,
  type CellState,
  type WorkerInput,
} from "../conway-rules";
import { computeNextStateExplicitTopologyFromBuffer } from "../conway-strategy-explicit-topology";
import { setCachedTopology } from "../conway-worker-cache";

describe("idToKey", () => {
  it("maps id 0 to key 000 for n=2", () => {
    expect(idToKey(2, 0)).toBe("000");
  });

  it("maps id to z,y,x string for n=2", () => {
    expect(idToKey(2, 1)).toBe("001");
    expect(idToKey(2, 2)).toBe("010");
    expect(idToKey(2, 3)).toBe("011");
    expect(idToKey(2, 4)).toBe("100");
    expect(idToKey(2, 7)).toBe("111");
  });

  it("maps id to key for n=3", () => {
    expect(idToKey(3, 0)).toBe("000");
    expect(idToKey(3, 12)).toBe("110");
    expect(idToKey(3, 26)).toBe("222");
  });

  it("2D: idToKey returns 0yx (z=0) for dimensions 2", () => {
    expect(idToKey(2, 0, 2)).toBe("000");
    expect(idToKey(2, 1, 2)).toBe("001");
    expect(idToKey(2, 2, 2)).toBe("010");
    expect(idToKey(2, 3, 2)).toBe("011");
  });
});

describe("computeNextState", () => {
  it("returns same number of cells as input", () => {
    const input: WorkerInput = { n: 2, cells: [] };
    for (let i = 0; i < 8; i++) {
      input.cells.push({ id: i, isAlive: false });
    }
    const result = computeNextState(input);
    expect(result).toHaveLength(8);
  });

  it("cell with fewer than 2 live neighbors dies", () => {
    const input: WorkerInput = {
      n: 2,
      cells: [
        { id: 0, isAlive: true },
        { id: 1, isAlive: false },
        { id: 2, isAlive: false },
        { id: 3, isAlive: false },
        { id: 4, isAlive: false },
        { id: 5, isAlive: false },
        { id: 6, isAlive: false },
        { id: 7, isAlive: false },
      ],
    };
    const result = computeNextState(input);
    const cell0 = result.find((c) => c.id === 0);
    expect(cell0?.isAlive).toBe(false);
  });

  it("dead cell with exactly 3 live neighbors becomes alive", () => {
    const input: WorkerInput = {
      n: 2,
      cells: [
        { id: 0, isAlive: true },
        { id: 1, isAlive: true },
        { id: 2, isAlive: true },
        { id: 3, isAlive: false },
        { id: 4, isAlive: false },
        { id: 5, isAlive: false },
        { id: 6, isAlive: false },
        { id: 7, isAlive: false },
      ],
    };
    const result = computeNextState(input);
    const cell3 = result.find((c) => c.id === 3);
    expect(cell3?.isAlive).toBe(true);
  });

  it("cell with 2 or 3 live neighbors stays alive", () => {
    const input: WorkerInput = {
      n: 2,
      cells: [
        { id: 0, isAlive: true },
        { id: 1, isAlive: true },
        { id: 2, isAlive: true },
        { id: 3, isAlive: false },
        { id: 4, isAlive: false },
        { id: 5, isAlive: false },
        { id: 6, isAlive: false },
        { id: 7, isAlive: false },
      ],
    };
    const result = computeNextState(input);
    [0, 1, 2].forEach((id) => {
      const cell = result.find((c) => c.id === id);
      expect(cell?.isAlive).toBe(true);
    });
  });

  it("cell with 4+ live neighbors dies (overcrowding)", () => {
    const input: WorkerInput = {
      n: 2,
      cells: [
        { id: 0, isAlive: true },
        { id: 1, isAlive: true },
        { id: 2, isAlive: true },
        { id: 3, isAlive: true },
        { id: 4, isAlive: true },
        { id: 5, isAlive: false },
        { id: 6, isAlive: false },
        { id: 7, isAlive: false },
      ],
    };
    const result = computeNextState(input);
    const center = result.find((c) => c.id === 5);
    expect(center?.isAlive).toBe(false);
  });
});

describe("strategy equivalence", () => {
  const sample: WorkerInput = {
    n: 2,
    cells: [
      { id: 0, isAlive: true },
      { id: 1, isAlive: true },
      { id: 2, isAlive: true },
      { id: 3, isAlive: false },
      { id: 4, isAlive: false },
      { id: 5, isAlive: false },
      { id: 6, isAlive: false },
      { id: 7, isAlive: false },
    ],
  };

  it("linear-algebra matches nested", () => {
    const nested = computeNextState({ ...sample, strategy: "nested" });
    const linear = computeNextStateLinearAlgebra(sample);
    expect(linear.length).toBe(nested.length);
    nested.forEach((c, i) => {
      expect(linear[i].id).toBe(c.id);
      expect(linear[i].isAlive).toBe(c.isAlive);
    });
  });

  it("graph matches nested", () => {
    const nested = computeNextState({ ...sample, strategy: "nested" });
    const graph = computeNextStateGraph(sample);
    expect(graph.length).toBe(nested.length);
    nested.forEach((c, i) => {
      expect(graph[i].id).toBe(c.id);
      expect(graph[i].isAlive).toBe(c.isAlive);
    });
  });

  it("cached-linear-algebra matches nested", () => {
    const nested = computeNextState({ ...sample, strategy: "nested" });
    const cached = computeNextState({ ...sample, strategy: "cached-linear-algebra" });
    expect(cached.length).toBe(nested.length);
    nested.forEach((c, i) => {
      expect(cached[i].id).toBe(c.id);
      expect(cached[i].isAlive).toBe(c.isAlive);
    });
  });

  it("explicit-topology with grid topology matches nested", () => {
    const n = 2;
    const topology: Record<number, number[]> = {};
    for (let id = 0; id < n * n * n; id++) topology[id] = getNeighborIds(n, id);
    const nested = computeNextState({ ...sample, strategy: "nested" });
    const explicit = computeNextStateExplicitTopology({ ...sample, topology });
    expect(explicit.length).toBe(nested.length);
    nested.forEach((c, i) => {
      expect(explicit[i].id).toBe(c.id);
      expect(explicit[i].isAlive).toBe(c.isAlive);
    });
  });

  it("explicit-topology without topology falls back to grid (n)", () => {
    const nested = computeNextState({ ...sample, strategy: "nested" });
    const explicit = computeNextStateExplicitTopology(sample);
    expect(explicit.length).toBe(nested.length);
    nested.forEach((c, i) => {
      expect(explicit[i].id).toBe(c.id);
      expect(explicit[i].isAlive).toBe(c.isAlive);
    });
  });

  it("buffer-based explicit-topology matches cell-based when topology is cached", () => {
    const n = 2;
    const topology: Record<number, number[]> = {};
    for (let id = 0; id < n * n * n; id++) topology[id] = getNeighborIds(n, id);
    setCachedTopology(topology);
    try {
      const cells: CellState[] = sample.cells.map((c) => ({ ...c }));
      const buf = new Uint8Array(cells.length);
      cells.forEach((c, i) => {
        buf[i] = c.isAlive ? 1 : 0;
      });
      const cellResult = computeNextStateExplicitTopology({ ...sample, topology, cells });
      const bufResult = computeNextStateExplicitTopologyFromBuffer(buf);
      expect(bufResult.length).toBe(cellResult.length);
      cellResult.forEach((c, i) => {
        expect(bufResult[i]).toBe(c.isAlive ? 1 : 0);
      });
    } finally {
      setCachedTopology(null);
    }
  });
});

describe("2D grid", () => {
  it("getCellCount: 2D has n², 3D has n³", () => {
    expect(getCellCount(4, 2)).toBe(16);
    expect(getCellCount(4, 3)).toBe(64);
  });

  it("nested strategy with dimensions 2 matches 2D semantics", () => {
    const input: WorkerInput = {
      n: 2,
      dimensions: 2,
      cells: [
        { id: 0, isAlive: true },
        { id: 1, isAlive: true },
        { id: 2, isAlive: true },
        { id: 3, isAlive: false },
      ],
    };
    const result = computeNextState(input);
    expect(result).toHaveLength(4);
    expect(result.map((c) => c.id)).toEqual([0, 1, 2, 3]);
  });
});
