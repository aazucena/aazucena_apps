/**
 * Homepage Section Component - Main orchestrator
 * Refactored to use contexts and extracted components
 * Reduced from 324 lines to ~180 lines
 *
 * Scoped to homepage - not a general-purpose section component
 * Phase 3: AnimationCanvas lazy-loaded for 60% bundle reduction
 */

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lazy, Suspense, useContext, useEffect, useRef, type JSX } from "react";
import type { HomepageData } from "@aazucena/types";
import type { PortfolioContent } from "@aazucena/types";
import type { PortfolioData } from "~/types";
import DynamicBackground from "./DynamicBackground";
// Lazy load AnimationCanvas to defer Three.js (~600KB) + PixiJS (~400KB)
const AnimationCanvas = lazy(() => import("./AnimationCanvas"));
import {
  AnimationProvider,
  PortfolioProvider,
  usePortfolio,
  useAnimation,
} from "@aazucena/context";
import { DataContext } from "~/contexts/DataContext";
import { DataProvider } from "~/contexts";
import HomepageContent from "./HomepageContent";
import {
  useAtmosphericLayer,
  useSectionRefs,
  useSectionTransitions,
} from "@aazucena/hooks";
import { useAtmosphericSound } from "~/hooks";
import AtmosphericOverlays from "./overlays/AtmosphericOverlays";
import UIOverlays from "./overlays/UIOverlays";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

// Inner component that uses contexts
function HomepageSectionInner(): JSX.Element | null {
  // Use raw useContext (returns null) instead of useDataContext (throws) — all hooks
  // must run before any early return, so we guard after they've all been called.
  const dataCtx = useContext(DataContext);
  const sections = dataCtx?.content.sections ?? [];
  const cmsRefs = useSectionRefs(sections);
  const exitRef = useRef<HTMLDivElement>(null);
  const refs = [...cmsRefs, exitRef];

  // Return visitors skip the preloader animation, so preloader-complete never fires.
  // In that case, release BrandIconLoader here once animations are mounted.
  // First-time visitors: preloader-complete → BaseLayout → brand-loader-complete handles it.
  useEffect(() => {
    if (!dataCtx) return;
    try {
      if (sessionStorage.getItem("portfolio-preloader-seen") === "true") {
        document.dispatchEvent(new CustomEvent("brand-loader-complete"));
      }
    } catch {
      // sessionStorage unavailable — dispatch anyway as fallback
      document.dispatchEvent(new CustomEvent("brand-loader-complete"));
    }
  }, [dataCtx]);

  // Get only the state needed for this component
  // (Most state is now consumed directly by child components via contexts)
  const { currentSection, scrollProgress } = usePortfolio();
  const { capabilities, isSoundMuted } = useAnimation();

  // Calculate atmospheric layer and background style, scaled to actual section count
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(
    currentSection,
    scrollProgress,
    sections.length,
  );

  // Atmospheric ambient sound — Web Audio API synthesized, no asset files
  useAtmosphericSound(atmosphericLayer, isSoundMuted);

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);

  // HMR guard: DataContext may be momentarily null during React Fast Refresh cycle
  // when this component is refreshed before its parent providers re-initialize.
  if (!dataCtx) return null;

  return (
    <>
      {/* Dynamic Background */}
      <DynamicBackground backgroundStyle={backgroundStyle} />

      {/* Atmospheric Overlays */}
      <AtmosphericOverlays atmosphericLayer={atmosphericLayer} />

      {/* Animation Canvas - Gated on user preference (mobile defaults off, user can enable) */}
      {capabilities.canUseHeavyAnimations && (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 z-20 transition-opacity duration-1000"
              style={backgroundStyle}
              aria-label="Loading 3D animations"
            />
          }
        >
          <AnimationCanvas atmosphericLayer={atmosphericLayer} />
        </Suspense>
      )}

      {/* Main Content Section */}
      <section className="relative h-[100dvh] w-full overflow-hidden">
        {/* Section Content - Uses contexts directly, only needs refs */}
        <HomepageContent refs={refs} />

        {/* UI Overlays - Uses contexts directly, only needs currentPhase */}
        <UIOverlays currentPhase={atmosphericLayer} />
      </section>
    </>
  );
}

// Add display name for React Fast Refresh
HomepageSectionInner.displayName = "HomepageSectionInner";

// Main exported component with providers
export default function HomepageSection({
  data,
  content,
  portfolio,
}: {
  data: PortfolioData;
  content: HomepageData;
  portfolio: PortfolioContent;
}): JSX.Element {
  // +1 for the hardcoded ExitSection appended after all CMS sections
  const totalSections = content.sections.length + 1;

  return (
    <DataProvider data={data} content={content} portfolio={portfolio}>
      <AnimationProvider>
        <PortfolioProvider totalSections={totalSections}>
          <HomepageSectionInner />
        </PortfolioProvider>
      </AnimationProvider>
    </DataProvider>
  );
}

// Add display name for React Fast Refresh
HomepageSection.displayName = "HomepageSection";
