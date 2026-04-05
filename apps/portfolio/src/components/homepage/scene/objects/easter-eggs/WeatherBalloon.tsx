/**
 * Weather Balloon Easter Egg
 * Floating weather balloon with instrument box (Stratosphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "@aazucena/utils";
import type { SceneObjectConfig } from "../types";

interface WeatherBalloonProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function WeatherBalloon({ opacity }: WeatherBalloonProps): JSX.Element {
  const balloonRef = useRef<Group>(null);

  // Animate balloon with gentle floating and swaying
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(balloonRef, time, {
      rotation: { y: 0.1 },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.3, amplitude: 0.5 },
        x: { frequency: 0.2, amplitude: 0.3, phase: Math.PI / 2 }, // Circular motion
      },
    });
  });

  return (
    <group ref={balloonRef}>
      {/* Balloon */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#f87171"
          transparent
          opacity={0.7 * opacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Shine/highlight */}
      <mesh position={[0.2, 1.3, 0.2]} scale={0.3}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.5 * opacity}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rope */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#78716c" transparent opacity={opacity} />
      </mesh>

      {/* Instrument box */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
