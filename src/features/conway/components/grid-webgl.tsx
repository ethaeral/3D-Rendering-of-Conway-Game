import React, { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Matrix3D } from "../types";

function OrbitControlsImpl() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  useLayoutEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);
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
  outline?: boolean;
  animation?: boolean;
  generation?: number;
}

const _rainbowColor = new THREE.Color();

function parseColor(color: string | null, fallbackId?: number): [number, number, number] {
  if (color) {
    const parts = color.split(",").map((s) => parseInt(s.trim(), 10) / 255);
    if (parts.length >= 3) return [parts[0] ?? 1, parts[1] ?? 1, parts[2] ?? 1];
  }
  if (fallbackId !== undefined) {
    const h = ((fallbackId * 137.508) % 360) / 360;
    _rainbowColor.setHSL(h, 0.7, 0.6);
    return [_rainbowColor.r, _rainbowColor.g, _rainbowColor.b];
  }
  return [1, 1, 1];
}

function InstancedCubes({
  matrix,
  outline,
  generation,
}: {
  matrix: Matrix3D;
  outline: boolean;
  generation: number;
}) {
  const aliveMeshRef = useRef<THREE.InstancedMesh>(null);
  const outlineMeshRef = useRef<THREE.InstancedMesh>(null);
  const n = matrix.length;
  const totalCount = n * n * n;

  const { aliveData, outlineData } = useMemo(() => {
    const alive: { matrix: THREE.Matrix4; r: number; g: number; b: number }[] = [];
    const outline: THREE.Matrix4[] = [];
    const tempObject = new THREE.Object3D();
    for (let z = 0; z < n; z++) {
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const unit = matrix[z][y][x];
          tempObject.position.set(x * SPACING, y * SPACING, z * SPACING);
          tempObject.scale.setScalar(BOX_SIZE);
          tempObject.updateMatrix();
          const matrix4 = new THREE.Matrix4().copy(tempObject.matrix);
          outline.push(matrix4);
          if (unit.isAlive) {
            const [r, g, b] = parseColor(unit.color, unit.id);
            alive.push({ matrix: matrix4, r, g, b });
          }
        }
      }
    }
    return { aliveData: alive, outlineData: outline };
  }, [matrix, n, generation]);

  const aliveCount = aliveData.length;

  const tempColor = useRef(new THREE.Color()).current;
  const invalidate = useThree((s) => s.invalidate);

  function applyInstanceData() {
    const mesh = aliveMeshRef.current;
    if (!mesh || aliveCount === 0) return false;
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(aliveCount * 3),
      3
    );
    aliveData.forEach(({ matrix: mat, r, g, b }, i) => {
      mesh.setMatrixAt(i, mat);
      tempColor.setRGB(r, g, b);
      mesh.setColorAt(i, tempColor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    return true;
  }

  useLayoutEffect(() => {
    applyInstanceData();
  }, [aliveData, aliveCount, tempColor]);

  useEffect(() => {
    if (aliveCount === 0) return;
    if (!aliveMeshRef.current) {
      const id = requestAnimationFrame(() => {
        if (applyInstanceData()) invalidate();
      });
      return () => cancelAnimationFrame(id);
    }
    invalidate();
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
        <instancedMesh ref={aliveMeshRef} args={[undefined, undefined, aliveCount]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={0xffffff}
            vertexColors
            transparent
            opacity={ALIVE_OPACITY}
            depthWrite={true}
          />
        </instancedMesh>
      )}
      {outline && (
        <instancedMesh ref={outlineMeshRef} args={[undefined, undefined, totalCount]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#333"
            wireframe
            transparent
            opacity={0.8}
          />
        </instancedMesh>
      )}
    </group>
  );
}

function RotatingGroup({
  animation,
  children,
}: {
  animation: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (animation && groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function Scene({
  matrix,
  outline,
  animation,
  generation,
}: {
  matrix: Matrix3D;
  outline: boolean;
  animation: boolean;
  generation: number;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const n = matrix.length;
  const offset = ((n - 1) * SPACING) / 2;

  React.useEffect(() => {
    invalidate();
  }, [generation, invalidate]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <OrbitControlsImpl />
      <RotatingGroup animation={animation ?? false}>
        <group position={[-offset, -offset, -offset]}>
          <InstancedCubes
            key={generation}
            matrix={matrix}
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
  outline,
  animation,
  generation = 0,
}: GridWebGLProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "80vh" }}>
      <Canvas
        camera={{ position: [12, 12, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          matrix={matrix}
          outline={outline ?? false}
          animation={animation ?? false}
          generation={generation}
        />
      </Canvas>
    </div>
  );
}
