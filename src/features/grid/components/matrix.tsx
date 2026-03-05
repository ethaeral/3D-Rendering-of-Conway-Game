import React from "react";
import { RowMemo } from "./row";
import { WindowContainer } from "../game-styles";
import type { UnitType } from "../../conway/types";
import type { GridDimensions } from "../../conway/worker/conway-types";

interface MatrixProps {
  MDMatrix: UnitType[][];
  dimensions?: GridDimensions;
  outline?: boolean;
  generation?: number;
}

export function Matrix({ MDMatrix, dimensions = 3, outline, generation = 0 }: MatrixProps) {
  const is2D = dimensions === 2;
  const n = MDMatrix.length;
  return (
    <WindowContainer $is2D={is2D} $n={n}>
      {MDMatrix.map((array, rowIndex) => (
        <RowMemo
          key={rowIndex}
          array={array}
          is2D={is2D}
          n={n}
          outline={outline}
          generation={generation}
        />
      ))}
    </WindowContainer>
  );
}

export const MatrixMemo = React.memo(Matrix);
