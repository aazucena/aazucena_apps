/**
 * Satellite Easter Egg
 * Orbiting satellite with solar panels (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';
import type { SceneObjectConfig } from '@aazucena/types';

interface SatelliteProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Satellite({ opacity }: SatelliteProps): JSX.Element {
  const satelliteRef = useRef<Group>(null);

  // Animate satellite with orbital rotation and gentle bobbing
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(satelliteRef, time, {
      rotation: { y: 0.3 },
      rotationOscillation: { z: { frequency: 0.5, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.4, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={satelliteRef}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.8}
          roughness={0.2}
          emissive="#1e3a8a"
          emissiveIntensity={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Connecting arms for solar panels - left */}
      <mesh position={[-0.7, 0, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.7}
          roughness={0.3}
          emissive="#475569"
          emissiveIntensity={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Connecting arms for solar panels - right */}
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.7}
          roughness={0.3}
          emissive="#475569"
          emissiveIntensity={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Solar panels - left */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#1e40af"
          metalness={0.6}
          roughness={0.3}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Solar panels - right */}
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#1e40af"
          metalness={0.6}
          roughness={0.3}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Red light */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
