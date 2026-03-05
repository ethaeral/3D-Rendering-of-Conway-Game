import type { StringKeyCoords } from "../types";

export function randomNumber(range: number): number {
  return Math.floor(Math.random() * range);
}

export function randomRGBColorGen(): string {
  const color: number[] = [];
  for (let i = 0; i < 3; i++) {
    const num = randomNumber(256);
    color.push(num);
  }
  return `${color[0]}, ${color[1]}, ${color[2]}`;
}

export function customUUID(): string {
  let newID = "";
  for (let i = 0; i < 33; i++) {
    const num = randomNumber(100);
    if (num <= 25) {
      const charCode = String.fromCharCode(
        Math.floor(Math.random() * (90 - 65)) + 65
      );
      newID += charCode;
    } else {
      const nextNum = Math.floor(Math.random() * 10);
      newID += nextNum.toString();
    }
  }
  return newID;
}

export function stringKeyToInt(key: string): StringKeyCoords {
  const gpIdx = parseInt(key.charAt(0), 10);
  const pIdx = parseInt(key.charAt(1), 10);
  const cIdx = parseInt(key.charAt(2), 10);
  return { gpIdx, pIdx, cIdx };
}
