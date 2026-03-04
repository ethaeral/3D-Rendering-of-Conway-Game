export interface UnitType {
  id: number;
  x: number;
  y: number;
  z: number;
  isAlive: boolean;
  color: string | null;
  connectRooms: (room: UnitType, dir: string) => void;
  [key: string]: unknown;
}

export interface NodeInfo {
  livingNeighbors: number;
  neighbors: string[];
}

export type Matrix3D = UnitType[][][];

export interface StringKeyCoords {
  gpIdx: number;
  pIdx: number;
  cIdx: number;
}
