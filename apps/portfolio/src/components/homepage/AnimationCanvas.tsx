/**
 * AnimationCanvas Component
 * Orchestrates Three.js Canvas and PixiJS Particles rendering
 * Conditionally renders based on device capabilities and atmospheric layer
 *
 * Refactored to use context hooks directly instead of prop drilling
 * Phase 3 Task #6: Demand-based rendering for improved FPS
 */

import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimationParticles } from "@aazucena/animations/pixi";
// TEST 10: comment out HomepageScene to isolate its deps as CJS source
// import HomepageScene from "./HomepageScene";
import type { AtmosphericPhase } from "@aazucena/types";
import { useAnimation, usePortfolio } from "@aazucena/context";

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
  // TEST 10: currentSection/scrollProgress unused while HomepageScene is stubbed
  // const { currentSection, scrollProgress } = usePortfolio();
  usePortfolio();
  // Don't render heavy animations if not capable
  if (!capabilities.canUseHeavyAnimations) {
    return null;
  }

  return (
    <>
      {/* PixiJS Particles - Only in Exosphere */}
      {mounted &&
        atmosphericLayer === "exosphere" &&
        typeof window !== "undefined" && (
          <div
            className="fixed inset-0 transition-opacity duration-1000"
            style={{ opacity: 1 }}
          >
            <AnimationParticles
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </div>
        )}

      {/* Three.js Canvas - Demand-based rendering (Phase 3 Task #6) */}
      <div className="fixed inset-0 z-20 transition-opacity duration-1000">
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 0], fov: 15 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          shadows
        >
          {/* TEST 10 stub — HomepageScene commented out */}
          <mesh />
        </Canvas>
      </div>
    </>
  );
}
