/**
 * UIOverlays Component
 * Renders all UI overlays: toolbar, panels, modals, and scroll indicators
 *
 * Refactored to use context hooks directly instead of prop drilling
 */

import type { JSX } from "react";
import {
  Toolbar,
  SocialMenu,
  SettingsPanel,
  InfoPanel,
  ExperienceModal,
  ScrollIndicators,
  ScrollDownIndicator,
} from "../ui";
import type { AtmosphericPhase } from "../config";
import { useSectionData, usePortfolio, useAnimation, useDataContext, usePortfolioData } from "../contexts";
import { useModal } from "../hooks";

interface UIOverlaysProps {
  // Atmospheric layer (not in contexts yet)
  currentPhase: AtmosphericPhase;
}

export default function UIOverlays({
  currentPhase,
}: UIOverlaysProps): JSX.Element {
  // Get data from contexts
  const { experiences } = useSectionData();
  const { content } = useDataContext();
  const portfolioData = usePortfolioData();

  // Portfolio context - navigation and UI state
  const {
    currentSection,
    navigateToSection,
    isExperienceModalOpen,
    selectedExperienceIndex,
    closeExperienceModal,
    showInfoPanel,
    showSettingsPanel,
    showSocialMenu,
    setShowInfoPanel,
    setShowSettingsPanel,
    setShowSocialMenu,
    togglePanel,
  } = usePortfolio();

  // Animation context - sound and capabilities
  const {
    isSoundMuted,
    toggleSound,
    capabilities,
    updateCapabilities,
  } = useAnimation();

  // Modal ref
  const { modalRef } = useModal({ closeOnEscape: false });

  // Extract section names from CMS data
  const sectionNames = content.sections.map(section => section.name);
  return (
    <>
      {/* Experience Modal */}
      {isExperienceModalOpen &&
        selectedExperienceIndex !== null &&
        experiences[selectedExperienceIndex] && (
          <ExperienceModal
            experience={experiences[selectedExperienceIndex]}
            onClose={closeExperienceModal}
            modalRef={modalRef}
          />
        )}

      {/* Toolbar */}
      <Toolbar
        isSoundMuted={isSoundMuted}
        onToggleSound={toggleSound}
        onToggleInfo={() => togglePanel('info')}
        onToggleSettings={() => togglePanel('settings')}
        onToggleSocial={() => togglePanel('social')}
      />

      {/* Social Menu */}
      {showSocialMenu && (
        <SocialMenu
          onClose={() => setShowSocialMenu(false)}
          socialLinks={portfolioData.socialLinks}
          email={portfolioData.email}
          emailDescription={portfolioData.emailDescription}
        />
      )}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <SettingsPanel
          onClose={() => setShowSettingsPanel(false)}
          capabilities={capabilities}
          onUpdateCapabilities={updateCapabilities}
        />
      )}

      {/* Info Panel */}
      {showInfoPanel && (
        <InfoPanel
          onClose={() => setShowInfoPanel(false)}
          currentPhase={currentPhase}
        />
      )}

      {/* Scroll Indicators */}
      <ScrollIndicators
        visible={currentSection !== 0}
        currentSection={currentSection}
        onSectionClick={navigateToSection}
        sectionNames={sectionNames}
      />

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator
        timeout={15 * 1000}
        visible={currentSection === 0}
        onClick={() => navigateToSection(1)}
      />
    </>
  );
}
