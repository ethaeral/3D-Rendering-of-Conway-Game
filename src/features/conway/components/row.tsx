import React from "react";
import { RowContainer } from "./game-styles";
import { UnitMemo } from "./unit";
import type { UnitType } from "../types";

interface RowProps {
  array: UnitType[];
  outline?: boolean;
  generation?: number;
}

export function Row({ array, outline, generation = 0 }: RowProps) {
  return (
    <RowContainer>
      {array.map((unit) => (
        <UnitMemo
          key={`${unit.id}-${generation}`}
          info={unit}
          outline={outline}
          generation={generation}
        />
      ))}
    </RowContainer>
  );
}

export const RowMemo = React.memo(Row);
