import { useEffect, useState, useCallback, useRef } from "react";
import { getMatrix } from "../utils/matrix-cache";
import {
  computeNextStateInWorker,
  applyWorkerResult,
} from "../worker/conway-worker-api";
import { logGridUpdate } from "../../../utils/debug";
import type { Matrix3D } from "../types";
import type { ComputeStrategy, GridDimensions } from "../worker/conway-rules";

const AUTOMATION_INTERVAL_MS = 1000;

export interface ConwaySimulationState {
  curr: Matrix3D;
  counter: number;
  animation: boolean;
  outline: boolean;
  onGoing: boolean;
  n: number;
  strategy: ComputeStrategy;
  dimensions: GridDimensions;
  /** Last step duration in ms (for performance bar) */
  lastStepMs: number | null;
  /** Rolling average step duration (ms) over recent steps */
  avgStepMs: number | null;
  /** Number of steps in the current average */
  stepSampleCount: number;
}

export interface ConwaySimulationActions {
  onReset: () => void;
  implementChangeState: () => Promise<void>;
  setAnimation: (v: boolean) => void;
  setOutline: (v: boolean) => void;
  setOnGoing: (v: boolean) => void;
  setStrategy: (s: ComputeStrategy) => void;
  setDimensions: (d: GridDimensions) => void;
  adjustCubeCount: (value: number[]) => void;
}

export type UseConwaySimulationReturn = ConwaySimulationState &
  ConwaySimulationActions & {
    onNext: () => Promise<void>;
  };

export function useConwaySimulation(): UseConwaySimulationReturn {
  const [curr, setCurr] = useState<Matrix3D>(() => getMatrix(1).matrix);
  const [counter, setCounter] = useState(0);
  const [onGoing, setOnGoing] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [outline, setOutline] = useState(true);
  const [n, setN] = useState(1);
  const [strategy, setStrategy] = useState<ComputeStrategy>("nested");
  const [dimensions, setDimensions] = useState<GridDimensions>(3);
  const [lastStepMs, setLastStepMs] = useState<number | null>(null);
  const [avgStepMs, setAvgStepMs] = useState<number | null>(null);
  const [stepSampleCount, setStepSampleCount] = useState(0);
  const stepTimesRef = useRef<number[]>([]);
  const stepInProgressRef = useRef(false);
  const automateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const STEP_AVG_WINDOW = 30;

  const implementChangeState = useCallback(async () => {
    if (stepInProgressRef.current) {
      logGridUpdate("implementChangeState: skipped (step already in progress)");
      return;
    }
    stepInProgressRef.current = true;
    const matrixInstance = getMatrix(n);
    const gridSize = dimensions === 2 ? n * n : n ** 3;
    logGridUpdate("implementChangeState: start", { n, dimensions, gridSize });
    const stepStart = performance.now();
    try {
      const result = await computeNextStateInWorker(
        matrixInstance.matrix,
        n,
        strategy,
        dimensions
      );
      logGridUpdate("implementChangeState: worker OK", {
        resultLength: result.length,
        aliveCount: result.filter((c) => c.isAlive).length,
      });
      applyWorkerResult(matrixInstance, n, result, dimensions);
      setCounter((num) => num + 1);
    } catch (err) {
      logGridUpdate("implementChangeState: worker failed, using sync", {
        error: err instanceof Error ? err.message : String(err),
      });
      matrixInstance.applyRuleToState();
      setCounter((num) => num + 1);
    } finally {
      const ms = performance.now() - stepStart;
      setLastStepMs(ms);
      stepTimesRef.current.push(ms);
      if (stepTimesRef.current.length > STEP_AVG_WINDOW) {
        stepTimesRef.current.shift();
      }
      const len = stepTimesRef.current.length;
      const avg =
        len > 0
          ? stepTimesRef.current.reduce((a, b) => a + b, 0) / len
          : null;
      setAvgStepMs(avg);
      setStepSampleCount(len);
      stepInProgressRef.current = false;
    }
  }, [n, strategy, dimensions]);

  const adjustCubeCount = useCallback((value: number[]) => {
    const newN = value[0] ?? 1;
    setN(newN);
    setCurr(getMatrix(newN).matrix);
    setCounter(0);
    stepTimesRef.current = [];
    setAvgStepMs(null);
    setStepSampleCount(0);
  }, []);

  useEffect(() => {
    if (!onGoing) return;
    let cancelled = false;
    function scheduleNext() {
      automateTimeoutRef.current = setTimeout(async () => {
        if (cancelled) return;
        await implementChangeState();
        if (cancelled) return;
        scheduleNext();
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

  const onReset = useCallback(() => {
    setCounter(0);
    stepTimesRef.current = [];
    setAvgStepMs(null);
    setStepSampleCount(0);
    const matrixInstance = getMatrix(n);
    matrixInstance.randomizeState();
    setCurr(matrixInstance.matrix.map((z) => z.map((y) => [...y])));
  }, [n]);

  return {
    curr,
    counter,
    animation,
    outline,
    onGoing,
    n,
    strategy,
    dimensions,
    lastStepMs,
    avgStepMs,
    stepSampleCount,
    onReset,
    onNext: implementChangeState,
    implementChangeState,
    setAnimation,
    setOutline,
    setOnGoing,
    setStrategy,
    setDimensions,
    adjustCubeCount,
  };
}
