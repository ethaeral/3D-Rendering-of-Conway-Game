import React from "react";
import { FaceContainer } from "../game-styles";
import { logGridUpdate } from "../../../utils/debug";
import type { UnitType } from "../../conway/types";

const FACE_5_ROTATION = 90;
const FACE_6_ROTATION = -90;

interface FaceProps {
  info: UnitType;
  outline?: boolean;
}

export function Face({ info, outline }: FaceProps) {
  const { color, isAlive } = info;
  if (info.id === 0) {
    logGridUpdate("Face render (cell 0 only)", {
      id: info.id,
      isAlive,
      hasColor: Boolean(color),
    });
  }
  return (
    <FaceContainer
      $outline={outline}
      $isAlive={isAlive}
      $color={color ?? undefined}
      $fifthCalc={FACE_5_ROTATION}
      $sixthCalc={FACE_6_ROTATION}
    />
  );
}

export const FaceMemo = React.memo(Face);
