/**
 * UIOverlays Component
 * Renders all UI overlays: navigation toolbar and scroll indicators
 */

import { type JSX } from "react";
import React from "react";
import { ScrollIndicators } from "~/components/ui";
import { ScrollDown as ScrollDownIndicator } from "@aazucena/ui";
import { NavigationToolbar } from "./NavigationToolbar";
import type { AtmosphericPhase } from "@aazucena/types";
import { usePortfolio } from "@aazucena/context";
import { useDataContext } from "~/contexts";

interface UIOverlaysProps {
  // Atmospheric layer (not in contexts yet)
  currentPhase: AtmosphericPhase;
}

export default function UIOverlays({
  currentPhase,
}: UIOverlaysProps): JSX.Element {
  // Get data from contexts
  const { content } = useDataContext();

  // Portfolio context - navigation state
  const { currentSection, navigateToSection } = usePortfolio();

  // Extract section names from CMS data
  const sectionNames = content.sections.map((section) => section.name);
  return (
    <>
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
