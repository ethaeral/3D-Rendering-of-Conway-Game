import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./app";
import { serializeMatrix } from "../features/conway/worker/conway-worker-api";
import { computeNextState } from "../features/conway/worker/conway-rules";
import { IIIDMatrix } from "../features/conway/utils/3d-matrix-structure";

vi.mock("../features/conway/worker/conway-worker-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../features/conway/worker/conway-worker-api")>();
  return {
    ...actual,
    computeNextStateInWorker: vi.fn(
      (matrix: Parameters<typeof actual.serializeMatrix>[0], n: number) => {
        const input = actual.serializeMatrix(matrix, n);
        return Promise.resolve(computeNextState(input));
      }
    ),
  };
});

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders generation counter and controls", () => {
    render(<App />);
    expect(screen.getByText(/Generation:/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("shows Generation: 0 initially", () => {
    render(<App />);
    expect(screen.getByText("Generation: 0")).toBeInTheDocument();
  });

  it("increments generation when Next is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Generation: 0")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await waitFor(() => {
      expect(screen.getByText("Generation: 1")).toBeInTheDocument();
    });
  });

  it("has DOM and WebGL renderer buttons", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /DOM/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /WebGL/i })).toBeInTheDocument();
  });
});
