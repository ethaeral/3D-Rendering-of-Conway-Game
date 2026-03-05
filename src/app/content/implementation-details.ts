export interface DetailSection {
  heading: string;
  body?: string;
  /** When set, render a comparison table instead of body. */
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ImplementationDetails {
  title: string;
  sections: DetailSection[];
}

export type AppVersion = "v1" | "v2" | "v3";

const V1_DETAILS: ImplementationDetails = {
  title: "V1 · 2020: DOM",
  sections: [
    {
      heading: "Context",
      body: "V1 was the first version, built as a school project. The simulation runs in the browser with a nested-array strategy only: triple (or double) loop over grid dimensions, counting living neighbors per cell with no extra data structures.",
    },
    {
      heading: "Pros",
      body: "Simple and easy to reason about. No build step for topology or caches; what you see is what runs. Good baseline and predictable performance for small to medium grids. Straightforward to debug and extend.",
    },
    {
      heading: "Cons",
      body: "DOM rendering does not scale to large grids. No WebGL or worker offload, so heavy steps can block the main thread. Only one compute strategy (nested arrays)—no option to compare approaches or optimize for repeated steps at fixed size.",
    },
  ],
};

const V2_DETAILS: ImplementationDetails = {
  title: "V2 · 2026: WebGL",
  sections: [
    {
      heading: "Context",
      body: "V2 is a more recent version that uses WebGL for rendering and offers multiple compute strategies for the same grid. All run in a Web Worker so the main thread stays responsive.",
    },
    {
      heading: "Strategies compared",
      table: {
        headers: ["Strategy", "Approach", "Trade-offs", "Best for"],
        rows: [
          [
            "Linear algebra",
            "Flatten grid to a vector; adjacency-style multiply. One step = matrix-vector neighbor count then apply rule.",
            "Θ(N) time, different memory pattern than nested. Can be faster on large grids with optimized sparse matvec. More allocation.",
            "Experimenting with matrix-based formulations or sparse LA.",
          ],
          [
            "Graph",
            "Explicit graph: each cell a node, edges to neighbors. Step = iterate nodes, sum alive state via edge list.",
            "Same Θ(N) as nested with explicit neighbor lists. More memory. Bridges to irregular topologies.",
            "Uniform graph abstraction that can swap to real irregular graphs (e.g. V3 parcels).",
          ],
          [
            "Cached linear algebra",
            "Same as linear algebra but adjacency/neighbor matrix built once and reused every step.",
            "Best per-step throughput at fixed grid size. Cache invalidated when N or dimensions change. More memory for cached matrix.",
            "Production: many steps at fixed size; minimizes per-step work. Recommended default for V2.",
          ],
        ],
      },
    },
    {
      heading: "Recommendation",
      body: "For production-style runs with many steps at a fixed grid size, cached linear algebra is the most recommended: it minimizes per-step work and keeps frame times low. For experimentation or smaller grids, nested arrays remain the clearest default. Use graph when you want a single abstraction that can later be swapped for irregular topologies (as in V3).",
    },
  ],
};

const V3_DETAILS: ImplementationDetails = {
  title: "V3 · 2026: ArcGIS",
  sections: [
    {
      heading: "Context",
      body: "V3 turns the project into an application on real-life data: Boston parcels. Cells are map parcels and topology is polygon adjacency (shared edge = neighbor), so the data is much larger and irregular.",
    },
    {
      heading: "Rules compared",
      table: {
        headers: ["Rule", "Notation", "Birth (B) / Survive (S)", "Behavior"],
        rows: [
          [
            "Conway",
            "B3/S23",
            "Birth on 3 neighbors; survive on 2 or 3.",
            "Classic Game of Life. Sparse cells die (isolation); crowded cells die (overcrowding). Balanced growth and decay; known for gliders, blinkers, and complex emergent patterns.",
          ],
          [
            "HighLife",
            "B36/S23",
            "Birth on 3 or 6 neighbors; survive on 2 or 3.",
            "Like Conway plus birth on 6. The extra birth condition creates the “replicator”: a pattern that can copy itself. Often produces more spreading, self-replicating structures.",
          ],
          [
            "Maze",
            "B3/S12345",
            "Birth on 3; survive on 1–5 neighbors.",
            "Cells survive with 1 to 5 neighbors (only 0 or 6+ die). Produces dense, maze-like corridors and walls; less die-off than Conway, so fill tends to grow and stabilize into labyrinthine shapes.",
          ],
        ],
      },
    },
    {
      heading: "Performance strategies",
      body: "The step runs in a Web Worker with topology cached so we only send cell state each tick. We use Uint8Array in/out for zero-copy transfer instead of thousands of objects. On the map side, we use delta updates: only parcels that changed get setFeatureState, and we throttle and chunk updates so the UI stays responsive.",
    },
    {
      heading: "Data loading",
      body: "Parcel geometry and adjacency are loaded once; the worker holds the topology and reuses it. For ~99k parcels, the main bottlenecks are transfer and map paint updates, not the step math. HighLife/Maze rules run on the main thread with the same topology; Conway uses the buffered path for best throughput.",
    },
  ],
};

const DETAILS_BY_VERSION: Record<AppVersion, ImplementationDetails> = {
  v1: V1_DETAILS,
  v2: V2_DETAILS,
  v3: V3_DETAILS,
};

export function getImplementationDetailsByVersion(
  version: AppVersion
): ImplementationDetails {
  return DETAILS_BY_VERSION[version];
}
