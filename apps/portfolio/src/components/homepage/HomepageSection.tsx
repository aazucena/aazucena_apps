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
import { lazy, Suspense, useEffect, type JSX } from "react";
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
} from "@aazucena/context";
import { DataProvider, useDataContext } from "~/contexts";
import HomepageContent from "./HomepageContent";
import {
  useAtmosphericLayer,
  useSectionRefs,
  useSectionTransitions,
} from "@aazucena/hooks";
import AtmosphericOverlays from "./overlays/AtmosphericOverlays";
import UIOverlays from "./overlays/UIOverlays";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

// Inner component that uses contexts
function HomepageSectionInner(): JSX.Element {
  const { content } = useDataContext();
  const sections = content.sections;
  const refs = useSectionRefs(sections);

  // Return visitors skip the preloader animation, so preloader-complete never fires.
  // In that case, release BrandIconLoader here once animations are mounted.
  // First-time visitors: preloader-complete → BaseLayout → brand-loader-complete handles it.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio-preloader-seen") === "true") {
        document.dispatchEvent(new CustomEvent("brand-loader-complete"));
      }
    } catch (_) {
      // sessionStorage unavailable — dispatch anyway as fallback
      document.dispatchEvent(new CustomEvent("brand-loader-complete"));
    }
  }, []);

  // Get only the state needed for this component
  // (Most state is now consumed directly by child components via contexts)
  const { currentSection, scrollProgress } = usePortfolio();

  // Calculate atmospheric layer and background style, scaled to actual section count
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(
    currentSection,
    scrollProgress,
    sections.length,
  );

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);

  return (
    <>
      {/* Dynamic Background */}
      <DynamicBackground backgroundStyle={backgroundStyle} />

      {/* Atmospheric Overlays */}
      <AtmosphericOverlays atmosphericLayer={atmosphericLayer} />

      {/* Animation Canvas - Lazy loaded to defer Three.js + PixiJS (~1MB) */}
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

      {/* Main Content Section */}
      <section className="relative h-screen w-full overflow-hidden">
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
  // Calculate total sections from CMS data
  const totalSections = content.sections.length;

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
