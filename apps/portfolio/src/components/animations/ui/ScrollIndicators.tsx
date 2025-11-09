/**
 * ScrollIndicators Component
 * Dots showing current section position
 */

import type { JSX } from 'react';
import { SECTION_NAMES } from '../sections/data';

export interface ScrollIndicatorsProps {
  visible: boolean;
  currentSection: number;
  onSectionClick: (index: number) => void;
}

export function ScrollIndicators({ currentSection, onSectionClick, visible }: ScrollIndicatorsProps): JSX.Element {
  if (!visible) return <></>;

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {SECTION_NAMES.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionClick(index)}
          className="group relative"
          aria-label={`Go to ${section} section`}
        >
          {/* Dot */}
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-cyan-400 scale-125'
                : 'bg-white/30 hover:bg-white/50 hover:scale-110'
            }`}
          />

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {section.charAt(0).toUpperCase() + section.slice(1)}
            <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-black/80"></div>
          </div>
        </button>
      ))}
    </div>
  );
}
