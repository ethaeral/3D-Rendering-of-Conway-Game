import React from "react";
import { RowMemo } from "./row";
import { WindowContainer } from "./game-styles";
import type { UnitType } from "../types";

interface MatrixProps {
  MDMatrix: UnitType[][];
  outline?: boolean;
  generation?: number;
}

export function Matrix({ MDMatrix, outline, generation = 0 }: MatrixProps) {
  return (
    <WindowContainer>
      {MDMatrix.map((array, rowIndex) => (
        <RowMemo
          key={rowIndex}
          array={array}
          outline={outline}
          generation={generation}
        />
      ))}
    </WindowContainer>
  );
}

export const MatrixMemo = React.memo(Matrix);
