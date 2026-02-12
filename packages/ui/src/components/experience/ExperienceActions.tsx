/**
 * ExperienceActions Component
 * Action buttons for experience sections
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';
import { ArrowRight } from '@aazucena/icons';

export interface ExperienceActionsProps {
  /** Whether to show the "View All" toggle button */
  showToggle: boolean;
  /** Whether showing all experiences */
  showAll: boolean;
  /** Total number of experiences */
  totalCount: number;
  /** Toggle handler */
  onToggle: () => void;
  /** Full timeline page URL */
  timelineUrl: string;
  /** Additional className */
  className?: string;
}

/**
 * ExperienceActions
 */
export function ExperienceActions({
  showToggle,
  showAll,
  totalCount,
  onToggle,
  timelineUrl,
  className,
}: ExperienceActionsProps): JSX.Element {
  return (
    <div
      className={cn('mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row', className)}
    >
      {/* View All / Show Less Toggle Button */}
      {showToggle && (
        <button
          onClick={onToggle}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white transition-transform duration-300 hover:scale-105"
        >
          {showAll ? 'Show Less' : `View All Experiences (${totalCount})`}
        </button>
      )}

      {/* Link to Full Timeline Page */}
      <a
        href={timelineUrl}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
      >
        View Full Timeline
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
