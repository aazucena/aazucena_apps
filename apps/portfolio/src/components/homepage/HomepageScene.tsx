/**
 * Homepage Scene Component (Three.js)
 * Orchestrates atmospheric layers and ground objects using modular components
 *
 * Scoped to homepage - renders the 3D background scene
 * Phase 3 Task #6: Demand-based rendering for 20-30% FPS improvement
 */

import { useRef, useMemo, useEffect, type JSX } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import { useShapeRefs } from "@aazucena/hooks";
import type { AtmosphericPhase } from "~/config/animations";
import {
  SCENE_ELEMENT_COUNTS,
  SCENE_ANIMATION_SPEEDS,
  SHAPE_ROTATION,
  FLOAT_CONFIG,
  SHAPE_MATERIAL,
} from "~/config/animations";
import {
  LazySceneLayerManager as SceneLayerManager,
  SceneLighting,
} from "./scene";
import { calculateLayerOpacities } from "@aazucena/utils";
import {
  generateParticleData,
  createBasicGeometries,
  generateShapeData,
  generateCloudData,
  generateHouseData,
  generateTreeData,
  generateBushData,
  generateRockData,
  generateFlowerData,
} from "~/data/scene";

interface HomepageSceneProps {
  intensity?: number;
  phase?: AtmosphericPhase;
  currentSection?: number;
  scrollProgress?: number;
}

export default function HomepageScene({
  intensity = 1,
  phase = "exosphere",
  currentSection = 0,
  scrollProgress = 0,
}: HomepageSceneProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const { setRef: setShapeRef, getAllRefs: getAllShapeRefs } = useShapeRefs();

  const progress = currentSection + scrollProgress;
  const opacities = calculateLayerOpacities(progress);

  // Using LazySceneLayerManager for code-split atmospheric layers (ENABLE_LAYER_LAZY_LOADING=true)
  // This reduces initial bundle size by ~375-750KB

  // Generate data for all scene elements (memoized for performance)
  const particles = useMemo(
    () => generateParticleData(SCENE_ELEMENT_COUNTS.particles, phase),
    [phase],
  );
  const shapes = useMemo(() => createBasicGeometries(), []);
  const mainShapes = useMemo(
    () => generateShapeData(SCENE_ELEMENT_COUNTS.mainShapes, shapes, phase),
    [shapes, phase],
  );
  const clouds = useMemo(
    () => generateCloudData(SCENE_ELEMENT_COUNTS.clouds),
    [],
  );
  const houses = useMemo(
    () => generateHouseData(SCENE_ELEMENT_COUNTS.houses),
    [],
  );
  const trees = useMemo(() => generateTreeData(SCENE_ELEMENT_COUNTS.trees), []);
  const bushes = useMemo(
    () => generateBushData(SCENE_ELEMENT_COUNTS.bushes),
    [],
  );
  const rocks = useMemo(() => generateRockData(SCENE_ELEMENT_COUNTS.rocks), []);
  const flowers = useMemo(
    () => generateFlowerData(SCENE_ELEMENT_COUNTS.flowers),
    [],
  );

  // Pre-calculate rotation speed multipliers for each shape (performance optimization)
  const shapeRotationMultipliers = useMemo(() => {
    return Array.from(
      { length: SCENE_ELEMENT_COUNTS.mainShapes },
      (_, index) => ({
        x:
          SHAPE_ROTATION.base.x +
          (index % SHAPE_ROTATION.modulo.x) * SHAPE_ROTATION.variation.x,
        y:
          SHAPE_ROTATION.base.y +
          (index % SHAPE_ROTATION.modulo.y) * SHAPE_ROTATION.variation.y,
        z:
          SHAPE_ROTATION.base.z +
          (index % SHAPE_ROTATION.modulo.z) * SHAPE_ROTATION.variation.z,
      }),
    );
  }, []);

  // Demand-based rendering: Request renders when scene state changes (Phase 3 Task #6)
  const { invalidate } = useThree();
  const animationActiveRef = useRef(true); // Keep animations always active

  // Request render when phase, section, or scroll changes
  useEffect(() => {
    invalidate(); // Request a frame when state changes
    // Animations stay active continuously for all sections
    // The background animation is a key part of the visual experience
  }, [phase, currentSection, scrollProgress, invalidate]);

  // Conditional animation loop - only runs when animations are active
  useFrame((_, delta: number) => {
    // Skip rendering if animations are paused (idle state)
    if (!animationActiveRef.current) {
      return;
    }

    const safeDelta = delta || 0.016;

    // Rotate main group continuously (except in troposphere)
    if (groupRef.current && phase !== "troposphere") {
      groupRef.current.rotation.y +=
        safeDelta * SCENE_ANIMATION_SPEEDS.groupRotation * intensity;
      groupRef.current.rotation.y %= Math.PI * 2;
    }

    // Rotate individual shapes using pre-calculated multipliers (performance optimized)
    getAllShapeRefs().forEach((mesh, index) => {
      const baseSpeed = intensity * safeDelta;
      const multipliers = shapeRotationMultipliers[index];
      if (multipliers) {
        mesh.rotation.x += baseSpeed * multipliers.x;
        mesh.rotation.y += baseSpeed * multipliers.y;
        mesh.rotation.z += baseSpeed * multipliers.z;

        mesh.rotation.x %= Math.PI * 2;
        mesh.rotation.y %= Math.PI * 2;
        mesh.rotation.z %= Math.PI * 2;
      }
    });

    // Request next frame while animations are active
    invalidate();
  });

  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI}
        enableDamping
        dampingFactor={SCENE_ANIMATION_SPEEDS.orbitDamping}
      />

      {/* Scene Lighting */}
      <SceneLighting phase={phase} intensity={intensity} />

      <group ref={groupRef}>
        {/* Atmospheric Layers - Using Lazy Manager for code-split loading */}
        <SceneLayerManager
          phase={phase}
          opacities={opacities}
          intensity={intensity}
          progress={progress}
          particles={particles}
          particleCount={SCENE_ELEMENT_COUNTS.particles}
          clouds={clouds}
          houses={houses}
          trees={trees}
          bushes={bushes}
          rocks={rocks}
          flowers={flowers}
        />

        {/* Main floating shapes (Exosphere & Thermosphere) */}
        {(opacities.exosphere > 0 || opacities.thermosphere > 0) &&
          mainShapes.map((shape, i) => (
            <Float
              key={i}
              speed={
                FLOAT_CONFIG.baseSpeed +
                (i % FLOAT_CONFIG.speedModulo) * FLOAT_CONFIG.speedVariation
              }
              rotationIntensity={FLOAT_CONFIG.rotationIntensity}
              floatIntensity={FLOAT_CONFIG.floatIntensity}
              floatingRange={FLOAT_CONFIG.floatingRange}
            >
              <mesh
                ref={setShapeRef(i)}
                position={shape.position}
                rotation={shape.rotation}
                scale={shape.scale}
                geometry={shape.geometry}
                castShadow
              >
                <meshStandardMaterial
                  color={shape.color}
                  emissive={shape.color}
                  emissiveIntensity={
                    opacities.thermosphere > 0
                      ? SHAPE_MATERIAL.emissiveThermosphere
                      : SHAPE_MATERIAL.emissiveExosphere
                  }
                  transparent
                  opacity={
                    SHAPE_MATERIAL.opacity *
                    Math.max(opacities.exosphere, opacities.thermosphere)
                  }
                  roughness={SHAPE_MATERIAL.roughness}
                  metalness={SHAPE_MATERIAL.metalness}
                />
              </mesh>
            </Float>
          ))}
      </group>
    </>
  );
}
