/**
 * Lighthouse Ground Object
 * Coastal/Ground anchor (Troposphere Ground)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SpotLight } from 'three';

interface LighthouseProps {
  opacity: number;
}

export function Lighthouse({ opacity }: LighthouseProps): JSX.Element {
  const lightRef = useRef<SpotLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.rotation.y = time * 1.5;
    }
  });

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.5, 12]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Main Tower (Tapered) */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 1, 4, 12]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>

      {/* Red Stripe */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.76, 0.85, 1, 12]} />
        <meshStandardMaterial color="#e11d48" transparent opacity={opacity} />
      </mesh>

      {/* Gallery/Top part */}
      <mesh position={[0, 4.6, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.6, 0.2, 12]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
      </mesh>

      {/* Lantern Room (Glass part) */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3 * opacity} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[0.7, 0.5, 12]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
      </mesh>

      {/* Rotating Light (Visual only) */}
      <group position={[0, 5, 0]} ref={lightRef}>
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={2}
            transparent
            opacity={opacity}
          />
        </mesh>
        {/* SpotLight representing the beam */}
        <spotLight
          ref={lightRef as any}
          position={[0, 0, 0.2]}
          angle={0.15}
          penumbra={1}
          intensity={2 * opacity}
          color="#fbbf24"
          distance={10}
        />
      </group>
    </group>
  );
}
