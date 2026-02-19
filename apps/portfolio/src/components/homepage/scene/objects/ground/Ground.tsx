/**
 * Ground Object
 * The ground plane for troposphere phase
 */

import type { JSX } from "react";
import type { SceneObjectConfig } from "../types";

interface GroundProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Ground Component
 * Renders a circular ground plane
 */
export function Ground({ opacity }: GroundProps): JSX.Element {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <circleGeometry args={[15, 64]} />
      <meshStandardMaterial
        color="#228B22"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}
