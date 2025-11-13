/**
 * UIOverlays Component
 * Renders all UI overlays: toolbar, panels, modals, and scroll indicators
 */

import type { JSX, RefObject } from "react";
import { experiences } from "../sections/data/experiences";
import {
  Toolbar,
  SocialMenu,
  SettingsPanel,
  InfoPanel,
  ExperienceModal,
  ScrollIndicators,
  ScrollDownIndicator,
} from "../ui";
import type { DeviceCapabilities, AtmosphericPhase } from "../config";

interface UIOverlaysProps {
  // Sound state
  isSoundMuted: boolean;
  onToggleSound: () => void;

  // Panel state
  showInfoPanel: boolean;
  showSettingsPanel: boolean;
  showSocialMenu: boolean;
  onToggleInfo: () => void;
  onToggleSettings: () => void;
  onToggleSocial: () => void;
  onCloseInfo: () => void;
  onCloseSettings: () => void;
  onCloseSocial: () => void;

  // Modal state
  isExperienceModalOpen: boolean;
  selectedExperienceIndex: number | null;
  onCloseExperienceModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;

  // Section navigation
  currentSection: number;
  onNavigateToSection: (index: number) => void;

  // Settings
  capabilities: DeviceCapabilities;
  onUpdateCapabilities: (updates: Partial<DeviceCapabilities>) => void;

  // Atmospheric layer
  currentPhase: AtmosphericPhase;
}

export default function UIOverlays({
  isSoundMuted,
  onToggleSound,
  showInfoPanel,
  showSettingsPanel,
  showSocialMenu,
  onToggleInfo,
  onToggleSettings,
  onToggleSocial,
  onCloseInfo,
  onCloseSettings,
  onCloseSocial,
  isExperienceModalOpen,
  selectedExperienceIndex,
  onCloseExperienceModal,
  modalRef,
  currentSection,
  onNavigateToSection,
  capabilities,
  onUpdateCapabilities,
  currentPhase,
}: UIOverlaysProps): JSX.Element {
  return (
    <>
      {/* Experience Modal */}
      {isExperienceModalOpen &&
        selectedExperienceIndex !== null &&
        experiences[selectedExperienceIndex] && (
          <ExperienceModal
            experience={experiences[selectedExperienceIndex]}
            onClose={onCloseExperienceModal}
            modalRef={modalRef}
          />
        )}

      {/* Toolbar */}
      <Toolbar
        isSoundMuted={isSoundMuted}
        onToggleSound={onToggleSound}
        onToggleInfo={onToggleInfo}
        onToggleSettings={onToggleSettings}
        onToggleSocial={onToggleSocial}
      />

      {/* Social Menu */}
      {showSocialMenu && <SocialMenu onClose={onCloseSocial} />}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <SettingsPanel
          onClose={onCloseSettings}
          capabilities={capabilities}
          onUpdateCapabilities={onUpdateCapabilities}
        />
      )}

      {/* Info Panel */}
      {showInfoPanel && (
        <InfoPanel onClose={onCloseInfo} currentPhase={currentPhase} />
      )}

      {/* Scroll Indicators */}
      <ScrollIndicators
        visible={currentSection !== 0}
        currentSection={currentSection}
        onSectionClick={onNavigateToSection}
      />

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator
        timeout={15 * 1000}
        visible={currentSection === 0}
        onClick={() => onNavigateToSection(1)}
      />
    </>
  );
}
