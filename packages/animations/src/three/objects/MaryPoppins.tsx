/**
 * Mary Poppins Easter Egg
 * Enhanced iconic silhouette (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface MaryPoppinsProps {
  opacity: number;
}

export function MaryPoppins({ opacity }: MaryPoppinsProps): JSX.Element {
  const poppinsRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Smooth drifting and gentle rotation
    applyAnimation(poppinsRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: 0.5 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.3 },
        x: { frequency: 0.1, amplitude: 1 },
      },
    });
  });

  return (
    <group ref={poppinsRef}>
      {/* 1. THE UMBRELLA (Larger and more prominent) */}
      <group position={[0, 1.5, 0.2]}>
        {/* Umbrella top - shallow dome shape */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[1.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={opacity} side={2} />
        </mesh>
        {/* Umbrella handle */}
        <mesh position={[0, -0.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 4]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
        {/* THE PARROT HEAD HANDLE (Critical Identifier) */}
        <group position={[0, -1.4, 0]} rotation={[0, 0, 0.5]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#166534" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.04, 0.15, 4]} />
            <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
          </mesh>
        </group>
      </group>

      {/* 2. THE CHARACTER SILHOUETTE */}
      <group position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
        </mesh>

        {/* Iconic Boater Hat with Flower */}
        <group position={[0, 0.75, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.15, 0.05, 0]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
          </mesh>
        </group>

        {/* FLARED DRESS (Iconic A-Line shape) */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.5, 1.2, 8]} />
          <meshStandardMaterial color="#1e3a8a" transparent opacity={opacity} />
        </mesh>

        {/* Arm reaching up to handle */}
        <mesh position={[0, 0.8, 0.1]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.05]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
        </mesh>

        {/* Arm holding bag (held out to the side) */}
        <group position={[0.2, 0.1, 0]} rotation={[0, 0, -0.6]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
          </mesh>
          {/* THE CARPET BAG */}
          <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0.6]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.2]} />
            <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
            {/* Bag Handle */}
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.1, 0.02, 4, 8, Math.PI]} />
              <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
            </mesh>
          </mesh>
        </group>

        {/* THE FEET (Signature Heels Together Pose) */}
        <group position={[0, -0.7, 0]}>
          <mesh position={[0.1, 0, 0]} rotation={[0, -0.8, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.2]} />
            <meshStandardMaterial color="#000000" transparent opacity={opacity} />
          </mesh>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0.8, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.2]} />
            <meshStandardMaterial color="#000000" transparent opacity={opacity} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
