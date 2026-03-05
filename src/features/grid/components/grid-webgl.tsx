import React, { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Matrix3D } from "../../conway/types";
import type { GridDimensions } from "../../conway/worker/conway-types";

function OrbitControlsImpl({ is2D }: { is2D: boolean }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  useLayoutEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = !is2D;
    controls.enablePan = !is2D;
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl, is2D]);
  useFrame((_, delta) => {
    controlsRef.current?.update(delta);
  });
  return null;
}

const BOX_SIZE = 1.2;
const SPACING = 1.6;
const ALIVE_OPACITY = 0.3;

interface GridWebGLProps {
  matrix: Matrix3D;
  dimensions?: GridDimensions;
  outline?: boolean;
  animation?: boolean;
  generation?: number;
}

const _rainbowColor = new THREE.Color();
const _linearColor = new THREE.Color();

const INSTANCED_COLOR_VERTEX = `
  attribute vec3 position;
  attribute mat4 instanceMatrix;
  attribute vec3 instanceColor;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec3 vInstanceColor;
  void main() {
    vInstanceColor = instanceColor;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const INSTANCED_COLOR_FRAGMENT = `
  precision mediump float;
  varying vec3 vInstanceColor;
  uniform float opacity;
  void main() {
    gl_FragColor = vec4(vInstanceColor, opacity);
  }
