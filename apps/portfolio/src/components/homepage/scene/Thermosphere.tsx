/**
 * Thermosphere Layer (INTEGRATED with Scene Objects System)
 * Aurora effects and ribbons with space-themed easter eggs
 *
 * BEFORE: 371 lines with inline easter egg definitions
 * AFTER: ~155 lines using SceneObjectManager
 * REDUCTION: 216 lines removed (58% smaller!)
 */

import type { JSX } from "react";
import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { createAuroraMaterial, updateShaderTime } from "~/lib/utils/scene";
import { SceneObjectManager } from "./objects";
import { thermosphereObjects } from "~/data/scene/objects";

export interface ThermosphereProps {
  opacity: number;
}

function ThermosphereComponent({ opacity }: ThermosphereProps): JSX.Element {
  // Aurora mesh refs
  const auroraMeshRefs = useRef<THREE.Mesh[]>([]);

  // Create materials for green and purple auroras
  const auroraMaterials = useMemo(
    () => ({
      green: createAuroraMaterial({
        color: "#06FFA5",
        baseOpacity: 0.3 * opacity,
      }),
      purple: createAuroraMaterial({
        color: "#9D4EDD",
        baseOpacity: 0.3 * opacity,
      }),
    }),
    [opacity],
  );

  // Animate aurora curtains
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Update shader uniforms and animate aurora curtains
    auroraMeshRefs.current.forEach((mesh, i) => {
      if (mesh && mesh.geometry && mesh.geometry.attributes.position) {
        // Update shader time uniform for flickering
        const material = mesh.material as ShaderMaterial;
        updateShaderTime(material, time);

        // Animate aurora curtains with flowing waves
        const positions = mesh.geometry.attributes.position;
        const array = positions.array as Float32Array;

        for (let j = 0; j < positions.count; j++) {
          const x = array[j * 3];
          const y = array[j * 3 + 1];

          if (x !== undefined && y !== undefined) {
            // Create wavy flowing motion
            const wave1 = Math.sin(x * 0.3 + time * 0.5 + i) * 0.5;
            const wave2 = Math.sin(y * 0.2 + time * 0.3 + i * 0.5) * 0.3;
            const wave3 = Math.cos(x * 0.15 + y * 0.15 + time * 0.4) * 0.2;

            array[j * 3 + 2] = wave1 + wave2 + wave3;
          }
        }

        positions.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }
    });
  });

  return (
    <>
      {/* Aurora curtains - flowing vertical sheets with feathered effect */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12 + Math.sin(i * 0.5) * 3;
        const isGreen = i % 3 !== 0;
        const heightVariation = Math.sin(i * 1.2) * 2;

        return (
          <mesh
            key={`aurora-${i}`}
            ref={(el) => {
              if (el) auroraMeshRefs.current[i] = el;
            }}
            position={[
              Math.cos(angle) * radius,
              1 + heightVariation,
              Math.sin(angle) * radius,
            ]}
            rotation={[0, angle + Math.PI / 2, 0]}
            material={isGreen ? auroraMaterials.green : auroraMaterials.purple}
          >
            <planeGeometry args={[20, 10, 64, 32]} />
          </mesh>
        );
      })}

      {/* Aurora particles for extra glow */}
      <Sparkles
        count={80}
        scale={[25, 12, 25]}
        size={2}
        speed={0.3}
        opacity={0.5 * opacity}
        color="#06FFA5"
      />
      <Sparkles
        count={80}
        scale={[25, 12, 25]}
        size={2}
        speed={0.2}
        opacity={0.4 * opacity}
        color="#9D4EDD"
      />

      {/* Easter Eggs via SceneObjectManager (shuttle, ISS, astronaut) */}
      <SceneObjectManager
        objects={thermosphereObjects.easterEggs}
        opacity={opacity}
        categoryFilter={["easter-egg"]}
      />
    </>
  );
}

/**
 * Memoized Thermosphere component
 * Only re-renders when opacity changes by a meaningful amount (> 0.01)
 */
export const Thermosphere = memo(
  ThermosphereComponent,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (trigger re-render)
    return Math.abs(prevProps.opacity - nextProps.opacity) < 0.01;
  },
);

Thermosphere.displayName = "Thermosphere";
