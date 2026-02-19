/**
 * Bird Easter Egg
 * FIXED: Anatomically correct wing flapping using shoulder joints.
 * SUPPORTED VARIANTS: 'majestic' (default), 'frantic'
 * (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneObjectConfig } from '@aazucena/types';

interface BirdProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Bird({ opacity, config }: BirdProps): JSX.Element {
  const birdRef = useRef<Group>(null);
  const leftShoulderRef = useRef<Group>(null);
  const rightShoulderRef = useRef<Group>(null);

  // 1. Determine Flight Profile from Config
  const variant = (config?.custom?.variant as 'majestic' | 'frantic') || 'majestic';
  
  // Profile Parameters
  const flapSpeed = variant === 'frantic' ? 12 : 4;
  const flapAmplitude = variant === 'frantic' ? 0.4 : 0.8;
  const flightSway = variant === 'frantic' ? 0.1 : 0.3;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (birdRef.current) {
      // 2. Dynamic Flight Path
      birdRef.current.position.y = Math.sin(time * 1.5) * flightSway;
      birdRef.current.position.x = Math.cos(time * 0.2) * 1.0;
      // Banking tilt
      birdRef.current.rotation.z = Math.sin(time * 0.2) * 0.15;
    }

    if (leftShoulderRef.current && rightShoulderRef.current) {
      // 3. Shoulder-Joint Flapping (X-axis)
      // Sin wave for smooth up/down motion
      const flap = Math.sin(time * flapSpeed) * flapAmplitude;
      
      leftShoulderRef.current.rotation.x = flap;
      rightShoulderRef.current.rotation.x = -flap;
    }
  });

  return (
    <group ref={birdRef}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.15, 0.6, 8, 12]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* LEFT WING SYSTEM (Shoulder Joint) */}
      <group ref={leftShoulderRef} position={[0, 0, -0.1]}>
        {/* Offset mesh so pivot is at the shoulder edge */}
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[0.3, 0.03, 0.8]} />
          <meshStandardMaterial
            color="#57534e"
            roughness={0.7}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* RIGHT WING SYSTEM (Shoulder Joint) */}
      <group ref={rightShoulderRef} position={[0, 0, 0.1]}>
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[0.3, 0.03, 0.8]} />
          <meshStandardMaterial
            color="#57534e"
            roughness={0.7}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[-0.35, 0.05, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#292524"
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Beak */}
      <mesh position={[-0.45, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.04, 0.15, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.4, 3]} />
        <meshStandardMaterial
          color="#44403c"
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
