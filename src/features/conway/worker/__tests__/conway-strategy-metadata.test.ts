import { describe, it, expect } from "vitest";
import {
  getStrategyMeta,
  STRATEGY_METADATA,
  STRATEGIES_V1_V2,
  type StrategyMeta,
} from "../conway-strategy-metadata";

describe("conway-strategy-metadata", () => {
  describe("STRATEGY_METADATA", () => {
    it("has an entry per strategy with id, label, shortLabel, timeComplexity, spaceComplexity", () => {
      const strategies = ["nested", "linear-algebra", "graph", "cached-linear-algebra", "explicit-topology"];
      expect(STRATEGY_METADATA).toHaveLength(strategies.length);
      STRATEGY_METADATA.forEach((m: StrategyMeta) => {
        expect(strategies).toContain(m.id);
        expect(typeof m.label).toBe("string");
        expect(m.label.length).toBeGreaterThan(0);
        expect(typeof m.shortLabel).toBe("string");
        expect(m.shortLabel.length).toBeGreaterThan(0);
        expect(typeof m.timeComplexity).toBe("string");
        expect(typeof m.spaceComplexity).toBe("string");
      });
    });
  });

  describe("getStrategyMeta", () => {
    it("returns meta for known strategy", () => {
      const meta = getStrategyMeta("nested");
      expect(meta).toBeDefined();
      expect(meta?.id).toBe("nested");
      expect(meta?.shortLabel).toBe("Nested");
    });

    it("returns undefined for unknown strategy", () => {
      expect(getStrategyMeta("unknown")).toBeUndefined();
    });

    it("returns correct time/space for explicit-topology", () => {
      const meta = getStrategyMeta("explicit-topology");
      expect(meta?.timeComplexity).toBe("Θ(C+E)");
      expect(meta?.spaceComplexity).toBe("Θ(C+E)");
    });
  });

  describe("STRATEGIES_V1_V2", () => {
    it("excludes explicit-topology", () => {
      const ids = STRATEGIES_V1_V2.map((m) => m.id);
      expect(ids).not.toContain("explicit-topology");
      expect(STRATEGIES_V1_V2).toHaveLength(STRATEGY_METADATA.length - 1);
    });
  });
});