`;

function parseColor(color: string | null, fallbackId?: number): [number, number, number] {
  if (color) {
    const parts = color.split(",").map((s) => parseInt(s.trim(), 10) / 255);
    if (parts.length >= 3) {
      const r = parts[0] ?? 1;
      const g = parts[1] ?? 1;
      const b = parts[2] ?? 1;
      _linearColor.setRGB(r, g, b).convertSRGBToLinear();
      return [_linearColor.r, _linearColor.g, _linearColor.b];
    }
  }
  if (fallbackId !== undefined) {
    const h = ((fallbackId * 137.508) % 360) / 360;
    _rainbowColor.setHSL(h, 0.7, 0.6);
    return [_rainbowColor.r, _rainbowColor.g, _rainbowColor.b];
  }
  _linearColor.setRGB(1, 1, 1);
  return [_linearColor.r, _linearColor.g, _linearColor.b];
}

function InstancedCubes({
  matrix,
  dimensions,
  outline,
  generation,
}: {
  matrix: Matrix3D;
  dimensions: GridDimensions;
  outline: boolean;
  generation: number;
}) {
  const outlineMeshRef = useRef<THREE.InstancedMesh>(null);
  const n = matrix.length;
  const is2D = dimensions === 2;
  const totalCount = is2D ? n * n : n * n * n;

  const { aliveData, outlineData, aliveMesh } = useMemo(() => {
    const alive: { matrix: THREE.Matrix4; r: number; g: number; b: number }[] = [];
    const outlineMats: THREE.Matrix4[] = [];
    const tempObject = new THREE.Object3D();
    if (is2D) {
      const z = 0;
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const unit = matrix[z][y][x];
          tempObject.position.set(x * SPACING, y * SPACING, 0);
          tempObject.scale.setScalar(BOX_SIZE);
          tempObject.updateMatrix();
          const matrix4 = new THREE.Matrix4().copy(tempObject.matrix);
          outlineMats.push(matrix4);
          if (unit.isAlive) {
            const [r, g, b] = parseColor(null, unit.id);
            alive.push({ matrix: matrix4, r, g, b });
          }
        }
      }
    } else {
      for (let z = 0; z < n; z++) {
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            const unit = matrix[z][y][x];
            tempObject.position.set(x * SPACING, y * SPACING, z * SPACING);
            tempObject.scale.setScalar(BOX_SIZE);
            tempObject.updateMatrix();
            const matrix4 = new THREE.Matrix4().copy(tempObject.matrix);
            outlineMats.push(matrix4);
            if (unit.isAlive) {
              const [r, g, b] = parseColor(null, unit.id);
              alive.push({ matrix: matrix4, r, g, b });
            }
          }
        }
      }
    }
    const count = alive.length;
    const maxCount = totalCount;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.RawShaderMaterial({
      vertexShader: INSTANCED_COLOR_VERTEX,
      fragmentShader: INSTANCED_COLOR_FRAGMENT,
      transparent: true,
      opacity: ALIVE_OPACITY,
      depthWrite: true,
      uniforms: {
        opacity: { value: ALIVE_OPACITY },
      },
    });
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(maxCount * 3),
      3
    );
    mesh.count = count;
    const tempColor = new THREE.Color();
    alive.forEach(({ matrix: mat, r, g, b }, i) => {
      mesh.setMatrixAt(i, mat);
      tempColor.setRGB(r, g, b);
      mesh.setColorAt(i, tempColor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    return { aliveData: alive, outlineData: outlineMats, aliveMesh: mesh };
  }, [matrix, n, generation, is2D, totalCount]);

  const aliveCount = aliveData.length;
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    if (aliveMesh.count !== aliveCount) {
      aliveMesh.count = aliveCount;
      aliveMesh.instanceMatrix.needsUpdate = true;
    }
    const tempColor = new THREE.Color();
    aliveData.forEach(({ matrix: mat, r, g, b }, i) => {
      aliveMesh.setMatrixAt(i, mat);
      tempColor.setRGB(r, g, b);
      aliveMesh.setColorAt(i, tempColor);
    });
    aliveMesh.instanceMatrix.needsUpdate = true;
    if (aliveMesh.instanceColor) aliveMesh.instanceColor.needsUpdate = true;
  }, [aliveData, aliveCount, aliveMesh]);

  useEffect(() => {
    if (aliveCount > 0) invalidate();
  }, [aliveData, aliveCount, invalidate]);

  useLayoutEffect(() => {
    const mesh = outlineMeshRef.current;
    if (!mesh || !outline) return;
    outlineData.forEach((mat, i) => mesh.setMatrixAt(i, mat));
    mesh.instanceMatrix.needsUpdate = true;
  }, [outlineData, outline]);

  return (
    <group>
      {aliveCount > 0 && (
        <primitive object={aliveMesh} />
      )}
      {outline && (
        <instancedMesh ref={outlineMeshRef} args={[undefined, undefined, totalCount]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#333"
            wireframe
            transparent
            opacity={0.5}
          />
        </instancedMesh>
      )}
    </group>
  );
}

function RotatingGroup({
  animation,
  is2D,
  children,
}: {
  animation: boolean;
  is2D: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!is2D && animation && groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function Scene({
  matrix,
  dimensions,
  outline,
  animation,
  generation,
}: {
  matrix: Matrix3D;
  dimensions: GridDimensions;
  outline: boolean;
  animation: boolean;
  generation: number;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const n = matrix.length;
  const is2D = dimensions === 2;
  const offset = ((n - 1) * SPACING) / 2;

  React.useEffect(() => {
    invalidate();
  }, [generation, invalidate]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <OrbitControlsImpl is2D={is2D} />
      <RotatingGroup animation={animation ?? false} is2D={is2D}>
        <group position={[-offset, -offset, is2D ? 0 : -offset]}>
          <InstancedCubes
            key={`${generation}-${dimensions}`}
            matrix={matrix}
            dimensions={dimensions}
            outline={outline ?? false}
            generation={generation}
          />
        </group>
      </RotatingGroup>
    </>
  );
}

export function GridWebGL({
  matrix,
  dimensions = 3,
  outline,
  animation,
  generation = 0,
}: GridWebGLProps) {
  const is2D = dimensions === 2;
  const n = matrix.length;
  const cameraPosition: [number, number, number] = is2D
    ? [0, 0, (n - 1) * SPACING * 2]
    : [12, 12, 12];
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "80vh" }}>
      <Canvas
        key={`${dimensions}-${n}`}
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          matrix={matrix}
          dimensions={dimensions}
          outline={outline ?? false}
          animation={animation ?? false}
          generation={generation}
        />
      </Canvas>
    </div>
  );
}
