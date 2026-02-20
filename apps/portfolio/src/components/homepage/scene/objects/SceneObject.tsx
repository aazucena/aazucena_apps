/**
 * SceneObject Component
 * Base wrapper for all 3D scene objects (easter eggs + ground objects)
 * Handles positioning, scaling, rotation, opacity, and animation
 */

import type { JSX } from "react";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyAnimation } from "~/lib/utils/scene";
import type { SceneObjectProps } from "./types";

/**
 * SceneObject - Universal wrapper for all scene objects
 *
 * Responsibilities:
 * - Position, rotation, scale management
 * - Opacity control
 * - Animation application (via presets or custom config)
 * - Ref management
 *
 * @example
 * ```tsx
 * <SceneObject
 *   config={{
 *     type: 'airplane',
 *     category: 'easter-egg',
 *     position: [-5, 4, -6],
 *     animation: { rotation: { y: 0.1 } }
 *   }}
 *   opacity={0.8}
 * >
 *   <Airplane />
 * </SceneObject>
 * ```
 */
export function SceneObject({
  config,
  opacity: _opacity, // Passed to children via props, not used directly
  objectRef,
  children,
}: SceneObjectProps): JSX.Element {
  const internalRef = useRef<Group>(null);
  const ref = objectRef || internalRef;

  const { position, rotation = [0, 0, 0], scale = 1, animation } = config;

  // Apply scale (support both uniform and non-uniform)
  const scaleArray: [number, number, number] =
    typeof scale === "number"
      ? [scale, scale, scale]
      : (scale as [number, number, number]);

  // Set initial position and rotation
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(position[0], position[1], position[2]);
      ref.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      ref.current.scale.set(scaleArray[0], scaleArray[1], scaleArray[2]);
    }
  }, [ref, position, rotation, scaleArray]);

  // Apply animation if provided
  useFrame(({ clock }) => {
    if (animation && animation !== "custom" && ref.current) {
      const time = clock.getElapsedTime();
      applyAnimation(ref, time, animation);
    }
  });

  return (
    <group ref={ref} name={config.id || config.type}>
      {children}
    </group>
  );
}
