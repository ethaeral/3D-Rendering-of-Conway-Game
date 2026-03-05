import { describe, it, expect } from "vitest";
import { getMatrix } from "../matrix-cache";

describe("matrix-cache", () => {
  describe("getMatrix", () => {
    it("returns matrix with correct n and shape", () => {
      const m = getMatrix(2);
      expect(m.n).toBe(2);
      expect(m.matrix).toHaveLength(2);
      expect(m.matrix[0]).toHaveLength(2);
      expect(m.matrix[0][0]).toHaveLength(2);
    });

    it("returns same reference for same n (caching)", () => {
      const a = getMatrix(2);
      const b = getMatrix(2);
      expect(a).toBe(b);
    });

    it("returns matrix with nodes for applyRuleToState", () => {
      const m = getMatrix(2);
      expect(m.matrix).toBeDefined();
      expect(Object.keys(m.nodes).length).toBeGreaterThan(0);
    });
  });
});
