/**
 * ExperienceActions Component
 * Action buttons for experience section (toggle view all, link to full timeline)
 */

import type { JSX } from 'react';

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
}

/**
 * ArrowRightIcon
 * Icon for external link button
 */
function ArrowRightIcon(): JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

/**
 * ExperienceActions
 * Displays action buttons for toggling view and navigating to full timeline
 */
export function ExperienceActions({
  showToggle,
  showAll,
  totalCount,
  onToggle,
  timelineUrl,
}: ExperienceActionsProps): JSX.Element {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* View All / Show Less Toggle Button */}
      {showToggle && (
        <button
          onClick={onToggle}
          className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
        >
          {showAll ? 'Show Less' : `View All Experiences (${totalCount})`}
        </button>
      )}

      {/* Link to Full Timeline Page */}
      <a
        href={`/${timelineUrl}`}
        className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        View Full Timeline
        <ArrowRightIcon />
      </a>
    </div>
  );
}
