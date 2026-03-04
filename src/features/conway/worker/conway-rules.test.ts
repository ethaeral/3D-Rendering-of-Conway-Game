import { describe, it, expect } from "vitest";
import {
  idToKey,
  computeNextState,
  type CellState,
  type WorkerInput,
} from "./conway-rules";

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
