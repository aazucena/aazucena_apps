/**
 * Space Shuttle Easter Egg
 * Detailed space shuttle with slow orbital motion (Thermosphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "~/lib/utils/scene";
import type { SceneObjectConfig } from "../types";

interface SpaceShuttleProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function SpaceShuttle({ opacity }: SpaceShuttleProps): JSX.Element {
  const shuttleRef = useRef<Group>(null);

  // Animate shuttle with slow orbital motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(shuttleRef, time, {
      rotation: { y: 0.15 },
      rotationOscillation: { x: { frequency: 0.3, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.25, amplitude: 0.3 },
      },
    });
  });

  return (
    <group ref={shuttleRef}>
      {/* Main fuselage - front section */}
      <mesh position={[0.8, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.6, 16]} />
        <meshStandardMaterial
          color="#f3f4f6"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nose cone - pointed front */}
      <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.35, 0.8, 16]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Cargo bay section - slightly wider */}
      <mesh position={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.38, 1.4, 16]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Rear section - tapering down */}
      <mesh position={[-1.1, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.3, 0.6, 16]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Heat shield tiles on belly (black tiles) */}
      <mesh position={[0, -0.36, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.41, 0.41, 3.5, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.2}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Delta wing - left */}
      <mesh position={[-0.6, 0.05, 0.7]} rotation={[0.1, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.08, 1.4]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Delta wing - right */}
      <mesh position={[-0.6, 0.05, -0.7]} rotation={[-0.1, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.08, 1.4]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Vertical tail fin */}
      <mesh position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.6, 1, 0.08]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engine nozzles - left */}
      <mesh position={[-1.5, -0.1, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engine nozzles - center */}
      <mesh position={[-1.5, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engine nozzles - right */}
      <mesh position={[-1.5, -0.1, -0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engine glow */}
      <pointLight
        position={[-1.6, -0.1, 0]}
        color="#ff9500"
        intensity={0.5 * opacity}
        distance={1}
      />

      {/* Cockpit windows - row 1 */}
      <mesh position={[1.35, 0.25, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
      <mesh position={[1.25, 0.3, 0.12]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
      <mesh position={[1.25, 0.3, -0.12]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>

      {/* Cockpit windows - row 2 */}
      <mesh position={[1.1, 0.32, 0.08]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
      <mesh position={[1.1, 0.32, -0.08]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>

      {/* NASA logo area (red stripe on tail) */}
      <mesh position={[-1.2, 0.45, 0.041]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
