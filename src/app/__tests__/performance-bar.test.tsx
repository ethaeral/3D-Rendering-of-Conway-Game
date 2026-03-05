import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PerformanceBar } from "../components/performance-bar";

describe("PerformanceBar", () => {
  it("renders snapshot metrics without simulation", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16.5, stepMs: null }}
      />
    );
    expect(screen.getByRole("status", { name: /computer science performance metrics/i })).toBeInTheDocument();
    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(screen.getByText("16.5 ms")).toBeInTheDocument();
    expect(screen.getByText("60 Hz")).toBeInTheDocument();
  });

  it("renders N/A for algorithm, grid, N when simulation is null", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
      />
    );
    const na = screen.getAllByText("N/A");
    expect(na.length).toBeGreaterThanOrEqual(3);
  });

  it("renders strategy label and complexity when simulation is provided", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        simulation={{
          n: 4,
          dimensions: 2,
          strategy: "nested",
          avgStepMs: null,
          stepSampleCount: 0,
        }}
      />
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("4²")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getAllByText("Θ(N)").length).toBe(2);
  });

  it("renders throughput when avg step time and N are present", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        simulation={{
          n: 10,
          dimensions: 2,
          strategy: "nested",
          avgStepMs: 5,
          stepSampleCount: 10,
        }}
      />
    );
    expect(screen.getByText(/cells\/s/)).toBeInTheDocument();
  });

  it("renders T(step) avg when samples exist", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        simulation={{
          n: 4,
          dimensions: 2,
          strategy: "linear-algebra",
          avgStepMs: 1.25,
          stepSampleCount: 2,
        }}
      />
    );
    expect(screen.getByText("1.25 ms")).toBeInTheDocument();
    expect(screen.getByText(/n=2/)).toBeInTheDocument();
  });

  it("uses short label for cached-linear-algebra", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        simulation={{
          n: 4,
          dimensions: 2,
          strategy: "cached-linear-algebra",
          avgStepMs: null,
          stepSampleCount: 0,
        }}
      />
    );
    expect(screen.getByText("Cached LA")).toBeInTheDocument();
  });

  it("renders 3D grid size as n³", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        simulation={{
          n: 3,
          dimensions: 3,
          strategy: "graph",
          avgStepMs: null,
          stepSampleCount: 0,
        }}
      />
    );
    expect(screen.getByText("3³")).toBeInTheDocument();
    expect(screen.getByText("27")).toBeInTheDocument();
  });

  it("renders map metrics when mapContext is provided", () => {
    render(
      <PerformanceBar
        snapshot={{ fps: 60, frameMs: 16, stepMs: null }}
        mapContext={{
          parcelCount: 2048,
          rulePreset: "conway",
          counter: 42,
          timeComplexity: "Θ(C+E)",
          spaceComplexity: "Θ(C+E)",
        }}
      />
    );
    expect(screen.getByRole("status", { name: /map simulation metrics/i })).toBeInTheDocument();
    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("2,048")).toBeInTheDocument();
    expect(screen.getByText("Conway")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getAllByText("Θ(C+E)").length).toBe(2);
  });
});
