import type { TopologyMap } from "../../../types/cellular-automata";

const PRECISION = 6;

function roundCoord(c: number): number {
  return Math.round(c * 10 ** PRECISION) / 10 ** PRECISION;
}

function segmentKey(a: [number, number], b: [number, number]): string {
  const ax = roundCoord(a[0]);
  const ay = roundCoord(a[1]);
  const bx = roundCoord(b[0]);
  const by = roundCoord(b[1]);
  if (ax !== bx) return ax < bx ? `${ax},${ay}-${bx},${by}` : `${bx},${by}-${ax},${ay}`;
  return ay <= by ? `${ax},${ay}-${bx},${by}` : `${bx},${by}-${ax},${ay}`;
}

function getRingSegments(ring: number[][]): string[] {
  const keys: string[] = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const a = [ring[i][0], ring[i][1]] as [number, number];
    const b = [ring[i + 1][0], ring[i + 1][1]] as [number, number];
    keys.push(segmentKey(a, b));
  }
  return keys;
}

function getPolygonSegments(coords: number[][][]): string[] {
  const keys: string[] = [];
  for (const ring of coords) {
    if (ring.length < 2) continue;
    keys.push(...getRingSegments(ring));
  }
  return keys;
}

function getGeometrySegments(geometry: unknown): string[] {
  if (!geometry || typeof (geometry as { type?: string }).type !== "string")
    return [];
  const g = geometry as { type: string; coordinates: number[][] | number[][][] | number[][][][] };
  if (g.type === "Polygon" && Array.isArray(g.coordinates))
    return getPolygonSegments(g.coordinates as number[][][]);
  if (g.type === "MultiPolygon" && Array.isArray(g.coordinates)) {
    const all: string[] = [];
    for (const poly of g.coordinates as number[][][][])
      all.push(...getPolygonSegments(poly));
    return all;
  }
  return [];
}

export interface ParcelTopologyInput {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: unknown;
    properties?: Record<string, unknown>;
  }>;
}

/**
 * Builds adjacency topology from parcel polygons: two parcels are neighbors
 * if they share an edge (segment). Uses segment hashing for O(features × edges) time.
 */
export function buildParcelTopology(fc: ParcelTopologyInput): TopologyMap {
  const segmentToIndices = new Map<string, number[]>();
  for (let i = 0; i < fc.features.length; i++) {
    const segs = getGeometrySegments(fc.features[i].geometry);
    for (const key of segs) {
      const list = segmentToIndices.get(key) ?? [];
      list.push(i);
      segmentToIndices.set(key, list);
    }
  }
  const topology: TopologyMap = {};
  for (let i = 0; i < fc.features.length; i++) {
    const segs = getGeometrySegments(fc.features[i].geometry);
    const neighborSet = new Set<number>();
    for (const key of segs) {
      const list = segmentToIndices.get(key) ?? [];
      for (const j of list) if (j !== i) neighborSet.add(j);
    }
    topology[i] = Array.from(neighborSet);
  }
  return topology;
}
