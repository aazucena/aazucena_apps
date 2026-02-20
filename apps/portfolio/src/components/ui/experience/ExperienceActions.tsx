/**
 * ExperienceActions Component
 * Action buttons for experience section (toggle view all, link to full timeline)
 */

import type { JSX } from "react";

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
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
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
    <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
      {/* View All / Show Less Toggle Button */}
      {showToggle && (
        <button
          onClick={onToggle}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white transition-transform duration-300 hover:scale-105"
        >
          {showAll ? "Show Less" : `View All Experiences (${totalCount})`}
        </button>
      )}

      {/* Link to Full Timeline Page */}
      <a
        href={`/${timelineUrl}`}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
      >
        View Full Timeline
        <ArrowRightIcon />
      </a>
    </div>
  );
}
