/**
 * Falling Sperm Whale Easter Egg
 * Reference to Hitchhiker's Guide to the Galaxy (Stratosphere)
 * Includes the companion flower pot
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface FallingWhaleProps {
  opacity: number;
}

export function FallingWhale({ opacity }: FallingWhaleProps): JSX.Element {
  const whaleRef = useRef<Group>(null);
  const potRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Tumbling fall movement for whale
    applyAnimation(whaleRef, time, {
      rotationOscillation: { 
        x: { frequency: 0.1, amplitude: Math.PI * 2 }, // Tumbling
        y: { frequency: 0.05, amplitude: 0.5 }
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 1 },
      },
    });

    // Separate tumbling for the flower pot
    if (potRef.current) {
      potRef.current.position.y = Math.sin(time * 0.3) * 2 + 2;
      potRef.current.position.x = Math.cos(time * 0.2) * 1.5 - 2;
      potRef.current.rotation.x = time * 2;
      potRef.current.rotation.z = time * 1.5;
    }
  });

  return (
    <group>
      {/* The Whale */}
      <group ref={whaleRef}>
        {/* Sperm Whale Body (Squared-off front) */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 1.2, 1.2]} />
          <meshStandardMaterial color="#475569" transparent opacity={opacity} roughness={0.3} />
        </mesh>

        {/* Tapered back section */}
        <mesh position={[-1.8, -0.1, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#475569" transparent opacity={opacity} />
        </mesh>

        {/* Tail flukes (Horizontal) */}
        <mesh position={[-2.5, -0.1, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.1, 2]} />
          <meshStandardMaterial color="#334155" transparent opacity={opacity} />
        </mesh>

        {/* Side flippers */}
        <mesh position={[0.2, -0.5, 0.7]} rotation={[0.4, 0, 0.2]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.8]} />
          <meshStandardMaterial color="#334155" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.2, -0.5, -0.7]} rotation={[-0.4, 0, 0.2]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.8]} />
          <meshStandardMaterial color="#334155" transparent opacity={opacity} />
        </mesh>

        {/* Blowhole detail */}
        <mesh position={[0.8, 0.61, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.1]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>

        {/* Eye detail */}
        <mesh position={[1, 0, 0.61]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* The Flower Pot (Petunias) */}
      <group ref={potRef}>
        {/* Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.15, 0.4, 8]} />
          <meshStandardMaterial color="#92400e" transparent opacity={opacity} />
        </mesh>
        {/* Rim */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.1, 8]} />
          <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
        </mesh>
        {/* Plant (Greenery) */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} scale={[1, 0.5, 1]} />
          <meshStandardMaterial color="#16a34a" transparent opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
}
