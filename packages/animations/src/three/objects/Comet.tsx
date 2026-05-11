/**
 * Comet Easter Egg
 * Comet with glowing curved tail (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';
import type { SceneObjectConfig } from '@aazucena/types';

interface CometProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Comet({ opacity }: CometProps): JSX.Element {
  const cometRef = useRef<Group>(null);

  // Create curved tail path for comet
  const cometTailCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const curve = Math.pow(t, 0.7); // Natural curve falloff
      points.push(
        new THREE.Vector3(
          -curve * 0.8 - t * 0.2, // Drift left and back
          curve * 5, // Flow upward
          0,
        ),
      );
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Animate comet with rotation and falling motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(cometRef, time, {
      rotation: { z: 0.05 },
    });

    // Linear falling motion (must stay imperative)
    if (cometRef.current) {
      cometRef.current.position.x = Math.sin(time * 0.2) * 2;
      cometRef.current.position.y = (-time * 0.5) % 10;
    }
  });

  return (
    <group ref={cometRef}>
      {/* Comet nucleus */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Icy surface detail */}
      <mesh scale={1.05}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial
          color="#60a5fa"
          transparent
          opacity={0.3 * opacity}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Curved tail - flowing naturally from nucleus with tapering */}
      {[0, 1, 2, 3, 4].map((i) => {
        const radius = 0.3 - i * 0.05; // Taper from thick to thin
        const segmentOpacity = 0.7 - i * 0.12; // Fade as it extends

        return (
          <mesh key={i}>
            <tubeGeometry
              args={[
                new THREE.CatmullRomCurve3(
                  cometTailCurve.getPoints(30).slice(i * 6, (i + 1) * 6 + 1),
                ),
                12,
                radius,
                8,
                false,
              ]}
            />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={0.8 - i * 0.15}
              transparent
              opacity={segmentOpacity * opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}
