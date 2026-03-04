import React, { useRef, useEffect } from "react";
import { MatrixMemo } from "./matrix";
import { MainContainer } from "./game-styles";
import { logGridUpdate } from "../../../utils/debug";
import type { Matrix3D } from "../types";

interface MainProps {
  animation?: boolean;
  matrix: Matrix3D;
  outline?: boolean;
  counter?: number;
  xTrans?: number;
  yTrans?: number;
}

export function Main({
  animation,
  matrix,
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
        matrixLayers: matrix.length,
      });
    }
  }, [counter]);
  return (
    <MainContainer $animation={animation} $xTrans={xTrans} $yTrans={yTrans}>
      {matrix.map((MDMatrix, layerIndex) => (
        <MatrixMemo
          key={layerIndex}
          MDMatrix={MDMatrix}
          outline={outline}
          generation={counter}
        />
      ))}
    </MainContainer>
  );
}

export const MainMemo = React.memo(Main);
