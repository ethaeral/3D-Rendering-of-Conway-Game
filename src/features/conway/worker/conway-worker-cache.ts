import type { TopologyMap } from "../../../types/cellular-automata";

let cachedTopology: TopologyMap | null = null;

export function getCachedTopology(): TopologyMap | null {
  return cachedTopology;
}

export function setCachedTopology(t: TopologyMap | null): void {
  cachedTopology = t;
}
