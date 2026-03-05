import React from "react";
import { useOutletContext } from "react-router-dom";
import { Grid2DViewMemo } from "../../features/grid/components/grid-2d-view";
import { MainMemo } from "../../features/grid/components/main";
import { GridWebGL } from "../../features/grid/components/grid-webgl";
import { DragWrapper } from "../../features/grid/components/drag-wrapper";
import { BostonMapView } from "../../features/boston-map/components/boston-map-view";
import type { ConwayLayoutContext } from "../conway-layout";

export function ConwayGridDOM() {
  const ctx = useOutletContext<ConwayLayoutContext>();
  const is2D = ctx.dimensions === 2;
  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
      {is2D ? (
        <Grid2DViewMemo
          key={`v1-2d-${ctx.curr.length}`}
          matrix={ctx.curr}
          outline={ctx.outline}
          counter={ctx.counter}
        />
      ) : (
        <DragWrapper
          key={`v1-3d-${ctx.curr.length}`}
          component={MainMemo}
          animation={ctx.animation}
          matrix={ctx.curr}
          dimensions={ctx.dimensions}
          outline={ctx.outline}
          counter={ctx.counter}
        />
      )}
    </div>
  );
}

export function ConwayGridWebGL() {
  const ctx = useOutletContext<ConwayLayoutContext>();
  const is2D = ctx.dimensions === 2;
  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
      {is2D ? (
        <Grid2DViewMemo
          key={`v2-2d-${ctx.curr.length}`}
          matrix={ctx.curr}
          outline={ctx.outline}
          counter={ctx.counter}
        />
      ) : (
        <GridWebGL
          key={`v2-3d-${ctx.dimensions}-${ctx.curr.length}`}
          matrix={ctx.curr}
          dimensions={ctx.dimensions}
          outline={ctx.outline}
          animation={ctx.animation}
          generation={ctx.counter}
        />
      )}
    </div>
  );
}

export function ConwayGridV3() {
  return (
    <div className="min-h-0 min-w-0 flex-1">
      <BostonMapView />
    </div>
  );
}
