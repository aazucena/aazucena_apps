/**
 * Homepage Section Component - Main orchestrator
 * Refactored to use contexts and extracted components
 * Reduced from 324 lines to ~180 lines
 *
 * Scoped to homepage - not a general-purpose section component
 */

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JSX } from "react";
import type { HomepageData } from "~/lib/transformers/homepage";
import type { PortfolioContent } from "~/lib/transformers/portfolio";
import type { PortfolioData } from "~/types/portfolio";
import DynamicBackground from "./background/DynamicBackground";
import AnimationCanvas from "./canvas/AnimationCanvas";
import {
  DataProvider,
  useDataContext,
  AnimationProvider,
  PortfolioProvider,
  usePortfolio,
} from '~/contexts/animations';
import HomepageContent from "./HomepageContent";
import {
  useAtmosphericLayer,
  useSectionRefs,
  useSectionTransitions
} from "~/hooks/animations";
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

  // Get only the state needed for this component
  // (Most state is now consumed directly by child components via contexts)
  const { currentSection, scrollProgress } = usePortfolio();

  // Calculate atmospheric layer and background style
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(
    currentSection,
    scrollProgress,
  );

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);


  return (
    <>
      {/* Dynamic Background */}
      <DynamicBackground backgroundStyle={backgroundStyle} />

      {/* Atmospheric Overlays */}
      <AtmosphericOverlays atmosphericLayer={atmosphericLayer} />

      {/* Animation Canvas - Uses contexts directly, only needs atmosphericLayer */}
      <AnimationCanvas atmosphericLayer={atmosphericLayer} />

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
HomepageSectionInner.displayName = 'HomepageSectionInner';

// Main exported component with providers
export default function HomepageSection({ data, content, portfolio }: { data: PortfolioData, content: HomepageData, portfolio: PortfolioContent }): JSX.Element {
  // Calculate total sections from CMS data
  const totalSections = content.sections.length;

  return (
    <DataProvider data={data} content={content} portfolio={portfolio}>
      <AnimationProvider>
        <PortfolioProvider totalSections={totalSections}>
          <HomepageSectionInner  />
        </PortfolioProvider>
      </AnimationProvider>
    </DataProvider>
  );
}

// Add display name for React Fast Refresh
HomepageSection.displayName = 'HomepageSection';
