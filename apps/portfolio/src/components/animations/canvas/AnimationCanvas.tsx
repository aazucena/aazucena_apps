/**
 * AnimationCanvas Component
 * Orchestrates Three.js Canvas and PixiJS Particles rendering
 * Conditionally renders based on device capabilities and atmospheric layer
 *
 * Refactored to use context hooks directly instead of prop drilling
 */

import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import PixiJSParticles from "../PixiJSParticles";
import ThreeJSScene from "../ThreeJSScene";
import type { AtmosphericPhase } from "../config";
import { useAnimation, usePortfolio } from "../contexts";

interface AnimationCanvasProps {
  // Only atmospheric layer remains as prop (not in context)
  atmosphericLayer: AtmosphericPhase;
}

export default function AnimationCanvas({
  atmosphericLayer,
}: AnimationCanvasProps): JSX.Element | null {
  // Get animation state from context
  const { capabilities, mounted } = useAnimation();

  // Get portfolio state from context
  const { currentSection, scrollProgress } = usePortfolio();
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
