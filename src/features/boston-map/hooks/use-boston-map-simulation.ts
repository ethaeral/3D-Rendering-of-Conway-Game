import { useState, useCallback, useRef, useEffect } from "react";
import {
  computeNextStateWithTopology,
  computeNextStateWithTopologyBuffer,
  setExplicitTopologyForMap,
} from "../../conway/worker/conway-worker-api";
import { computeNextStateMap } from "../rules/compute-next-state";
import { getMapRule } from "../rules/presets";
import type { CellState, TopologyMap } from "../../../types/cellular-automata";
import type { MapRulePresetId } from "../rules/types";

const AUTOMATION_INTERVAL_MS = 800;

export interface UseBostonMapSimulationOptions {
  topology: TopologyMap;
  cellCount: number;
  /** Rule preset (e.g. Conway, HighLife, Maze). */
  rulePreset?: MapRulePresetId;
  /** Fraction of cells initially alive (0–1). */
  initialAliveFraction?: number;
}

export interface UseBostonMapSimulationReturn {
  /** Get current cells (avoids 99k items in React state). */
  getCells: () => CellState[];
  /** When Conway: get current alive flags as Uint8Array (for delta map sync). */
  getAliveBuffer: () => Uint8Array | null;
  counter: number;
  onGoing: boolean;
  implementChangeState: () => Promise<void>;
  onReset: () => void;
  setOnGoing: (v: boolean) => void;
  rulePreset: MapRulePresetId;
  setRulePreset: (id: MapRulePresetId) => void;
}

function createInitialCells(
  cellCount: number,
  aliveFraction: number
): CellState[] {
  const cells: CellState[] = [];
  for (let id = 0; id < cellCount; id++) {
    cells.push({
      id,
      isAlive: Math.random() < aliveFraction,
    });
  }
  return cells;
}

function createInitialBuffer(cellCount: number, aliveFraction: number): Uint8Array {
  const buf = new Uint8Array(cellCount);
  for (let i = 0; i < cellCount; i++) buf[i] = Math.random() < aliveFraction ? 1 : 0;
  return buf;
}

export function useBostonMapSimulation({
  topology,
  cellCount,
  rulePreset: initialRulePreset = "conway",
  initialAliveFraction = 0.35,
}: UseBostonMapSimulationOptions): UseBostonMapSimulationReturn {
  const [counter, setCounter] = useState(0);
  const [onGoing, setOnGoing] = useState(false);
  const [rulePreset, setRulePreset] = useState<MapRulePresetId>(initialRulePreset);
  const stepInProgressRef = useRef(false);
  const automateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cellsRef = useRef<CellState[]>(createInitialCells(cellCount, initialAliveFraction));
  const aliveBufferRef = useRef<Uint8Array>(createInitialBuffer(cellCount, initialAliveFraction));

  useEffect(() => {
    cellsRef.current = createInitialCells(cellCount, initialAliveFraction);
    aliveBufferRef.current = createInitialBuffer(cellCount, initialAliveFraction);
    setCounter(0);
  }, [cellCount, initialAliveFraction]);

  useEffect(() => {
    if (cellCount > 0 && Object.keys(topology).length > 0) {
      setExplicitTopologyForMap(topology);
    }
    return () => {
      setExplicitTopologyForMap(null);
    };
  }, [topology, cellCount]);

  const implementChangeState = useCallback(async () => {
    if (stepInProgressRef.current) return;
    stepInProgressRef.current = true;
    try {
      if (rulePreset === "conway") {
        const next = await computeNextStateWithTopologyBuffer(aliveBufferRef.current);
        aliveBufferRef.current = next;
      } else {
        const current = cellsRef.current;
        const rule = getMapRule(rulePreset);
        cellsRef.current = computeNextStateMap(current, topology, rule);
      }
      setCounter((n) => n + 1);
    } finally {
      stepInProgressRef.current = false;
    }
  }, [topology, rulePreset]);

  const onReset = useCallback(() => {
    cellsRef.current = createInitialCells(cellCount, initialAliveFraction);
    aliveBufferRef.current = createInitialBuffer(cellCount, initialAliveFraction);
    setCounter(0);
    if (automateTimeoutRef.current) {
      clearTimeout(automateTimeoutRef.current);
      automateTimeoutRef.current = null;
    }
  }, [cellCount, initialAliveFraction]);

  const setOnGoingHandler = useCallback((v: boolean) => {
    setOnGoing(v);
  }, []);

  useEffect(() => {
    if (!onGoing) return;
    let cancelled = false;
    function scheduleNext() {
      automateTimeoutRef.current = setTimeout(() => {
        if (cancelled) return;
        implementChangeState().then(() => {
          if (cancelled) return;
          scheduleNext();
        });
      }, AUTOMATION_INTERVAL_MS);
    }
    scheduleNext();
    return () => {
      cancelled = true;
      if (automateTimeoutRef.current) {
        clearTimeout(automateTimeoutRef.current);
        automateTimeoutRef.current = null;
      }
    };
  }, [onGoing, implementChangeState]);

  const getCells = useCallback(() => cellsRef.current, []);
  const getAliveBuffer = useCallback(
    () => (rulePreset === "conway" ? aliveBufferRef.current : null),
    [rulePreset]
  );

  return {
    getCells,
    getAliveBuffer,
    counter,
    onGoing,
    implementChangeState,
    onReset,
    setOnGoing: setOnGoingHandler,
    rulePreset,
    setRulePreset,
  };
}
