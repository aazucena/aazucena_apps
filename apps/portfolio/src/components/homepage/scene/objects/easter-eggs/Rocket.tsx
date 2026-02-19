/**
 * Rocket Easter Egg
 * Classic rocket with engine glow and slow tumble (Exosphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "~/lib/utils/scene";
import type { SceneObjectConfig } from "../types";

interface RocketProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Rocket({ opacity }: RocketProps): JSX.Element {
  const rocketRef = useRef<Group>(null);

  // Animate rocket with slow tumble
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(rocketRef, time, {
      rotation: { z: 0.4 },
      rotationOscillation: { x: { frequency: 0.3, amplitude: 0.2 } },
    });
  });

  return (
    <group ref={rocketRef}>
      {/* Rocket body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Fins */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.35, -0.8, Math.sin(angle) * 0.35]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.05, 0.6, 0.4]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}

      {/* Engine glow */}
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.25, 0.4, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>

      {/* Window */}
      <mesh position={[0, 0.5, 0.31]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
    </group>
  );
}
