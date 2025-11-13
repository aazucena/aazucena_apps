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
  useModal,
  useAtmosphericLayer,
  useGSAPEntrance,
  useSectionRefs,
  useSectionTransitions,
} from "./hooks";
import {
  CTA_CLICK_SCALE,
  CTA_CLICK_DURATION,
  CTA_CLICK_REPEAT,
  RESUME_BUTTON_SCALE,
  RESUME_BUTTON_DURATION,
  RESUME_BUTTON_COLOR,
  RESUME_OPEN_DELAY,
} from "./config/constants";
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

  const { modalRef } = useModal({ closeOnEscape: false }); // Escape handled by PortfolioContext
  const { titleRef, subtitleRef, ctaRef } = useGSAPEntrance(refs.heroRef);
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(
    currentSection,
    scrollProgress,
  );

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);

  // CTA handlers
  /**
   * Handles navigation to a specific section with click animation feedback
   * @param index - The target section index (0-7)
   */
  const handleSectionClick = (index: number): void => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current.children, {
        scale: CTA_CLICK_SCALE,
        duration: CTA_CLICK_DURATION,
        yoyo: true,
        repeat: CTA_CLICK_REPEAT,
      });
    }
    navigateToSection(index);
  };

  /**
   * Handles resume download with button animation and secure window opening
   * Animates the resume button, then opens the PDF in a new tab with tabnabbing protection
   */
  const handleViewResume = (): void => {
    // Safely access the resume button (second child of CTA container)
    const resumeButton = ctaRef.current?.children[1];
    if (resumeButton) {
      const tl = gsap.timeline();
      tl.to(resumeButton, {
        scale: RESUME_BUTTON_SCALE,
        duration: RESUME_BUTTON_DURATION,
        backgroundColor: RESUME_BUTTON_COLOR,
      }).to(resumeButton, {
        scale: 1,
        duration: RESUME_BUTTON_DURATION,
      });
    }

    setTimeout(() => {
      // Secure window.open to prevent tabnabbing attacks
      const resumeWindow = window.open("/AldrinAzucena_Resume.pdf", "_blank");
      if (resumeWindow) {
        resumeWindow.opener = null;
      }
    }, RESUME_OPEN_DELAY);
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
          modalRef={modalRef}
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
