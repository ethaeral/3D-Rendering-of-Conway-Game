import * as Comlink from "comlink";
import { computeNextState, type WorkerInput, type CellState } from "./conway-rules";
import { computeNextStateExplicitTopologyFromBuffer } from "./conway-strategy-explicit-topology";
import type { TopologyMap } from "../../../types/cellular-automata";
import { setCachedTopology } from "./conway-worker-cache";

const api = {
  computeNextState(input: WorkerInput): CellState[] {
    return computeNextState(input);
  },
  /** Cache topology in worker so subsequent steps only need to send cells (saves ~99k neighbor arrays per step). */
  setExplicitTopology(topology: TopologyMap | null): void {
    setCachedTopology(topology);
  },
  /** Buffer-based step: Uint8Array in/out (one buffer transfer instead of 99k objects). */
  computeNextStateFromBuffer(aliveIn: Uint8Array): Uint8Array {
    return computeNextStateExplicitTopologyFromBuffer(aliveIn);
  },
};

export type ConwayWorkerApi = typeof api;

Comlink.expose(api);
