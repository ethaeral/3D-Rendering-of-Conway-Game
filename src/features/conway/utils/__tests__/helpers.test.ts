import { describe, it, expect, vi } from "vitest";
import { randomNumber, stringKeyToInt, randomRGBColorGen } from "../helpers";

describe("randomNumber", () => {
  it("returns integer in [0, range) for positive range", () => {
    for (let i = 0; i < 50; i++) {
      const n = randomNumber(10);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it("returns 0 for range 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomNumber(1)).toBe(0);
    vi.restoreAllMocks();
  });
});

describe("stringKeyToInt", () => {
  it("parses 3-char key to gpIdx, pIdx, cIdx", () => {
    expect(stringKeyToInt("000")).toEqual({ gpIdx: 0, pIdx: 0, cIdx: 0 });
    expect(stringKeyToInt("123")).toEqual({ gpIdx: 1, pIdx: 2, cIdx: 3 });
    expect(stringKeyToInt("909")).toEqual({ gpIdx: 9, pIdx: 0, cIdx: 9 });
  });
});

describe("randomRGBColorGen", () => {
  it("returns string in form 'r, g, b'", () => {
    const color = randomRGBColorGen();
    expect(color).toMatch(/^\d+,\s*\d+,\s*\d+$/);
    const parts = color.split(",").map((s) => parseInt(s.trim(), 10));
    expect(parts).toHaveLength(3);
    parts.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(255);
    });
  });
});
