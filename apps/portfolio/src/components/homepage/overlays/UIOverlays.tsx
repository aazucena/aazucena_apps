/**
 * UIOverlays Component
 * Renders all UI overlays: navigation toolbar, modals, and scroll indicators
 *
 * Simplified architecture with encapsulated NavigationToolbar component
 */

import type { JSX } from "react";
import { ExperienceModal, ScrollIndicators, ScrollDownIndicator } from '~/components/ui';
import { NavigationToolbar } from './NavigationToolbar';
import type { AtmosphericPhase } from '~/config/animations';
import { useSectionData, usePortfolio, useDataContext } from '~/contexts/animations';
import { useModal } from '~/hooks/animations';

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

  // Portfolio context - navigation and modal state
  const {
    currentSection,
    navigateToSection,
    isExperienceModalOpen,
    selectedExperienceIndex,
    closeExperienceModal,
  } = usePortfolio();

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

      {/* Navigation toolbar with integrated panels (Info, Settings, Social) */}
      <NavigationToolbar currentPhase={currentPhase} />

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
