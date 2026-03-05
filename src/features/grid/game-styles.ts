import styled from "styled-components";

interface MainContainerProps {
  $animation?: boolean;
  $xTrans?: number;
  $yTrans?: number;
  $n?: number;
  $dimensions?: number;
}

const gridSizeEm = (n: number) => Math.max(1, n) * 2.5 + (Math.max(1, n) - 1) * 0.5;

export const MainContainer = styled.div.attrs<MainContainerProps>(
  (props) => {
    const n = props.$n ?? 5;
    const size = gridSizeEm(n);
    const baseTransform = "translate(-50%, -50%)";
    const rotate =
      props.$yTrans != null && props.$xTrans != null
        ? ` rotateX(${props.$xTrans}deg) rotateY(${props.$yTrans}deg)`
        : "";
    return {
      style: {
        width: `${size}em`,
        height: `${size}em`,
        transform: baseTransform + rotate,
        animation: props.$animation ? "r 60s linear infinite" : "none",
      },
    };
  }
)<MainContainerProps>`
  transform-style: preserve-3d;
  position: absolute;
  top: 50%;
  left: 50%;
  @keyframes r {
    to {
      transform: translate(-50%, -50%) rotateY(1turn) rotateX(1turn) rotateZ(1turn);
    }
  }
`;

interface WindowContainerProps {
  $is2D?: boolean;
  $n?: number;
}

const windowContainer2D = (n: number) => {
  const size = gridSizeEm(n);
  return `left: 50%; top: 50%; width: ${size}em; height: ${size}em; margin-left: -${size / 2}em; margin-top: -${size / 2}em;`;
};

export const WindowContainer = styled.div<WindowContainerProps>`
  position: absolute;
  transform-style: preserve-3d;
  ${(props) =>
    props.$is2D && props.$n != null
      ? windowContainer2D(props.$n)
      : "left: 0; top: 0;"}
  /* 3D: layer stacking transforms (2D overrides below) */
  &:nth-child(1) {
    transform: translate3d(-1em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(2) {
    transform: translate3d(-2em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(3) {
    transform: translate3d(-3em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(4) {
    transform: translate3d(-4em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(5) {
    transform: translate3d(-5em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(6) {
    transform: translate3d(-6em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(7) {
    transform: translate3d(-7em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(8) {
    transform: translate3d(-8em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(9) {
    transform: translate3d(-9em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(10) {
    transform: translate3d(-10em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  /* 2D: no layer shift, rows only use top */
  ${(props) =>
    props.$is2D && props.$n
      ? Array.from(
          { length: props.$n },
          (_, i) =>
            `&:nth-child(${i + 1}) { transform: scale3d(0.75, 0.75, 0.75); }`
        ).join("")
      : ""}
`;

interface RowContainerProps {
  $is2D?: boolean;
  $n?: number;
}

export const RowContainer = styled.div<RowContainerProps>`
  position: absolute;
  transform-style: preserve-3d;
  /* row index (3D: vh units) */
  &:nth-child(1) { top: 10vh; }
  &:nth-child(2) { top: 20vh; }
  &:nth-child(3) { top: 30vh; }
  &:nth-child(4) { top: 40vh; }
  &:nth-child(5) { top: 50vh; }
  &:nth-child(6) { top: 60vh; }
  &:nth-child(7) { top: 70vh; }
  &:nth-child(8) { top: 80vh; }
  &:nth-child(9) { top: 90vh; }
  &:nth-child(10) { top: 100vh; }
  /* 2D: rows stacked with same spacing as cells (2.5em + 0.5em = 3em) */
  ${(props) => {
    if (!props.$is2D || !props.$n) return "";
    const n = props.$n;
    const stepEm = 2.5 + 0.5;
    return Array.from({ length: n }, (_, i) =>
      `&:nth-child(${i + 1}) { top: ${i * stepEm}em; }`
    ).join("");
  }}
  /* 2D: position cells horizontally with same step (3em) */
  ${(props) => {
    if (!props.$is2D || !props.$n) return "";
    const n = props.$n;
    const stepEm = 2.5 + 0.5;
    return Array.from({ length: n }, (_, i) =>
      `& > *:nth-child(${i + 1}) { left: ${i * stepEm}em; }`
    ).join("");
  }}
`;

export const UnitContainer = styled.div`
  position: absolute;
  transform-style: preserve-3d;
  &:nth-child(1) {
    transform: translate3d(0em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(2) {
    transform: translate3d(0em, 0em, 2em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(3) {
    transform: translate3d(0em, 0em, 4em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(4) {
    transform: translate3d(0em, 0em, 6em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(5) {
    transform: translate3d(0em, 0em, 8em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(6) {
    transform: translate3d(0em, 0em, 10em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(7) {
    transform: translate3d(0em, 0em, 12em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(8) {
    transform: translate3d(0em, 0em, 14em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(9) {
    transform: translate3d(0em, 0em, 16em) scale3d(0.75, 0.75, 0.75);
  }
  &:nth-child(10) {
    transform: translate3d(0em, 0em, 18em) scale3d(0.75, 0.75, 0.75);
  }
`;

interface FaceContainerProps {
  $outline?: boolean;
  $isAlive?: boolean;
  $color?: string;
  $fifthCalc?: number;
  $sixthCalc?: number;
}

export const FaceContainer = styled.div.attrs<FaceContainerProps>(
  (props) => ({
    style: {
      background: props.$isAlive
        ? `rgba(${props.$color ?? "255,255,255"}, 0.3)`
        : "rgba(255, 255, 255, 0)",
      boxShadow:
        props.$outline || props.$isAlive
          ? "inset 0 0 1px rgba(0, 0, 0, 0.5)"
          : "none",
    },
  })
)<FaceContainerProps>`
  position: absolute;
  width: 2.5em;
  height: 2.5em;
  &:nth-child(1) {
    transform: rotateY(0deg) translateZ(1.25em);
  }
  &:nth-child(2) {
    transform: rotateY(90deg) translateZ(1.25em);
  }
  &:nth-child(3) {
    transform: rotateY(180deg) translateZ(1.25em);
  }
  &:nth-child(4) {
    transform: rotateY(270deg) translateZ(1.25em);
  }
  &:nth-child(5) {
    transform: ${(props) =>
      `rotateX(${props.$fifthCalc ?? 90}deg) translateZ(1.25em)`};
  }
  &:nth-child(6) {
    transform: ${(props) =>
      `rotateX(${props.$sixthCalc ?? -90}deg) translateZ(1.25em)`};
  }
`;

export const DragContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 95vw;
  height: 99vh;
`;
