import React, { useEffect, useState, useCallback, useRef } from "react";
import { MainMemo } from "../features/conway/components/main";
import { GridWebGL } from "../features/conway/components/grid-webgl";
import { AppContainer, Controls, RightClip, Buttons, Slider } from "./app-styles";
import { IIIDMatrix } from "../features/conway/utils/3d-matrix-structure";
import { DragWrapper } from "../features/conway/components/drag-wrapper";
import {
  computeNextStateInWorker,
  applyWorkerResult,
} from "../features/conway/worker/conway-worker-api";
import { Switch } from "../components";
import { Button } from "../components/ui/button";
import { Slider as ShadcnSlider } from "../components/ui/slider";
import type { Matrix3D } from "../features/conway/types";
import { CONWAY_GRID_MAX } from "../config/conway";
import { logGridUpdate } from "../utils/debug";

type ViewMode = "dom" | "webgl";

function instantiateMtrx(x: number): IIIDMatrix {
  const m = new IIIDMatrix(x);
  m.genMatrix();
  m.matrixGenCxn();
  return m;
}

const matrices: Record<number, IIIDMatrix> = {};
for (let i = 1; i <= CONWAY_GRID_MAX; i++) {
  matrices[i] = instantiateMtrx(i);
}

let stepInProgress = false;

export function App() {
  const [curr, setCurr] = useState<Matrix3D>(matrices[1].matrix);
  const [counter, setCounter] = useState(0);
  const [onGoing, setOnGoing] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [outline, setOutline] = useState(true);
  const [n, setN] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("dom");
  const automateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const implementChangeState = useCallback(async () => {
    const already = stepInProgress;
    stepInProgress = true;
    if (already) {
      logGridUpdate("implementChangeState: skipped (step already in progress)");
      return;
    }
    const matrixInstance = matrices[n];
    logGridUpdate("implementChangeState: start", { n, gridSize: n ** 3 });
    try {
      const result = await computeNextStateInWorker(matrixInstance.matrix, n);
      logGridUpdate("implementChangeState: worker OK", {
        resultLength: result.length,
        aliveCount: result.filter((c) => c.isAlive).length,
      });
      applyWorkerResult(matrixInstance, n, result);
      logGridUpdate("implementChangeState: setCounter (increment queued)");
      setCounter((num) => num + 1);
    } catch (err) {
      logGridUpdate("implementChangeState: worker failed, using sync", {
        error: err instanceof Error ? err.message : String(err),
      });
      matrixInstance.applyRuleToState();
      setCounter((num) => num + 1);
    } finally {
      stepInProgress = false;
    }
  }, [n]);

  const adjustCubeCount = useCallback((value: number[]) => {
    const newN = value[0] ?? 1;
    setN(newN);
    setCurr(matrices[newN].matrix);
    setCounter(0);
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
      }, 1000);
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

  return (
    <AppContainer>
      {viewMode === "dom" ? (
        <DragWrapper
          component={MainMemo}
          animation={animation}
          matrix={curr}
          outline={outline}
          counter={counter}
        />
      ) : (
        <div style={{ width: "95vw", height: "99vh" }}>
          <GridWebGL
            matrix={curr}
            outline={outline}
            animation={animation}
            generation={counter}
          />
        </div>
      )}
      <Controls className="gap-2">
        <RightClip>
          <p className="text-xs font-medium mb-4 pb-4">Generation: {counter}</p>
          <Buttons>
            <div className="flex flex-col gap-6 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Renderer:</span>
                <Button
                  variant={viewMode === "dom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("dom")}
                >
                  DOM
                </Button>
                <Button
                  variant={viewMode === "webgl" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("webgl")}
                >
                  WebGL
                </Button>
              </div>
              <Switch title="Animate" cb={setAnimation} state={animation} />
              <Switch title="Automate" cb={setOnGoing} state={onGoing} />
              <Switch
                title="Outline"
                cb={setOutline}
                state={outline}
                checked={true}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setCounter(0);
                  matrices[n].randomizeState();
                }}
              >
                Reset
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => implementChangeState()}
              >
                Next
              </Button>
            </div>
          </Buttons>
        </RightClip>
        <Slider>
          <ShadcnSlider
            orientation="vertical"
            min={1}
            max={CONWAY_GRID_MAX}
            step={1}
            value={[n]}
            onValueChange={adjustCubeCount}
            className="h-32 pt-5 ml-8"
          />
        </Slider>
      </Controls>
    </AppContainer>
  );
}
