import type { UnitType } from "../types";

export function createUnit(
  id: number,
  x: number,
  y: number,
  z: number
): UnitType {
  const unit: UnitType = {
    id,
    x,
    y,
    z,
    isAlive: false,
    color: null,
    npo: null,
    opo: null,
    ppo: null,
    noo: null,
    ooo: null,
    poo: null,
    nno: null,
    ono: null,
    pno: null,
    npp: null,
    ppp: null,
    nop: null,
    oop: null,
    pop: null,
    nnp: null,
    onp: null,
    pnp: null,
    npn: null,
    opn: null,
    ppn: null,
    non: null,
    oon: null,
    pon: null,
    nnn: null,
    onn: null,
    pnn: null,
    connectRooms(room: UnitType, dir: string) {
      (this as Record<string, unknown>)[dir] = room;
    },
  };
  return unit;
}
