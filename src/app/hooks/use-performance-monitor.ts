import { useEffect, useState, useRef } from "react";

const FPS_SAMPLE_MS = 500;
const SMOOTH_SAMPLES = 16;

export interface PerformanceSnapshot {
  fps: number;
  frameMs: number;
  /** Last simulation step duration (ms), if provided */
  stepMs: number | null;
}

/** Simulation context for CS metrics (grid size, algorithm, dimensions, step timing) */
export interface SimulationContext {
  n: number;
  dimensions: 2 | 3;
  strategy: string;
  /** Rolling average step time (ms); used for display when stepSampleCount > 0 */
  avgStepMs: number | null;
  /** Number of steps in the current average */
  stepSampleCount: number;
}

export function usePerformanceMonitor(stepMs: number | null = null): PerformanceSnapshot {
  const [fps, setFps] = useState(0);
  const [frameMs, setFrameMs] = useState(0);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  const prevTimeRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;

    function tick(now: number) {
      frameCountRef.current += 1;
      const delta = now - prevTimeRef.current;
      prevTimeRef.current = now;

      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > SMOOTH_SAMPLES) {
        frameTimesRef.current.shift();
      }
      const avgFrameMs =
        frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      setFrameMs(Math.round(avgFrameMs * 10) / 10);

      const elapsed = now - lastFpsTimeRef.current;
      if (elapsed >= FPS_SAMPLE_MS) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { fps, frameMs, stepMs };
}
