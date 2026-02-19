/**
 * Scientific Gondola Easter Egg
 * Research instrument package (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface ScientificGondolaProps {
  opacity: number;
}

export function ScientificGondola({ opacity }: ScientificGondolaProps): JSX.Element {
  const gondolaRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Slow spinning and swaying as it hangs
    applyAnimation(gondolaRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: 0.5 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.15, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={gondolaRef}>
      {/* Main instrument box */}
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.5} />
      </mesh>

      {/* External sensors/arms */}
      <mesh position={[0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 4]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>
      
      <mesh position={[-0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 4]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>

      {/* Parabolic dish */}
      <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
        <coneGeometry args={[0.4, 0.2, 12, 1, true]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[2, 0.02, 0.8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
      </mesh>

      {/* Cables going up (truncated) */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 2, 4]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
