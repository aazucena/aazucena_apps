/**
 * ISS Easter Egg
 * International Space Station with solar panels (Thermosphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "@aazucena/utils";
import type { SceneObjectConfig } from "../types";

interface ISSProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function ISS({ opacity }: ISSProps): JSX.Element {
  const issRef = useRef<Group>(null);

  // Animate ISS with slow rotation
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(issRef, time, {
      rotation: { y: 0.1 },
      rotationOscillation: { z: { frequency: 0.2, amplitude: 0.05 } },
    });
  });

  return (
    <group ref={issRef}>
      {/* Central module */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 3, 16]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Solar panels (left) */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.05, 3, 1.5]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-2.5, 0, 0]}>
        <boxGeometry args={[0.05, 3, 1.5]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Solar panels (right) */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.05, 3, 1.5]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[2.5, 0, 0]}>
        <boxGeometry args={[0.05, 3, 1.5]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Modules */}
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0, -0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
