import React from "react";
import type { Matrix3D } from "../../conway/types";

export interface Grid2DViewProps {
  matrix: Matrix3D;
  outline?: boolean;
  counter?: number;
}

const CELL_SIZE_EM = 2.5;
const GAP_EM = 0.5;

export function Grid2DView({
  matrix,
  outline = true,
  counter = 0,
}: Grid2DViewProps) {
  const layer = matrix[0];
  if (!layer?.length) return null;

  const n = layer.length;
  const sizeEm = n * CELL_SIZE_EM + (n - 1) * GAP_EM;

  return (
    <div
      className="absolute left-1/2 top-1/2 flex flex-col -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${sizeEm}em`,
        height: `${sizeEm}em`,
        gap: `${GAP_EM}em`,
      }}
    >
      {layer.map((row, rowIndex) => (
        <div
          key={`${rowIndex}-${counter}`}
          className="flex"
          style={{ gap: `${GAP_EM}em` }}
        >
          {row.map((unit) => (
            <div
              key={`${unit.id}-${counter}`}
              className="flex-shrink-0 rounded-sm"
              style={{
                width: `${CELL_SIZE_EM}em`,
                height: `${CELL_SIZE_EM}em`,
                background: unit.isAlive
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(255, 255, 255, 0)",
                boxShadow:
                  outline || unit.isAlive
                    ? "inset 0 0 1px rgba(0, 0, 0, 0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const Grid2DViewMemo = React.memo(Grid2DView);
