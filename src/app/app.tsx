import React, { useState } from "react";
import { MainMemo } from "../features/grid/components/main";
import { GridWebGL } from "../features/grid/components/grid-webgl";
import { AppContainer, Controls, RightClip, Buttons, Slider } from "./app-styles";
import { DragWrapper } from "../features/grid/components/drag-wrapper";
import { useConwaySimulation } from "../features/conway/hooks/use-conway-simulation";
import { Switch } from "../components/switch";
import { Button } from "../components/ui/button";
import { Slider as ShadcnSlider } from "../components/ui/slider";
import { CONWAY_GRID_MAX } from "../config/conway";

type ViewMode = "dom" | "webgl";

export function App({ viewMode: viewModeProp }: { viewMode?: ViewMode } = {}) {
  const simulation = useConwaySimulation();
  const [viewModeState, setViewModeState] = useState<ViewMode>("dom");
  const viewMode = viewModeProp ?? viewModeState;
  const showRendererToggle = viewModeProp == null;

  return (
    <AppContainer>
      {viewMode === "dom" ? (
        <DragWrapper
          component={MainMemo}
          animation={simulation.animation}
          matrix={simulation.curr}
          outline={simulation.outline}
          counter={simulation.counter}
        />
      ) : (
        <div style={{ width: "95vw", height: "99vh" }}>
          <GridWebGL
            matrix={simulation.curr}
            outline={simulation.outline}
            animation={simulation.animation}
            generation={simulation.counter}
          />
        </div>
      )}
      <Controls className="gap-2">
        <RightClip>
          <p className="text-xs font-medium mb-4 pb-4">
            Generation: {simulation.counter}
          </p>
          <Buttons>
            <div className="flex flex-col gap-6 mb-2">
              {showRendererToggle && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Renderer:</span>
                  <Button
                    variant={viewMode === "dom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewModeState("dom")}
                  >
                    DOM
                  </Button>
                  <Button
                    variant={viewMode === "webgl" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewModeState("webgl")}
                  >
                    WebGL
                  </Button>
                </div>
              )}
              <Switch
                title="Animate"
                cb={simulation.setAnimation}
                state={simulation.animation}
              />
              <Switch
                title="Automate"
                cb={simulation.setOnGoing}
                state={simulation.onGoing}
              />
              <Switch
                title="Outline"
                cb={simulation.setOutline}
                state={simulation.outline}
                checked={true}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <Button
                variant="default"
                size="sm"
                onClick={simulation.onReset}
              >
                Reset
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => simulation.implementChangeState()}
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
            value={[simulation.n]}
            onValueChange={simulation.adjustCubeCount}
            className="h-32 pt-5 ml-8"
          />
        </Slider>
      </Controls>
    </AppContainer>
  );
}
