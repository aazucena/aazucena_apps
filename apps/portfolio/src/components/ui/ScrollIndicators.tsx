/**
 * ScrollIndicators Component
 * Dots showing current section position
 */

import type { JSX } from "react";

export interface ScrollIndicatorsProps {
  visible: boolean;
  currentSection: number;
  onSectionClick: (_index: number) => void;
  sectionNames: string[]; // Dynamic section names from CMS
}

export function ScrollIndicators({
  currentSection,
  onSectionClick,
  visible,
  sectionNames,
}: ScrollIndicatorsProps): JSX.Element {
  if (!visible) return <></>;

  return (
    <div className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 flex-row gap-4 md:top-1/2 md:right-8 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2 md:flex-col">
      {sectionNames.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionClick(index)}
          className="group relative"
          aria-label={`Go to ${section} section`}
        >
          {/* Dot */}
          <div
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? "scale-125 bg-cyan-400"
                : "bg-white/30 hover:scale-110 hover:bg-white/50"
            }`}
          />

          {/* Tooltip */}
          <div className="pointer-events-none absolute top-1/2 right-full mr-4 -translate-y-1/2 rounded-lg bg-black/80 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {section.charAt(0).toUpperCase() + section.slice(1)}
            <div className="absolute top-1/2 left-full -ml-1 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
          </div>
        </button>
      ))}
    </div>
  );
}
