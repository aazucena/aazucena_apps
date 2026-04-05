/**
 * Scene Lighting Component
 * Manages all lighting for the ThreeJS scene based on atmospheric phase
 */

import { useRef, type JSX } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AtmosphericPhase } from "~/config/animations";
import {
  getAmbientIntensity,
  getPointLightColor,
  getSecondaryLightColor,
} from "@aazucena/utils";
import {
  SUN_CONFIG,
  SHADOW_CONFIG,
  POINT_LIGHT_POSITIONS,
  LIGHT_INTENSITIES,
  SCENE_ANIMATION_SPEEDS,
} from "~/config/animations";

interface SceneLightingProps {
  /** Current atmospheric phase */
  phase: AtmosphericPhase;
  /** Light intensity multiplier */
  intensity: number;
}

export function SceneLighting({
  phase,
  intensity,
}: SceneLightingProps): JSX.Element {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  // Animate sun light in troposphere
  useFrame((state) => {
    if (sunLightRef.current && phase === "troposphere") {
      const time = state.clock.elapsedTime;
      const sunSpeed = time * SCENE_ANIMATION_SPEEDS.sunRotation;

      sunLightRef.current.position.x = Math.cos(sunSpeed) * SUN_CONFIG.radius;
      sunLightRef.current.position.z = Math.sin(sunSpeed) * SUN_CONFIG.radius;
      sunLightRef.current.position.y =
        SUN_CONFIG.baseY + Math.sin(sunSpeed * 0.5) * SUN_CONFIG.yVariation;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={getAmbientIntensity(phase, intensity)} />

      {/* Primary point light */}
      <pointLight
        position={POINT_LIGHT_POSITIONS.primary}
        intensity={LIGHT_INTENSITIES.primaryPoint * intensity}
        color={getPointLightColor(phase)}
      />

      {/* Secondary point light */}
      <pointLight
        position={POINT_LIGHT_POSITIONS.secondary}
        intensity={LIGHT_INTENSITIES.secondaryPoint * intensity}
        color={getSecondaryLightColor(phase)}
      />

      {/* Directional light for troposphere (sun) */}
      {phase === "troposphere" && (
        <directionalLight
          ref={sunLightRef}
          position={[5, SUN_CONFIG.baseY, 5]}
          intensity={SUN_CONFIG.intensity * intensity}
          castShadow
          shadow-mapSize-width={SHADOW_CONFIG.width}
          shadow-mapSize-height={SHADOW_CONFIG.height}
          shadow-camera-far={SHADOW_CONFIG.far}
          shadow-camera-left={SHADOW_CONFIG.frustum.left}
          shadow-camera-right={SHADOW_CONFIG.frustum.right}
          shadow-camera-top={SHADOW_CONFIG.frustum.top}
          shadow-camera-bottom={SHADOW_CONFIG.frustum.bottom}
          color={SUN_CONFIG.color}
        />
      )}
    </>
  );
}
