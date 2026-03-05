import { describe, it, expect } from "vitest";
import { createUnit } from "../unit-structure";

describe("unit-structure", () => {
  describe("createUnit", () => {
    it("returns unit with id, x, y, z, isAlive false, connectRooms", () => {
      const u = createUnit(5, 1, 2, 3);
      expect(u.id).toBe(5);
      expect(u.x).toBe(1);
      expect(u.y).toBe(2);
      expect(u.z).toBe(3);
      expect(u.isAlive).toBe(false);
      expect(u.color).toBe(null);
      expect(typeof u.connectRooms).toBe("function");
    });

    it("connectRooms assigns room to direction key", () => {
      const a = createUnit(0, 0, 0, 0);
      const b = createUnit(1, 1, 0, 0);
      a.connectRooms(b, "ppo");
      expect((a as Record<string, unknown>)["ppo"]).toBe(b);
    });
  });
});
