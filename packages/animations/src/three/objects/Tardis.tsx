/**
 * TARDIS Easter Egg
 * Iconic time machine police box (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface TardisProps {
  opacity: number;
}

export function Tardis({ opacity }: TardisProps): JSX.Element {
  const tardisRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Slow majestic tumbling and fading
    applyAnimation(tardisRef, time, {
      rotationOscillation: {
        y: { frequency: 0.1, amplitude: Math.PI },
        z: { frequency: 0.05, amplitude: 0.5 },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 1 },
      },
    });

    // Slight phasing effect
    if (tardisRef.current) {
      const phase = Math.sin(time * 2) * 0.1 + 0.9;
      tardisRef.current.scale.setScalar(phase);
    }
  });

  return (
    <group ref={tardisRef}>
      {/* Police Box Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.8, 0.8]} />
        <meshStandardMaterial
          color="#1e3a8a"
          transparent
          opacity={opacity}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Roof Tier 1 */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.85, 0.1, 0.85]} />
        <meshStandardMaterial color="#1e3a8a" transparent opacity={opacity} />
      </mesh>

      {/* Roof Tier 2 */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#1e3a8a" transparent opacity={opacity} />
      </mesh>

      {/* Top Light */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Windows (Grid of small boxes) */}
      {[0.4, 0.1].map((y) =>
        [-0.2, 0.2].map((x) => (
          <mesh key={`${x}-${y}`} position={[x, y + 0.3, 0.41]}>
            <boxGeometry args={[0.15, 0.2, 0.01]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f8fafc"
              emissiveIntensity={0.5}
              transparent
              opacity={opacity * 0.8}
            />
          </mesh>
        )),
      )}
    </group>
  );
}
