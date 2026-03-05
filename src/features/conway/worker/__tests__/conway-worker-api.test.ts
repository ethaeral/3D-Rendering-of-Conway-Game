import { describe, it, expect } from "vitest";
import { serializeMatrix, applyWorkerResult } from "../conway-worker-api";
import { computeNextState } from "../conway-rules";
import { IIIDMatrix } from "../../utils/3d-matrix-structure";

describe("serializeMatrix", () => {
  it("returns n and cells with id and isAlive for each cell", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    const input = serializeMatrix(m.matrix, 2);
    expect(input.n).toBe(2);
    expect(input.cells).toHaveLength(8);
    input.cells.forEach((cell, i) => {
      expect(cell).toHaveProperty("id", i);
      expect(cell).toHaveProperty("isAlive");
      expect(typeof cell.isAlive).toBe("boolean");
    });
  });

  it("reflects current isAlive state of matrix", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    m.matrix[0][0][0].isAlive = true;
    m.setAliveNeighborCount("000", true);
    const input = serializeMatrix(m.matrix, 2);
    const cell0 = input.cells.find((c) => c.id === 0);
    expect(cell0?.isAlive).toBe(true);
  });

  it("2D: serializeMatrix with dimensions 2 returns n² cells with ids 0..n²-1", () => {
    const m = new IIIDMatrix(3);
    m.genMatrix();
    m.matrixGenCxn();
    const input = serializeMatrix(m.matrix, 3, 2);
    expect(input.cells).toHaveLength(9);
    expect(input.cells.map((c) => c.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("applyWorkerResult", () => {
  it("updates matrix isAlive to match worker result", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    const input = serializeMatrix(m.matrix, 2);
    const result = computeNextState(input);
    const cell0Before = m.matrix[0][0][0].isAlive;
    applyWorkerResult(m, 2, result);
    expect(m.matrix[0][0][0].isAlive).toBe(result.find((c) => c.id === 0)?.isAlive);
  });

  it("round-trip: serialize -> computeNextState -> apply matches applyRuleToState", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    m.matrix[0][0][0].isAlive = true;
    m.matrix[0][0][1].isAlive = true;
    m.matrix[0][1][0].isAlive = true;
    m.setAliveNeighborCount("000", true);
    m.setAliveNeighborCount("001", true);
    m.setAliveNeighborCount("010", true);
    const input = serializeMatrix(m.matrix, 2);
    const workerResult = computeNextState(input);
    applyWorkerResult(m, 2, workerResult);
    const m2 = new IIIDMatrix(2);
    m2.genMatrix();
    m2.matrixGenCxn();
    m2.clearLivingState();
    m2.matrix[0][0][0].isAlive = true;
    m2.matrix[0][0][1].isAlive = true;
    m2.matrix[0][1][0].isAlive = true;
    m2.setAliveNeighborCount("000", true);
    m2.setAliveNeighborCount("001", true);
    m2.setAliveNeighborCount("010", true);
    m2.applyRuleToState();
    for (let z = 0; z < 2; z++) {
      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          const id = z * 4 + y * 2 + x;
          expect(m.matrix[z][y][x].isAlive).toBe(m2.matrix[z][y][x].isAlive);
        }
      }
    }
  });
});
