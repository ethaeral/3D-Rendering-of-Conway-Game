import { createUnit } from "./unit-structure";
import {
  randomNumber,
  randomRGBColorGen,
  stringKeyToInt,
} from "./helpers";
import { logGridUpdate } from "../../../utils/debug";
import type { Matrix3D, NodeInfo, UnitType } from "../types";

export class IIIDMatrix {
  matrix: Matrix3D = [];
  n: number;
  nodes: Record<string, NodeInfo> = {};

  constructor(n: number) {
    this.n = n;
  }

  genMatrix(): void {
    const matrix: (UnitType[][] | null)[] = Array(this.n).fill(null);
    matrix.forEach((_, gpIdx) => {
      const innerMatrix: (UnitType[] | null)[] = Array(this.n).fill(null);
      innerMatrix.forEach((_, pIdx) => {
        innerMatrix[pIdx] = Array(this.n).fill(null) as unknown as UnitType[];
      });
      matrix[gpIdx] = innerMatrix as UnitType[][];
    });
    this.matrix = matrix as Matrix3D;
    this.createNodes();
  }

  matrixGenCxn(): void {
    const diffX = [-1, 0, 1];
    const diffY = [-1, 0, 1];
    const diffZ = [-1, 0, 1];
    const dirMap: Record<string, string> = { "-1": "n", "1": "p", "0": "o" };
    for (const node of Object.keys(this.nodes)) {
      const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
      for (const dx of diffX) {
        for (const dy of diffY) {
          for (const dz of diffZ) {
            try {
              const nx = dx + cIdx;
              const ny = dy + pIdx;
              const nz = dz + gpIdx;
              if (
                Math.min(ny, nx, nz) >= 0 &&
                this.matrix[nz]?.[ny]?.[nx] &&
                this.matrix[nz][ny][nx] !== this.matrix[gpIdx][pIdx][cIdx]
              ) {
                this.matrix[gpIdx][pIdx][cIdx].connectRooms(
                  this.matrix[nz][ny][nx],
                  `${dirMap[String(dx)]}${dirMap[String(dy)]}${dirMap[String(dz)]}`
                );
                this.nodes[node].neighbors.push(`${nz}${ny}${nx}`);
                if (this.matrix[nz][ny][nx].isAlive === true) {
                  this.nodes[node].livingNeighbors += 1;
                }
              }
            } catch {
              continue;
            }
          }
        }
      }
    }
  }

  applyRuleToState(): void {
    const reanimate: string[] = [];
    const expire: string[] = [];

    logGridUpdate("applyRuleToState: applying rules", {
      n: this.n,
      ruleSummary:
        "Die if <2 or ≥4 live neighbors; born if exactly 3; else unchanged.",
    });

    for (const node of Object.keys(this.nodes)) {
      const neighborsAliveNum = this.nodes[node].livingNeighbors;
      if (neighborsAliveNum < 2 || neighborsAliveNum >= 4) {
        expire.push(node);
      } else if (neighborsAliveNum === 3) {
        reanimate.push(node);
      }
    }

    logGridUpdate("applyRuleToState: classified by rule", {
      toReanimate: reanimate.length,
      toExpire: expire.length,
      sampleReanimate: reanimate.slice(0, 3),
      sampleExpire: expire.slice(0, 3),
      reanimateReason: "exactly 3 live neighbors",
      expireReason: "<2 or ≥4 live neighbors",
    });

    for (const node of reanimate) {
      const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
      if (this.matrix[gpIdx][pIdx][cIdx].isAlive === false) {
        this.matrix[gpIdx][pIdx][cIdx].isAlive = true;
        this.setAliveNeighborCount(node, true);
      }
    }
    for (const node of expire) {
      const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
      if (this.matrix[gpIdx][pIdx][cIdx].isAlive === true) {
        this.matrix[gpIdx][pIdx][cIdx].isAlive = false;
        this.setAliveNeighborCount(node, false);
      }
    }

    let aliveAfter = 0;
    for (const node of Object.keys(this.nodes)) {
      const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
      if (this.matrix[gpIdx][pIdx][cIdx].isAlive) aliveAfter++;
    }
    logGridUpdate("applyRuleToState: done", {
      births: reanimate.length,
      deaths: expire.length,
      aliveAfter,
    });
  }

  createNodes(): void {
    const roomsAmount = this.n ** 3;
    const matrixRoomAmount = this.n ** 2;
    let roomCount = 0;
    let matrixIdx = 0;
    let matrixRoomCount = 0;
    while (roomCount < roomsAmount) {
      if (matrixRoomCount === matrixRoomAmount) {
        matrixIdx += 1;
        matrixRoomCount = 0;
      }
      const xCoord = matrixRoomCount % this.n;
      const yCoord = Math.floor(matrixRoomCount / this.n);
      const zCoord = matrixIdx;
      this.matrix[zCoord][yCoord][xCoord] = createUnit(
        roomCount,
        xCoord,
        yCoord,
        zCoord
      );
      this.nodes[`${zCoord}${yCoord}${xCoord}`] = {
        livingNeighbors: 0,
        neighbors: [],
      };
      const threshold = 25;
      const randomNum = randomNumber(100);
      if (randomNum < threshold) {
        this.matrix[zCoord][yCoord][xCoord].isAlive = true;
      }
      this.matrix[zCoord][yCoord][xCoord].color = randomRGBColorGen();
      matrixRoomCount += 1;
      roomCount += 1;
    }
  }

  randomizeState(): void {
    this.clearLivingState();
    const roomsAmount = this.n ** 3;
    const matrixRoomAmount = this.n ** 2;
    let roomCount = 0;
    let matrixIdx = 0;
    let matrixRoomCount = 0;
    while (roomCount < roomsAmount) {
      if (matrixRoomCount === matrixRoomAmount) {
        matrixIdx += 1;
        matrixRoomCount = 0;
      }
      const xCoord = matrixRoomCount % this.n;
      const yCoord = Math.floor(matrixRoomCount / this.n);
      const zCoord = matrixIdx;
      const threshold = 25;
      const randomNum = randomNumber(100);
      if (randomNum < threshold) {
        this.matrix[zCoord][yCoord][xCoord].isAlive = true;
        this.setAliveNeighborCount(`${zCoord}${yCoord}${xCoord}`, true);
      }
      this.matrix[zCoord][yCoord][xCoord].color = randomRGBColorGen();
      matrixRoomCount += 1;
      roomCount += 1;
    }
  }

  clearLivingState(): void {
    for (const node of Object.keys(this.nodes)) {
      const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
      this.nodes[node].livingNeighbors = 0;
      this.matrix[gpIdx][pIdx][cIdx].isAlive = false;
    }
  }

  setAliveNeighborCount(node: string, inc: boolean): void {
    for (const neighbor of this.nodes[node].neighbors) {
      if (inc === true) {
        this.nodes[neighbor].livingNeighbors =
          this.nodes[neighbor].livingNeighbors + 1;
      } else if (this.nodes[neighbor].livingNeighbors > 0) {
        this.nodes[neighbor].livingNeighbors =
          this.nodes[neighbor].livingNeighbors - 1;
      }
    }
  }
}
