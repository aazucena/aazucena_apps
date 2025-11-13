/**
 * Portfolio Section Component - Main orchestrator
 * Refactored to use contexts and extracted components
 * Reduced from 324 lines to ~180 lines
 */

import type { JSX } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioProvider, usePortfolio } from "./contexts/PortfolioContext";
import { AnimationProvider, useAnimation } from "./contexts/AnimationContext";
import { aboutData } from "./sections/data/about";
import {
  useFlipText,
  useAtmosphericLayer,
  useGSAPEntrance,
  useSectionRefs,
  useSectionTransitions,
} from "./hooks";
import DynamicBackground from "./background/DynamicBackground";
import AtmosphericOverlays from "./overlays/AtmosphericOverlays";
import AnimationCanvas from "./canvas/AnimationCanvas";
import SectionContent from "./sections/SectionContent";
import UIOverlays from "./overlays/UIOverlays";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

// Inner component that uses contexts
function PortfolioSectionInner(): JSX.Element {
  const refs = useSectionRefs();

  // Context hooks
  const {
    currentSection,
    scrollProgress,
    isExperienceModalOpen,
    selectedExperienceIndex,
    openExperienceModal,
    closeExperienceModal,
    showInfoPanel,
    showSettingsPanel,
    showSocialMenu,
    setShowInfoPanel,
    setShowSettingsPanel,
    setShowSocialMenu,
    navigateToSection,
    togglePanel,
  } = usePortfolio();

  const {
    capabilities,
    updateCapabilities,
    isSoundMuted,
    toggleSound,
    mounted,
  } = useAnimation();

  // Custom hooks
  const { currentWord: currentFlipWord, elementRef: flipTextRef } = useFlipText(
    {
      words: aboutData.flipWords,
      interval: 3000,
    },
  );

  const { titleRef, subtitleRef, ctaRef } = useGSAPEntrance(refs.heroRef);
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(
    currentSection,
    scrollProgress,
  );

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);

  // CTA handlers
  const handleSectionClick = (index: number): void => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current.children, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
    navigateToSection(index);
  };

  const handleViewResume = (): void => {
    const tl = gsap.timeline();
    tl.to(ctaRef.current?.children[1]!, {
      scale: 1.1,
      duration: 0.2,
      backgroundColor: "#059669",
    }).to(ctaRef.current?.children[1]!, {
      scale: 1,
      duration: 0.2,
    });

    setTimeout(() => {
      // Secure window.open to prevent tabnabbing attacks
      const resumeWindow = window.open("/AldrinAzucena_Resume.pdf", "_blank");
      if (resumeWindow) {
        resumeWindow.opener = null;
      }
    }, 400);
  };

  return (
    <>
      {/* Dynamic Background */}
      <DynamicBackground backgroundStyle={backgroundStyle} />

      {/* Atmospheric Overlays */}
      <AtmosphericOverlays atmosphericLayer={atmosphericLayer} />

      {/* Animation Canvas (Three.js + PixiJS) */}
      <AnimationCanvas
        capabilities={capabilities}
        mounted={mounted}
        atmosphericLayer={atmosphericLayer}
        currentSection={currentSection}
        scrollProgress={scrollProgress}
      />

      {/* Main Content Section */}
      <section
        ref={refs.heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Section Content */}
        <SectionContent
          refs={refs}
          currentSection={currentSection}
          isSoundMuted={isSoundMuted}
          onOpenExperience={openExperienceModal}
          titleRef={titleRef}
          subtitleRef={subtitleRef}
          ctaRef={ctaRef}
          flipTextRef={flipTextRef as any}
          currentFlipWord={currentFlipWord || ""}
          onSectionClick={handleSectionClick}
          onViewResume={handleViewResume}
        />

        {/* UI Overlays */}
        <UIOverlays
          isSoundMuted={isSoundMuted}
          onToggleSound={toggleSound}
          showInfoPanel={showInfoPanel}
          showSettingsPanel={showSettingsPanel}
          showSocialMenu={showSocialMenu}
          onToggleInfo={() => togglePanel("info")}
          onToggleSettings={() => togglePanel("settings")}
          onToggleSocial={() => togglePanel("social")}
          onCloseInfo={() => setShowInfoPanel(false)}
          onCloseSettings={() => setShowSettingsPanel(false)}
          onCloseSocial={() => setShowSocialMenu(false)}
          isExperienceModalOpen={isExperienceModalOpen}
          selectedExperienceIndex={selectedExperienceIndex}
          onCloseExperienceModal={closeExperienceModal}
          modalRef={null as any}
          currentSection={currentSection}
          onNavigateToSection={navigateToSection}
          capabilities={capabilities}
          onUpdateCapabilities={updateCapabilities}
          currentPhase={atmosphericLayer}
        />
      </section>
    </>
  );
}

// Main exported component with providers
export default function PortfolioSection(): JSX.Element {
  return (
    <AnimationProvider>
      <PortfolioProvider>
        <PortfolioSectionInner />
      </PortfolioProvider>
    </AnimationProvider>
  );
}
