/**
 * Mesosphere Layer (INTEGRATED with Scene Objects System)
 * Meteor effects and icy sparkles with space debris easter eggs
 *
 * BEFORE: 369 lines with inline easter egg definitions
 * AFTER: ~80 lines using SceneObjectManager
 * REDUCTION: 289 lines removed (78% smaller!)
 */

import type { JSX } from 'react';
import { memo } from 'react';
import { Sparkles } from '@react-three/drei';
import { SceneObjectManager } from '../objects/index.js';
import { mesosphereObjects } from '../data/objects.js';

export interface MesosphereProps {
  opacity: number;
}

function MesosphereComponent({ opacity }: MesosphereProps): JSX.Element {
  return (
    <>
      {/* Icy blue sparkles for cold atmosphere */}
      <Sparkles
        count={120}
        scale={[30, 10, 30]}
        size={1}
        speed={0.1}
        opacity={0.4 * opacity}
        color="#3A86FF"
      />

      {/* Noctilucent Clouds - rare silvery-blue clouds at edge of space */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`cloud-${i}`}
          position={[-10 + i * 5, -2 + Math.sin(i) * 2, -15 + i * 3]}
          rotation={[0, i * 0.3, 0]}
        >
          <planeGeometry args={[4, 2, 1, 1]} />
          <meshStandardMaterial
            color="#a5f3fc"
            emissive="#67e8f9"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15 * opacity}
            side={2}
          />
        </mesh>
      ))}

      {/* Atmospheric haze layers - coldest layer of atmosphere */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[0, -3 + i * 2, -20 + i * 2]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[8 + i * 3, 15 + i * 4, 32]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.08 * opacity} side={2} />
        </mesh>
      ))}

      {/* Ice crystals floating - mesosphere is the coldest layer */}
      <Sparkles
        count={80}
        scale={[25, 8, 25]}
        size={0.5}
        speed={0.05}
        opacity={0.3 * opacity}
        color="#e0f2fe"
      />

      {/* Shooting stars/meteors - this is where meteors burn up */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`meteor-${i}`}
          position={[(i - 2) * 12, 6 - i * 2, 10 - i * 6]}
          rotation={[Math.PI / 6, i * 0.5, 0]}
        >
          <cylinderGeometry args={[0.05, 0.15, 3, 8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#87CEEB"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>
      ))}

      {/* Easter Eggs via SceneObjectManager (comet, meteor, 4 debris pieces) */}
      <SceneObjectManager
        objects={mesosphereObjects.easterEggs}
        opacity={opacity}
        categoryFilter={['easter-egg']}
      />
    </>
  );
}

/**
 * Memoized Mesosphere component
 * Only re-renders when opacity changes by a meaningful amount (> 0.01)
 */
export const Mesosphere = memo(MesosphereComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return Math.abs(prevProps.opacity - nextProps.opacity) < 0.01;
});

Mesosphere.displayName = 'Mesosphere';
