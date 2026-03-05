import React, { useRef, useEffect } from "react";
import { MatrixMemo } from "./matrix";
import { MainContainer } from "../game-styles";
import { logGridUpdate } from "../../../utils/debug";
import type { Matrix3D } from "../../conway/types";
import type { GridDimensions } from "../../conway/worker/conway-types";

interface MainProps {
  animation?: boolean;
  matrix: Matrix3D;
  dimensions?: GridDimensions;
  outline?: boolean;
  counter?: number;
  xTrans?: number;
  yTrans?: number;
}

export function Main({
  animation,
  matrix,
  dimensions = 3,
  outline,
  counter = 0,
  xTrans,
  yTrans,
}: MainProps) {
  const lastLoggedGen = useRef<number>(-1);
  useEffect(() => {
    if (counter !== lastLoggedGen.current) {
      lastLoggedGen.current = counter;
      logGridUpdate("Main render (generation changed)", {
        counter,
        matrixLayers: dimensions === 2 ? 1 : matrix.length,
      });
    }
  }, [counter, dimensions, matrix.length]);
  const layers = dimensions === 2 ? [matrix[0]] : matrix;
  const n = matrix.length;
  return (
    <MainContainer
      $animation={animation && dimensions !== 2}
      $xTrans={xTrans}
      $yTrans={yTrans}
      $n={n}
      $dimensions={dimensions}
    >
      {layers.map((MDMatrix, layerIndex) => (
        <MatrixMemo
          key={layerIndex}
          MDMatrix={MDMatrix}
          dimensions={dimensions}
          outline={outline}
          generation={counter}
        />
      ))}
    </MainContainer>
  );
}

export const MainMemo = React.memo(Main);
