import { describe, it, expect, vi } from "vitest";
import { IIIDMatrix } from "./3d-matrix-structure";

describe("IIIDMatrix", () => {
  it("creates matrix of size n^3 units for n=2", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    expect(m.matrix).toHaveLength(2);
    expect(m.matrix[0]).toHaveLength(2);
    expect(m.matrix[0][0]).toHaveLength(2);
    expect(m.n).toBe(2);
    let count = 0;
    for (let z = 0; z < 2; z++) {
      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(m.matrix[z][y][x]).toHaveProperty("id", count);
          expect(m.matrix[z][y][x]).toHaveProperty("isAlive");
          expect(m.matrix[z][y][x]).toHaveProperty("x", x);
          expect(m.matrix[z][y][x]).toHaveProperty("y", y);
          expect(m.matrix[z][y][x]).toHaveProperty("z", z);
          count++;
        }
      }
    }
    expect(count).toBe(8);
  });

  it("has nodes for each cell key", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    expect(Object.keys(m.nodes)).toHaveLength(8);
    expect(m.nodes["000"]).toHaveProperty("livingNeighbors");
    expect(m.nodes["000"]).toHaveProperty("neighbors");
    expect(Array.isArray(m.nodes["000"].neighbors)).toBe(true);
  });

  it("clearLivingState sets all isAlive to false", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.matrix[0][0][0].isAlive = true;
    m.clearLivingState();
    for (let z = 0; z < 2; z++) {
      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(m.matrix[z][y][x].isAlive).toBe(false);
        }
      }
    }
  });

  it("applyRuleToState: lone cell dies", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    m.matrix[0][0][0].isAlive = true;
    m.setAliveNeighborCount("000", true);
    m.applyRuleToState();
    expect(m.matrix[0][0][0].isAlive).toBe(false);
  });

  it("applyRuleToState: dead cell with 3 neighbors is born", () => {
    const m = new IIIDMatrix(2);
    m.genMatrix();
    m.matrixGenCxn();
    m.clearLivingState();
    m.matrix[0][0][0].isAlive = true;
    m.matrix[0][0][1].isAlive = true;
    m.matrix[0][1][0].isAlive = true;
    ["000", "001", "010"].forEach((key) => m.setAliveNeighborCount(key, true));
    m.applyRuleToState();
    expect(m.matrix[0][1][1].isAlive).toBe(true);
  });
});
