/**
 * Spy Plane Easter Egg
 * SR-71 Blackbird-style spy plane (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneObjectConfig } from '@aazucena/types';

interface SpyPlaneProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function SpyPlane({ opacity }: SpyPlaneProps): JSX.Element {
  const spyPlaneRef = useRef<Group>(null);

  // Animate spy plane with fast horizontal flight and banking
  // (Must stay imperative due to complex flight path)
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (spyPlaneRef.current) {
      // Fast horizontal flight in a wide arc
      spyPlaneRef.current.position.x = Math.sin(time * 0.25) * 5;
      // Slight altitude variation
      spyPlaneRef.current.position.y = Math.sin(time * 0.15) * 0.3;
      // Banking turns and pitch
      spyPlaneRef.current.rotation.z = Math.sin(time * 0.25) * 0.2;
      spyPlaneRef.current.rotation.y = Math.cos(time * 0.25) * 0.1;
    }
  });

  return (
    <group ref={spyPlaneRef}>
      {/* Fuselage - horizontal orientation */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.15, 3, 16]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nose - pointed forward */}
      <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Delta wings - wide triangular shape */}
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.5, 3, 0.08]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Twin tail fins - distinctive SR-71 feature */}
      <mesh position={[-1.2, 0.3, 0.5]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-1.2, 0.3, -0.5]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Cockpit - front of fuselage */}
      <mesh position={[0.8, 0.15, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#1e40af"
          transparent
          opacity={0.6 * opacity}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Twin engines at rear */}
      <mesh position={[-1.6, 0, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.18, 0.5, 12]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-1.6, 0, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.18, 0.5, 12]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engine glow */}
      <mesh position={[-1.85, 0, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7 * opacity}
        />
      </mesh>
      <mesh position={[-1.85, 0, -0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7 * opacity}
        />
      </mesh>
    </group>
  );
}
