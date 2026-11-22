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
    <div className="fixed z-40 hidden gap-1 md:top-1/2 md:right-8 md:flex md:-translate-y-1/2 md:flex-col md:items-center">
      {sectionNames.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionClick(index)}
          aria-current={currentSection === index ? "step" : undefined}
          className="group focus-visible:outline-signal relative flex min-h-6 min-w-6 items-center justify-center p-1.5 focus-visible:outline-1 focus-visible:outline-offset-2"
          aria-label={`Go to ${section} section`}
        >
          {/* Tick: the current section is a tall signal bar, the rest are dots */}
          <span
            aria-hidden="true"
            className={`hover-grow block rounded-full transition-[height,background-color] duration-(--motion-base) [--grow:1.75] ${
              currentSection === index
                ? "bg-signal h-4 w-0.5"
                : "bg-muted-foreground group-hover:bg-foreground group-focus-visible:bg-foreground size-1.5"
            }`}
          />

          {/* Tooltip */}
          <span
            role="presentation"
            className="rounded-control border-rule bg-panel text-foreground micro-label pointer-events-none absolute top-1/2 right-full mr-4 -translate-y-1/2 border px-3 py-1.5 whitespace-nowrap opacity-0 transition-opacity duration-(--motion-base) group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
