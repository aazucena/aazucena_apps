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
        className="bg-signal text-signal-foreground h-control rounded-control hover:bg-signal/90 focus-visible:outline-signal flex items-center gap-2 px-4 text-sm font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-2"
      >
        View Full Timeline
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
