import type { MapRule, MapRulePreset, MapRulePresetId } from "./types";

/** Pure Conway: B3/S23 — birth on 3, survive on 2 or 3 */
const conwayClassic: MapRule = (isAlive, livingNeighbors) => {
  if (livingNeighbors < 2 || livingNeighbors >= 4) return false;
  if (livingNeighbors === 3) return true;
  return isAlive;
};

/** HighLife: B36/S23 — like Conway plus birth on 6 (replicator) */
const highLife: MapRule = (isAlive, livingNeighbors) => {
  if (livingNeighbors === 3 || livingNeighbors === 6) return true;
  if (livingNeighbors === 2 || livingNeighbors === 3) return isAlive;
  return false;
};

/** Maze: B3/S12345 — maze-like growth */
const maze: MapRule = (isAlive, livingNeighbors) => {
  if (livingNeighbors === 3) return true;
  if (livingNeighbors >= 1 && livingNeighbors <= 5) return isAlive;
  return false;
};

export const MAP_RULE_PRESETS: MapRulePreset[] = [
  { id: "conway", label: "Conway", description: "B3/S23 (classic)", rule: conwayClassic },
  { id: "high-life", label: "HighLife", description: "B36/S23", rule: highLife },
  { id: "maze", label: "Maze", description: "B3/S12345", rule: maze },
];

const PRESETS_BY_ID = new Map(MAP_RULE_PRESETS.map((p) => [p.id, p]));

export function getMapRulePreset(id: MapRulePresetId): MapRulePreset {
  const p = PRESETS_BY_ID.get(id);
  if (!p) throw new Error(`Unknown map rule preset: ${id}`);
  return p;
}

export function getMapRule(id: MapRulePresetId): MapRule {
  return getMapRulePreset(id).rule;
}
