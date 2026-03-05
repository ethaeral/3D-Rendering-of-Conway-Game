/**
 * Boston-map rule types. The grid (conway feature) uses pure Conway in the worker;
 * this feature uses Conway-esque variants (different birth/survival, etc.).
 */

/** (current alive, living neighbor count) => next alive */
export type MapRule = (isAlive: boolean, livingNeighbors: number) => boolean;

export type MapRulePresetId = "conway" | "high-life" | "maze";

export interface MapRulePreset {
  id: MapRulePresetId;
  label: string;
  description: string;
  rule: MapRule;
}
