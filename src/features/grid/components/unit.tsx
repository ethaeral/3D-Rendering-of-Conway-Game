import React from "react";
import { UnitContainer } from "../game-styles";
import { FaceMemo } from "./face";
import type { UnitType } from "../../conway/types";

interface UnitProps {
  info: UnitType;
  is2D?: boolean;
  outline?: boolean;
  generation?: number;
}

const FACE_INDICES = [0, 1, 2, 3, 4, 5] as const;

export function Unit({ info, outline }: UnitProps) {
  return (
    <UnitContainer>
      {FACE_INDICES.map((faceIndex) => (
        <FaceMemo key={faceIndex} info={info} outline={outline} />
      ))}
    </UnitContainer>
  );
}

export const UnitMemo = React.memo(Unit);
