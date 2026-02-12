/**
 * Stratosphere Layer (INTEGRATED with Scene Objects System)
 * Clouds for sky phase with high-altitude easter eggs
 *
 * BEFORE: 299 lines with inline easter egg definitions
 * AFTER: ~165 lines using SceneObjectManager
 * REDUCTION: 134 lines removed (45% smaller!)
 */

import type { JSX } from 'react';
import { useRef, useMemo, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import type { CloudData } from '@aazucena/types';
import { SceneObjectManager } from '../objects/index.js';
import { stratosphereObjects } from '../data/objects.js';

export interface StratosphereProps {
  clouds: CloudData[];
  opacity: number;
}

function StratosphereComponent({ clouds, opacity }: StratosphereProps): JSX.Element {
  // Cloud refs for smooth animation
  const cloudRefs = useRef<(Group | null)[]>([]);

  // Cloud animation offsets (random phase for each cloud)
  const cloudOffsets = useMemo(() => clouds.map(() => Math.random() * Math.PI * 2), [clouds]);

  // Initialize cloud positions and materials
  useEffect(() => {
    cloudRefs.current.forEach((cloudRef, i) => {
      const cloud = clouds[i];
      if (cloudRef && cloud) {
        cloudRef.position.set(cloud.position[0], cloud.position[1], cloud.position[2]);
        cloudRef.rotation.set(cloud.rotation[0], cloud.rotation[1], cloud.rotation[2]);

        // Make clouds bright and white with varying shadow amounts
        cloudRef.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            // Make material bright with varying shadow definition (0.3 to 0.8)
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.color.setHex(0xffffff);
              material.emissive.setHex(0xffffff);
              material.emissiveIntensity = cloud.emissiveIntensity;
              material.roughness = 1;
              material.metalness = 0;
            }
          }
        });
      }
    });
  }, [clouds]);

  // Animate clouds
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate clouds with smooth gentle movement
    cloudRefs.current.forEach((cloudRef, i) => {
      const cloud = clouds[i];
      const offset = cloudOffsets[i];

      if (cloudRef && cloud && offset !== undefined) {
        // Smooth horizontal drift - subtract initial offset so animation starts from base position
        const initialDriftX = Math.sin(offset) * 1.5;
        const driftX = Math.sin(time * cloud.speed + offset) * 1.5 - initialDriftX;
        cloudRef.position.x = cloud.position[0] + driftX;

        // Gentle vertical bobbing - subtract initial offset so animation starts from base position
        const initialBobY = Math.sin(offset) * 0.3;
        const bobY = Math.sin(time * cloud.speed * 0.5 + offset) * 0.3 - initialBobY;
        cloudRef.position.y = cloud.position[1] + bobY;

        // Keep original z position (no animation)
        cloudRef.position.z = cloud.position[2];

        // Subtle continuous rotation - starts from base rotation
        cloudRef.rotation.y = cloud.rotation[1] + time * cloud.speed * 0.1;
      }
    });
  });

  return (
    <>
      {/* Clouds */}
      {clouds.map((cloud, i) => (
        <group
          key={`cloud-${i}`}
          scale={cloud.scale}
          ref={(el) => {
            cloudRefs.current[i] = el;
          }}
        >
          <Cloud
            opacity={opacity}
            speed={0}
            color="#ffffff"
            segments={20}
            bounds={[6, 2, 2]}
            volume={6}
          />
        </group>
      ))}

      {/* Easter Eggs via SceneObjectManager */}
      <SceneObjectManager
        objects={stratosphereObjects.easterEggs}
        opacity={opacity}
        categoryFilter={['easter-egg']}
      />
    </>
  );
}

/**
 * Memoized Stratosphere component
 * Only re-renders when clouds data or opacity change
 */
export const Stratosphere = memo(StratosphereComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return (
    prevProps.clouds === nextProps.clouds && Math.abs(prevProps.opacity - nextProps.opacity) < 0.01
  );
});

Stratosphere.displayName = 'Stratosphere';
