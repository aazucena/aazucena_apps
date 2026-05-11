/**
 * ChronologyTimeline
 *
 * Portfolio wrapper around the generic InteractiveTimeline.
 * Maps TimelineNode domain fields (logo, subtitle, slug) to the
 * package's generic TimelineEvent shape, and wires the hover popup.
 *
 * Must live in .tsx — Astro cannot parse JSX arrow functions inline.
 */

import { InteractiveTimeline } from "@aazucena/visualizations";
import type { TimelineEvent } from "@aazucena/visualizations";
import { TimelineEventTooltip } from "./TimelineEventTooltip";
import type { TimelineNode } from "~/lib/transformers";

interface ChronologyTimelineProps {
  data: TimelineNode[];
}

const COLOR_MAP = {
  experience: "#3b82f6",
  education: "#10b981",
};

/** Map portfolio-specific TimelineNode fields to the generic TimelineEvent shape */
function toTimelineEvent(node: TimelineNode): TimelineEvent {
  return {
    ...node,
    subtitle: node.subtitle,
    avatarUrl: node.logo,
    avatarAlt: node.company || node.institution,
  };
}

export function ChronologyTimeline({ data }: ChronologyTimelineProps) {
  const events = data.map(toTimelineEvent);

  return (
    <InteractiveTimeline
      data={events}
      laneKey="type"
      colorMap={COLOR_MAP}
      hideHeader
      showFilter
      hoverPopup={(event, pos) => (
        <TimelineEventTooltip event={event} pos={pos} />
      )}
      onEventClick={(event) => {
        const node = event as TimelineNode;
        if (node.type === "experience" && node.slug) {
          window.location.href = `/experiences/${node.slug}`;
        }
      }}
    />
  );
}
