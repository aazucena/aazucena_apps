/**
 * ScrollIndicators Component
 * Dots showing current section position
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface ScrollIndicatorsProps {
  visible: boolean;
  currentSection: number;
  onSectionClick: (index: number) => void;
  sectionNames: string[]; // Dynamic section names from CMS
  className?: string;
}

export function ScrollIndicators({
  currentSection,
  onSectionClick,
  visible,
  sectionNames,
  className,
}: ScrollIndicatorsProps): JSX.Element {
  if (!visible) return <></>;

  return (
    <div
      className={cn('fixed top-1/2 right-8 z-50 flex -translate-y-1/2 flex-col gap-4', className)}
    >
      {sectionNames.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionClick(index)}
          className="group relative"
          aria-label={`Go to ${section} section`}
        >
          {/* Dot */}
          <div
            className={cn(
              'h-3 w-3 rounded-full transition-all duration-300',
              currentSection === index
                ? 'scale-125 bg-cyan-400'
                : 'bg-white/30 hover:scale-110 hover:bg-white/50',
            )}
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
