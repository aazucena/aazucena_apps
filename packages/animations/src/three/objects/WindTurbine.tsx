/**
 * Wind Turbine Ground Object
 * Sustainable energy infrastructure (Troposphere Ground)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface WindTurbineProps {
  opacity: number;
}

export function WindTurbine({ opacity }: WindTurbineProps): JSX.Element {
  const bladesRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // Constant rotation of blades
    if (bladesRef.current) {
      bladesRef.current.rotation.z = time * 1.5;
    }
  });

  return (
    <group>
      {/* Tower */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 5, 8]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={opacity} />
      </mesh>

      {/* Nacelle (Generator box) */}
      <mesh position={[0, 5, 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>

      {/* Hub and Blades */}
      <group position={[0, 5, 0.5]} ref={bladesRef}>
        {/* Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={opacity} />
        </mesh>

        {/* 3 Blades */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]} position={[0, 0, 0]}>
            <mesh position={[0, 1.25, 0]} castShadow>
              <boxGeometry args={[0.15, 2.5, 0.02]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
            </mesh>
          </mesh>
        ))}
      </group>
    </group>
  );
}
