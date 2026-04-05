/**
 * Meteor Easter Egg
 * Rocky meteor with fiery tail (Mesosphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "@aazucena/utils";
import type { SceneObjectConfig } from "../types";

interface MeteorProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Meteor({ opacity }: MeteorProps): JSX.Element {
  const meteorRef = useRef<Group>(null);

  // Animate meteor with fast spinning and diagonal motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(meteorRef, time, {
      rotation: { x: 0.8, y: 0.6 },
    });

    // Linear diagonal motion (must stay imperative)
    if (meteorRef.current) {
      meteorRef.current.position.x = (-time * 0.3) % 12;
      meteorRef.current.position.y = (-time * 0.4) % 10;
    }
  });

  return (
    <group ref={meteorRef}>
      {/* Irregular rocky shape */}
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh scale={[1.2, 0.8, 0.9]} position={[0.1, 0, 0]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#57534e"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Hot spots from atmospheric entry */}
      <mesh scale={0.3} position={[0.3, 0.2, 0.3]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={1.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh scale={0.25} position={[-0.2, -0.3, 0.2]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Fiery tail trailing behind */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0.3 + i * 0.6, 0.3 + i * 0.7, 0]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <coneGeometry args={[0.25 - i * 0.05, 0.8, 8]} />
          <meshStandardMaterial
            color={i < 2 ? "#f97316" : "#fb923c"}
            emissive={i < 2 ? "#f97316" : "#fb923c"}
            emissiveIntensity={0.8 - i * 0.15}
            transparent
            opacity={(0.6 - i * 0.12) * opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
