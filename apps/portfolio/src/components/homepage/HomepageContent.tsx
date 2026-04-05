/**
 * HomepageContent Component
 * Renders all 8 portfolio section contents with proper refs and pointer-events
 *
 * Refactored to use context hooks directly instead of prop drilling
 */

import { type JSX } from "react";
import { usePortfolio } from "@aazucena/context";
import { useDataContext, useRegistry } from "~/contexts/animations";
import { type SectionRef } from "@aazucena/hooks";
import { type SectionComponent } from "@aazucena/hooks";

interface HomepageContentProps {
  // Only refs remain as prop (created in parent with useSectionRefs)
  refs: SectionRef[];
}

export default function HomepageContent({
  refs,
}: HomepageContentProps): JSX.Element {
  const { content } = useDataContext();

  // Get current section from context
  const { currentSection } = usePortfolio();

  // Helper function to find section config by name
  const REGISTRY = useRegistry();
  const activeSections = content.sections;

  return (
    <>
      {activeSections.map((section, index) => {
        const Component = REGISTRY[section.name] as SectionComponent;
        if (!Component) return null;

        return (
          <div
            key={section.name}
            ref={refs[index]}
            className="absolute top-0 right-0 left-0 z-30 flex min-h-screen w-full items-center px-6"
            style={{
              pointerEvents: currentSection === index ? "auto" : "none",
            }}
          >
            <Component title={section.title} subtitle={section.subtitle} />
          </div>
        );
      })}
    </>
  );
}
