/**
 * Drone Easter Egg
 * Hovering drone with spinning propellers (Troposphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "@aazucena/utils";
import type { SceneObjectConfig } from "../types";

interface DroneProps {
  opacity: number;
  config?: SceneObjectConfig;
}

// Drone propeller arm positions (typed as tuples for TypeScript)
const propellerArmPositions: readonly [number, number][] = [
  [0.8, 0.8],
  [0.8, -0.8],
  [-0.8, 0.8],
  [-0.8, -0.8],
] as const;

export function Drone({ opacity }: DroneProps): JSX.Element {
  const droneRef = useRef<Group>(null);

  // Animate drone hovering and propeller spinning
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Hovering motion with declarative animation
    applyAnimation(droneRef, time, {
      rotation: { y: 0.5 },
      positionWave: {
        base: { x: 0, y: 0, z: 0 }, // Position handled by SceneObject wrapper
        y: { frequency: 1.5, amplitude: 0.2 },
        x: { frequency: 0.4, amplitude: 1 },
      },
    });

    // Propeller spinning (imperative for child element access)
    if (droneRef.current) {
      for (let i = 3; i < 7; i++) {
        const propeller = droneRef.current.children[i];
        if (propeller) {
          propeller.rotation.y = time * 20;
        }
      }
    }
  });

  return (
    <group ref={droneRef}>
      {/* Central body */}
      <mesh>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Camera */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Lens */}
      <mesh position={[0, -0.2, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#1e40af"
          transparent
          opacity={0.7 * opacity}
          emissive="#3b82f6"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Propeller arms */}
      {propellerArmPositions.map((pos, i) => (
        <group key={i}>
          {/* Arm */}
          <mesh
            position={[pos[0] / 2, 0, pos[1] / 2]}
            rotation={[0, Math.atan2(pos[1], pos[0]), 0]}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
            <meshStandardMaterial
              color="#4b5563"
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Motor */}
          <mesh position={[pos[0], 0.15, pos[1]]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Propeller (will spin in animation) */}
          <mesh position={[pos[0], 0.22, pos[1]]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.02, 0.08]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={0.6 * opacity}
            />
          </mesh>
        </group>
      ))}

      {/* LED lights */}
      <mesh position={[0.25, 0.12, 0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-0.25, 0.12, -0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
