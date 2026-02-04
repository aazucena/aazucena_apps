/**
 * Space Debris Easter Egg
 * Various space debris pieces with tumbling animation (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation, applyCircularMotion } from '~/lib/utils/scene';
import type { SceneObjectConfig } from '../types';

interface SpaceDebrisProps {
  opacity: number;
  config?: SceneObjectConfig;
}

type DebrisVariant = 'solar-panel' | 'damaged-panel' | 'body-piece' | 'antenna';

export function SpaceDebris({ opacity, config }: SpaceDebrisProps): JSX.Element {
  const debrisRef = useRef<Group>(null);

  // Get variant from config or default to solar-panel
  const variant = (config?.custom?.variant as DebrisVariant) || 'solar-panel';

  // Animation parameters vary by variant
  const animationParams = {
    'solar-panel': {
      rotation: { x: 0.15, y: 0.25, z: 0.2 },
      circular: { x: { frequency: 0.3, amplitude: 0.5 }, y: { frequency: 0.2, amplitude: 0.3 } }
    },
    'damaged-panel': {
      rotation: { x: 0.18, y: 0.22, z: 0.15 },
      circular: { x: { frequency: 0.25, amplitude: 0.4 }, y: { frequency: 0.3, amplitude: 0.5 } }
    },
    'body-piece': {
      rotation: { x: 0.2, y: 0.15, z: 0.25 },
      circular: { x: { frequency: 0.28, amplitude: 0.6 }, y: { frequency: 0.25, amplitude: 0.4 } }
    },
    'antenna': {
      rotation: { x: 0.12, y: 0.28, z: 0.18 },
      circular: { x: { frequency: 0.22, amplitude: 0.35 }, y: { frequency: 0.35, amplitude: 0.45 } }
    }
  };

  const params = animationParams[variant];

  // Animate debris with slow tumbling and drifting
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(debrisRef, time, {
      rotation: params.rotation
    });

    applyCircularMotion(debrisRef, time, {
      base: { x: 0, y: 0, z: 0 },
      x: params.circular.x,
      y: params.circular.y
    });
  });

  // Render different debris based on variant
  const renderDebris = () => {
    switch (variant) {
      case 'solar-panel':
        return (
          <mesh rotation={[0.3, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#1e40af"
              emissive="#1e40af"
              emissiveIntensity={0.1}
              metalness={0.7}
              roughness={0.4}
              transparent
              opacity={opacity}
            />
          </mesh>
        );

      case 'damaged-panel':
        return (
          <mesh rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.6, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
              transparent
              opacity={opacity}
            />
          </mesh>
        );

      case 'body-piece':
        return (
          <mesh>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.6}
              roughness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        );

      case 'antenna':
        return (
          <mesh rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={debrisRef}>
      {renderDebris()}
    </group>
  );
}
