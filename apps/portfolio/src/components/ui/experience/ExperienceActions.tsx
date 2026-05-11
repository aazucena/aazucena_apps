/**
 * ExperienceActions Component
 * Action buttons for experience section (toggle view all, link to full timeline)
 */

import type { JSX } from "react";
import { ArrowRight } from "@aazucena/icons";

export interface ExperienceActionsProps {
  /** Full timeline page URL */
  timelineUrl: string;
}

/**
 * ExperienceActions
 * Link to the full experiences timeline page
 */
export function ExperienceActions({
  timelineUrl,
}: ExperienceActionsProps): JSX.Element {
  return (
    <div className="mt-6 flex items-center justify-center">
      <a
        href={`/${timelineUrl}`}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white transition-transform duration-300 hover:scale-105"
      >
        View Full Timeline
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
