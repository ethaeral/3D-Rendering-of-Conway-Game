import React from "react";
import { RowContainer } from "../game-styles";
import { UnitMemo } from "./unit";
import type { UnitType } from "../../conway/types";

interface RowProps {
  array: UnitType[];
  is2D?: boolean;
  n?: number;
  outline?: boolean;
  generation?: number;
}

export function Row({ array, is2D, n, outline, generation = 0 }: RowProps) {
  return (
    <RowContainer $is2D={is2D} $n={n}>
      {array.map((unit) => (
        <UnitMemo
          key={`${unit.id}-${generation}`}
          info={unit}
          is2D={is2D}
          outline={outline}
          generation={generation}
        />
      ))}
    </RowContainer>
  );
}

export const RowMemo = React.memo(Row);
