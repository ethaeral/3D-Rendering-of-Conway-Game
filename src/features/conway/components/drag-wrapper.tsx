import React, { useState, useCallback, useRef } from "react";
import { DragContainer } from "./game-styles";
import type { Matrix3D } from "../types";
import type { ComponentType } from "react";

interface DragWrapperProps {
  component: ComponentType<{
    animation?: boolean;
    matrix: Matrix3D;
    outline?: boolean;
    counter?: number;
    xTrans?: number;
    yTrans?: number;
  }>;
  animation: boolean;
  matrix: Matrix3D;
  outline: boolean;
  counter: number;
}

function getScrollOffset() {
  return {
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop,
  };
}

export function DragWrapper({
  component: Component,
  animation,
  matrix,
  outline,
  counter,
}: DragWrapperProps) {
  const [prev, setPrev] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const [angle, setAngle] = useState({ x: 0, y: 0 });
  const prevRef = useRef(prev);
  prevRef.current = prev;

  const getXY = useCallback((e: React.DragEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const { x: cursorX, y: cursorY } = getScrollOffset();
    if ("dataTransfer" in e && e.dataTransfer) {
      const crt = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
      crt.style.opacity = "1";
      e.dataTransfer.setDragImage(crt, 0, 0);
    }
    setPrev({
      x: clientX + cursorX,
      y: clientY + cursorY,
    });
  }, []);

  const calcAngle = useCallback((e: React.DragEvent | React.TouchEvent) => {
    const clientX =
      "touches" in e && e.touches.length
        ? e.touches[0].clientX
        : "changedTouches" in e && e.changedTouches.length
          ? e.changedTouches[0].clientX
          : (e as React.DragEvent).clientX;
    const clientY =
      "touches" in e && e.touches.length
        ? e.touches[0].clientY
        : "changedTouches" in e && e.changedTouches.length
          ? e.changedTouches[0].clientY
          : (e as React.DragEvent).clientY;
    const { x: prevX, y: prevY } = prevRef.current;
    if (prevX == null || prevY == null) return;
    const { x: cursorX, y: cursorY } = getScrollOffset();
    const deltaX = (clientX + cursorX - prevX) / 2;
    const deltaY = (clientY + cursorY - prevY) / 2;
    if (!animation) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setAngle((a) => ({ ...a, y: a.y + deltaX }));
      } else {
        setAngle((a) => ({ ...a, x: a.x + deltaY }));
      }
    }
  }, [animation]);

  return (
    <DragContainer
      draggable={!animation}
      onTouchStart={getXY}
      onTouchMove={calcAngle}
      onDragStart={getXY}
      onDragEnd={calcAngle}
    >
      <Component
        animation={animation}
        matrix={matrix}
        outline={outline}
        counter={counter}
        xTrans={angle.x}
        yTrans={angle.y}
      />
    </DragContainer>
  );
}
