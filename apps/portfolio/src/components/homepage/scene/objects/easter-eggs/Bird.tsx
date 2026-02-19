/**
 * Bird Easter Egg
 * Animated bird with wing flapping (Troposphere)
 */

import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { SceneObjectConfig } from "../types";

interface BirdProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Bird({ opacity }: BirdProps): JSX.Element {
  const birdRef = useRef<Group>(null);

  // Animate bird with flapping and gliding (imperative for wing animation)
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (birdRef.current) {
      // Body movement
      birdRef.current.position.y = Math.sin(time * 2) * 0.3;
      birdRef.current.position.x = Math.cos(time * 0.3) * 2;
      birdRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;

      // Wing flapping animation (must stay imperative for child element access)
      const wing1 = birdRef.current.children[1];
      const wing2 = birdRef.current.children[2];
      if (wing1 && wing2) {
        wing1.rotation.z = Math.sin(time * 8) * 0.3;
        wing2.rotation.z = -Math.sin(time * 8) * 0.3;
      }
    }
  });

  return (
    <group ref={birdRef}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.4, 0, -0.3]} rotation={[0, -0.3, 0.5]}>
        <boxGeometry args={[0.05, 1.2, 0.6]} />
        <meshStandardMaterial
          color="#57534e"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[-0.4, 0, 0.3]} rotation={[0, 0.3, -0.5]}>
        <boxGeometry args={[0.05, 1.2, 0.6]} />
        <meshStandardMaterial
          color="#57534e"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Head */}
      <mesh position={[-0.45, 0, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#292524"
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Beak */}
      <mesh position={[-0.55, -0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.5}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshStandardMaterial
          color="#44403c"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
