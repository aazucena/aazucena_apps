/**
 * AnimationCanvas Component
 * Orchestrates Three.js Canvas and PixiJS Particles rendering
 * Conditionally renders based on device capabilities and atmospheric layer
 */

import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import PixiJSParticles from "../PixiJSParticles";
import ThreeJSScene from "../ThreeJSScene";
import type { AtmosphericPhase, DeviceCapabilities } from "../config";

interface AnimationCanvasProps {
  capabilities: DeviceCapabilities;
  mounted: boolean;
  atmosphericLayer: AtmosphericPhase;
  currentSection: number;
  scrollProgress: number;
}

export default function AnimationCanvas({
  capabilities,
  mounted,
  atmosphericLayer,
  currentSection,
  scrollProgress,
}: AnimationCanvasProps): JSX.Element | null {
  // Don't render heavy animations if not capable
  if (!capabilities.canUseHeavyAnimations) {
    return null;
  }

  return (
    <>
      {/* PixiJS Particles - Only in Exosphere */}
      {mounted && atmosphericLayer === "exosphere" && typeof window !== "undefined" && (
        <div
          className="fixed inset-0 transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <PixiJSParticles
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </div>
      )}

      {/* Three.js Canvas - Adaptive to Atmospheric Layer */}
      <div className="fixed inset-0 z-20 transition-opacity duration-1000">
        <Canvas
          camera={{ position: [0, 0, 0], fov: 15 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          shadows
        >
          <ThreeJSScene
            intensity={capabilities.performanceTier === "high" ? 1 : 0.7}
            phase={atmosphericLayer}
            currentSection={currentSection}
            scrollProgress={scrollProgress}
          />
        </Canvas>
      </div>
    </>
  );
}
