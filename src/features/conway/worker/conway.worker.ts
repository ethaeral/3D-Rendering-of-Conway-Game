import * as Comlink from "comlink";
import { computeNextState, type WorkerInput, type CellState } from "./conway-rules";

const api = {
  computeNextState(input: WorkerInput): CellState[] {
    return computeNextState(input);
  },
};

export type ConwayWorkerApi = typeof api;

Comlink.expose(api);
