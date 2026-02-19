/**
 * Meteor Smoke Trail Easter Egg
 * Lingering dust trail after a meteor burns up (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface MeteorSmokeTrailProps {
  opacity: number;
}

export function MeteorSmokeTrail({ opacity }: MeteorSmokeTrailProps): JSX.Element {
  const trailRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (trailRef.current) {
      // Slow wispy deformation
      trailRef.current.children.forEach((child, i) => {
        child.position.x += Math.sin(time * 0.5 + i) * 0.005;
        child.position.y += Math.cos(time * 0.3 + i) * 0.005;
        child.scale.setScalar(1 + Math.sin(time * 0.2 + i) * 0.1);
      });
    }
  });

  return (
    <group ref={trailRef}>
      {/* Zig-zagging chain of wispy spheres */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[i * 0.5 - 2.5, i * -0.3 + 1.5, Math.sin(i) * 0.2]}>
          <sphereGeometry args={[0.2 + i * 0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#94a3b8" 
            transparent 
            opacity={opacity * 0.3 * (1 - i / 10)} 
          />
        </mesh>
      ))}
    </group>
  );
}
