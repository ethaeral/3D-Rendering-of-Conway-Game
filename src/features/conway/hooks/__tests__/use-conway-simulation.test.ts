import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConwaySimulation } from "../use-conway-simulation";
import {
  computeNextStateInWorker,
  applyWorkerResult,
} from "../../worker/conway-worker-api";
import { computeNextState } from "../../worker/conway-rules";
import { serializeMatrix } from "../../worker/conway-worker-api";
import { IIIDMatrix } from "../../utils/3d-matrix-structure";

const matrixCache: Record<number, IIIDMatrix> = {} as Record<number, IIIDMatrix>;

vi.mock("../../utils/matrix-cache", () => ({
  getMatrix: vi.fn((n: number) => {
    if (!matrixCache[n]) {
      const m = new IIIDMatrix(n);
      m.genMatrix();
      m.matrixGenCxn();
      matrixCache[n] = m;
    }
    return matrixCache[n];
  }),
}));

vi.mock("../../worker/conway-worker-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../worker/conway-worker-api")>();
  return {
    ...actual,
    computeNextStateInWorker: vi.fn(
      (matrix: Parameters<typeof serializeMatrix>[0], n: number, _s: string, dimensions: 2 | 3 = 3) => {
        const input = actual.serializeMatrix(matrix, n, dimensions);
        return Promise.resolve(computeNextState(input));
      }
    ),
  };
});

vi.mock("../../../../utils/debug", () => ({
  logGridUpdate: vi.fn(),
}));

describe("useConwaySimulation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(matrixCache).forEach((k) => delete matrixCache[Number(k)]);
  });

  it("returns initial state with counter 0 and n 1", () => {
    const { result } = renderHook(() => useConwaySimulation());
    expect(result.current.counter).toBe(0);
    expect(result.current.n).toBe(1);
    expect(result.current.onGoing).toBe(false);
    expect(result.current.strategy).toBe("nested");
    expect(result.current.dimensions).toBe(3);
  });

  it("increments counter when implementChangeState is called", async () => {
    const { result } = renderHook(() => useConwaySimulation());
    expect(result.current.counter).toBe(0);
    await act(async () => {
      await result.current.implementChangeState();
    });
    expect(result.current.counter).toBe(1);
  });

  it("adjustCubeCount updates n and resets counter", async () => {
    const { result } = renderHook(() => useConwaySimulation());
    await act(async () => {
      result.current.adjustCubeCount([3]);
    });
    expect(result.current.n).toBe(3);
    expect(result.current.counter).toBe(0);
  });

  it("onReset resets counter and step metrics", async () => {
    const { result } = renderHook(() => useConwaySimulation());
    await act(async () => {
      await result.current.implementChangeState();
    });
    expect(result.current.counter).toBe(1);
    await act(() => {
      result.current.onReset();
    });
    expect(result.current.counter).toBe(0);
    expect(result.current.avgStepMs).toBe(null);
    expect(result.current.stepSampleCount).toBe(0);
  });

  it("setStrategy and setDimensions update state", () => {
    const { result } = renderHook(() => useConwaySimulation());
    act(() => {
      result.current.setStrategy("linear-algebra");
    });
    expect(result.current.strategy).toBe("linear-algebra");
    act(() => {
      result.current.setDimensions(2);
    });
    expect(result.current.dimensions).toBe(2);
  });
});
